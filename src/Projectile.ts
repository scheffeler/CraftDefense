import * as THREE from "three";
import type { ProjectileType } from "./types";

interface ProjectileData {
  active: boolean;
  type: ProjectileType;
  mesh: THREE.Mesh;
  targetId: number;
  damage: number;
  speed: number;
  aoeRadius: number;
  slowFactor: number;
  slowDuration: number;
  life: number;
  maxLife: number;
}

const POOL_SIZE = 200;
const HIT_DIST = 0.6;

export class ProjectileManager {
  private readonly pool: ProjectileData[] = [];

  constructor(private readonly scene: THREE.Scene) {
    this.buildPool();
  }

  private buildPool(): void {
    const geos: Record<ProjectileType, THREE.BufferGeometry> = {
      arrow:      new THREE.CylinderGeometry(0.04, 0.04, 0.5, 4),
      cannonball: new THREE.SphereGeometry(0.18, 6, 6),
      icebolt:    new THREE.BoxGeometry(0.15, 0.15, 0.15),
    };
    const mats: Record<ProjectileType, THREE.MeshLambertMaterial> = {
      arrow:      new THREE.MeshLambertMaterial({ color: 0x8b6914 }),
      cannonball: new THREE.MeshLambertMaterial({ color: 0x333333 }),
      icebolt:    new THREE.MeshLambertMaterial({ color: 0x99eeff, emissive: 0x44aaff, emissiveIntensity: 0.4 }),
    };

    for (let i = 0; i < POOL_SIZE; i++) {
      // Alternate types across pool
      const type: ProjectileType = i % 3 === 0 ? "arrow" : i % 3 === 1 ? "cannonball" : "icebolt";
      const mesh = new THREE.Mesh(geos[type], mats[type].clone());
      mesh.visible = false;
      mesh.castShadow = false;
      this.scene.add(mesh);
      this.pool.push({
        active: false, type, mesh,
        targetId: -1, damage: 0, speed: 0,
        aoeRadius: 0, slowFactor: 1, slowDuration: 0,
        life: 0, maxLife: 3,
      });
    }
  }

  fire(
    type: ProjectileType,
    from: THREE.Vector3,
    targetId: number,
    damage: number,
    speed: number,
    aoeRadius = 0,
    slowFactor = 1,
    slowDuration = 0,
  ): void {
    const p = this.pool.find(x => !x.active && x.type === type);
    if (!p) return;

    p.active = true;
    p.targetId = targetId;
    p.damage = damage;
    p.speed = speed;
    p.aoeRadius = aoeRadius;
    p.slowFactor = slowFactor;
    p.slowDuration = slowDuration;
    p.life = 0;
    p.maxLife = 4;
    p.mesh.position.copy(from);
    p.mesh.visible = true;
  }

  update(
    dt: number,
    getEnemyPos: (id: number) => THREE.Vector3 | null,
    damageEnemy: (id: number, dmg: number, slow: number, slowDur: number) => void,
    getEnemiesInRadius: (center: THREE.Vector3, radius: number) => number[],
  ): void {
    for (const p of this.pool) {
      if (!p.active) continue;

      p.life += dt;
      if (p.life > p.maxLife) { this.deactivate(p); continue; }

      const targetPos = getEnemyPos(p.targetId);
      if (!targetPos) { this.deactivate(p); continue; }

      const dir = targetPos.clone().sub(p.mesh.position);
      const dist = dir.length();

      if (dist < HIT_DIST) {
        // Hit
        if (p.aoeRadius > 0) {
          const hits = getEnemiesInRadius(p.mesh.position, p.aoeRadius);
          for (const eid of hits) {
            damageEnemy(eid, p.damage, p.slowFactor, p.slowDuration);
          }
          this.showAoeFlash(p.mesh.position, p.aoeRadius);
        } else {
          damageEnemy(p.targetId, p.damage, p.slowFactor, p.slowDuration);
        }
        this.deactivate(p);
        continue;
      }

      // Move toward target
      const step = dir.normalize().multiplyScalar(Math.min(p.speed * dt, dist));
      p.mesh.position.add(step);

      // Orient along movement direction
      if (p.type === "arrow") {
        p.mesh.lookAt(targetPos);
        p.mesh.rotateX(Math.PI / 2);
      }
    }
  }

  reset(): void {
    for (const p of this.pool) this.deactivate(p);
  }

  private deactivate(p: ProjectileData): void {
    p.active = false;
    p.mesh.visible = false;
  }

  private showAoeFlash(center: THREE.Vector3, radius: number): void {
    const geo = new THREE.SphereGeometry(radius, 8, 6);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff6600, transparent: true, opacity: 0.5, depthWrite: false,
    });
    const flash = new THREE.Mesh(geo, mat);
    flash.position.copy(center);
    this.scene.add(flash);
    let t = 0;
    const fade = () => {
      t += 0.016;
      mat.opacity = Math.max(0, 0.5 - t * 2);
      if (mat.opacity > 0) requestAnimationFrame(fade);
      else { this.scene.remove(flash); geo.dispose(); mat.dispose(); }
    };
    requestAnimationFrame(fade);
  }
}
