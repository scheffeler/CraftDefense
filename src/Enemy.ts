import * as THREE from "three";
import type { EnemyState, EnemyTypeName } from "./types";
import { ENEMY_CONFIGS } from "./config/enemies";
import { advanceTowardWaypoint, SPAWN_POINT, WAYPOINTS, pathProgress } from "./Path";

export type { EnemyState };

export class EnemyManager {
  private readonly enemies = new Map<number, EnemyState>();
  private readonly meshes  = new Map<number, THREE.Group>();
  private readonly healthBars = new Map<number, { bar: THREE.Mesh; bg: THREE.Mesh }>();
  private idCounter = 0;

  onEnemyReachedBase: (state: EnemyState) => void = () => {};
  onEnemyDied: (state: EnemyState) => void = () => {};

  constructor(
    private readonly scene: THREE.Scene,
    private readonly camera: THREE.Camera,
  ) {}

  spawn(type: EnemyTypeName): number {
    const cfg = ENEMY_CONFIGS[type];
    const id = this.idCounter++;
    const state: EnemyState = {
      id,
      config: cfg,
      health: cfg.maxHealth,
      waypointIndex: 1, // start moving toward waypoint[1] (we're at [0])
      speed: cfg.speed,
      slowTimer: 0,
      alive: true,
      dying: false,
      dyingTimer: 0,
      movePhase: Math.random() * Math.PI * 2,
    };
    this.enemies.set(id, state);

    const group = this.buildMesh(type, cfg.scale);
    group.position.copy(SPAWN_POINT);
    this.scene.add(group);
    this.meshes.set(id, group);

    const healthBar = this.buildHealthBar();
    this.scene.add(healthBar.bg);
    this.scene.add(healthBar.bar);
    this.healthBars.set(id, healthBar);

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
        if (state.dyingTimer <= 0) {
          this.despawn(id);
        }
        continue;
      }

      // Slow timer decay
      if (state.slowTimer > 0) {
        state.slowTimer -= dt;
        if (state.slowTimer <= 0) {
          state.speed = state.config.speed;
          this.clearSlowTint(id);
        }
      }

      const group = this.meshes.get(id)!;
      const pos = group.position.clone();
      const result = advanceTowardWaypoint(pos, state.waypointIndex, state.speed, dt);

      group.position.copy(result.newPosition);
      state.waypointIndex = result.newIndex;

      // Face movement direction
      if (result.newIndex < WAYPOINTS.length) {
        const target = WAYPOINTS[Math.min(result.newIndex, WAYPOINTS.length - 1)];
        const dir = target.clone().sub(group.position);
        dir.y = 0;
        if (dir.length() > 0.01) {
          const angle = Math.atan2(dir.x, dir.z);
          group.rotation.y = angle;
        }
      }

      // Leg animation
      state.movePhase += dt * state.speed * 4;
      this.animateLegs(id, state.movePhase);

      // Update health bar position
      this.updateHealthBar(id, state, group.position);

      if (result.reachedBase) {
        state.alive = false;
        this.despawn(id);
        this.onEnemyReachedBase(state);
      }
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
    const state = this.enemies.get(id);
    const pos = this.meshes.get(id)?.position;
    if (!state || !pos) return 0;
    return pathProgress(state.waypointIndex, pos);
  }

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
      hb.bg.geometry.dispose(); (hb.bg.material as THREE.Material).dispose();
      hb.bar.geometry.dispose(); (hb.bar.material as THREE.Material).dispose();
      this.healthBars.delete(id);
    }
    this.enemies.delete(id);
  }

  // -------------------------------------------------------------------------
  // Mesh building
  // -------------------------------------------------------------------------
  private buildMesh(type: EnemyTypeName, scale: number): THREE.Group {
    const group = new THREE.Group();
    group.scale.setScalar(scale);

    if (type === "spider") {
      // Low flat body + 8 legs
      const bodyGeo = new THREE.BoxGeometry(0.6, 0.3, 0.5);
      const bodyMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.15;
      body.castShadow = true;
      group.add(body);

      const headGeo = new THREE.BoxGeometry(0.3, 0.25, 0.3);
      const headMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(0.35, 0.2, 0);
      group.add(head);

      // Eyes
      const eyeGeo = new THREE.BoxGeometry(0.06, 0.06, 0.01);
      const eyeMat = new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
      [-0.07, 0.07].forEach(ex => {
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(0.5, 0.22, ex);
        group.add(eye);
      });

      // 8 legs (4 per side)
      const legMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
      for (let i = 0; i < 4; i++) {
        [-1, 1].forEach(side => {
          const legGeo = new THREE.BoxGeometry(0.05, 0.05, 0.4);
          const leg = new THREE.Mesh(legGeo, legMat);
          const angle = ((i - 1.5) / 3) * Math.PI * 0.5;
          leg.position.set(side * 0.35, 0.1, (i - 1.5) * 0.18);
          leg.rotation.z = side * 0.6;
          leg.rotation.x = angle * 0.5;
          leg.name = `leg_${i}_${side}`;
          group.add(leg);
        });
      }

    } else {
      // Humanoid: body + head + 2 legs
      const bodyColor = ENEMY_CONFIGS[type].color;
      const headColor = ENEMY_CONFIGS[type].headColor;

      const bodyGeo = new THREE.BoxGeometry(0.5, 0.65, 0.3);
      const bodyMat = new THREE.MeshLambertMaterial({ color: bodyColor });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.7;
      body.castShadow = true;
      group.add(body);

      const headGeo = new THREE.BoxGeometry(0.42, 0.42, 0.42);
      const headMat = new THREE.MeshLambertMaterial({ color: headColor });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.y = 1.25;
      head.castShadow = true;
      group.add(head);

      // Eyes
      const eyeGeo = new THREE.BoxGeometry(0.09, 0.09, 0.01);
      const eyeMat = new THREE.MeshLambertMaterial({
        color: type === "golem" ? 0xff4400 : 0xffffff,
        emissive: type === "golem" ? 0xff4400 : 0x888888,
        emissiveIntensity: 0.5,
      });
      [-0.1, 0.1].forEach(ex => {
        const eye = new THREE.Mesh(eyeGeo, eyeMat);
        eye.position.set(ex, 1.3, 0.22);
        group.add(eye);
      });

      const legGeo = new THREE.BoxGeometry(0.22, 0.5, 0.22);
      const legMat = new THREE.MeshLambertMaterial({ color: bodyColor });
      [-0.14, 0.14].forEach((lx, i) => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(lx, 0.25, 0);
        leg.castShadow = true;
        leg.name = `leg_${i}`;
        group.add(leg);
      });

      // Golem extra: shoulder pads
      if (type === "golem") {
        const padGeo = new THREE.BoxGeometry(0.2, 0.2, 0.35);
        const padMat = new THREE.MeshLambertMaterial({ color: 0x666666 });
        [-0.35, 0.35].forEach(px => {
          const pad = new THREE.Mesh(padGeo, padMat);
          pad.position.set(px, 0.95, 0);
          group.add(pad);
        });
      }
    }

    return group;
  }

  private animateLegs(id: number, phase: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      if (c.name.startsWith("leg_")) {
        const idx = parseInt(c.name.split("_")[1]);
        (c as THREE.Mesh).rotation.x = Math.sin(phase + idx * Math.PI) * 0.5;
      }
    });
  }

  private buildHealthBar(): { bar: THREE.Mesh; bg: THREE.Mesh } {
    const bgGeo = new THREE.PlaneGeometry(0.7, 0.1);
    const bgMat = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide, depthTest: false });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.renderOrder = 1;

    const barGeo = new THREE.PlaneGeometry(0.7, 0.1);
    const barMat = new THREE.MeshBasicMaterial({ color: 0x44ff44, side: THREE.DoubleSide, depthTest: false });
    const bar = new THREE.Mesh(barGeo, barMat);
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

    const pct = Math.max(0, state.health / state.config.maxHealth);
    const color = pct > 0.5 ? 0x44ff44 : pct > 0.25 ? 0xffaa00 : 0xff2222;
    (hb.bar.material as THREE.MeshBasicMaterial).color.setHex(color);

    const scale = Math.max(0.001, pct);
    hb.bar.scale.x = scale;
    hb.bar.position.set(position.x - (1 - scale) * 0.35, y, position.z);
    hb.bar.lookAt(this.camera.position);
  }

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
      (m.material as THREE.MeshLambertMaterial).emissive.setHex(0x3399ff);
      (m.material as THREE.MeshLambertMaterial).emissiveIntensity = 0.3;
    });
  }

  private clearSlowTint(id: number): void {
    const group = this.meshes.get(id);
    if (!group) return;
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      (m.material as THREE.MeshLambertMaterial).emissive.setHex(0x000000);
      (m.material as THREE.MeshLambertMaterial).emissiveIntensity = 0;
    });
  }
}
