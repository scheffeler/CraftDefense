import * as THREE from "three";
import { GROUND_OFFSET } from "./config/map";

export type PassiveMobType = "cow" | "sheep" | "pig" | "chicken";

interface MobDef {
  bodyColor: number;
  headColor: number;
  legColor: number;
  bodyW: number; bodyH: number; bodyD: number;
  headSz: number;
  legH: number;
  drops: Array<{ itemId: string; count: number }>;
  xp: number;
  scale: number;
}

const DEFS: Record<PassiveMobType, MobDef> = {
  cow: {
    bodyColor: 0x5a3a1a, headColor: 0x4a2a0a, legColor: 0x3a2010,
    bodyW: 0.8, bodyH: 0.55, bodyD: 1.1, headSz: 0.42, legH: 0.5,
    drops: [{ itemId: "raw_beef", count: 2 }], xp: 3, scale: 1.0,
  },
  sheep: {
    bodyColor: 0xdddddd, headColor: 0xbbbbbb, legColor: 0x888888,
    bodyW: 0.7, bodyH: 0.5, bodyD: 0.9, headSz: 0.35, legH: 0.44,
    drops: [{ itemId: "wool", count: 2 }, { itemId: "raw_porkchop", count: 1 }], xp: 2, scale: 0.95,
  },
  pig: {
    bodyColor: 0xffcccc, headColor: 0xffbbbb, legColor: 0xeeaaaa,
    bodyW: 0.7, bodyH: 0.5, bodyD: 0.9, headSz: 0.38, legH: 0.42,
    drops: [{ itemId: "raw_porkchop", count: 2 }], xp: 3, scale: 0.95,
  },
  chicken: {
    bodyColor: 0xffffff, headColor: 0xff4444, legColor: 0xffaa00,
    bodyW: 0.35, bodyH: 0.3, bodyD: 0.45, headSz: 0.22, legH: 0.3,
    drops: [{ itemId: "raw_chicken", count: 1 }], xp: 2, scale: 0.8,
  },
};

interface PassiveMobState {
  id: number;
  type: PassiveMobType;
  group: THREE.Group;
  health: number;
  maxHealth: number;
  wanderDir: number;   // angle in radians
  wanderTimer: number; // seconds until next wander direction change
  movePhase: number;
  alive: boolean;
}

export type PassiveMobDrops = Array<{ itemId: string; count: number }>;

export class PassiveMobManager {
  private readonly mobs = new Map<number, PassiveMobState>();
  private idCounter = 0;

  onMobDied: (x: number, y: number, z: number, drops: PassiveMobDrops, xp: number) => void = () => {};

  constructor(private readonly scene: THREE.Scene) {}

  spawn(type: PassiveMobType, x: number, z: number): void {
    const def = DEFS[type];
    const id = this.idCounter++;
    const group = this.buildMesh(type, def);
    const y = GROUND_OFFSET + 1;
    group.position.set(x, y, z);
    group.scale.setScalar(def.scale);
    this.scene.add(group);

    this.mobs.set(id, {
      id, type, group,
      health: 10, maxHealth: 10,
      wanderDir: Math.random() * Math.PI * 2,
      wanderTimer: 2 + Math.random() * 4,
      movePhase: Math.random() * Math.PI * 2,
      alive: true,
    });
  }

  update(dt: number): void {
    for (const mob of this.mobs.values()) {
      if (!mob.alive) continue;

      mob.wanderTimer -= dt;
      if (mob.wanderTimer <= 0) {
        mob.wanderDir += (Math.random() - 0.5) * 1.5;
        mob.wanderTimer = 2 + Math.random() * 5;
      }

      const speed = 1.0;
      const moving = mob.wanderTimer > 1.5;
      if (moving) {
        mob.group.position.x += Math.cos(mob.wanderDir) * speed * dt;
        mob.group.position.z += Math.sin(mob.wanderDir) * speed * dt;
        // Keep within world bounds
        mob.group.position.x = Math.max(2, Math.min(61, mob.group.position.x));
        mob.group.position.z = Math.max(2, Math.min(61, mob.group.position.z));
        mob.group.rotation.y = mob.wanderDir;
        mob.movePhase += dt * 8;
      }

      // Leg animation — bob the legs slightly
      const legBob = moving ? Math.sin(mob.movePhase) * 0.06 : 0;
      const legs = mob.group.userData.legs as THREE.Mesh[] | undefined;
      if (legs) {
        for (let i = 0; i < legs.length; i++) {
          legs[i].position.y = legs[i].userData.baseY + (i % 2 === 0 ? legBob : -legBob);
        }
      }
    }
  }

  damage(worldX: number, worldZ: number, amount: number, radius = 1.5): boolean {
    for (const mob of this.mobs.values()) {
      if (!mob.alive) continue;
      const dx = mob.group.position.x - worldX;
      const dz = mob.group.position.z - worldZ;
      if (dx * dx + dz * dz < radius * radius) {
        mob.health -= amount;
        this.flashHit(mob.group);
        if (mob.health <= 0) {
          mob.alive = false;
          const pos = mob.group.position;
          const drops = DEFS[mob.type].drops;
          this.onMobDied(pos.x, pos.y, pos.z, drops, DEFS[mob.type].xp);
          this.scene.remove(mob.group);
          this.mobs.delete(mob.id);
        }
        return true;
      }
    }
    return false;
  }

  getMobPositions(): Array<{ x: number; z: number }> {
    return [...this.mobs.values()].filter(m => m.alive).map(m => ({
      x: m.group.position.x,
      z: m.group.position.z,
    }));
  }

  getCount(): number { return this.mobs.size; }

  reset(): void {
    for (const mob of this.mobs.values()) this.scene.remove(mob.group);
    this.mobs.clear();
  }

  private flashHit(group: THREE.Group): void {
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (!m.isMesh) return;
      const mat = m.material as THREE.MeshLambertMaterial;
      const orig = mat.emissive?.getHex() ?? 0;
      mat.emissive?.setHex(0xffffff);
      setTimeout(() => { if (mat.emissive) mat.emissive.setHex(orig); }, 120);
    });
  }

  private buildMesh(type: PassiveMobType, def: MobDef): THREE.Group {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: def.bodyColor });
    const headMat = new THREE.MeshLambertMaterial({ color: def.headColor });
    const legMat  = new THREE.MeshLambertMaterial({ color: def.legColor });

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(def.bodyW, def.bodyH, def.bodyD), bodyMat);
    body.position.y = def.legH + def.bodyH / 2;
    body.castShadow = true;
    group.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(def.headSz, def.headSz, def.headSz), headMat);
    head.position.set(0, def.legH + def.bodyH + def.headSz * 0.4, def.bodyD * 0.45);
    head.castShadow = true;
    group.add(head);

    // Legs (4x)
    const lx = def.bodyW * 0.28, lz = def.bodyD * 0.32;
    const legW = def.bodyW * 0.2, legD = def.bodyD * 0.2;
    const legPositions: [number, number][] = [[-lx, lz], [lx, lz], [-lx, -lz], [lx, -lz]];
    const legs: THREE.Mesh[] = [];
    for (const [ox, oz] of legPositions) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, def.legH, legD), legMat);
      leg.position.set(ox, def.legH / 2, oz);
      leg.userData.baseY = def.legH / 2;
      leg.castShadow = true;
      group.add(leg);
      legs.push(leg);
    }
    group.userData.legs = legs;

    // Chicken-specific: red beak
    if (type === "chicken") {
      const beakMat = new THREE.MeshLambertMaterial({ color: 0xffaa00 });
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.12), beakMat);
      beak.position.set(0, head.position.y, head.position.z + def.headSz * 0.55);
      group.add(beak);
    }

    // Sheep-specific: fluffy wool overlay on body
    if (type === "sheep") {
      const woolMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const wool = new THREE.Mesh(new THREE.BoxGeometry(def.bodyW + 0.12, def.bodyH + 0.1, def.bodyD + 0.12), woolMat);
      wool.position.copy(body.position);
      group.add(wool);
    }

    return group;
  }
}
