import * as THREE from "three";
import { GROUND_OFFSET } from "./config/map";
import type { VillagerProfession } from "./config/trades";
import { PROFESSION_COLORS } from "./config/trades";

export interface VillagerState {
  id: number;
  profession: VillagerProfession;
  group: THREE.Group;
  x: number;
  z: number;
  bobPhase: number;
}

const INTERACT_RANGE = 3.0;

export class VillagerNPCManager {
  private readonly villagers: VillagerState[] = [];
  private idCounter = 0;

  constructor(private readonly scene: THREE.Scene) {}

  spawn(profession: VillagerProfession, x: number, z: number): void {
    const id = this.idCounter++;
    const group = this.buildMesh(profession);
    group.position.set(x, GROUND_OFFSET + 0.01, z);
    this.scene.add(group);
    this.villagers.push({ id, profession, group, x, z, bobPhase: Math.random() * Math.PI * 2 });
  }

  /** Returns the nearest villager within interaction range, or null. */
  getNearestInRange(px: number, pz: number): VillagerState | null {
    let best: VillagerState | null = null;
    let bestDist = INTERACT_RANGE;
    for (const v of this.villagers) {
      const d = Math.hypot(px - v.x, pz - v.z);
      if (d < bestDist) { bestDist = d; best = v; }
    }
    return best;
  }

  update(dt: number): void {
    for (const v of this.villagers) {
      v.bobPhase += dt * 1.2;
      // Gentle idle bob
      v.group.position.y = GROUND_OFFSET + 0.01 + Math.sin(v.bobPhase) * 0.04;
      // Slowly rotate to face player direction (optional idle sway)
      v.group.rotation.y += Math.sin(v.bobPhase * 0.3) * 0.002;
    }
  }

  dispose(): void {
    for (const v of this.villagers) {
      this.scene.remove(v.group);
    }
    this.villagers.length = 0;
  }

  private buildMesh(profession: VillagerProfession): THREE.Group {
    const group = new THREE.Group();
    const colors = PROFESSION_COLORS[profession];

    const skin  = new THREE.MeshLambertMaterial({ color: colors.skin });
    const robe  = new THREE.MeshLambertMaterial({ color: colors.robe });
    const hat   = new THREE.MeshLambertMaterial({ color: colors.hat  });
    const eye   = new THREE.MeshLambertMaterial({ color: 0x222222 });
    const nose  = new THREE.MeshLambertMaterial({ color: 0xcc8855 }); // large villager nose

    // Body (robe — slightly wider than enemy humanoid)
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.68, 0.32), robe);
    body.position.y = 0.72;
    body.castShadow = true;
    group.add(body);

    // Head
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.44, 0.44), skin);
    head.position.y = 1.26;
    head.castShadow = true;
    group.add(head);

    // Large nose (signature villager feature)
    const noseMesh = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.12, 0.12), nose);
    noseMesh.position.set(0, 1.22, 0.28);
    group.add(noseMesh);

    // Eyes
    for (const ex of [-0.12, 0.12]) {
      const eyeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.01), eye);
      eyeMesh.position.set(ex, 1.30, 0.23);
      group.add(eyeMesh);
    }

    // Hat / head covering (different per profession)
    if (profession === "farmer") {
      // Wide brim straw hat
      const brim = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.06, 0.68), hat);
      brim.position.y = 1.49;
      group.add(brim);
      const crown = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.18, 0.38), hat);
      crown.position.y = 1.60;
      group.add(crown);
    } else if (profession === "blacksmith") {
      // Dark cap
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.12, 0.46), hat);
      cap.position.y = 1.50;
      group.add(cap);
      // Apron panel on front of body
      const apronMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
      const apron = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.44, 0.02), apronMat);
      apron.position.set(0, 0.76, 0.18);
      group.add(apron);
    } else if (profession === "librarian") {
      // Tall pointy hat
      const hatBrim = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.06, 0.52), hat);
      hatBrim.position.y = 1.50;
      group.add(hatBrim);
      const hatTop = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.32), hat);
      hatTop.position.y = 1.64;
      group.add(hatTop);
    } else {
      // Butcher: white apron
      const apronMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
      const apron = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.50, 0.02), apronMat);
      apron.position.set(0, 0.76, 0.18);
      group.add(apron);
      // Red stripe on apron
      const stripeMat = new THREE.MeshLambertMaterial({ color: 0xcc2222 });
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.50, 0.01), stripeMat);
      stripe.position.set(0, 0.76, 0.20);
      group.add(stripe);
    }

    // Arms
    const armMat = new THREE.MeshLambertMaterial({ color: colors.robe });
    for (const ax of [-0.30, 0.30]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.48, 0.18), armMat);
      arm.position.set(ax, 0.72, 0);
      arm.castShadow = true;
      group.add(arm);
    }

    // Legs
    const legMat = new THREE.MeshLambertMaterial({ color: colors.robe });
    for (const lx of [-0.13, 0.13]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.40, 0.22), legMat);
      leg.position.set(lx, 0.20, 0);
      leg.castShadow = true;
      group.add(leg);
    }

    return group;
  }
}
