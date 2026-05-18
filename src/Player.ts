import * as THREE from "three";
import type { VoxelWorld } from "./Map";
import { sweepAABBWorld } from "./Physics";
import type { MovementInput } from "./InputManager";

const WALK_SPEED      = 5.0;
const SPRINT_MULT     = 1.6;
const CROUCH_MULT     = 0.35;
const JUMP_IMPULSE    = 7.5;
const WATER_SPEED     = 0.5;   // fraction of normal speed in water
const SWIM_ACCEL      = 18;    // upward accel when holding jump in water
const SWIM_MAX_UP     = 3.5;   // max upward swim velocity
const EYE_HEIGHT      = 1.62;
const MELEE_COOLDOWN       = 0.5;
const BOW_CHARGE_TIME      = 1.5;  // seconds to reach full charge
const CROSSBOW_LOAD_TIME   = 1.2;  // seconds to load crossbow
const MELEE_RADIUS         = 2.5;
const MELEE_REACH          = 2.0;
const PISTOL_COOLDOWN      = 0.45; // ~2.2 shots/sec for generic guns

export interface ActiveEffect {
  timer: number;
  magnitude: number;
}

export class Player {
  position: THREE.Vector3;    // feet position
  velocity: THREE.Vector3 = new THREE.Vector3();
  onGround = false;
  inWater  = false;

  health    = 20;
  maxHealth = 20;
  hunger    = 20;
  xp        = 0;
  level     = 0;
  armorValue = 0; // sum of equipped armor pieces, updated by Game.ts

  attackCooldown = 0;
  bowCharge      = 0;
  isBowCharging  = false;
  gunCooldown    = 0;
  webSlowTimer   = 0;  // > 0: player is webbed and slowed

  // Crossbow state: two-phase (load then fire)
  isCrossbowLoading  = false;
  isCrossbowLoaded   = false;
  crossbowLoadProgress = 0;  // 0..1

  readonly activeEffects = new Map<string, ActiveEffect>();

  onDeath: () => void = () => {};

  // Look direction extracted from camera quaternion
  private readonly _lookDir = new THREE.Vector3();
  private readonly _euler   = new THREE.Euler(0, 0, 0, "YXZ");

  constructor(
    private readonly world: VoxelWorld,
    private readonly camera: THREE.PerspectiveCamera,
    startX = 32,
    startZ = 32,
  ) {
    this.position = new THREE.Vector3(startX, 7.0, startZ);
  }

  update(dt: number, input: MovementInput): void {
    this.attackCooldown = Math.max(0, this.attackCooldown - dt);
    this.gunCooldown    = Math.max(0, this.gunCooldown - dt);
    this.webSlowTimer   = Math.max(0, this.webSlowTimer - dt);
    if (this.isBowCharging) {
      this.bowCharge = Math.min(BOW_CHARGE_TIME, this.bowCharge + dt);
    }
    if (this.isCrossbowLoading) {
      this.crossbowLoadProgress = Math.min(1, this.crossbowLoadProgress + dt / CROSSBOW_LOAD_TIME);
      if (this.crossbowLoadProgress >= 1) {
        this.isCrossbowLoading = false;
        this.isCrossbowLoaded  = true;
      }
    }
    for (const [key, eff] of this.activeEffects) {
      eff.timer -= dt;
      if (eff.timer <= 0) this.activeEffects.delete(key);
    }
    this.applyMovement(dt, input);
    this.camera.position.copy(this.getCameraPosition());
  }

  applyEffect(id: string, duration: number, magnitude: number): void {
    const existing = this.activeEffects.get(id);
    if (existing) {
      existing.timer = Math.max(existing.timer, duration);
      existing.magnitude = Math.max(existing.magnitude, magnitude);
    } else {
      this.activeEffects.set(id, { timer: duration, magnitude });
    }
  }

  getSpeedMult(): number {
    const e = this.activeEffects.get("speed");
    return e ? e.magnitude : 1.0;
  }

  getStrengthBonus(): number {
    const e = this.activeEffects.get("strength");
    return e ? e.magnitude : 0;
  }

  /** Returns melee sphere params if attack was successful, null if on cooldown. */
  tryMeleeAttack(): { center: THREE.Vector3; radius: number } | null {
    if (this.attackCooldown > 0) return null;
    this.attackCooldown = MELEE_COOLDOWN;
    const look = this.getLookDirection();
    const center = this.getCameraPosition()
      .addScaledVector(look, MELEE_REACH)
      .add(new THREE.Vector3(0, -0.3, 0));
    return { center, radius: MELEE_RADIUS };
  }

  /** Hitscan fire — returns shot params if off cooldown, null otherwise. */
  tryGunFire(): { from: THREE.Vector3; direction: THREE.Vector3 } | null {
    if (this.gunCooldown > 0) return null;
    this.gunCooldown = PISTOL_COOLDOWN;
    return { from: this.getCameraPosition(), direction: this.getLookDirection() };
  }

  startBowCharge(): void {
    if (!this.isBowCharging) {
      this.isBowCharging = true;
      this.bowCharge = 0;
    }
  }

  /**
   * Releases the bow. Returns shot params if power >= 10%, otherwise null.
   * power is [0..1]; speed = 15 + power * 25 m/s.
   */
  releaseBow(): { power: number; from: THREE.Vector3; direction: THREE.Vector3 } | null {
    if (!this.isBowCharging) return null;
    const power = Math.min(1, this.bowCharge / BOW_CHARGE_TIME);
    this.isBowCharging = false;
    this.bowCharge = 0;
    if (power < 0.1) return null;
    return {
      power,
      from: this.getCameraPosition(),
      direction: this.getLookDirection(),
    };
  }

  /** Start loading the crossbow (first right-click). No-op if already loaded/loading. */
  startCrossbowLoad(): void {
    if (this.isCrossbowLoaded || this.isCrossbowLoading) return;
    this.isCrossbowLoading   = true;
    this.crossbowLoadProgress = 0;
  }

  /** Fire the loaded crossbow. Returns shot params or null if not loaded. */
  fireCrossbow(): { from: THREE.Vector3; direction: THREE.Vector3 } | null {
    if (!this.isCrossbowLoaded) return null;
    this.isCrossbowLoaded   = false;
    this.isCrossbowLoading  = false;
    this.crossbowLoadProgress = 0;
    return { from: this.getCameraPosition(), direction: this.getLookDirection() };
  }

  /** Unload crossbow when switching away (bolt is lost). */
  cancelCrossbow(): void {
    this.isCrossbowLoaded    = false;
    this.isCrossbowLoading   = false;
    this.crossbowLoadProgress = 0;
  }

  getCameraPosition(): THREE.Vector3 {
    return this.position.clone().add(new THREE.Vector3(0, EYE_HEIGHT, 0));
  }

  getLookDirection(): THREE.Vector3 {
    this.camera.getWorldDirection(this._lookDir);
    return this._lookDir.clone();
  }

  getYaw(): number {
    this._euler.setFromQuaternion(this.camera.quaternion);
    return this._euler.y;
  }

  damage(amount: number): void {
    const reduced = Math.max(1, amount - this.armorValue / 5);
    const prev = this.health;
    this.health = Math.max(0, this.health - reduced);
    if (prev > 0 && this.health === 0) this.onDeath();
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  addXP(amount: number): void {
    this.xp += amount;
    const thresholds = [0, 50, 150, 350, 700, 1200];
    while (this.level < thresholds.length - 1 && this.xp >= thresholds[this.level + 1]) {
      this.level++;
      this.maxHealth += 2;
      this.health = Math.min(this.health + 2, this.maxHealth);
    }
  }

  private applyMovement(dt: number, input: MovementInput): void {
    const yaw = this.getYaw();

    let speed = WALK_SPEED * this.getSpeedMult();
    if (input.sprint) speed *= SPRINT_MULT;
    if (this.inWater) speed *= WATER_SPEED;
    if (this.webSlowTimer > 0) speed *= 0.35;  // webbed: slowed to 35% speed

    // Build horizontal move vector relative to camera yaw
    const move = new THREE.Vector3();
    if (input.forward)  move.z -= 1;
    if (input.backward) move.z += 1;
    if (input.left)     move.x -= 1;
    if (input.right)    move.x += 1;
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed);
      move.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    }

    this.velocity.x = move.x;
    this.velocity.z = move.z;

    if (input.jump) {
      if (this.onGround) {
        this.velocity.y = JUMP_IMPULSE;
      } else if (this.inWater) {
        this.velocity.y = Math.min(this.velocity.y + SWIM_ACCEL * dt, SWIM_MAX_UP);
      }
    }

    const result = sweepAABBWorld(this.world, this.position, this.velocity, dt);
    this.position.copy(result.newPos);
    this.velocity.copy(result.newVel);
    this.onGround = result.onGround;
    this.inWater  = result.inWater;

    // Clamp position inside world bounds
    this.position.x = Math.max(0.31, Math.min(63.69, this.position.x));
    this.position.z = Math.max(0.31, Math.min(63.69, this.position.z));
  }
}

void CROUCH_MULT;
