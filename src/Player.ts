import * as THREE from "three";
import type { VoxelWorld } from "./Map";
import { sweepAABBWorld } from "./Physics";
import type { MovementInput } from "./InputManager";

const WALK_SPEED           = 5.0;
const SPRINT_MULT          = 1.6;
const CROUCH_MULT          = 0.35;
const JUMP_IMPULSE         = 7.5;
const WATER_SPEED          = 0.5;
const SWIM_ACCEL           = 18;
const SWIM_MAX_UP          = 3.5;
const EYE_HEIGHT           = 1.62;
const MELEE_COOLDOWN       = 0.5;
const BOW_CHARGE_TIME      = 1.5;
const CROSSBOW_LOAD_TIME   = 1.2;
const MELEE_RADIUS         = 2.5;
const MELEE_REACH          = 2.0;
const PISTOL_COOLDOWN      = 0.45;

export interface ActiveEffect {
  duration: number;  // remaining seconds
  power: number;     // effect magnitude
}

export class Player {
  position: THREE.Vector3;
  velocity: THREE.Vector3 = new THREE.Vector3();
  onGround = false;
  inWater  = false;

  health    = 20;
  maxHealth = 20;
  hunger    = 20;
  xp        = 0;
  level     = 0;
  armorValue = 0;

  attackCooldown       = 0;
  bowCharge            = 0;
  isBowCharging        = false;
  gunCooldown          = 0;
  webSlowTimer         = 0;

  isCrossbowLoading    = false;
  isCrossbowLoaded     = false;
  crossbowLoadProgress = 0;

  readonly activeEffects: Map<string, ActiveEffect> = new Map();
  private _regenTick = 0;

  onDeath: () => void = () => {};

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
    this._tickEffects(dt);
    this.applyMovement(dt, input);
    this.camera.position.copy(this.getCameraPosition());
  }

  private _tickEffects(dt: number): void {
    for (const [id, eff] of this.activeEffects) {
      eff.duration -= dt;
      if (eff.duration <= 0) this.activeEffects.delete(id);
    }
    if (this.activeEffects.has("regeneration")) {
      this._regenTick += dt;
      if (this._regenTick >= 2) {
        this._regenTick -= 2;
        this.heal(1);
      }
    } else {
      this._regenTick = 0;
    }
  }

  // ── Effect accessors ──────────────────────────────────────────────────────

  get speedPotionMult(): number {
    const e = this.activeEffects.get("speed");
    return e ? e.power : 1.0;
  }

  /** @deprecated use speedPotionMult */
  getSpeedMult(): number { return this.speedPotionMult; }

  get strengthMult(): number {
    const e = this.activeEffects.get("strength");
    return e ? e.power : 1.0;
  }

  getStrengthBonus(): number {
    const e = this.activeEffects.get("strength");
    return e ? e.power - 1 : 0;
  }

  get fireResistant(): boolean {
    return this.activeEffects.has("fire_resistance");
  }

  getHasteMult(): number {
    const e = this.activeEffects.get("haste");
    return e ? e.power : 1.0;
  }

  getNightVisionActive(): boolean {
    const e = this.activeEffects.get("night_vision");
    return !!(e && e.duration > 0);
  }

  // ── Effect application ────────────────────────────────────────────────────

  applyPotionEffect(effect: string, duration: number, power: number): void {
    if (duration === 0) {
      if (effect === "healing") this.heal(power);
    } else {
      const existing = this.activeEffects.get(effect);
      if (existing) {
        existing.duration = Math.max(existing.duration, duration);
      } else {
        this.activeEffects.set(effect, { duration, power });
      }
    }
  }

  applyEffect(id: string, duration: number, magnitude: number): void {
    this.applyPotionEffect(id, duration, magnitude);
  }

  // ── Attack / weapon methods ──────────────────────────────────────────────

  tryMeleeAttack(): { center: THREE.Vector3; radius: number } | null {
    if (this.attackCooldown > 0) return null;
    this.attackCooldown = MELEE_COOLDOWN;
    const look = this.getLookDirection();
    const center = this.getCameraPosition()
      .addScaledVector(look, MELEE_REACH)
      .add(new THREE.Vector3(0, -0.3, 0));
    return { center, radius: MELEE_RADIUS };
  }

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

  releaseBow(): { power: number; from: THREE.Vector3; direction: THREE.Vector3 } | null {
    if (!this.isBowCharging) return null;
    const power = Math.min(1, this.bowCharge / BOW_CHARGE_TIME);
    this.isBowCharging = false;
    this.bowCharge = 0;
    if (power < 0.1) return null;
    return { power, from: this.getCameraPosition(), direction: this.getLookDirection() };
  }

  startCrossbowLoad(): void {
    if (this.isCrossbowLoaded || this.isCrossbowLoading) return;
    this.isCrossbowLoading    = true;
    this.crossbowLoadProgress = 0;
  }

  fireCrossbow(): { from: THREE.Vector3; direction: THREE.Vector3 } | null {
    if (!this.isCrossbowLoaded) return null;
    this.isCrossbowLoaded    = false;
    this.isCrossbowLoading   = false;
    this.crossbowLoadProgress = 0;
    return { from: this.getCameraPosition(), direction: this.getLookDirection() };
  }

  cancelCrossbow(): void {
    this.isCrossbowLoaded    = false;
    this.isCrossbowLoading   = false;
    this.crossbowLoadProgress = 0;
  }

  // ── Utilities ─────────────────────────────────────────────────────────────

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

    let speed = WALK_SPEED * this.speedPotionMult;
    if (input.sprint) speed *= SPRINT_MULT;
    if (this.inWater) speed *= WATER_SPEED;
    if (this.webSlowTimer > 0) speed *= 0.35;

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

    this.position.x = Math.max(0.31, Math.min(63.69, this.position.x));
    this.position.z = Math.max(0.31, Math.min(63.69, this.position.z));
  }
}

void CROUCH_MULT;
