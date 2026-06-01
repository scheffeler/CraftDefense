import * as THREE from "three";
import type { EnemyState, EnemyTypeName } from "./types";
import { ENEMY_CONFIGS } from "./config/enemies";
import type { FlowField } from "./FlowField";
import type { VoxelWorld } from "./Map";
import {
  FORTRESS_CENTER_X, FORTRESS_CENTER_Z, ENEMY_Y as CFG_ENEMY_Y,
  GROUND_OFFSET, WALL_HEIGHT,
  FORTRESS_WALL_NORTH_Z, FORTRESS_WALL_SOUTH_Z,
  FORTRESS_INNER_NORTH_Z, FORTRESS_INNER_SOUTH_Z,
  FORTRESS_GATE_X1, FORTRESS_GATE_X2,
  FORTRESS_WALL_WEST_X, FORTRESS_WALL_EAST_X,
} from "./config/map";
import { getSpawnPositions } from "./WorldGen";

export type { EnemyState };

const ENEMY_Y        = CFG_ENEMY_Y;
const REACH_RADIUS   = 2.0;  // distance to fortress center that counts as "reached base"
const WALL_BREAK_TIME = 3.0; // seconds to break one wall block

// Spider wall-climbing
const SPIDER_CLIMB_SPEED   = 4.5; // blocks/s vertical movement
const SPIDER_WALL_TOP_Y    = GROUND_OFFSET + WALL_HEIGHT + 1.5; // ~13.5 — apex of climb

// All types use flow-field AI — waypoint AI removed in Phase 12 cleanup
const FLOW_FIELD_TYPES = new Set<EnemyTypeName>([
  "goblin", "orc", "troll", "goblin_miner",
  "zombie", "spider", "golem", "creeper", "skeleton", "uruk_captain", "troll_king",
]);

const BOSS_RAGE_THRESHOLD = 0.5;
const BOSS_SLAM_INTERVAL = 5.0;
const BOSS_SLAM_RANGE    = 7.0;
const BOSS_BERSERK_HP    = 0.50;

interface SkeletonArrow {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  damage: number;
  life: number;
  active: boolean;
}

interface SpiderWeb {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  life: number;
  active: boolean;
}

const SKELETON_ARROW_POOL    = 30;
const SKELETON_SHOOT_RANGE   = 7.5;
const SKELETON_SHOOT_INTERVAL = 2.2;
const SKELETON_STRAFE_SPEED  = 1.8;  // lateral units/sec while aiming
const SKELETON_STRAFE_FLIP   = 1.6;  // seconds between direction flips
const KNOCKBACK_STAGGER      = 0.35; // seconds enemies are staggered after knockback

const SPIDER_WEB_POOL     = 12;
const SPIDER_WEB_RANGE    = 12.0; // max distance to spit web
const SPIDER_WEB_INTERVAL = 4.5;  // seconds between web shots
const SPIDER_WEB_SPEED    = 7.0;  // projectile speed (slower than arrows for readability)
const SPIDER_WEB_HIT_DIST = 0.8;

// Troll / uruk_captain stomp attack
const STOMP_RANGE       = 2.8;  // blocks from player to trigger stomp
const STOMP_CHARGE_TIME = 0.7;  // seconds of wind-up before stomp fires
const STOMP_COOLDOWN    = 5.0;  // seconds between stomps
const STOMP_RADIUS      = 3.5;  // AoE blast radius
const STOMP_DAMAGE      = 8;    // damage on direct hit (within radius)

// uruk_captain war cry — buffs nearby allies
const WAR_CRY_COOLDOWN      = 14;   // seconds between cries
const WAR_CRY_BUFF_RADIUS   = 16;   // world units
const WAR_CRY_SPEED_MULT    = 1.7;  // 70% speed boost for nearby enemies
const WAR_CRY_BUFF_DURATION = 6;    // seconds the buff lasts
const WAR_CRY_FLASH_DURATION = 1.0; // seconds the boss flashes gold

export class EnemyManager {
  private readonly enemies   = new Map<number, EnemyState>();
  private readonly meshes    = new Map<number, THREE.Group>();
  private readonly healthBars = new Map<number, { bar: THREE.Mesh; bg: THREE.Mesh }>();
  private readonly skeletonArrows: SkeletonArrow[] = [];
  private readonly spiderWebs: SpiderWeb[] = [];
  private idCounter = 0;

  private flowField: FlowField | null = null;
  private world: VoxelWorld | null = null;

  onEnemyReachedBase: (state: EnemyState) => void = () => {};
  onEnemyDied:        (state: EnemyState) => void = () => {};
  onWallBroken: (wx: number, wz: number) => void = () => {};
  onCreeperExplode: (x: number, y: number, z: number, radius: number) => void = () => {};
  onCreeperPrime: () => void = () => {};
  onSkeletonArrowHit: (damage: number) => void = () => {};
  onSpiderWebHit: () => void = () => {};
  onBossHealthChanged: (name: string, pct: number) => void = () => {};
  onBossDied: () => void = () => {};
  onTrollStomp: (x: number, y: number, z: number, radius: number, damage: number) => void = () => {};
  onBossWarCry: (x: number, z: number) => void = () => {};
  onBossSlam: (damage: number, x: number, z: number) => void = () => {};

  private _playerX = 32;
  private _playerZ = 32;
  private _playerY = 8;

  setPlayerPosition(x: number, z: number, y = 8): void {
    this._playerX = x;
    this._playerZ = z;
    this._playerY = y;
  }

  constructor(
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
  ) {
    const geo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 4);
    const mat = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
    for (let i = 0; i < SKELETON_ARROW_POOL; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      scene.add(mesh);
      this.skeletonArrows.push({ mesh, vel: new THREE.Vector3(), damage: 0, life: 0, active: false });
    }

    // Spider web projectile pool — grey-white sticky globs
    const webGeo = new THREE.SphereGeometry(0.15, 5, 4);
    const webMat = new THREE.MeshLambertMaterial({ color: 0xddddcc, transparent: true, opacity: 0.85 });
    for (let i = 0; i < SPIDER_WEB_POOL; i++) {
      const mesh = new THREE.Mesh(webGeo, webMat);
      mesh.visible = false;
      scene.add(mesh);
      this.spiderWebs.push({ mesh, vel: new THREE.Vector3(), life: 0, active: false });
    }
  }

  setFlowField(ff: FlowField): void { this.flowField = ff; }
  setWorld(w: VoxelWorld):     void { this.world = w; }

  /** Spawn an elite variant: 2× HP, 1.5× damage, 1.3× scale, orange glow. */
  spawnElite(type: EnemyTypeName, spawnX?: number, spawnZ?: number): number {
    const id = this.spawn(type, spawnX, spawnZ);
    const state = this.enemies.get(id)!;
    state.elite = true;
    // Double HP and bump damage
    state.health = state.config.maxHealth * 2;
    // Mutate a copy of config so we don't affect other spawns of same type
    state.config = {
      ...state.config,
      maxHealth: state.config.maxHealth * 2,
      damage: Math.ceil(state.config.damage * 1.5),
      xpReward: (state.config.xpReward ?? 10) * 3,
    };
    // Visual: 1.3× scale + orange emissive glow
    const group = this.meshes.get(id);
    if (group) {
      group.scale.multiplyScalar(1.3);
      group.traverse(obj => {
        if ((obj as THREE.Mesh).isMesh) {
          const mat = (obj as THREE.Mesh).material as THREE.MeshLambertMaterial;
          if (mat && obj.name !== "boss_eye") {
            mat.emissive = new THREE.Color(0xff4400);
            mat.emissiveIntensity = 0.35;
          }
        }
      });
    }
    // Gold health bar for elites
    const hb = this.healthBars.get(id);
    if (hb) {
      (hb.bar.material as THREE.MeshBasicMaterial).color.setHex(0xffaa00);
    }
    return id;
  }

  spawn(type: EnemyTypeName, spawnX?: number, spawnZ?: number): number {
    const cfg = ENEMY_CONFIGS[type];
    const id  = this.idCounter++;

    const state: EnemyState = {
      id,
      config: cfg,
      health: cfg.maxHealth,
      waypointIndex: 1,
      speed: cfg.speed,
      slowTimer: 0,
      alive: true,
      dying: false,
      dyingTimer: 0,
      movePhase: Math.random() * Math.PI * 2,
      useFlowField: FLOW_FIELD_TYPES.has(type),
      breakTarget: null,
      breakTimer: 0,
      // War cry for uruk_captain — first cry at 8s (half cooldown)
      warCryTimer: type === "uruk_captain" ? WAR_CRY_COOLDOWN * 0.55 : undefined,
      warCryFlash: 0,
    };
    this.enemies.set(id, state);

    // Assign spider a random wall segment to climb (outside the gate opening)
    if (type === "spider") {
      this.assignSpiderClimbTarget(state, spawnZ);
    }

    const group = this.buildMesh(type, cfg.scale);

    // Per-enemy hue variation so no two goblins/orcs/zombies look identical
    if (type === "goblin" || type === "goblin_miner" || type === "orc" || type === "zombie") {
      const seed = (id * 2654435761) >>> 0;
      const hueDelta  = ((seed % 201) - 100) / 1000;        // ±0.10 hue shift
      const lightDelta = type === "zombie"
        ? ((((seed >>> 8) % 101) - 50) / 1000)              // ±0.05 lightness for undead rot
        : 0;
      const hslBuf: { h: number; s: number; l: number } = { h: 0, s: 0, l: 0 };
      group.traverse(obj => {
        if (!(obj as THREE.Mesh).isMesh) return;
        const mats = (obj as THREE.Mesh).material;
        const matList: THREE.Material[] = Array.isArray(mats) ? mats : [mats];
        for (const mat of matList) {
          if (!(mat instanceof THREE.MeshLambertMaterial)) continue;
          if (mat.map) continue; // preserve painted canvas face textures
          mat.color.getHSL(hslBuf);
          mat.color.setHSL(
            (hslBuf.h + hueDelta + 1.0) % 1.0,
            hslBuf.s,
            Math.max(0.05, Math.min(0.95, hslBuf.l + lightDelta)),
          );
        }
      });
    }

    if (FLOW_FIELD_TYPES.has(type)) {
      let sx: number, sz: number;
      if (spawnX !== undefined && spawnZ !== undefined) {
        sx = spawnX; sz = spawnZ;
      } else {
        const positions = getSpawnPositions("north");
        [sx, sz] = positions[Math.floor(Math.random() * positions.length)];
        sx += 0.5; sz += 0.5;
      }
      group.position.set(sx, ENEMY_Y, sz);
    } else {
      // All types now use flow field — fall back to north gate
      const positions = getSpawnPositions("north");
      const [fx, fz]  = positions[Math.floor(Math.random() * positions.length)];
      group.position.set(fx + 0.5, ENEMY_Y, fz + 0.5);
    }

    this.scene.add(group);
    this.meshes.set(id, group);

    const hb = this.buildHealthBar();
    this.scene.add(hb.bg);
    this.scene.add(hb.bar);
    this.healthBars.set(id, hb);

    return id;
  }

  update(dt: number): void {
    for (const [id, state] of this.enemies) {
      if (!state.alive) continue;

      if (state.dying) {
        state.dyingTimer -= dt;
        const group = this.meshes.get(id)!;
        group.rotation.x += dt * 4;
        group.scale.multiplyScalar(1 - dt * 3);
        if (state.dyingTimer <= 0) this.despawn(id);
        continue;
      }

      if (state.slowTimer > 0) {
        state.slowTimer -= dt;
        if (state.slowTimer <= 0) {
          state.speed = state.config.speed;
          this.clearSlowTint(id);
        }
      }

      const group = this.meshes.get(id)!;

      if (this.flowField) {
        this.updateFlowFieldEnemy(id, state, group, dt);
      }

      // uruk_captain war cry
      if (state.config.type === "uruk_captain" && state.warCryTimer !== undefined) {
        state.warCryTimer -= dt;

        // Handle boss flash during war cry
        if (state.warCryFlash !== undefined && state.warCryFlash > 0) {
          state.warCryFlash -= dt;
          const t = 1 - state.warCryFlash / WAR_CRY_FLASH_DURATION;
          const bright = Math.sin(t * Math.PI * 8) * 0.5 + 0.5;
          this.setBossWarCryGlow(id, bright > 0.5);
          if (state.warCryFlash <= 0) this.clearBossWarCryGlow(id);
        }

        if (state.warCryTimer <= 0) {
          state.warCryTimer = WAR_CRY_COOLDOWN;
          state.warCryFlash = WAR_CRY_FLASH_DURATION;
          const pos = group.position;
          this.onBossWarCry(pos.x, pos.z);
          // Buff all nearby non-boss enemies
          for (const [otherId, other] of this.enemies) {
            if (otherId === id || !other.alive || other.dying) continue;
            const oGroup = this.meshes.get(otherId);
            if (!oGroup) continue;
            const dx = oGroup.position.x - pos.x;
            const dz = oGroup.position.z - pos.z;
            if (dx * dx + dz * dz <= WAR_CRY_BUFF_RADIUS * WAR_CRY_BUFF_RADIUS) {
              other.speed = other.config.speed * WAR_CRY_SPEED_MULT;
              other.slowTimer = Math.max(other.slowTimer, WAR_CRY_BUFF_DURATION);
              this.applyWarCryTint(otherId);
            }
          }
        }
      }

      this.updateHealthBar(id, state, group.position);
    }

    // Update skeleton arrows
    const GRAVITY = 18;
    const ARROW_KILL_DIST = 0.7;
    for (const arrow of this.skeletonArrows) {
      if (!arrow.active) continue;
      arrow.life -= dt;
      if (arrow.life <= 0) {
        arrow.active = false;
        arrow.mesh.visible = false;
        continue;
      }
      arrow.vel.y -= GRAVITY * dt;
      arrow.mesh.position.addScaledVector(arrow.vel, dt);
      // Orient arrow along velocity
      const len = arrow.vel.length();
      if (len > 0.01) {
        arrow.mesh.lookAt(arrow.mesh.position.clone().add(arrow.vel));
        arrow.mesh.rotation.x += Math.PI / 2;
      }
      // Check hit against player
      const dx = arrow.mesh.position.x - this._playerX;
      const dy = arrow.mesh.position.y - this._playerY;
      const dz = arrow.mesh.position.z - this._playerZ;
      if (dx * dx + dy * dy + dz * dz < ARROW_KILL_DIST * ARROW_KILL_DIST) {
        this.onSkeletonArrowHit(arrow.damage);
        arrow.active = false;
        arrow.mesh.visible = false;
      }
    }

    // Update spider webs
    for (const web of this.spiderWebs) {
      if (!web.active) continue;
      web.life -= dt;
      if (web.life <= 0) {
        web.active = false;
        web.mesh.visible = false;
        continue;
      }
      web.mesh.position.addScaledVector(web.vel, dt);
      // Simple rotation for visual flair
      web.mesh.rotation.x += dt * 3;
      web.mesh.rotation.z += dt * 2;
      // Check hit against player
      const dx = web.mesh.position.x - this._playerX;
      const dy = web.mesh.position.y - this._playerY;
      const dz = web.mesh.position.z - this._playerZ;
      if (dx * dx + dy * dy + dz * dz < SPIDER_WEB_HIT_DIST * SPIDER_WEB_HIT_DIST) {
        this.onSpiderWebHit();
        web.active = false;
        web.mesh.visible = false;
      }
    }
  }

  damage(id: number, amount: number, slowFactor = 1.0, slowDuration = 0, knockback = false): void {
    const state = this.enemies.get(id);
    if (!state || !state.alive || state.dying) return;

    const prevPct = state.health / state.config.maxHealth;
    state.health = Math.max(0, state.health - amount);
    this.flashHit(id);

    // Brief stagger on melee hit — interrupts skeleton strafe direction
    if (knockback) {
      state.knockbackTimer = KNOCKBACK_STAGGER;
      if (state.config.type === "skeleton") state.strafeTimer = 0; // forces immediate strafe flip
    }

    if (slowFactor < 1.0 && slowDuration > 0) {
      state.speed = Math.min(state.speed, state.config.speed * slowFactor);
      state.slowTimer = Math.max(state.slowTimer, slowDuration);
      this.applySlowTint(id);
    }

    this.updateHealthBar(id, state, this.meshes.get(id)?.position ?? new THREE.Vector3());

    // Boss-specific handling
    if (state.config.type === "uruk_captain") {
      const newPct = state.health / state.config.maxHealth;
      this.onBossHealthChanged(state.config.name, newPct);
      // Rage mode triggers when crossing 50% health threshold
      if (prevPct > BOSS_RAGE_THRESHOLD && newPct <= BOSS_RAGE_THRESHOLD && state.slowTimer <= 0) {
        state.speed = state.config.speed * 1.6;
        this.applyRageTint(id);
      }
    }

    if (state.health <= 0) {
      state.dying = true;
      state.dyingTimer = 0.5;
      if (state.config.type === "uruk_captain") this.onBossDied();
      this.onEnemyDied(state);
    }
  }

  getAliveEnemies(): EnemyState[] {
    return [...this.enemies.values()].filter(e => e.alive && !e.dying);
  }

  damageInRadius(x: number, y: number, z: number, radius: number, amount: number): number {
    let killed = 0;
    for (const [id, state] of this.enemies) {
      if (!state.alive || state.dying) continue;
      const pos = this.meshes.get(id)?.position;
      if (!pos) continue;
      const dx = pos.x - x, dy = pos.y - y, dz = pos.z - z;
      if (dx*dx + dy*dy + dz*dz <= radius*radius) {
        const before = state.health;
        this.damage(id, amount);
        if (before > 0 && state.health <= 0) killed++;
      }
    }
    return killed;
  }

  getEnemyPosition(id: number): THREE.Vector3 | null {
    return this.meshes.get(id)?.position ?? null;
  }

  getEnemy(id: number): EnemyState | undefined {
    return this.enemies.get(id);
  }

  getEnemyMeshes(): THREE.Object3D[] {
    return [...this.meshes.values()];
  }

  getMeshToId(): Map<THREE.Object3D, number> {
    const map = new Map<THREE.Object3D, number>();
    this.meshes.forEach((group, id) => map.set(group, id));
    return map;
  }

  reset(): void {
    for (const id of [...this.enemies.keys()]) this.despawn(id);
    this.enemies.clear();
    this.idCounter = 0;
    // Clear in-flight webs
    for (const w of this.spiderWebs) { w.active = false; w.mesh.visible = false; }
  }

  getEnemyProgress(id: number): number {
    const pos = this.meshes.get(id)?.position;
    if (!pos || !this.flowField) return 0;
    const dist = this.flowField.getDistance(pos.x, pos.z);
    return isFinite(dist) ? 1 / (1 + dist) : 0;
  }

  /** Returns the current alive Troll King state and position, or null if not present. */
  getBossState(): { state: EnemyState; pos: THREE.Vector3 } | null {
    for (const [id, state] of this.enemies) {
      if (state.config.type === "troll_king" && state.alive && !state.dying) {
        const pos = this.meshes.get(id)?.position;
        if (pos) return { state, pos };
      }
    }
    return null;
  }

  // ─── Flow-field movement ───────────────────────────────────────────────────

  private updateFlowFieldEnemy(
    id: number, state: EnemyState, group: THREE.Group, dt: number,
  ): void {
    const pos = group.position;

    // Knockback stagger — enemy pauses movement briefly after taking a hit
    if ((state.knockbackTimer ?? 0) > 0) {
      state.knockbackTimer = (state.knockbackTimer ?? 0) - dt;
      return;
    }

    // Reached fortress center?
    const dx = pos.x - FORTRESS_CENTER_X;
    const dz = pos.z - FORTRESS_CENTER_Z;
    if (Math.sqrt(dx * dx + dz * dz) < REACH_RADIUS) {
      state.alive = false;
      this.despawn(id);
      this.onEnemyReachedBase(state);
      return;
    }

    const flow = this.flowField!.getFlowDirection(pos.x, pos.z);

    if (state.config.canBreakWalls && this.world) {
      // Check if the next cell in movement direction has a wall
      const nx = Math.floor(pos.x + flow.dx);
      const nz = Math.floor(pos.z + flow.dz);
      const blocked = nx >= 0 && nz >= 0 &&
        this.world.getBlock(nx, 1, nz) !== "air";

      if (blocked) {
        if (!state.breakTarget ||
            state.breakTarget.x !== nx || state.breakTarget.z !== nz) {
          state.breakTarget = { x: nx, y: Math.round(ENEMY_Y), z: nz };
          state.breakTimer  = 0;
        }
        state.breakTimer = (state.breakTimer ?? 0) + dt;
        if (state.breakTimer >= WALL_BREAK_TIME) {
          const baseY = Math.round(ENEMY_Y);
          for (let wy = baseY; wy <= baseY + 2; wy++) {
            if (this.world.getBlock(nx, wy, nz) !== "air") {
              this.world.setBlock(nx, wy, nz, "air");
            }
          }
          this.world.rebuildDirtyChunks();
          state.breakTarget = null;
          state.breakTimer  = 0;
          this.onWallBroken(nx, nz);
        }
        return; // stand still while breaking
      }
    }

    // Creeper priming logic
    if (state.config.type === "creeper") {
      const dx = this._playerX - pos.x;
      const dz = this._playerZ - pos.z;
      const distToPlayer = Math.sqrt(dx * dx + dz * dz);
      const dxBase = FORTRESS_CENTER_X - pos.x;
      const dzBase = FORTRESS_CENTER_Z - pos.z;
      const distToBase = Math.sqrt(dxBase * dxBase + dzBase * dzBase);
      const inRange = distToPlayer < 3.5 || distToBase < 3.5;

      if (inRange) {
        if (!state.priming) {
          state.priming = true;
          state.primeTimer = 0;
          state.flashTimer = 0;
          this.onCreeperPrime();
        }
        state.primeTimer = (state.primeTimer ?? 0) + dt;
        state.flashTimer = (state.flashTimer ?? 0) + dt;

        // Flash body white/green rapidly as fuse gets closer
        const flashRate = 4 + (state.primeTimer ?? 0) * 3;
        if ((state.flashTimer ?? 0) >= 1 / flashRate) {
          state.flashTimer = 0;
          const isWhite = Math.floor((state.primeTimer ?? 0) * flashRate) % 2 === 0;
          group.traverse(c => {
            const m = c as THREE.Mesh;
            if (!m.isMesh) return;
            const mats = Array.isArray(m.material)
              ? (m.material as THREE.MeshLambertMaterial[])
              : [m.material as THREE.MeshLambertMaterial];
            for (const mat of mats) {
              if (mat.name !== "face") mat.emissive?.setHex(isWhite ? 0xaaffaa : 0x001100);
            }
          });
        }

        // Explode after 1.8 seconds
        if ((state.primeTimer ?? 0) >= 1.8) {
          this.onCreeperExplode(pos.x, pos.y, pos.z, 3.5);
          state.alive = false;
          state.dying = true;
          state.dyingTimer = 0.01;
          return;
        }
        return; // stand still while priming
      } else if (state.priming) {
        // Out of range — cancel priming
        state.priming = false;
        state.primeTimer = 0;
        group.traverse(c => {
          const m = c as THREE.Mesh;
          if (!m.isMesh) return;
          const mats = Array.isArray(m.material)
            ? (m.material as THREE.MeshLambertMaterial[])
            : [m.material as THREE.MeshLambertMaterial];
          for (const mat of mats) mat.emissive?.setHex(0);
        });
      }
    }

    // Skeleton ranged attack
    if (state.config.type === "skeleton") {
      const dx = this._playerX - pos.x;
      const dz = this._playerZ - pos.z;
      const distToPlayer = Math.sqrt(dx * dx + dz * dz);

      if (distToPlayer < SKELETON_SHOOT_RANGE) {
        // Face the player
        group.rotation.y = Math.atan2(dx, dz);

        // Tick shoot cooldown
        state.shootCooldown = (state.shootCooldown ?? 0) - dt;
        if (state.shootCooldown <= 0) {
          state.shootCooldown = SKELETON_SHOOT_INTERVAL;
          this.fireSkeletonArrow(pos, state.config.damage);
        }

        // Strafe sideways while aiming
        state.strafeTimer = (state.strafeTimer ?? 0) - dt;
        if (state.strafeTimer <= 0) {
          state.strafeDir = (Math.random() < 0.5 ? 1 : -1) as 1 | -1;
          state.strafeTimer = SKELETON_STRAFE_FLIP + Math.random() * 0.8;
        }
        const dir   = state.strafeDir ?? 1;
        const dLen  = Math.sqrt(dx * dx + dz * dz) || 1;
        // Perpendicular to player direction
        const perpX = (-dz / dLen) * dir;
        const perpZ = (dx / dLen) * dir;
        pos.x += perpX * SKELETON_STRAFE_SPEED * dt;
        pos.z += perpZ * SKELETON_STRAFE_SPEED * dt;

        state.movePhase += dt * SKELETON_STRAFE_SPEED * 4;
        this.animateLegs(id, state.movePhase);
        return;
      }
    }

    // Spider web shot — periodically spit a web blob at the player
    if (state.config.type === "spider") {
      const sdx = this._playerX - pos.x;
      const sdz = this._playerZ - pos.z;
      const distToPlayer = Math.sqrt(sdx * sdx + sdz * sdz);

      state.webCooldown = (state.webCooldown ?? SPIDER_WEB_INTERVAL) - dt;
      if (state.webCooldown <= 0 && distToPlayer < SPIDER_WEB_RANGE) {
        state.webCooldown = SPIDER_WEB_INTERVAL + Math.random() * 1.5;
        this.fireSpiderWeb(pos);
      }
    }

    // Troll / boss stomp attack
    if (state.config.type === "troll" || state.config.type === "uruk_captain") {
      state.stompCooldown = Math.max(0, (state.stompCooldown ?? STOMP_COOLDOWN) - dt);

      const stompDx   = this._playerX - pos.x;
      const stompDz   = this._playerZ - pos.z;
      const stompDist = Math.sqrt(stompDx * stompDx + stompDz * stompDz);
      // Base scale accounting for elite 1.3× multiplier
      const baseS = state.config.scale * (state.elite ? 1.3 : 1.0);

      if (state.stompCharging) {
        state.stompChargeTimer = (state.stompChargeTimer ?? 0) + dt;
        // Wind-up: widen and compress vertically (crouch before leap)
        const t = Math.min(1, (state.stompChargeTimer ?? 0) / STOMP_CHARGE_TIME);
        group.scale.set(baseS * (1.0 + t * 0.1), baseS * (1.0 - t * 0.18), baseS * (1.0 + t * 0.1));

        if ((state.stompChargeTimer ?? 0) >= STOMP_CHARGE_TIME) {
          // Fire stomp!
          state.stompCharging = false;
          state.stompCooldown = STOMP_COOLDOWN;
          state.stompChargeTimer = 0;
          group.scale.setScalar(baseS);
          this.onTrollStomp(pos.x, pos.y, pos.z, STOMP_RADIUS, STOMP_DAMAGE);
        }
        return; // stand still during wind-up
      }

      if (stompDist <= STOMP_RANGE && state.stompCooldown <= 0) {
        state.stompCharging = true;
        state.stompChargeTimer = 0;
        group.scale.setScalar(baseS);
        // Face the player before stomping
        group.rotation.y = Math.atan2(stompDx, stompDz);
      }
    }

    // Spider wall-climbing: bypass fortress walls by scaling vertically
    if (state.config.type === "spider" && state.climbPhase) {
      this.updateSpiderClimb(state, group, pos, dt);
      state.movePhase += dt * state.speed * 4;
      this.animateLegs(id, state.movePhase);
      return;
    }

    // Troll King boss behaviour
    if (state.config.type === "troll_king") {
      // Berserker rage at BOSS_BERSERK_HP
      if (!state.berserking && state.health / state.config.maxHealth < BOSS_BERSERK_HP) {
        state.berserking = true;
        state.speed = state.config.speed * 2.0;
        group.traverse(c => {
          const m = c as THREE.Mesh;
          if (m.isMesh) {
            const mat = m.material as THREE.MeshLambertMaterial;
            mat.emissive.setHex(0x660000);
            mat.emissiveIntensity = 0.6;
          }
        });
      }

      // Ground slam
      state.slamCooldown = (state.slamCooldown ?? BOSS_SLAM_INTERVAL) - dt;
      if (state.slamCooldown <= 0) {
        state.slamCooldown = BOSS_SLAM_INTERVAL;
        const dxP = this._playerX - pos.x;
        const dzP = this._playerZ - pos.z;
        if (Math.sqrt(dxP * dxP + dzP * dzP) < BOSS_SLAM_RANGE) {
          this.onBossSlam(state.config.damage, pos.x, pos.z);
          group.scale.set(state.config.scale * 1.15, state.config.scale * 0.75, state.config.scale * 1.15);
          setTimeout(() => {
            group.scale.setScalar(state.config.scale);
          }, 200);
        }
      }
    }

    // Move in flow direction
    if (flow.dx !== 0 || flow.dz !== 0) {
      pos.x += flow.dx * state.speed * dt;
      pos.z += flow.dz * state.speed * dt;
      pos.y  = ENEMY_Y;

      const angle = Math.atan2(flow.dx, flow.dz);
      group.rotation.y = angle;
    }

    state.movePhase += dt * state.speed * 4;
    this.animateLegs(id, state.movePhase);
  }

  private assignSpiderClimbTarget(state: import("./types").EnemyState, spawnZ?: number): void {
    // Determine which wall to target based on spawn side
    const targetingNorth = spawnZ === undefined || spawnZ < FORTRESS_CENTER_Z;
    const wallZ   = targetingNorth ? FORTRESS_WALL_NORTH_Z : FORTRESS_WALL_SOUTH_Z;
    const innerZ  = targetingNorth ? FORTRESS_INNER_NORTH_Z : FORTRESS_INNER_SOUTH_Z;
    const dirZ    = targetingNorth ? 1 : -1;  // +1 = climbing inward from north

    // Pick a random X column that's NOT the gate opening
    let wallX: number;
    do {
      wallX = FORTRESS_WALL_WEST_X + 1 +
        Math.floor(Math.random() * (FORTRESS_WALL_EAST_X - FORTRESS_WALL_WEST_X - 1));
    } while (wallX >= FORTRESS_GATE_X1 && wallX <= FORTRESS_GATE_X2);

    state.climbPhase   = "approach";
    state.climbTargetX = wallX + 0.5;
    state.climbTargetZ = wallZ;
    state.climbInnerZ  = innerZ;
    state.climbDirZ    = dirZ;
  }

  private updateSpiderClimb(
    state: import("./types").EnemyState,
    group: THREE.Group,
    pos: THREE.Vector3,
    dt: number,
  ): void {
    const targetX = state.climbTargetX ?? pos.x;
    const targetZ = state.climbTargetZ ?? pos.z;
    const innerZ  = state.climbInnerZ  ?? pos.z;
    const dirZ    = state.climbDirZ    ?? 1;

    switch (state.climbPhase) {
      case "approach": {
        // Walk directly to wall base (ignores flow field)
        const dx = targetX - pos.x;
        const dz = targetZ - pos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < 1.0) {
          pos.x = targetX;
          state.climbPhase = "up";
        } else {
          const spd = state.speed * dt;
          pos.x += (dx / dist) * spd;
          pos.z += (dz / dist) * spd;
          pos.y = ENEMY_Y;
        }
        group.rotation.x = 0;
        group.rotation.y = Math.atan2(targetX - pos.x, targetZ - pos.z);
        break;
      }
      case "up": {
        // Climb upward while holding X position at wall column
        pos.y += SPIDER_CLIMB_SPEED * dt;
        pos.z = targetZ; // pressed against the wall face
        // Tilt spider forward (climbing pose)
        group.rotation.x = -Math.PI / 2.2;
        group.rotation.y = dirZ > 0 ? 0 : Math.PI;
        if (pos.y >= SPIDER_WALL_TOP_Y) {
          pos.y = SPIDER_WALL_TOP_Y;
          state.climbPhase = "across";
          state.climbTimer = 0;
        }
        break;
      }
      case "across": {
        // Scurry across the wall top toward fortress interior
        state.climbTimer = (state.climbTimer ?? 0) + dt;
        pos.z += dirZ * state.speed * 0.9 * dt;
        pos.y = SPIDER_WALL_TOP_Y;
        group.rotation.x = 0;
        group.rotation.y = dirZ > 0 ? 0 : Math.PI;
        // Switch to descent when past the inner wall edge
        if (dirZ > 0 ? pos.z >= innerZ : pos.z <= innerZ) {
          state.climbPhase = "down";
        }
        break;
      }
      case "down": {
        // Descend to ground level, then resume flow-field navigation
        pos.y -= SPIDER_CLIMB_SPEED * dt;
        pos.z += dirZ * state.speed * 0.3 * dt; // drift inward while descending
        group.rotation.x = Math.PI / 2.2;
        group.rotation.y = dirZ > 0 ? 0 : Math.PI;
        if (pos.y <= ENEMY_Y) {
          pos.y = ENEMY_Y;
          group.rotation.x = 0;
          // Clear climb state — resume normal flow field
          state.climbPhase   = undefined;
          state.climbTargetX = undefined;
          state.climbTargetZ = undefined;
          state.climbInnerZ  = undefined;
          state.climbDirZ    = undefined;
          state.climbTimer   = undefined;
        }
        break;
      }
    }

    group.position.copy(pos);
  }

  private fireSkeletonArrow(from: THREE.Vector3, damage: number): void {
    const arrow = this.skeletonArrows.find(a => !a.active);
    if (!arrow) return;

    const tx = this._playerX, ty = this._playerY + 0.8, tz = this._playerZ;
    const dx = tx - from.x, dy = ty - from.y, dz = tz - from.z;
    const horiz = Math.sqrt(dx * dx + dz * dz);
    const speed = 10;

    arrow.active = true;
    arrow.damage = damage;
    arrow.life = 4;
    arrow.mesh.position.set(from.x, from.y + 1.1, from.z);
    arrow.mesh.visible = true;

    const spd3d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    arrow.vel.set(
      dx / spd3d * speed,
      (dy + horiz * 0.15) / spd3d * speed, // slight upward arc
      dz / spd3d * speed,
    );
  }

  private fireSpiderWeb(from: THREE.Vector3): void {
    const web = this.spiderWebs.find(w => !w.active);
    if (!web) return;

    const tx = this._playerX, ty = this._playerY + 0.8, tz = this._playerZ;
    const dx = tx - from.x, dy = ty - from.y, dz = tz - from.z;
    const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;

    web.active = true;
    web.life = 3.5;
    web.mesh.position.set(from.x, from.y + 0.4, from.z);
    web.mesh.visible = true;
    // Slight upward arc to make it readable
    web.vel.set(
      dx / len * SPIDER_WEB_SPEED,
      (dy / len + 0.2) * SPIDER_WEB_SPEED,
      dz / len * SPIDER_WEB_SPEED,
    );
  }

  // ─── Mesh building ─────────────────────────────────────────────────────────

  private buildMesh(type: EnemyTypeName, scale: number): THREE.Group {
    const group = new THREE.Group();
    group.scale.setScalar(scale);

    if (type === "spider") {
      this.buildSpiderMesh(group);
    } else if (type === "creeper") {
      this.buildCreeperMesh(group);
    } else if (type === "skeleton") {
      this.buildSkeletonMesh(group);
    } else if (type === "uruk_captain") {
      this.buildUrukCaptainMesh(group);
    } else if (type === "troll_king") {
      this.buildTrollKingMesh(group);
    } else {
      this.buildHumanoidMesh(group, type);
    }

    return group;
  }

  private buildSpiderMesh(group: THREE.Group): void {
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.5), bodyMat);
    body.position.y = 0.15;
    body.castShadow = true;
    group.add(body);

    const headMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.25, 0.3), headMat);
    head.position.set(0.35, 0.2, 0);
    group.add(head);

    const eyeMat = new THREE.MeshLambertMaterial({
      color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5,
    });
    for (const ex of [-0.07, 0.07]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.01), eyeMat);
      eye.position.set(0.5, 0.22, ex);
      group.add(eye);
    }

    const legMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
    for (let i = 0; i < 4; i++) {
      for (const side of [-1, 1]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.4), legMat);
        leg.position.set(side * 0.35, 0.1, (i - 1.5) * 0.18);
        leg.rotation.z = side * 0.6;
        leg.name = `leg_${i}_${side}`;
        group.add(leg);
      }
    }
  }

  private buildCreeperMesh(group: THREE.Group): void {
    const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1a7a1a });

    // Body (tall narrow box)
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.7, 0.28), bodyMat);
    body.position.y = 0.65;
    body.castShadow = true;
    body.name = "creeper_body";
    group.add(body);

    // Head — canvas face texture on +Z front face
    const faceTex = EnemyManager.buildCreeperFaceTex();
    const faceMat = new THREE.MeshLambertMaterial({ map: faceTex });
    faceMat.name = "face"; // exclude from priming flash
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.48), [
      bodyMat, bodyMat, bodyMat, bodyMat, // -X +X -Y +Y
      bodyMat,                            // -Z back
      faceMat,                            // +Z front
    ]);
    head.position.y = 1.24;
    head.castShadow = true;
    head.name = "creeper_head";
    group.add(head);

    // Four stubby legs
    const legMat = new THREE.MeshLambertMaterial({ color: 0x166016 });
    for (const [lx, lz] of [[-0.1, -0.05], [0.1, -0.05], [-0.1, 0.05], [0.1, 0.05]]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.18), legMat);
      leg.position.set(lx, 0.14, lz);
      leg.castShadow = true;
      group.add(leg);
    }
  }

  private buildSkeletonMesh(group: THREE.Group): void {
    const boneMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0xbbbbbb });

    // Torso (narrower than zombie — bones showing)
    const bodyTex = EnemyManager.buildSkeletonBodyTex();
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.55, 0.22), [
      boneMat, boneMat, boneMat, boneMat,
      new THREE.MeshLambertMaterial({ map: bodyTex }), // +Z front face (rib cage)
      boneMat,
    ]);
    torso.position.y = 0.72;
    torso.castShadow = true;
    group.add(torso);

    // Head with skull canvas texture on +Z front face
    const skullTex = EnemyManager.buildSkeletonFaceTex();
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.38), [
      boneMat, boneMat, boneMat, boneMat,
      new THREE.MeshLambertMaterial({ map: skullTex }), // +Z front face
      boneMat,
    ]);
    head.position.y = 1.24;
    head.castShadow = true;
    group.add(head);

    // Thin arms/legs
    for (const [ax, i] of [[-0.26, 0], [0.26, 1]] as [number, number][]) {
      const armPivot = new THREE.Object3D();
      armPivot.position.set(ax, 0.88, 0);
      armPivot.name = `armpivot_${i}`;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.44, 0.14), darkMat);
      arm.position.y = -0.20;
      armPivot.add(arm);
      group.add(armPivot);
    }

    // Bow in right hand
    const bowMat = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
    const bowBody = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.04), bowMat);
    const bowTop  = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.12), bowMat);
    const bowBot  = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.12), bowMat);
    bowTop.position.y = 0.21;
    bowBot.position.y = -0.21;
    const bow = new THREE.Group();
    bow.add(bowBody); bow.add(bowTop); bow.add(bowBot);
    bow.position.set(0.30, 0.82, 0.18);
    bow.rotation.z = 0.15;
    group.add(bow);

    // Thin legs
    for (const [lx, i] of [[-0.1, 0], [0.1, 1]] as [number, number][]) {
      const legPivot = new THREE.Object3D();
      legPivot.position.set(lx, 0.48, 0);
      legPivot.name = `legpivot_${i}`;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.44, 0.14), darkMat);
      leg.position.y = -0.22;
      leg.castShadow = true;
      legPivot.add(leg);
      group.add(legPivot);
    }
  }

  private buildTrollKingMesh(group: THREE.Group): void {
    const bodyMat  = new THREE.MeshLambertMaterial({ color: 0x2a1a4a });
    const headMat  = new THREE.MeshLambertMaterial({ color: 0x3a2a5a });
    const armMat   = new THREE.MeshLambertMaterial({ color: 0x2a1a4a });
    const legMat   = new THREE.MeshLambertMaterial({ color: 0x1a0a3a });
    const crownMat = new THREE.MeshLambertMaterial({ color: 0xffd700, emissive: 0xaa8800, emissiveIntensity: 0.4 });
    const eyeMat   = new THREE.MeshLambertMaterial({ color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 1.0 });
    const warpaintMat = new THREE.MeshLambertMaterial({ color: 0xcc0000 });

    // Broad torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.75, 0.40), bodyMat);
    torso.position.y = 0.78;
    torso.castShadow = true;
    group.add(torso);

    // Large head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 0.58), headMat);
    head.position.y = 1.42;
    head.castShadow = true;
    group.add(head);

    // Glowing red eyes
    for (const ex of [-0.13, 0.13]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.02), eyeMat);
      eye.position.set(ex, 1.48, 0.30);
      group.add(eye);
    }

    // War paint stripes on face
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.02), warpaintMat);
    stripe.position.set(0, 1.40, 0.30);
    group.add(stripe);

    // Golden crown
    for (let i = 0; i < 5; i++) {
      const spike = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14 + (i % 2) * 0.08, 0.07), crownMat);
      spike.position.set(-0.24 + i * 0.12, 1.79 + (i % 2) * 0.04, 0);
      group.add(spike);
    }
    const crownBand = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.08, 0.62), crownMat);
    crownBand.position.y = 1.73;
    group.add(crownBand);

    // Massive arms
    let trollRightArmPivot: THREE.Object3D | null = null;
    for (const [ax, i] of [[-0.48, 0], [0.48, 1]] as [number, number][]) {
      const armPivot = new THREE.Object3D();
      armPivot.position.set(ax, 1.0, 0);
      armPivot.name = `armpivot_${i}`;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.65, 0.28), armMat);
      arm.position.y = -0.30;
      arm.castShadow = true;
      armPivot.add(arm);
      group.add(armPivot);
      if (i === 1) trollRightArmPivot = armPivot;
    }

    // Shoulder pads
    for (const sx of [-0.44, 0.44]) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.44), crownMat);
      pad.position.set(sx, 1.08, 0);
      group.add(pad);
    }

    // War club parented to right arm pivot so it swings with the arm
    const clubMat = new THREE.MeshLambertMaterial({ color: 0x5c3a1a });
    const club    = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.70, 0.12), clubMat);
    club.position.set(0.08, -0.45, 0.20);
    trollRightArmPivot!.add(club);
    const clubHead = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), clubMat);
    clubHead.position.set(0.08, -0.78, 0.20);
    trollRightArmPivot!.add(clubHead);

    // Thick legs
    for (const [lx, i] of [[-0.18, 0], [0.18, 1]] as [number, number][]) {
      const legPivot = new THREE.Object3D();
      legPivot.position.set(lx, 0.44, 0);
      legPivot.name = `legpivot_${i}`;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.58, 0.30), legMat);
      leg.position.y = -0.29;
      leg.castShadow = true;
      legPivot.add(leg);
      group.add(legPivot);
    }
  }

  private buildHumanoidMesh(group: THREE.Group, type: EnemyTypeName): void {
    const cfg = ENEMY_CONFIGS[type];

    const bodyColorMat = new THREE.MeshLambertMaterial({ color: cfg.color });
    const bodyGeo = new THREE.BoxGeometry(0.5, 0.65, 0.3);
    let body: THREE.Mesh;
    if (type === "zombie") {
      const bodyTex = EnemyManager.buildZombieBodyTex();
      body = new THREE.Mesh(bodyGeo, [
        bodyColorMat, bodyColorMat, bodyColorMat, bodyColorMat,
        new THREE.MeshLambertMaterial({ map: bodyTex }), // +Z front face
        bodyColorMat,
      ]);
    } else if (type === "orc" || type === "troll") {
      const bodyTex = EnemyManager.buildOrcBodyTex();
      body = new THREE.Mesh(bodyGeo, [
        bodyColorMat, bodyColorMat, bodyColorMat, bodyColorMat,
        new THREE.MeshLambertMaterial({ map: bodyTex }), // +Z front face
        bodyColorMat,
      ]);
    } else if (type === "goblin" || type === "goblin_miner") {
      const bodyTex = type === "goblin_miner"
        ? EnemyManager.buildGoblinMinerBodyTex()
        : EnemyManager.buildGoblinBodyTex();
      body = new THREE.Mesh(bodyGeo, [
        bodyColorMat, bodyColorMat, bodyColorMat, bodyColorMat,
        new THREE.MeshLambertMaterial({ map: bodyTex }), // +Z front face
        bodyColorMat,
      ]);
    } else {
      body = new THREE.Mesh(bodyGeo, bodyColorMat);
    }
    body.position.y = 0.7;
    body.castShadow = true;
    group.add(body);

    // Head — use canvas face texture for zombie and goblin; flat color + eye boxes for others
    const headGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
    let head: THREE.Mesh;
    if (type === "zombie") {
      const faceTex = EnemyManager.buildZombieFaceTex();
      const side = new THREE.MeshLambertMaterial({ color: cfg.headColor });
      head = new THREE.Mesh(headGeo, [
        side, side, side, side,
        new THREE.MeshLambertMaterial({ map: faceTex }), // +Z front face
        side,
      ]);
    } else if (type === "goblin" || type === "goblin_miner") {
      const faceTex = EnemyManager.buildGoblinFaceTex();
      const side = new THREE.MeshLambertMaterial({ color: cfg.headColor });
      head = new THREE.Mesh(headGeo, [
        side, side, side, side,
        new THREE.MeshLambertMaterial({ map: faceTex }), // +Z front face
        side,
      ]);
      // Pointed ears — small angled boxes on each side
      const earMat = new THREE.MeshLambertMaterial({ color: cfg.headColor });
      for (const [ex, dir] of [[-0.25, -1], [0.25, 1]] as [number, number][]) {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.17, 0.06), earMat);
        ear.position.set(ex, 1.36, 0.02);
        ear.rotation.z = dir * 0.45;
        group.add(ear);
      }
    } else if (type === "orc") {
      const faceTex = EnemyManager.buildOrcFaceTex();
      const side = new THREE.MeshLambertMaterial({ color: cfg.headColor });
      head = new THREE.Mesh(headGeo, [
        side, side, side, side,
        new THREE.MeshLambertMaterial({ map: faceTex }),
        side,
      ]);
    } else if (type === "troll") {
      const faceTex = EnemyManager.buildTrollFaceTex();
      const side = new THREE.MeshLambertMaterial({ color: cfg.headColor });
      head = new THREE.Mesh(headGeo, [
        side, side, side, side,
        new THREE.MeshLambertMaterial({ map: faceTex }),
        side,
      ]);
    } else if (type === "golem") {
      const faceTex = EnemyManager.buildGolemFaceTex();
      const side = new THREE.MeshLambertMaterial({ color: cfg.headColor });
      head = new THREE.Mesh(headGeo, [
        side, side, side, side,
        new THREE.MeshLambertMaterial({ map: faceTex }), // +Z front face
        side,
      ]);
    } else {
      const headMat = new THREE.MeshLambertMaterial({ color: cfg.headColor });
      head = new THREE.Mesh(headGeo, headMat);
      const eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff, emissive: 0x888888, emissiveIntensity: 0.5 });
      for (const ex of [-0.1, 0.1]) {
        const eye = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.01), eyeMat);
        eye.position.set(ex, 1.3, 0.22);
        group.add(eye);
      }
    }
    head.position.y = 1.25;
    head.castShadow = true;
    group.add(head);

    const legMat = new THREE.MeshLambertMaterial({ color: cfg.color });
    for (const [lx, i] of [[-0.14, 0], [0.14, 1]] as [number, number][]) {
      const legPivot = new THREE.Object3D();
      legPivot.position.set(lx, 0.5, 0);
      legPivot.name = `legpivot_${i}`;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.22), legMat);
      leg.position.y = -0.25;
      leg.castShadow = true;
      legPivot.add(leg);
      group.add(legPivot);
    }

    // Arms
    const armMat = new THREE.MeshLambertMaterial({ color: cfg.headColor });
    let humanoidRightArmPivot: THREE.Object3D | null = null;
    for (const [ax, i] of [[-0.36, 0], [0.36, 1]] as [number, number][]) {
      const armPivot = new THREE.Object3D();
      armPivot.position.set(ax, 0.9, 0);
      armPivot.name = `armpivot_${i}`;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.22), armMat);
      arm.position.y = -0.22;
      armPivot.add(arm);
      group.add(armPivot);
      if (i === 1) humanoidRightArmPivot = armPivot;
    }

    // Extra details per type
    if (type === "golem" || type === "troll") {
      const padMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
      for (const px of [-0.35, 0.35]) {
        const pad = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.35), padMat);
        pad.position.set(px, 0.95, 0);
        group.add(pad);
      }
    }

    if (type === "goblin_miner") {
      // Pickaxe prop
      const pickMat = new THREE.MeshLambertMaterial({ color: 0x888888 });
      const pick = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.5), pickMat);
      pick.position.set(0.38, 0.7, 0.2);
      pick.rotation.x = Math.PI / 4;
      group.add(pick);
    }

    if (type === "orc") {
      // Leather belt across waist
      const beltMat = new THREE.MeshLambertMaterial({ color: 0x3a1a08 });
      const belt = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.08, 0.32), beltMat);
      belt.position.set(0, 0.48, 0);
      group.add(belt);
      // Metal belt buckle (gold-ish)
      const buckleMat = new THREE.MeshLambertMaterial({ color: 0xcc9900, emissive: 0x553300, emissiveIntensity: 0.2 });
      const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.04), buckleMat);
      buckle.position.set(0, 0.48, 0.165);
      group.add(buckle);
    }

    if (type === "orc" || type === "zombie") {
      // Club parented to right arm pivot so it swings with the arm
      const wepMat = new THREE.MeshLambertMaterial({ color: 0x5c3a1a });
      const club = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), wepMat);
      club.position.set(0.02, -0.25, 0.15);
      humanoidRightArmPivot!.add(club);
    }
  }

  private buildUrukCaptainMesh(group: THREE.Group): void {
    const armorMat  = new THREE.MeshLambertMaterial({ color: 0x1a1a2e });
    const skinMat   = new THREE.MeshLambertMaterial({ color: 0x2a2a3e });
    const darkMat   = new THREE.MeshLambertMaterial({ color: 0x0a0a18 });
    const eyeMat    = new THREE.MeshLambertMaterial({ color: 0xff2200, emissive: 0xff0000, emissiveIntensity: 1.2 });
    const bladeMat  = new THREE.MeshLambertMaterial({ color: 0x888899 });
    const goldMat   = new THREE.MeshLambertMaterial({ color: 0xddaa00, emissive: 0x664400, emissiveIntensity: 0.3 });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.32), armorMat);
    body.position.y = 0.72; body.castShadow = true;
    group.add(body);

    // Helmet
    const helm = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.48), darkMat);
    helm.position.y = 1.30; helm.castShadow = true;
    group.add(helm);
    // Helm visor
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.14, 0.04), darkMat);
    visor.position.set(0, 1.32, 0.25); group.add(visor);
    // Glowing red eyes
    for (const ex of [-0.09, 0.09]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), eyeMat);
      eye.position.set(ex, 1.34, 0.26);
      eye.name = "boss_eye";
      group.add(eye);
    }

    // Shoulder pauldrons
    for (const sx of [-0.46, 0.46]) {
      const pad = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.38), darkMat);
      pad.position.set(sx, 0.98, 0); group.add(pad);
      // Gold trim
      const trim = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.40), goldMat);
      trim.position.set(sx, 0.88, 0); group.add(trim);
    }

    // Legs with greaves
    for (const [lx, i] of [[-0.15, 0], [0.15, 1]] as [number, number][]) {
      const legPivot = new THREE.Object3D();
      legPivot.position.set(lx, 0.50, 0);
      legPivot.name = `legpivot_${i}`;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.52, 0.24), armorMat);
      leg.position.y = -0.26; leg.castShadow = true;
      legPivot.add(leg);
      group.add(legPivot);
    }

    // Arms
    let urukRightArmPivot: THREE.Object3D | null = null;
    for (const [ax, i] of [[-0.42, 0], [0.42, 1]] as [number, number][]) {
      const armPivot = new THREE.Object3D();
      armPivot.position.set(ax, 0.92, 0);
      armPivot.name = `armpivot_${i}`;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.52, 0.24), skinMat);
      arm.position.y = -0.24;
      armPivot.add(arm);
      group.add(armPivot);
      if (i === 1) urukRightArmPivot = armPivot;
    }

    // Greatsword parented to right arm pivot so it swings with the arm
    const swordGrip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.32, 0.06), goldMat);
    swordGrip.position.set(0.13, -0.37, 0.10); urukRightArmPivot!.add(swordGrip);
    const crossguard = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 0.06), goldMat);
    crossguard.position.set(0.13, -0.20, 0.10); urukRightArmPivot!.add(crossguard);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.70, 0.04), bladeMat);
    blade.position.set(0.13, 0.20, 0.10); urukRightArmPivot!.add(blade);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.03), bladeMat);
    tip.position.set(0.13, 0.64, 0.10); urukRightArmPivot!.add(tip);

    // War banner on the back — distinguishes the captain from a distance
    const poleMat2 = new THREE.MeshLambertMaterial({ color: 0x3a2810 });
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.055, 1.55, 0.055), poleMat2);
    pole.position.set(0, 1.28, -0.22);
    pole.castShadow = true;
    group.add(pole);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.05, 0.055), poleMat2);
    bar.position.set(-0.03, 2.04, -0.22);
    group.add(bar);
    const finial = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), goldMat);
    finial.position.set(0, 2.08, -0.22);
    group.add(finial);
    const bannerPivot = new THREE.Object3D();
    bannerPivot.name = "bannerpivot";
    bannerPivot.position.set(-0.03, 2.02, -0.22);
    group.add(bannerPivot);
    const bannerBodyMat = new THREE.MeshLambertMaterial({ color: 0x7a0a0a, side: THREE.DoubleSide });
    const bannerBody = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.46, 0.025), bannerBodyMat);
    bannerBody.position.set(0, -0.24, 0);
    bannerPivot.add(bannerBody);
    const emblMat = new THREE.MeshLambertMaterial({ color: 0xddaa00, emissive: 0x553300, emissiveIntensity: 0.25 });
    const ovalH = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.03), emblMat);
    ovalH.position.set(0, -0.24, 0);
    bannerPivot.add(ovalH);
    const ovalV = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.13, 0.03), emblMat);
    ovalV.position.set(0, -0.24, 0);
    bannerPivot.add(ovalV);
    const borderMat = new THREE.MeshLambertMaterial({ color: 0x1a0a00 });
    const topBorder = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.03), borderMat);
    topBorder.position.set(0, -0.02, 0);
    bannerPivot.add(topBorder);
    const botBorder = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.04, 0.03), borderMat);
    botBorder.position.set(0, -0.46, 0);
    bannerPivot.add(botBorder);
  }

  private animateLegs(id: number, phase: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    const type = this.enemies.get(id)?.config.type;
    group.traverse(c => {
      if (c.name.startsWith("legpivot_")) {
        const idx = parseInt(c.name.split("_")[1]);
        (c as THREE.Object3D).rotation.x = Math.sin(phase + idx * Math.PI) * 0.55;
      } else if (c.name.startsWith("armpivot_")) {
        const idx = parseInt(c.name.split("_")[1]);
        // Boss right arms hold weapons raised forward
        const isWeaponArm = idx === 1 && (type === "uruk_captain" || type === "troll_king");
        const isOrcArm = idx === 1 && (type === "orc" || type === "zombie");
        const base = isWeaponArm ? -0.55 : isOrcArm ? -0.28 : 0;
        (c as THREE.Object3D).rotation.x = base + Math.sin(phase + (1 - idx) * Math.PI) * 0.45;
      } else if (c.name === "bannerpivot") {
        (c as THREE.Object3D).rotation.z = Math.sin(phase * 0.9) * 0.18 + Math.sin(phase * 1.7) * 0.06;
        (c as THREE.Object3D).rotation.y = Math.sin(phase * 0.5 + 1.3) * 0.07;
      }
    });
    // Slight walk bob — only at ground level (preserved by caller for climbing)
    if (Math.abs(group.position.y - ENEMY_Y) < 0.1) {
      group.position.y = ENEMY_Y + Math.abs(Math.sin(phase * 2)) * 0.04;
    }
  }

  // ─── Health bar ────────────────────────────────────────────────────────────

  private buildHealthBar(): { bar: THREE.Mesh; bg: THREE.Mesh } {
    const bgMat = new THREE.MeshBasicMaterial({
      color: 0x333333, side: THREE.DoubleSide, depthTest: false,
    });
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.1), bgMat);
    bg.renderOrder = 1;

    const barMat = new THREE.MeshBasicMaterial({
      color: 0x44ff44, side: THREE.DoubleSide, depthTest: false,
    });
    const bar = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.1), barMat);
    bar.renderOrder = 2;

    return { bar, bg };
  }

  private updateHealthBar(id: number, state: EnemyState, position: THREE.Vector3): void {
    const hb = this.healthBars.get(id);
    if (!hb) return;
    const heightOffset = state.config.type === "spider" ? 0.6 : 1.7 * state.config.scale;
    const y = position.y + heightOffset;

    hb.bg.position.set(position.x, y, position.z);
    hb.bg.lookAt(this.camera.position);

    const pct   = Math.max(0, state.health / state.config.maxHealth);
    const color = pct > 0.5 ? 0x44ff44 : pct > 0.25 ? 0xffaa00 : 0xff2222;
    (hb.bar.material as THREE.MeshBasicMaterial).color.setHex(color);

    const scale = Math.max(0.001, pct);
    hb.bar.scale.x = scale;
    hb.bar.position.set(position.x - (1 - scale) * 0.35, y, position.z);
    hb.bar.lookAt(this.camera.position);
  }

  // ─── Visual effects ────────────────────────────────────────────────────────

  private flashHit(id: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshLambertMaterial;
      const orig = mat.emissive.getHex();
      mat.emissive.setHex(0xffffff);
      mat.emissiveIntensity = 0.8;
      setTimeout(() => {
        mat.emissive.setHex(orig);
        mat.emissiveIntensity = 0;
      }, 100);
    });
  }

  private applySlowTint(id: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.emissive.setHex(0x3399ff);
      mat.emissiveIntensity = 0.3;
    });
  }

  private clearSlowTint(id: number): void {
    const state = this.enemies.get(id);
    const group = this.meshes.get(id);
    if (!group) return;
    // Restore elite glow if applicable; otherwise clear entirely
    const eliteEmissive = state?.elite ? 0xff4400 : 0x000000;
    const eliteIntensity = state?.elite ? 0.35 : 0;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      if (m.name === "boss_eye") return;
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.emissive.setHex(eliteEmissive);
      mat.emissiveIntensity = eliteIntensity;
    });
  }

  private applyRageTint(id: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh || m.name === "boss_eye") return;
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.emissive.setHex(0xff2200);
      mat.emissiveIntensity = 0.4;
    });
  }

  private setBossWarCryGlow(id: number, on: boolean): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh || m.name === "boss_eye") return;
      const mat = m.material as THREE.MeshLambertMaterial;
      if (on) {
        mat.emissive.setHex(0xffaa00);
        mat.emissiveIntensity = 1.0;
      } else {
        mat.emissive.setHex(0xff2200);
        mat.emissiveIntensity = 0.4;
      }
    });
  }

  private clearBossWarCryGlow(id: number): void {
    const state = this.enemies.get(id);
    if (!state) return;
    const isRaging = state.health / state.config.maxHealth <= BOSS_RAGE_THRESHOLD;
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh || m.name === "boss_eye") return;
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.emissive.setHex(isRaging ? 0xff2200 : 0x000000);
      mat.emissiveIntensity = isRaging ? 0.4 : 0;
    });
  }

  private applyWarCryTint(id: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.emissive.setHex(0xcc6600);
      mat.emissiveIntensity = 0.45;
    });
  }

  // ─── Face canvas textures ──────────────────────────────────────────────────

  /** 16×16 zombie face: mottled green skin, dark rectangular eyes, grim mouth. */
  private static buildZombieFaceTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Mottled green-gray skin base using sine noise
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 2.3 + y * 1.7 + 5.1) * Math.cos(x * 0.9 + y * 2.8 + 3.7);
      const v = (n * 16) | 0;
      const r = Math.max(0, Math.min(255, 85 + v));
      const g = Math.max(0, Math.min(255, 140 + v));
      const b = Math.max(0, Math.min(255, 72 + v));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Dark eye sockets (rectangular, Minecraft-style)
    ctx.fillStyle = "#1a1008";
    ctx.fillRect(2, 5, 4, 3);   // left socket
    ctx.fillRect(10, 5, 4, 3);  // right socket
    // White pupils inside sockets
    ctx.fillStyle = "#ddddcc";
    ctx.fillRect(3, 6, 2, 1);
    ctx.fillRect(11, 6, 2, 1);
    // Downturned grim mouth
    ctx.fillStyle = "#1a1008";
    ctx.fillRect(4, 11, 8, 1);
    ctx.fillRect(4, 10, 1, 1);   // left corner up
    ctx.fillRect(11, 10, 1, 1);  // right corner up
    // Dark chin crease below mouth
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(3, 13, 10, 1);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 goblin face: bright green, beady glowing eyes, jagged toothy grin. */
  private static buildGoblinFaceTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Bright lime-green base with subtle noise
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 3.1 + y * 2.2 + 1.3) * 0.5;
      const v = (n * 14) | 0;
      const r = Math.max(0, Math.min(255, 68 + v));
      const g = Math.max(0, Math.min(255, 148 + v));
      const b = Math.max(0, Math.min(255, 30 + v));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Beady yellow-orange eyes
    ctx.fillStyle = "#ff8800";
    ctx.fillRect(3, 5, 3, 3);   // left eye
    ctx.fillRect(10, 5, 3, 3);  // right eye
    // Dark pupil dots
    ctx.fillStyle = "#1a0800";
    ctx.fillRect(4, 6, 1, 1);
    ctx.fillRect(11, 6, 1, 1);
    // Wide jagged grin — alternating tooth-and-gap pattern
    ctx.fillStyle = "#eeeedd"; // white teeth
    for (let tx = 3; tx < 13; tx += 2) { ctx.fillRect(tx, 10, 1, 2); }
    ctx.fillStyle = "#1a0a00"; // dark gum base
    ctx.fillRect(3, 12, 10, 1);
    // Nose — tiny raised bump between eyes and mouth
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(7, 8, 2, 1);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 orc face: warm brown skin, heavy brow, red glowing eyes, tusk stubs, warpaint stripe. */
  private static buildOrcFaceTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Warm brown-red base skin (matches headColor 0xaa6a30)
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 2.7 + y * 1.9 + 7.3) * 0.5;
      const v = (n * 14) | 0;
      ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,170+v))},${Math.max(0,Math.min(255,106+v))},${Math.max(0,Math.min(255,48+v))})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Heavy brow ridge
    ctx.fillStyle = "#5a2808"; ctx.fillRect(1, 3, 14, 2);
    ctx.fillStyle = "#3a1a04"; ctx.fillRect(1, 5, 14, 1); // shadow under brow
    // Narrow squinting eyes
    ctx.fillStyle = "#2a1004"; ctx.fillRect(2, 6, 5, 2); ctx.fillRect(9, 6, 5, 2);
    ctx.fillStyle = "#dd2200"; ctx.fillRect(4, 6, 2, 1); ctx.fillRect(10, 6, 2, 1);
    ctx.fillStyle = "#1a0000"; ctx.fillRect(4, 6, 1, 1); ctx.fillRect(11, 6, 1, 1);
    // Warpaint stripe (dark scar-like diagonal on left cheek)
    ctx.fillStyle = "rgba(60,0,0,0.7)";
    ctx.fillRect(1, 5, 2, 6); ctx.fillRect(2, 8, 1, 3);
    // Flat wide nose
    ctx.fillStyle = "#7a3a10"; ctx.fillRect(6, 8, 4, 3);
    ctx.fillStyle = "#2a0800"; ctx.fillRect(6, 9, 2, 1); ctx.fillRect(9, 9, 2, 1);
    // Mouth + tusk stubs
    ctx.fillStyle = "#3a1004"; ctx.fillRect(3, 12, 10, 2);
    ctx.fillStyle = "#eeeedd"; ctx.fillRect(4, 12, 2, 2); ctx.fillRect(10, 12, 2, 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 troll face: gray-green rough skin, massive brow ridge, beady yellow eyes, wide mouth. */
  private static buildTrollFaceTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Gray-green rough skin base (matches headColor 0x445533)
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 1.8 + y * 2.4 + 3.3) * Math.cos(x * 3.1 + y * 0.7) * 0.5;
      const v = (n * 20) | 0;
      ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,68+v))},${Math.max(0,Math.min(255,85+v))},${Math.max(0,Math.min(255,51+v))})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Massive brow that dominates top ~40% of face
    ctx.fillStyle = "#2a3319"; ctx.fillRect(0, 2, 16, 4);
    ctx.fillStyle = "#1a2210"; ctx.fillRect(0, 6, 16, 2); // heavy shadow
    // Beady yellow eyes under brow
    ctx.fillStyle = "#eecc00"; ctx.fillRect(3, 7, 2, 2); ctx.fillRect(11, 7, 2, 2);
    ctx.fillStyle = "#1a0a00"; ctx.fillRect(4, 7, 1, 2); ctx.fillRect(12, 7, 1, 2);
    // Wide flat nose
    ctx.fillStyle = "#3a4428"; ctx.fillRect(5, 8, 6, 3);
    ctx.fillStyle = "#1a1a0c"; ctx.fillRect(5, 9, 3, 2); ctx.fillRect(8, 9, 3, 2);
    // Wide mouth with 3 stubby teeth
    ctx.fillStyle = "#1a0a04"; ctx.fillRect(2, 12, 12, 3);
    ctx.fillStyle = "#ddcc99"; ctx.fillRect(3, 12, 2, 2); ctx.fillRect(7, 12, 2, 2); ctx.fillRect(11, 12, 2, 2);
    ctx.fillStyle = "rgba(0,0,0,0.4)"; ctx.fillRect(2, 12, 12, 1);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 skeleton skull face: bone-white cranium, dark hollow eye sockets with red glow,
   *  T-shaped nasal cavity, and four visible teeth at the jaw. */
  private static buildSkeletonFaceTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Bone-white base with radial edge darkening for skull roundness
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const ex = (x - 7.5) / 7.5, ey = (y - 7.5) / 7.5;
      const edge = (ex * ex + ey * ey) * 0.18;
      const r = Math.max(0, Math.min(255, (215 - edge * 55) | 0));
      const g = Math.max(0, Math.min(255, (210 - edge * 50) | 0));
      const b = Math.max(0, Math.min(255, (196 - edge * 40) | 0));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Top cranium shading band
    ctx.fillStyle = "rgba(0,0,0,0.14)";
    ctx.fillRect(2, 0, 12, 2);
    // Eye sockets — wide rectangular hollow voids
    ctx.fillStyle = "#080606";
    ctx.fillRect(1, 5, 5, 3);    // left socket
    ctx.fillRect(10, 5, 5, 3);   // right socket
    // Eerie red glow within sockets
    ctx.fillStyle = "rgba(200,20,20,0.65)";
    ctx.fillRect(2, 6, 3, 1);
    ctx.fillRect(11, 6, 3, 1);
    // Nasal cavity — inverted-T
    ctx.fillStyle = "#181414";
    ctx.fillRect(6, 9, 4, 1);    // horizontal bar
    ctx.fillRect(7, 10, 2, 2);   // vertical drop
    // Jaw bone crease line
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(2, 11, 12, 1);
    // Four bone-white teeth with dark gaps between
    ctx.fillStyle = "#e8e6d0";
    ctx.fillRect(2, 12, 2, 3);   // tooth 1
    ctx.fillRect(6, 12, 2, 3);   // tooth 2
    ctx.fillRect(10, 12, 2, 3);  // tooth 3
    ctx.fillRect(14, 12, 1, 3);  // tooth 4 (partial at edge)
    // Dark gap between teeth
    ctx.fillStyle = "#0a0808";
    ctx.fillRect(4, 12, 2, 3);
    ctx.fillRect(8, 12, 2, 3);
    ctx.fillRect(12, 12, 2, 3);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 iron golem face: cold dark metal, heavy brow, cracked glowing orange eyes,
   *  angular nose bridge, and a grim set jaw. */
  private static buildGolemFaceTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Cold dark iron base with slight blue-gray variation
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 2.7 + y * 1.9 + 3.1) * 0.5;
      const v = (n * 12) | 0;
      const r = Math.max(0, Math.min(255, 68 + v));
      const g = Math.max(0, Math.min(255, 70 + v));
      const b = Math.max(0, Math.min(255, 74 + v));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Heavy brow ridge — darkest band at top
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, S, 4);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 4, S, 2);
    // Glowing orange-red cracked eye slits
    ctx.fillStyle = "#ff5500";
    ctx.fillRect(2, 5, 4, 2);    // left eye slit
    ctx.fillRect(10, 5, 4, 2);   // right eye slit
    // Bright inner glow of eyes
    ctx.fillStyle = "#ffaa44";
    ctx.fillRect(3, 5, 2, 1);
    ctx.fillRect(11, 5, 2, 1);
    // Crack lines emanating from eyes
    ctx.fillStyle = "rgba(200,80,10,0.6)";
    ctx.fillRect(0, 6, 2, 1);    // left outer crack
    ctx.fillRect(14, 6, 2, 1);   // right outer crack
    ctx.fillRect(2, 7, 1, 2);    // left lower crack
    ctx.fillRect(13, 7, 1, 2);   // right lower crack
    // Flat angular nose bridge
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(6, 8, 4, 2);
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    ctx.fillRect(7, 8, 2, 1);    // nose highlight top
    // Grim jaw — three horizontal shadow bands
    ctx.fillStyle = "rgba(0,0,0,0.45)";
    ctx.fillRect(2, 11, 12, 1);  // jaw line
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(3, 12, 10, 2);  // chin shadow
    // Rivet dots (iron golem construction detail)
    ctx.fillStyle = "rgba(180,180,190,0.6)";
    for (const [rx, ry] of [[1,2],[14,2],[1,9],[14,9]] as [number,number][]) {
      ctx.fillRect(rx, ry, 1, 1);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 creeper face: dark-green skin, two square eyes, iconic sad bracket mouth. */
  private static buildCreeperFaceTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Dark green skin base with subtle noise
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 2.1 + y * 1.9 + 0.7) * 0.5;
      const v = (n * 12) | 0;
      ctx.fillStyle = `rgb(${26 + v},${122 + v},${26 + v})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Edge darkening
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, S, 1); ctx.fillRect(0, S - 1, S, 1);
    ctx.fillRect(0, 0, 1, S); ctx.fillRect(S - 1, 0, 1, S);
    // Eyes — two 3×3 dark squares
    ctx.fillStyle = "#080808";
    ctx.fillRect(3, 3, 3, 3);   // left eye
    ctx.fillRect(10, 3, 3, 3);  // right eye
    // Subtle inner highlight pixel per eye
    ctx.fillStyle = "#1c5c1c";
    ctx.fillRect(4, 4, 1, 1);
    ctx.fillRect(11, 4, 1, 1);
    // Mouth — inverted bracket: top bar + two descending sides that flare outward
    ctx.fillStyle = "#080808";
    ctx.fillRect(5, 8, 6, 2);   // top horizontal bar (6 wide, 2 tall)
    ctx.fillRect(4, 10, 2, 2);  // left descend
    ctx.fillRect(10, 10, 2, 2); // right descend
    ctx.fillRect(3, 12, 2, 1);  // left outer flare
    ctx.fillRect(11, 12, 2, 1); // right outer flare
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  // ─── Body canvas textures ──────────────────────────────────────────────────

  /** 16×16 zombie torso: mottled green cloth with dark tear streaks. */
  private static buildZombieBodyTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 1.8 + y * 2.4 + 3.2) * Math.cos(x * 1.1 + y * 0.7 + 1.5);
      const v = (n * 12) | 0;
      ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,88+v))},${Math.max(0,Math.min(255,120+v))},${Math.max(0,Math.min(255,68+v))})`;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.fillStyle = "rgba(20,30,10,0.55)";
    ctx.fillRect(2, 4, 12, 1); ctx.fillRect(1, 8, 13, 1); ctx.fillRect(3, 12, 10, 1);
    ctx.fillStyle = "rgba(15,25,8,0.7)";
    for (let x = 0; x < S; x += 2) ctx.fillRect(x, 14, 1, 2);
    ctx.fillStyle = "rgba(0,0,0,0.22)"; ctx.fillRect(7, 0, 1, S);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 skeleton torso: bone-white with rib cage lines. */
  private static buildSkeletonBodyTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 3.1 + y * 1.7) * Math.cos(y * 2.3 + x * 0.9) * 10;
      const c = Math.max(180, Math.min(240, 210 + (n | 0)));
      ctx.fillStyle = `rgb(${c},${c},${(c - 12) | 0})`; ctx.fillRect(x, y, 1, 1);
    }
    ctx.fillStyle = "rgba(60,60,40,0.55)";
    for (let rib = 0; rib < 4; rib++) {
      ctx.fillRect(2, 2 + rib * 3, 5, 1); ctx.fillRect(9, 2 + rib * 3, 5, 1);
    }
    ctx.fillStyle = "rgba(255,255,230,0.35)";
    for (let rib = 0; rib < 4; rib++) {
      ctx.fillRect(2, 1 + rib * 3, 5, 1); ctx.fillRect(9, 1 + rib * 3, 5, 1);
    }
    ctx.fillStyle = "rgba(50,50,35,0.55)"; ctx.fillRect(7, 0, 2, S);
    ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(0, 0, 2, S); ctx.fillRect(14, 0, 2, S);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 orc torso: dark leather breastplate with iron rivets and chest strap. */
  private static buildOrcBodyTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 2.1 + y * 1.3 + 2.7) * Math.cos(x * 0.7 + y * 2.9 + 4.1);
      const v = (n * 14) | 0;
      ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,105+v))},${Math.max(0,Math.min(255,62+v))},${Math.max(0,Math.min(255,25+v))})`;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.fillStyle = "rgba(140,85,35,0.38)"; ctx.fillRect(4, 1, 8, 14);
    ctx.fillStyle = "rgba(55,32,10,0.72)"; ctx.fillRect(0, 6, S, 2);
    ctx.fillStyle = "rgba(80,48,15,0.45)"; ctx.fillRect(0, 7, S, 1);
    ctx.fillStyle = "#aaaaaa"; ctx.fillRect(1, 6, 2, 2); ctx.fillRect(13, 6, 2, 2);
    ctx.fillStyle = "#cccccc"; ctx.fillRect(1, 6, 1, 1); ctx.fillRect(13, 6, 1, 1);
    ctx.fillStyle = "rgba(0,0,0,0.32)"; ctx.fillRect(5, 3, 1, 3); ctx.fillRect(10, 9, 1, 3);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 goblin body: ragged dark-green tunic with goblin skin peeking through tears and a diagonal war-sash. */
  private static buildGoblinBodyTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Dark green-brown ratty cloth base
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 2.7 + y * 1.9 + 4.1) * Math.cos(x * 1.3 + y * 2.4 + 2.3);
      const v = (n * 14) | 0;
      ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,38+v))},${Math.max(0,Math.min(255,52+v))},${Math.max(0,Math.min(255,15+v))})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Goblin green skin visible through 3 cloth tears
    ctx.fillStyle = "#5a8a2a";
    ctx.fillRect(1, 2, 2, 3);   // left shoulder tear
    ctx.fillRect(12, 5, 3, 2);  // right side tear
    ctx.fillRect(5, 12, 3, 2);  // bottom hem tear
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(1, 1, 3, 1);   // shadow at tear top
    ctx.fillRect(11, 4, 4, 1);
    ctx.fillRect(4, 11, 5, 1);
    // Diagonal brown war-sash (shoulder to hip)
    ctx.fillStyle = "rgba(88,50,12,0.72)";
    for (let i = 0; i < 8; i++) ctx.fillRect(8 - i, i + 1, 2, 1);
    // Collar notch (V-neck)
    ctx.fillStyle = "#5a8a2a";
    ctx.fillRect(7, 0, 2, 2);
    // Edge darkening
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(0, 0, 1, S); ctx.fillRect(S - 1, 0, 1, S);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  /** 16×16 goblin miner body: brown mining tunic with dirt stains, a tool belt and crossed pickaxe motif. */
  private static buildGoblinMinerBodyTex(): THREE.Texture {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    // Dark brown-tan mining vest base
    for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
      const n = Math.sin(x * 1.9 + y * 2.8 + 5.2) * Math.cos(x * 2.2 + y * 1.1 + 0.8);
      const v = (n * 12) | 0;
      ctx.fillStyle = `rgb(${Math.max(0,Math.min(255,118+v))},${Math.max(0,Math.min(255,74+v))},${Math.max(0,Math.min(255,28+v))})`;
      ctx.fillRect(x, y, 1, 1);
    }
    // Dirt smudges
    ctx.fillStyle = "rgba(55,30,6,0.55)";
    ctx.fillRect(3, 5, 4, 2);   // chest smudge
    ctx.fillRect(9, 8, 3, 3);   // belly smudge
    ctx.fillRect(5, 13, 5, 2);  // hem dirt
    // Pickaxe motif: horizontal head + diagonal shaft
    ctx.fillStyle = "rgba(180,120,40,0.7)";
    ctx.fillRect(5, 5, 6, 1);                              // horizontal pick head
    ctx.fillRect(5, 5, 2, 2);                              // left blade
    for (let i = 0; i < 5; i++) ctx.fillRect(9 + i, 4 + i, 1, 1); // handle shaft diagonal
    // Tool belt across waist
    ctx.fillStyle = "rgba(38,18,4,0.7)";
    ctx.fillRect(0, 10, S, 2);
    ctx.fillStyle = "rgba(150,95,35,0.45)";
    ctx.fillRect(0, 10, S, 1);  // top highlight on belt
    // Edge darkening
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(0, 0, 1, S); ctx.fillRect(S - 1, 0, 1, S);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter; tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  // ─── Despawn ───────────────────────────────────────────────────────────────

  private despawn(id: number): void {
    const group = this.meshes.get(id);
    if (group) {
      this.scene.remove(group);
      group.traverse(c => {
        if ((c as THREE.Mesh).isMesh) {
          (c as THREE.Mesh).geometry.dispose();
          const m = (c as THREE.Mesh).material;
          if (Array.isArray(m)) m.forEach(x => x.dispose()); else m.dispose();
        }
      });
      this.meshes.delete(id);
    }
    const hb = this.healthBars.get(id);
    if (hb) {
      this.scene.remove(hb.bg);
      this.scene.remove(hb.bar);
      hb.bg.geometry.dispose();  (hb.bg.material as THREE.Material).dispose();
      hb.bar.geometry.dispose(); (hb.bar.material as THREE.Material).dispose();
      this.healthBars.delete(id);
    }
    this.enemies.delete(id);
  }
}
