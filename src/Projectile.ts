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

interface PlayerArrow {
  active: boolean;
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  damage: number;
  life: number;
}

interface ThrownPotion {
  active: boolean;
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  potionId: string;
  life: number;
}

const POOL_SIZE        = 200;
const PLAYER_POOL      = 20;
const POTION_POOL      = 10;
const HIT_DIST         = 0.6;
const ARROW_HIT_DIST   = 0.9;
const GRAVITY          = 20;
const ARROW_MAX_LIFE   = 6;
const ARROW_BASE_SPEED = 18;
const ARROW_POWER_MULT = 22;
const POTION_SPLASH_Y  = 7.2;  // splash when potion drops to approximately ground level
const POTION_MAX_LIFE  = 3.0;

export class ProjectileManager {
  private readonly pool: ProjectileData[] = [];
  private readonly playerArrows: PlayerArrow[] = [];
  private readonly thrownPotions: ThrownPotion[] = [];

  onSplashLand: (pos: THREE.Vector3, potionId: string) => void = () => {};

  constructor(private readonly scene: THREE.Scene) {
    this.buildPool();
    this.buildPlayerArrowPool();
    this.buildThrownPotionPool();
  }

  private buildPlayerArrowPool(): void {
    const geo = new THREE.CylinderGeometry(0.04, 0.04, 0.6, 4);
    const mat = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
    for (let i = 0; i < PLAYER_POOL; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.playerArrows.push({
        active: false, mesh, velocity: new THREE.Vector3(), damage: 0, life: 0,
      });
    }
  }

  fireFromPlayer(
    from: THREE.Vector3,
    direction: THREE.Vector3,
    power: number,
    damage: number,
  ): void {
    const arrow = this.playerArrows.find(a => !a.active);
    if (!arrow) return;
    arrow.active = true;
    arrow.damage = damage;
    arrow.life = ARROW_MAX_LIFE;
    arrow.mesh.position.copy(from);
    arrow.mesh.visible = true;
    const speed = ARROW_BASE_SPEED + power * ARROW_POWER_MULT;
    arrow.velocity.copy(direction).multiplyScalar(speed);
  }

  private buildThrownPotionPool(): void {
    const geo = new THREE.SphereGeometry(0.18, 6, 6);
    for (let i = 0; i < POTION_POOL; i++) {
      const mat = new THREE.MeshLambertMaterial({ color: 0x8844ff, transparent: true, opacity: 0.9 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.thrownPotions.push({
        active: false, mesh, velocity: new THREE.Vector3(),
        potionId: "", life: 0,
      });
    }
  }

  throwPotion(from: THREE.Vector3, direction: THREE.Vector3, potionId: string): void {
    const p = this.thrownPotions.find(t => !t.active);
    if (!p) return;
    const color = potionId === "splash_harming" ? 0xcc2200 : 0x4466cc;
    (p.mesh.material as THREE.MeshLambertMaterial).color.setHex(color);
    p.active = true;
    p.potionId = potionId;
    p.life = 0;
    p.mesh.position.copy(from);
    p.mesh.visible = true;
    const speed = 14;
    p.velocity.copy(direction).multiplyScalar(speed);
    p.velocity.y += 3; // slight upward arc
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
    getAliveEnemyIds?: () => number[],
  ): void {
    // Tower projectiles (homing)
    for (const p of this.pool) {
      if (!p.active) continue;

      p.life += dt;
      if (p.life > p.maxLife) { this.deactivate(p); continue; }

      const targetPos = getEnemyPos(p.targetId);
      if (!targetPos) { this.deactivate(p); continue; }

      const dir  = targetPos.clone().sub(p.mesh.position);
      const dist = dir.length();

      if (dist < HIT_DIST) {
        if (p.aoeRadius > 0) {
          for (const eid of getEnemiesInRadius(p.mesh.position, p.aoeRadius)) {
            damageEnemy(eid, p.damage, p.slowFactor, p.slowDuration);
          }
          this.showAoeFlash(p.mesh.position, p.aoeRadius);
        } else {
          damageEnemy(p.targetId, p.damage, p.slowFactor, p.slowDuration);
        }
        this.deactivate(p);
        continue;
      }

      const step = dir.normalize().multiplyScalar(Math.min(p.speed * dt, dist));
      p.mesh.position.add(step);
      if (p.type === "arrow") { p.mesh.lookAt(targetPos); p.mesh.rotateX(Math.PI / 2); }
    }

    // Player arrows (directional + gravity)
    for (const a of this.playerArrows) {
      if (!a.active) continue;

      a.life -= dt;
      if (a.life <= 0) { this.deactivateArrow(a); continue; }

      a.velocity.y -= GRAVITY * dt;
      a.mesh.position.addScaledVector(a.velocity, dt);

      // Orient along velocity
      const speed = a.velocity.length();
      if (speed > 0.1) {
        const dir = a.velocity.clone().normalize();
        a.mesh.lookAt(a.mesh.position.clone().add(dir));
        a.mesh.rotateX(Math.PI / 2);
      }

      // Hit detection vs all alive enemies
      if (getAliveEnemyIds) {
        for (const eid of getAliveEnemyIds()) {
          const epos = getEnemyPos(eid);
          if (!epos) continue;
          if (a.mesh.position.distanceTo(epos) < ARROW_HIT_DIST) {
            damageEnemy(eid, a.damage, 1, 0);
            this.deactivateArrow(a);
            break;
          }
        }
      }
    }

    // Thrown potions (arc + splash)
    for (const t of this.thrownPotions) {
      if (!t.active) continue;
      t.life += dt;
      t.velocity.y -= GRAVITY * dt;
      t.mesh.position.addScaledVector(t.velocity, dt);
      t.mesh.rotation.x += dt * 4;

      const shouldSplash = t.mesh.position.y <= POTION_SPLASH_Y || t.life >= POTION_MAX_LIFE;
      if (shouldSplash) {
        const splashPos = t.mesh.position.clone();
        this.showPotionSplash(splashPos, t.potionId);
        this.onSplashLand(splashPos, t.potionId);
        this.deactivatePotion(t);
      }
    }
  }

  reset(): void {
    for (const p of this.pool) this.deactivate(p);
    for (const a of this.playerArrows) this.deactivateArrow(a);
    for (const t of this.thrownPotions) this.deactivatePotion(t);
  }

  private deactivate(p: ProjectileData): void {
    p.active = false;
    p.mesh.visible = false;
  }

  private deactivateArrow(a: PlayerArrow): void {
    a.active = false;
    a.mesh.visible = false;
  }

  private deactivatePotion(t: ThrownPotion): void {
    t.active = false;
    t.mesh.visible = false;
  }

  private showPotionSplash(center: THREE.Vector3, potionId: string): void {
    const color = potionId === "splash_harming" ? 0xcc2200 : 0x4466cc;
    const geo = new THREE.SphereGeometry(2.5, 8, 6);
    const mat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.4, depthWrite: false,
    });
    const flash = new THREE.Mesh(geo, mat);
    flash.position.copy(center);
    this.scene.add(flash);
    let t = 0;
    const fade = () => {
      t += 0.016;
      mat.opacity = Math.max(0, 0.4 - t * 1.5);
      if (mat.opacity > 0) requestAnimationFrame(fade);
      else { this.scene.remove(flash); geo.dispose(); mat.dispose(); }
    };
    requestAnimationFrame(fade);
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
