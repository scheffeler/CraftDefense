import * as THREE from "three";
import type { EnemyState, EnemyTypeName } from "./types";
import { ENEMY_CONFIGS } from "./config/enemies";
import type { FlowField } from "./FlowField";
import type { VoxelWorld } from "./Map";
import { FORTRESS_CENTER_X, FORTRESS_CENTER_Z, ENEMY_Y as CFG_ENEMY_Y } from "./config/map";
import { getSpawnPositions } from "./WorldGen";

export type { EnemyState };

const ENEMY_Y       = CFG_ENEMY_Y;
const REACH_RADIUS  = 2.0; // distance to fortress center that counts as "reached base"
const WALL_BREAK_TIME = 3.0; // seconds to break one wall block

// All types use flow-field AI — waypoint AI removed in Phase 12 cleanup
const FLOW_FIELD_TYPES = new Set<EnemyTypeName>([
  "goblin", "orc", "troll", "goblin_miner",
  "zombie", "spider", "golem",
]);

export class EnemyManager {
  private readonly enemies   = new Map<number, EnemyState>();
  private readonly meshes    = new Map<number, THREE.Group>();
  private readonly healthBars = new Map<number, { bar: THREE.Mesh; bg: THREE.Mesh }>();
  private idCounter = 0;

  private flowField: FlowField | null = null;
  private world: VoxelWorld | null = null;

  onEnemyReachedBase: (state: EnemyState) => void = () => {};
  onEnemyDied:        (state: EnemyState) => void = () => {};
  onWallBroken: (wx: number, wz: number) => void = () => {};

  constructor(
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
  ) {}

  setFlowField(ff: FlowField): void { this.flowField = ff; }
  setWorld(w: VoxelWorld):     void { this.world = w; }

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
    };
    this.enemies.set(id, state);

    const group = this.buildMesh(type, cfg.scale);

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

      this.updateHealthBar(id, state, group.position);
    }
  }

  damage(id: number, amount: number, slowFactor = 1.0, slowDuration = 0): void {
    const state = this.enemies.get(id);
    if (!state || !state.alive || state.dying) return;

    state.health = Math.max(0, state.health - amount);
    this.flashHit(id);

    if (slowFactor < 1.0 && slowDuration > 0) {
      state.speed = Math.min(state.speed, state.config.speed * slowFactor);
      state.slowTimer = Math.max(state.slowTimer, slowDuration);
      this.applySlowTint(id);
    }

    this.updateHealthBar(id, state, this.meshes.get(id)?.position ?? new THREE.Vector3());

    if (state.health <= 0) {
      state.dying = true;
      state.dyingTimer = 0.4;
      this.onEnemyDied(state);
    }
  }

  getAliveEnemies(): EnemyState[] {
    return [...this.enemies.values()].filter(e => e.alive && !e.dying);
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
  }

  getEnemyProgress(id: number): number {
    const pos = this.meshes.get(id)?.position;
    if (!pos || !this.flowField) return 0;
    const dist = this.flowField.getDistance(pos.x, pos.z);
    return isFinite(dist) ? 1 / (1 + dist) : 0;
  }

  // ─── Flow-field movement ───────────────────────────────────────────────────

  private updateFlowFieldEnemy(
    id: number, state: EnemyState, group: THREE.Group, dt: number,
  ): void {
    const pos = group.position;

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

  // ─── Mesh building ─────────────────────────────────────────────────────────

  private buildMesh(type: EnemyTypeName, scale: number): THREE.Group {
    const group = new THREE.Group();
    group.scale.setScalar(scale);

    if (type === "spider") {
      this.buildSpiderMesh(group);
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

  private buildHumanoidMesh(group: THREE.Group, type: EnemyTypeName): void {
    const cfg = ENEMY_CONFIGS[type];

    const bodyMat = new THREE.MeshLambertMaterial({ color: cfg.color });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.65, 0.3), bodyMat);
    body.position.y = 0.7;
    body.castShadow = true;
    group.add(body);

    const headMat = new THREE.MeshLambertMaterial({ color: cfg.headColor });
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), headMat);
    head.position.y = 1.25;
    head.castShadow = true;
    group.add(head);

    const eyeColor = type === "golem" ? 0xff4400 : 0xffffff;
    const eyeEmissive = type === "golem" ? 0xff4400 : 0x888888;
    const eyeMat = new THREE.MeshLambertMaterial({
      color: eyeColor, emissive: eyeEmissive, emissiveIntensity: 0.5,
    });
    for (const ex of [-0.1, 0.1]) {
      const eye = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.01), eyeMat);
      eye.position.set(ex, 1.3, 0.22);
      group.add(eye);
    }

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
    for (const [ax, i] of [[-0.36, 0], [0.36, 1]] as [number, number][]) {
      const armPivot = new THREE.Object3D();
      armPivot.position.set(ax, 0.9, 0);
      armPivot.name = `armpivot_${i}`;
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.5, 0.22), armMat);
      arm.position.y = -0.22;
      armPivot.add(arm);
      group.add(armPivot);
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

    if (type === "orc" || type === "zombie") {
      // Club/weapon
      const wepMat = new THREE.MeshLambertMaterial({ color: 0x5c3a1a });
      const club = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), wepMat);
      club.position.set(0.38, 0.65, 0.15);
      group.add(club);
    }
  }

  private animateLegs(id: number, phase: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      if (c.name.startsWith("legpivot_")) {
        const idx = parseInt(c.name.split("_")[1]);
        (c as THREE.Object3D).rotation.x = Math.sin(phase + idx * Math.PI) * 0.55;
      } else if (c.name.startsWith("armpivot_")) {
        const idx = parseInt(c.name.split("_")[1]);
        // Arms swing opposite to legs
        (c as THREE.Object3D).rotation.x = Math.sin(phase + (1 - idx) * Math.PI) * 0.45;
      }
    });
    // Slight walk bob
    group.position.y = ENEMY_Y + Math.abs(Math.sin(phase * 2)) * 0.04;
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
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshLambertMaterial;
      mat.emissive.setHex(0x000000);
      mat.emissiveIntensity = 0;
    });
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
