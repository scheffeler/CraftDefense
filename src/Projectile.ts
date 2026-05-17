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

interface PlayerBolt {
  active: boolean;
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  damage: number;
  life: number;
}

const POOL_SIZE        = 200;
const PLAYER_POOL      = 20;
const BOLT_POOL        = 10;
const HIT_DIST         = 0.6;
const ARROW_HIT_DIST   = 0.9;
const BOLT_HIT_DIST    = 0.8;
const GRAVITY          = 20;
const BOLT_GRAVITY     = 6;   // less arc than arrow
const ARROW_MAX_LIFE   = 6;
const BOLT_MAX_LIFE    = 5;
const ARROW_BASE_SPEED = 18;
const ARROW_POWER_MULT = 22;
const BOLT_SPEED       = 48;  // fast, flat trajectory

export class ProjectileManager {
  private readonly pool: ProjectileData[] = [];
  private readonly playerArrows: PlayerArrow[] = [];
  private readonly playerBolts: PlayerBolt[] = [];

  constructor(private readonly scene: THREE.Scene) {
    this.buildPool();
    this.buildPlayerArrowPool();
    this.buildPlayerBoltPool();
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

  private buildPlayerBoltPool(): void {
    const geo = new THREE.CylinderGeometry(0.06, 0.06, 0.5, 6);
    const mat = new THREE.MeshLambertMaterial({ color: 0x5c3a1a });
    const tipGeo = new THREE.ConeGeometry(0.06, 0.12, 6);
    const tipMat = new THREE.MeshLambertMaterial({ color: 0xaaaaaa });
    for (let i = 0; i < BOLT_POOL; i++) {
      const group = new THREE.Group();
      const shaft = new THREE.Mesh(geo, mat);
      const tip   = new THREE.Mesh(tipGeo, tipMat);
      tip.position.y = 0.31;
      group.add(shaft, tip);
      group.visible = false;
      this.scene.add(group);
      // Wrap group in interface using mesh slot (store group as mesh field)
      this.playerBolts.push({
        active: false,
        mesh: group as unknown as THREE.Mesh,
        velocity: new THREE.Vector3(),
        damage: 0,
        life: 0,
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

  /** Fire a crossbow bolt: fast, flat, high-damage */
  fireFromPlayerCrossbow(
    from: THREE.Vector3,
    direction: THREE.Vector3,
    damage: number,
  ): void {
    const bolt = this.playerBolts.find(b => !b.active);
    if (!bolt) return;
    bolt.active = true;
    bolt.damage = damage;
    bolt.life = BOLT_MAX_LIFE;
    bolt.mesh.position.copy(from);
    bolt.mesh.visible = true;
    bolt.velocity.copy(direction).multiplyScalar(BOLT_SPEED);
  }

  private buildPool(): void {
    const geos: Record<ProjectileType, THREE.BufferGeometry> = {
      arrow:          new THREE.CylinderGeometry(0.04, 0.04, 0.5, 4),
      cannonball:     new THREE.SphereGeometry(0.18, 6, 6),
      icebolt:        new THREE.BoxGeometry(0.15, 0.15, 0.15),
      crossbow_bolt:  new THREE.CylinderGeometry(0.04, 0.04, 0.5, 4), // tower bolt (unused, satisfies type)
    };
    const mats: Record<ProjectileType, THREE.MeshLambertMaterial> = {
      arrow:          new THREE.MeshLambertMaterial({ color: 0x8b6914 }),
      cannonball:     new THREE.MeshLambertMaterial({ color: 0x333333 }),
      icebolt:        new THREE.MeshLambertMaterial({ color: 0x99eeff, emissive: 0x44aaff, emissiveIntensity: 0.4 }),
      crossbow_bolt:  new THREE.MeshLambertMaterial({ color: 0x5c3a1a }),
    };

    for (let i = 0; i < POOL_SIZE; i++) {
      // Alternate types across pool (towers use arrow/cannonball/icebolt only)
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

    // Player crossbow bolts (fast + low gravity)
    for (const b of this.playerBolts) {
      if (!b.active) continue;

      b.life -= dt;
      if (b.life <= 0) { this.deactivateBolt(b); continue; }

      b.velocity.y -= BOLT_GRAVITY * dt;
      b.mesh.position.addScaledVector(b.velocity, dt);

      const spd = b.velocity.length();
      if (spd > 0.1) {
        const dir = b.velocity.clone().normalize();
        b.mesh.lookAt(b.mesh.position.clone().add(dir));
        b.mesh.rotateX(Math.PI / 2);
      }

      if (getAliveEnemyIds) {
        for (const eid of getAliveEnemyIds()) {
          const epos = getEnemyPos(eid);
          if (!epos) continue;
          if (b.mesh.position.distanceTo(epos) < BOLT_HIT_DIST) {
            damageEnemy(eid, b.damage, 1, 0);
            this.deactivateBolt(b);
            break;
          }
        }
      }
    }
  }

  reset(): void {
    for (const p of this.pool) this.deactivate(p);
    for (const a of this.playerArrows) this.deactivateArrow(a);
    for (const b of this.playerBolts) this.deactivateBolt(b);
  }

  private deactivate(p: ProjectileData): void {
    p.active = false;
    p.mesh.visible = false;
  }

  private deactivateArrow(a: PlayerArrow): void {
    a.active = false;
    a.mesh.visible = false;
  }

  private deactivateBolt(b: PlayerBolt): void {
    b.active = false;
    b.mesh.visible = false;
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
