import * as THREE from "three";

const POLE_HEIGHT = 4.5;
const FLASH_TIME  = 0.4;

/**
 * The objective the player defends in survival mode: a banner on a pole with
 * health. Enemies that reach it chip its health down; the game is lost when it
 * hits zero. Owns its own mesh, damage feedback and idle animation.
 */
export class Flag {
  readonly maxHealth: number;
  health: number;
  readonly position: THREE.Vector3;

  private readonly group: THREE.Group;
  private readonly bannerPivot: THREE.Group;
  private readonly bannerMat: THREE.MeshLambertMaterial;
  private flashTimer = 0;
  private wavePhase = 0;

  constructor(scene: THREE.Scene, x: number, z: number, groundY: number, maxHealth: number) {
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.position = new THREE.Vector3(x + 0.5, groundY, z + 0.5);

    this.group = new THREE.Group();
    this.group.position.copy(this.position);

    const poleMat = new THREE.MeshLambertMaterial({ color: 0x6b4c2a });
    const pole = new THREE.Mesh(new THREE.BoxGeometry(0.18, POLE_HEIGHT, 0.18), poleMat);
    pole.position.y = POLE_HEIGHT / 2;
    pole.castShadow = true;
    this.group.add(pole);

    // Banner hangs from a pivot at the top of the pole so it can sway.
    this.bannerPivot = new THREE.Group();
    this.bannerPivot.position.y = POLE_HEIGHT - 0.7;
    this.bannerMat = new THREE.MeshLambertMaterial({ color: 0xcc2222, side: THREE.DoubleSide });
    const banner = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.95, 0.08), this.bannerMat);
    banner.position.x = 0.7;
    banner.castShadow = true;
    this.bannerPivot.add(banner);
    this.group.add(this.bannerPivot);

    scene.add(this.group);
  }

  get isAlive(): boolean { return this.health > 0; }

  /** Apply damage; triggers a red flash. Returns true if this drop killed the flag. */
  takeDamage(amount: number): boolean {
    if (!this.isAlive) return false;
    this.health = Math.max(0, this.health - amount);
    this.flashTimer = FLASH_TIME;
    return this.health === 0;
  }

  /** Advance flash and idle sway. Call every frame. */
  update(dt: number): void {
    this.wavePhase += dt * 3;
    this.bannerPivot.rotation.y = Math.sin(this.wavePhase) * 0.22;

    if (this.flashTimer > 0) {
      this.flashTimer = Math.max(0, this.flashTimer - dt);
      const t = this.flashTimer / FLASH_TIME;            // 1 -> 0
      this.bannerMat.color.setRGB(0.8 + t * 0.2, 0.13 + t * 0.7, 0.13 + t * 0.7);
    } else {
      // Base colour darkens as the flag is worn down.
      const hp = this.health / this.maxHealth;
      this.bannerMat.color.setRGB(0.35 + hp * 0.45, 0.13 * hp, 0.13 * hp);
    }
  }
}
