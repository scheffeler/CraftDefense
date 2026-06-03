import * as THREE from "three";
import { GROUND_OFFSET } from "./config/map";

export type PassiveMobType = "cow" | "sheep" | "pig" | "chicken";

// Sheep spawn with one of these wool colors at random for herd visual variety
const SHEEP_WOOL_COLORS = [
  0xeeeeee, // white
  0xccaa88, // tan
  0x999999, // gray
  0x665544, // brown
  0x221c18, // black
  0xcc3333, // red
  0x3366bb, // blue
  0xddcc22, // yellow
] as const;

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
    const woolColor = type === "sheep"
      ? SHEEP_WOOL_COLORS[Math.floor(Math.random() * SHEEP_WOOL_COLORS.length)]
      : 0xeeeeee;
    const group = this.buildMesh(type, def, woolColor);
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

      // Leg animation — diagonal gait: front-left/back-right swing together
      const swing = moving ? Math.sin(mob.movePhase) * 0.42 : 0;
      const pivots = mob.group.userData.legPivots as THREE.Object3D[] | undefined;
      if (pivots && pivots.length === 4) {
        // pivots: [0]=front-left, [1]=front-right, [2]=back-left, [3]=back-right
        pivots[0].rotation.x =  swing;
        pivots[1].rotation.x = -swing;
        pivots[2].rotation.x = -swing;
        pivots[3].rotation.x =  swing;
      }

      // Chicken wing flap: wings angle up/down during walking
      const wings = mob.group.userData.wings as THREE.Mesh[] | undefined;
      if (wings && mob.type === "chicken") {
        const flapAngle = moving ? Math.sin(mob.movePhase * 1.6) * 0.4 : 0.15;
        wings[0].rotation.z =  flapAngle;
        wings[1].rotation.z = -flapAngle;
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

  private buildMesh(type: PassiveMobType, def: MobDef, woolColor = 0xeeeeee): THREE.Group {
    const group = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color: def.bodyColor });
    const headMat = new THREE.MeshLambertMaterial({ color: def.headColor });
    const legMat  = new THREE.MeshLambertMaterial({ color: def.legColor });

    const bodyY   = def.legH + def.bodyH / 2;
    const headY   = def.legH + def.bodyH + def.headSz * 0.4;
    const headZ   = def.bodyD * 0.45;

    // Body
    const body = new THREE.Mesh(new THREE.BoxGeometry(def.bodyW, def.bodyH, def.bodyD), bodyMat);
    body.position.y = bodyY;
    body.castShadow = true;
    group.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(def.headSz, def.headSz, def.headSz), headMat);
    head.position.set(0, headY, headZ);
    head.castShadow = true;
    group.add(head);

    // Legs — pivot objects at body base allow diagonal gait rotation
    const lx = def.bodyW * 0.28, lz = def.bodyD * 0.32;
    const legW = def.bodyW * 0.2, legD = def.bodyD * 0.2;
    // Order: [0]=front-left, [1]=front-right, [2]=back-left, [3]=back-right
    const legPositions: [number, number][] = [[-lx, lz], [lx, lz], [-lx, -lz], [lx, -lz]];
    const legPivots: THREE.Object3D[] = [];
    for (const [ox, oz] of legPositions) {
      const pivot = new THREE.Object3D();
      pivot.position.set(ox, def.legH, oz);
      const leg = new THREE.Mesh(new THREE.BoxGeometry(legW, def.legH, legD), legMat);
      leg.position.y = -def.legH / 2;
      leg.castShadow = true;
      pivot.add(leg);
      group.add(pivot);
      legPivots.push(pivot);
    }
    group.userData.legPivots = legPivots;

    // ── Per-species detail props ──────────────────────────────────────────────

    if (type === "chicken") {
      // Beak — yellow trapezoid
      const beakMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
      const beak = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.11), beakMat);
      beak.position.set(0, headY - 0.02, headZ + def.headSz * 0.55);
      group.add(beak);

      // Red comb — small box on top of head
      const combMat = new THREE.MeshLambertMaterial({ color: 0xdd2222 });
      const comb = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.12), combMat);
      comb.position.set(0, headY + def.headSz * 0.55, headZ - 0.01);
      group.add(comb);

      // Red wattle — tiny box below beak
      const wattle = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.07, 0.05), combMat);
      wattle.position.set(0, headY - 0.1, headZ + def.headSz * 0.45);
      group.add(wattle);

      // Wings — flat panels on body sides, stored for flap animation
      const wingMat = new THREE.MeshLambertMaterial({ color: 0xdddddd });
      const wings: THREE.Mesh[] = [];
      for (const sx of [-1, 1]) {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.22, 0.3), wingMat);
        wing.position.set(sx * (def.bodyW * 0.52), bodyY + 0.01, 0);
        group.add(wing);
        wings.push(wing);
      }
      group.userData.wings = wings;
    }

    if (type === "pig") {
      // Snout — protruding pink disk (BoxGeometry)
      const snoutMat = new THREE.MeshLambertMaterial({ color: 0xffaaaa });
      const snout = new THREE.Mesh(new THREE.BoxGeometry(def.headSz * 0.55, def.headSz * 0.4, 0.10), snoutMat);
      snout.position.set(0, headY - 0.02, headZ + def.headSz * 0.52);
      group.add(snout);

      // Nostril dots — two tiny dark boxes on snout face
      const nostrilMat = new THREE.MeshLambertMaterial({ color: 0xcc7777 });
      for (const nx of [-0.07, 0.07]) {
        const nostril = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.02), nostrilMat);
        nostril.position.set(nx, headY - 0.02, headZ + def.headSz * 0.58);
        group.add(nostril);
      }

      // Ears — small flat boxes angled outward on head top
      const earMat = new THREE.MeshLambertMaterial({ color: 0xffbbbb });
      for (const [ex, rot] of [[-1, 0.4], [1, -0.4]] as [number, number][]) {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.07), earMat);
        ear.position.set(ex * def.headSz * 0.52, headY + def.headSz * 0.45, headZ - 0.04);
        ear.rotation.z = rot;
        group.add(ear);
      }

      // Curly tail — tiny angled box at rear
      const tailMat = new THREE.MeshLambertMaterial({ color: 0xffbbbb });
      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.12), tailMat);
      tail.position.set(0, bodyY + 0.06, -def.bodyD * 0.52);
      tail.rotation.x = -0.6;
      group.add(tail);
    }

    if (type === "cow") {
      // Horns — two small beige boxes on head top
      const hornMat = new THREE.MeshLambertMaterial({ color: 0xddcc88 });
      for (const [hx, rot] of [[-1, -0.3], [1, 0.3]] as [number, number][]) {
        const horn = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.07), hornMat);
        horn.position.set(hx * def.headSz * 0.42, headY + def.headSz * 0.55, headZ - 0.06);
        horn.rotation.z = rot;
        group.add(horn);
      }

      // Udder — pink box underneath body near rear legs
      const udderMat = new THREE.MeshLambertMaterial({ color: 0xffcccc });
      const udder = new THREE.Mesh(new THREE.BoxGeometry(def.bodyW * 0.5, 0.12, def.bodyD * 0.25), udderMat);
      udder.position.set(0, def.legH + 0.06, -def.bodyD * 0.18);
      group.add(udder);

      // Teat nubs — four tiny boxes hanging below udder
      const teatMat = new THREE.MeshLambertMaterial({ color: 0xffbbbb });
      for (const [tx, tz] of [[-0.09, 0.04], [0.09, 0.04], [-0.09, -0.04], [0.09, -0.04]]) {
        const teat = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.04), teatMat);
        teat.position.set(tx, def.legH, tz + udder.position.z);
        group.add(teat);
      }
    }

    if (type === "sheep") {
      // Fluffy wool overlay on body (slightly larger than body)
      const woolMat = new THREE.MeshLambertMaterial({ color: woolColor });
      const wool = new THREE.Mesh(new THREE.BoxGeometry(def.bodyW + 0.13, def.bodyH + 0.11, def.bodyD + 0.13), woolMat);
      wool.position.copy(body.position);
      group.add(wool);

      // Wool puff on head (sheep heads are covered in wool too)
      const headWool = new THREE.Mesh(new THREE.BoxGeometry(def.headSz + 0.08, def.headSz + 0.08, def.headSz + 0.08), woolMat);
      headWool.position.copy(head.position);
      group.add(headWool);

      // Dark face strip — shows through wool on front of head
      const faceMat = new THREE.MeshLambertMaterial({ color: 0x333322 });
      const face = new THREE.Mesh(new THREE.BoxGeometry(def.headSz * 0.7, def.headSz * 0.55, 0.03), faceMat);
      face.position.set(0, headY - 0.02, headZ + def.headSz * 0.52);
      group.add(face);

      // Ears — flat flaps on sides of head, tinted slightly toward wool color
      const earMat = new THREE.MeshLambertMaterial({ color: woolColor });
      for (const [ex, rot] of [[-1, 0.5], [1, -0.5]] as [number, number][]) {
        const ear = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.13, 0.10), earMat);
        ear.position.set(ex * (def.headSz * 0.6), headY - 0.03, headZ - 0.02);
        ear.rotation.z = rot;
        group.add(ear);
      }
    }

    return group;
  }
}
