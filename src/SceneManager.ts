import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { ITEMS } from "./config/items";

// ---------------------------------------------------------------------------
// Day/night cycle keyframes (t=0 midnight, t=0.5 noon, t=1 midnight)
// ---------------------------------------------------------------------------
interface DayFrame {
  t: number; sky: number; fog: number;
  ambientColor: number; ambientInt: number;
  sunInt: number; sunColor: number;
}
const DAY_FRAMES: DayFrame[] = [
  { t: 0.00, sky: 0x050510, fog: 0x060615, ambientColor: 0x203050, ambientInt: 0.08, sunInt: 0.0, sunColor: 0xffffff },
  { t: 0.20, sky: 0x0a1535, fog: 0x0a1830, ambientColor: 0x304070, ambientInt: 0.15, sunInt: 0.0, sunColor: 0xffffff },
  { t: 0.27, sky: 0xff8040, fog: 0xdd6030, ambientColor: 0xcc6633, ambientInt: 0.5,  sunInt: 0.7, sunColor: 0xff9060 },
  { t: 0.35, sky: 0x7ec8e3, fog: 0xaad4e8, ambientColor: 0xb0c8e8, ambientInt: 0.8,  sunInt: 1.6, sunColor: 0xffe8b0 },
  { t: 0.50, sky: 0x5ab3dd, fog: 0x80ccee, ambientColor: 0xb8d8f0, ambientInt: 1.0,  sunInt: 1.9, sunColor: 0xfffde0 },
  { t: 0.65, sky: 0x7ec8e3, fog: 0xaad4e8, ambientColor: 0xb0c8e8, ambientInt: 0.8,  sunInt: 1.6, sunColor: 0xffe8b0 },
  { t: 0.73, sky: 0xff6020, fog: 0xcc4010, ambientColor: 0xcc5522, ambientInt: 0.5,  sunInt: 0.7, sunColor: 0xff7040 },
  { t: 0.80, sky: 0x0a1535, fog: 0x0a1830, ambientColor: 0x304070, ambientInt: 0.15, sunInt: 0.0, sunColor: 0xffffff },
  { t: 1.00, sky: 0x050510, fog: 0x060615, ambientColor: 0x203050, ambientInt: 0.08, sunInt: 0.0, sunColor: 0xffffff },
];

function lerpHex(a: number, b: number, t: number): number {
  const ar = (a >> 16) & 0xff, ag = (a >> 8) & 0xff, ab = a & 0xff;
  const br = (b >> 16) & 0xff, bg = (b >> 8) & 0xff, bb = b & 0xff;
  return ((Math.round(ar + (br - ar) * t) << 16) |
          (Math.round(ag + (bg - ag) * t) << 8)  |
           Math.round(ab + (bb - ab) * t));
}

function sampleDayCycle(t: number): Omit<DayFrame, "t"> {
  t = ((t % 1) + 1) % 1;
  let lo = DAY_FRAMES[0], hi = DAY_FRAMES[DAY_FRAMES.length - 1];
  for (let i = 0; i < DAY_FRAMES.length - 1; i++) {
    if (t >= DAY_FRAMES[i].t && t <= DAY_FRAMES[i + 1].t) {
      lo = DAY_FRAMES[i]; hi = DAY_FRAMES[i + 1]; break;
    }
  }
  const f = lo.t === hi.t ? 0 : (t - lo.t) / (hi.t - lo.t);
  return {
    sky:         lerpHex(lo.sky, hi.sky, f),
    fog:         lerpHex(lo.fog, hi.fog, f),
    ambientColor: lerpHex(lo.ambientColor, hi.ambientColor, f),
    ambientInt:  lo.ambientInt + (hi.ambientInt - lo.ambientInt) * f,
    sunInt:      lo.sunInt  + (hi.sunInt  - lo.sunInt)  * f,
    sunColor:    lerpHex(lo.sunColor, hi.sunColor, f),
  };
}

// ---------------------------------------------------------------------------

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  private readonly controls: PointerLockControls;

  // Day/night
  private _dayTime = 0.38; // start at morning
  private _totalDays = 0;
  private readonly DAY_DURATION = 600; // 10 real minutes per game day
  private sunLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;

  // Sky elements
  private readonly stars: THREE.Points;
  private readonly moon: THREE.Mesh;
  private readonly sun:  THREE.Mesh;

  // Clouds
  private readonly cloudMeshes: THREE.Mesh[] = [];
  private cloudMat!: THREE.MeshLambertMaterial;

  // Underwater effect
  private _underwaterEffect = false;


  // Screen shake
  private _shakeTimer = 0;
  private _shakeMagnitude = 0;

  // First-person arm + swing animation
  private readonly armScene: THREE.Scene;
  private readonly armGroup: THREE.Group;
  private armSwingTimer = 0;
  private readonly ARM_SWING_DURATION = 0.25;

  onPointerLockChange: (locked: boolean) => void = () => {};

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.autoClear = false;
    this.renderer.domElement.id = "game-canvas";
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7ec8e3);
    this.scene.fog = new THREE.Fog(0xaad4e8, 48, 130);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(18, 28, 18);
    this.camera.lookAt(32, 7, 32); // title screen: aerial view of fortress

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("lock",   () => this.onPointerLockChange(true));
    this.controls.addEventListener("unlock", () => this.onPointerLockChange(false));

    this.setupLighting();
    this.buildClouds();
    this.stars = this.buildStars();
    this.moon  = this.buildMoon();
    this.sun   = this.buildSun();

    // Arm scene — rendered after main scene with depth cleared
    this.armScene = new THREE.Scene();
    this.armScene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const armSun = new THREE.DirectionalLight(0xffe8b0, 0.8);
    armSun.position.set(1, 2, 1);
    this.armScene.add(armSun);

    this.armGroup = new THREE.Group();
    this.armGroup.scale.setScalar(0.65);
    this.armScene.add(this.armGroup);
    this.buildArmMesh();

    window.addEventListener("resize", () => this.onResize());
  }

  get isPointerLocked(): boolean { return this.controls.isLocked; }
  get dayTime(): number { return this._dayTime; }
  get daylight(): number {
    const frame = sampleDayCycle(this.dayTime);
    return frame.ambientInt;
  }
  get dayNumber(): number { return Math.floor(this._totalDays) + 1; }
  get isDay(): boolean { return this.daylight > 0.3; }
  skipToMorning(): void { this._dayTime = 0.25; }

  lockPointer():   void { this.controls.lock(); }
  unlockPointer(): void { this.controls.unlock(); }

  /** Advance the day/night cycle. Call from game loop. */
  updateDayNight(dt: number): void {
    this._totalDays += dt / this.DAY_DURATION;
    this._dayTime = (this._dayTime + dt / this.DAY_DURATION) % 1;
    const frame = sampleDayCycle(this._dayTime);

    // Underwater overrides sky/fog
    if (this._underwaterEffect) {
      (this.scene.background as THREE.Color).setHex(0x083560);
      (this.scene.fog as THREE.Fog).color.setHex(0x083560);
      (this.scene.fog as THREE.Fog).near = 1;
      (this.scene.fog as THREE.Fog).far  = 6;
    } else {
      (this.scene.background as THREE.Color).setHex(frame.sky);
      (this.scene.fog as THREE.Fog).color.setHex(frame.fog);
      (this.scene.fog as THREE.Fog).near = 48;
      (this.scene.fog as THREE.Fog).far  = 130;
    }

    this.ambientLight.color.setHex(frame.ambientColor);
    this.ambientLight.intensity = frame.ambientInt;

    this.sunLight.intensity = frame.sunInt;
    this.sunLight.color.setHex(frame.sunColor);

    // Animate sun position around world center
    const angle = this._dayTime * Math.PI * 2;
    const r = 100;
    this.sunLight.position.set(
      Math.cos(angle) * r,
      Math.sin(angle) * r,
      20,
    );

    // Tone mapping exposure: brighter at noon, dimmer at night
    this.renderer.toneMappingExposure = 0.5 + frame.ambientInt * 0.8;

    // Stars and moon: visible at night
    const nightness = Math.max(0, 1 - frame.ambientInt * 4);
    (this.stars.material as THREE.PointsMaterial).opacity = nightness * 0.9;
    (this.moon.material as THREE.MeshBasicMaterial).opacity = nightness * 0.95;

    // Moon position: opposite side of sky from sun
    const moonAngle = this._dayTime * Math.PI * 2 + Math.PI;
    const mr = 130;
    this.moon.position.set(
      Math.cos(moonAngle) * mr + 32,
      Math.abs(Math.sin(moonAngle)) * mr,
      20,
    );

    // Sun: follows sun light direction
    const sunOpacity = Math.min(1, Math.max(0, frame.ambientInt * 1.8 - 0.4));
    (this.sun.material as THREE.MeshBasicMaterial).opacity = sunOpacity;
    // Tint: warm yellow at noon, orange-red at dawn/dusk
    const sunColor = lerpHex(0xff8833, 0xffee88, Math.min(1, (frame.ambientInt - 0.4) * 5));
    (this.sun.material as THREE.MeshBasicMaterial).color.setHex(sunColor);
    this.sun.position.set(
      Math.cos(angle) * 130 + 32,
      Math.abs(Math.sin(angle)) * 130,
      20,
    );

    // Drift clouds and tint them with day cycle
    for (const cloud of this.cloudMeshes) {
      cloud.position.x += 0.8 * dt;
      if (cloud.position.x > 80) cloud.position.x = -16;
    }
    if (this.cloudMat) {
      this.cloudMat.opacity = 0.5 + frame.ambientInt * 0.4;
    }
  }

  /** Enable/disable the underwater fog effect. */
  setUnderwaterEffect(inWater: boolean): void {
    this._underwaterEffect = inWater;
  }

  /** 0 = clear, 1 = heavy rain — darkens sky, tightens fog. */
  setWeatherIntensity(intensity: number): void {
    if (this._underwaterEffect || intensity < 0.01) return;
    const frame = sampleDayCycle(this._dayTime);
    const rainy = 0x556677;
    const fogRainy = 0x445566;
    const t = intensity;
    (this.scene.background as THREE.Color).setHex(lerpHex(frame.sky, rainy, t * 0.7));
    (this.scene.fog as THREE.Fog).color.setHex(lerpHex(frame.fog, fogRainy, t * 0.7));
    (this.scene.fog as THREE.Fog).far = 130 - t * 70; // rain reduces visibility
    this.ambientLight.intensity = frame.ambientInt * (1 - t * 0.4);
    this.cloudMat.opacity = 0.7 + t * 0.25; // clouds thicken
  }

  /** Call when hotbar active slot changes. itemId = null for empty hand. */
  updateArmItem(itemId: string | null): void {
    while (this.armGroup.children.length > 1) {
      this.armGroup.remove(this.armGroup.children[1]);
    }
    if (!itemId) return;

    const def = ITEMS[itemId];
    if (!def) return;

    const itemMesh = def.weaponType === "gun"
      ? (def.id === "pistol" ? this.buildPistolMesh() : this.buildGunMesh(def.color))
      : this.buildItemMesh(def.category, def.color);
    if (itemMesh) this.armGroup.add(itemMesh);
  }

  /** Compact pistol viewmodel (upright, side-held style). */
  private buildPistolMesh(): THREE.Object3D {
    const g = new THREE.Group();
    const metalMat = new THREE.MeshLambertMaterial({ color: 0x445566 });
    const gripMat  = new THREE.MeshLambertMaterial({ color: 0x1a1a22 });
    const slideMat = new THREE.MeshLambertMaterial({ color: 0x556677 });

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.18, 0.07), gripMat);
    grip.position.set(-0.01, 0.05, 0.01);
    grip.rotation.x = 0.18;
    g.add(grip);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.04), slideMat);
    body.position.set(-0.01, 0.24, -0.01);
    g.add(body);

    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.03), metalMat);
    barrel.position.set(-0.01, 0.39, -0.01);
    g.add(barrel);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.05, 0.04), gripMat);
    guard.position.set(-0.01, 0.14, -0.01);
    g.add(guard);

    g.rotation.z = 0.3;
    return g;
  }

  /** Builds a first-person gun viewmodel (long barrel pointing forward — used by sniper & future guns). */
  private buildGunMesh(color: number): THREE.Object3D {
    const g = new THREE.Group();
    const bodyMat = new THREE.MeshLambertMaterial({ color });
    const darkMat = new THREE.MeshLambertMaterial({ color: 0x222222 });

    const barrel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.5), bodyMat);
    barrel.position.set(0.06, 0.26, -0.16);
    g.add(barrel);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.22), bodyMat);
    body.position.set(0.06, 0.24, 0.04);
    g.add(body);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.07), darkMat);
    grip.position.set(0.06, 0.12, 0.08);
    grip.rotation.x = 0.25;
    g.add(grip);

    const scope = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.18), darkMat);
    scope.position.set(0.06, 0.30, -0.05);
    g.add(scope);

    g.position.set(0.04, 0.08, 0.0);
    return g;
  }

  private buildItemMesh(category: string, color: number): THREE.Object3D | null {
    if (category === "block") {
      const mat = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), mat);
      mesh.position.set(-0.06, 0.24, 0.0);
      mesh.rotation.set(0.3, 0.5, 0.2);
      return mesh;
    }
    if (category === "weapon" || category === "tool" || category === "material") {
      const g = new THREE.Group();
      const stickMat = new THREE.MeshLambertMaterial({ color: 0x8b6914 });
      const stick = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.42, 0.05), stickMat);
      stick.position.set(0.0, 0.18, 0.0);
      stick.rotation.z = 0.35;
      g.add(stick);

      const headMat = new THREE.MeshLambertMaterial({ color });
      if (category === "weapon") {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.28, 0.04), headMat);
        blade.position.set(-0.08, 0.44, 0.0);
        g.add(blade);
      } else {
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 0.06), headMat);
        head.position.set(-0.07, 0.44, 0.0);
        g.add(head);
      }
      return g;
    }
    return null;
  }

  private buildArmMesh(): void {
    const skinMat = new THREE.MeshLambertMaterial({ color: 0x8b6040 });
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.36, 0.12), skinMat);
    this.armGroup.add(arm);
  }

  private buildStars(): THREE.Points {
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 160;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta) + 32;
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));      // upper hemisphere only
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) + 32;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5, transparent: true, opacity: 0 });
    const pts = new THREE.Points(geo, mat);
    this.scene.add(pts);
    return pts;
  }

  private buildMoon(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(4, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xeeeedd, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);
    return mesh;
  }

  private buildSun(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(6, 10, 10);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0, fog: false });
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);
    return mesh;
  }

  private buildClouds(): void {
    this.cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff, transparent: true, opacity: 0.85,
    });
    const positions: [number, number][] = [
      [10, 8], [28, 5], [48, 12], [15, 42], [45, 38],
      [5, 22], [38, 25], [55, 50], [22, 55], [50, 20],
      [35, 14], [18, 48], [52, 32], [8, 36], [42, 58],
    ];
    for (const [cx, cz] of positions) {
      const w = 5 + (cx % 7);
      const d = 3 + (cz % 5);
      const cloud = new THREE.Mesh(new THREE.BoxGeometry(w, 1.0, d), this.cloudMat);
      cloud.position.set(cx, 22, cz);
      this.scene.add(cloud);
      this.cloudMeshes.push(cloud);
    }
  }

  /** Trigger the arm swing animation (call on attack/mine). */
  swingArm(): void {
    this.armSwingTimer = this.ARM_SWING_DURATION;
  }

  render(dt = 0): void {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    this.renderArm(dt);
  }

  private renderArm(dt: number): void {
    if (this.armSwingTimer > 0) this.armSwingTimer = Math.max(0, this.armSwingTimer - dt);

    const worldPos  = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    this.camera.getWorldPosition(worldPos);
    this.camera.getWorldQuaternion(worldQuat);

    // Swing: rotate arm forward and back over the swing duration
    const swingPct = this.armSwingTimer / this.ARM_SWING_DURATION;
    const swingAngle = Math.sin(swingPct * Math.PI) * 1.2; // 1.2 rad ≈ 69 degrees

    const localOffset = new THREE.Vector3(0.38, -0.52 + swingPct * 0.08, -0.75);
    localOffset.applyQuaternion(worldQuat);
    this.armGroup.position.copy(worldPos).add(localOffset);

    const tiltQ = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0.25 - swingAngle, -0.2, 0.12, "YXZ"),
    );
    this.armGroup.quaternion.copy(worldQuat).multiply(tiltQ);

    this.renderer.render(this.armScene, this.camera);
  }

  /** Trigger a camera shake (e.g., on player damage). */
  shake(magnitude = 0.06, duration = 0.35): void {
    this._shakeMagnitude = Math.max(this._shakeMagnitude, magnitude);
    this._shakeTimer = Math.max(this._shakeTimer, duration);
  }

  /** Apply and decay screen shake. Call every frame. */
  updateShake(dt: number): void {
    if (this._shakeTimer <= 0) return;
    this._shakeTimer = Math.max(0, this._shakeTimer - dt);
    const t = this._shakeTimer > 0 ? (this._shakeTimer / 0.35) : 0;
    const m = this._shakeMagnitude * t;
    this.camera.position.x += (Math.random() - 0.5) * m;
    this.camera.position.y += (Math.random() - 0.5) * m;
    if (this._shakeTimer <= 0) this._shakeMagnitude = 0;
  }

  /** Smoothly transition FOV. Call every frame with target (75 normal, 85 sprint). */
  setFOV(targetFOV: number, dt: number): void {
    const diff = targetFOV - this.camera.fov;
    const step = diff * Math.min(1, dt * 10);
    if (Math.abs(step) > 0.01) {
      this.camera.fov += step;
      this.camera.updateProjectionMatrix();
    }
  }

  resetCamera(): void {
    this.camera.position.set(32, 8.62, 36);
    this.camera.lookAt(32, 8, 60);
  }

  private setupLighting(): void {
    this.ambientLight = new THREE.AmbientLight(0xb0c8e8, 0.9);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffe8b0, 1.6);
    this.sunLight.position.set(60, 100, 20);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 220;
    this.sunLight.shadow.camera.left  = -90;
    this.sunLight.shadow.camera.right =  90;
    this.sunLight.shadow.camera.top   =  90;
    this.sunLight.shadow.camera.bottom = -90;
    this.scene.add(this.sunLight);

    const fill1 = new THREE.DirectionalLight(0x88aacc, 0.5);
    fill1.position.set(-30, 20, -20);
    this.scene.add(fill1);

    const fill2 = new THREE.DirectionalLight(0x9ab4cc, 0.4);
    fill2.position.set(0, 15, 60);
    this.scene.add(fill2);
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
