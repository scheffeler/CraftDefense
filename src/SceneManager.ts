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
  private readonly starGroups: THREE.Points[];
  private _starTime = 0;
  private readonly moon: THREE.Mesh;
  private readonly sun:  THREE.Mesh;
  private readonly skyDome: THREE.Mesh;
  private readonly skyZenith  = new THREE.Color(0x5ab3dd);
  private readonly skyHorizon = new THREE.Color(0x80ccee);

  // Clouds
  private readonly cloudMeshes: THREE.Object3D[] = [];
  private cloudMat!: THREE.MeshLambertMaterial;

  // Sun glow halo
  private sunGlow!: THREE.Mesh;

  // Underwater effect
  private _underwaterEffect  = false;
  private _nightVisionEffect = false;


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
    this.skyDome = this.buildSkyDome();
    this.buildClouds();
    this.starGroups = this.buildStars();
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

    // Lava overrides sky/fog with orange
    if (this._inLavaEffect) {
      (this.scene.fog as THREE.Fog).color.setHex(0x8b2200);
      (this.scene.fog as THREE.Fog).near = 0.5;
      (this.scene.fog as THREE.Fog).far  = 3;
      this.skyZenith.setHex(0x8b2200);
      this.skyHorizon.setHex(0x8b2200);
    // Underwater overrides sky/fog
    } else if (this._underwaterEffect) {
      (this.scene.fog as THREE.Fog).color.setHex(0x083560);
      (this.scene.fog as THREE.Fog).near = 1;
      (this.scene.fog as THREE.Fog).far  = 6;
      this.skyZenith.setHex(0x083560);
      this.skyHorizon.setHex(0x083560);
    } else {
      (this.scene.fog as THREE.Fog).color.setHex(frame.fog);
      (this.scene.fog as THREE.Fog).near = 48;
      (this.scene.fog as THREE.Fog).far  = 130;
      this.skyZenith.setHex(frame.sky);
      this.skyHorizon.setHex(frame.fog);
    }

    this.ambientLight.color.setHex(frame.ambientColor);
    this.ambientLight.intensity = this._nightVisionEffect
      ? Math.max(frame.ambientInt, 0.85)
      : frame.ambientInt;

    this.sunLight.intensity = frame.sunInt;
    this.sunLight.color.setHex(frame.sunColor);

    // Animate sun position around world center (offset by 32 so target=world center works)
    const angle = this._dayTime * Math.PI * 2;
    const r = 100;
    this.sunLight.position.set(
      32 + Math.cos(angle) * r,
      Math.sin(angle) * r,
      32,
    );

    // Tone mapping exposure: brighter at noon, dimmer at night
    this.renderer.toneMappingExposure = 0.5 + frame.ambientInt * 0.8;

    // Stars and moon: visible at night; stars twinkle with staggered phases
    const nightness = Math.max(0, 1 - frame.ambientInt * 4);
    this._starTime += dt;
    const PHASES = [0, Math.PI * 0.67, Math.PI * 1.33];
    for (let g = 0; g < this.starGroups.length; g++) {
      const mat = this.starGroups[g].material as THREE.PointsMaterial;
      mat.opacity = nightness * 0.9;
      // Twinkle: slow sine wave gives ±20% size flicker, different phase per group
      mat.size = 0.45 + 0.18 * Math.sin(this._starTime * 1.1 + PHASES[g])
                      + 0.07 * Math.sin(this._starTime * 2.9 + PHASES[g]);
    }
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
    const sunX = 32 + Math.cos(angle) * 130;
    const sunY = Math.abs(Math.sin(angle)) * 130;
    this.sun.position.set(sunX, sunY, 32);
    // Billboard: disc always faces camera
    this.sun.quaternion.copy(this.camera.quaternion);

    // Glow halo follows sun
    this.sunGlow.position.set(sunX, sunY, 31.5);
    this.sunGlow.quaternion.copy(this.camera.quaternion);
    (this.sunGlow.material as THREE.MeshBasicMaterial).opacity = sunOpacity * 0.45;
    (this.sunGlow.material as THREE.MeshBasicMaterial).color.setHex(lerpHex(0xff6600, 0xffcc44, Math.min(1, (frame.ambientInt - 0.3) * 4)));

    // Drift clouds and tint them with day cycle
    for (const cloud of this.cloudMeshes) {
      cloud.position.x += 0.8 * dt;
      if (cloud.position.x > 80) cloud.position.x = -16;
    }
    if (this.cloudMat) {
      this.cloudMat.opacity = 0.5 + frame.ambientInt * 0.4;
    }
  }

  private _inLavaEffect = false;

  /** Enable/disable the underwater fog effect. */
  setUnderwaterEffect(inWater: boolean): void {
    this._underwaterEffect = inWater;
  }

  /** Enable/disable the in-lava orange fog effect. */
  setInLavaEffect(inLava: boolean): void {
    this._inLavaEffect = inLava;
  }

  setNightVisionEffect(active: boolean): void {
    this._nightVisionEffect = active;
  }

  /** 0 = clear, 1 = heavy rain — darkens sky, tightens fog. */
  setWeatherIntensity(intensity: number): void {
    if (this._underwaterEffect || this._inLavaEffect || intensity < 0.01) return;
    const frame = sampleDayCycle(this._dayTime);
    const rainy = 0x556677;
    const fogRainy = 0x445566;
    const t = intensity;
    const skyHex = lerpHex(frame.sky, rainy, t * 0.7);
    const fogHex = lerpHex(frame.fog, fogRainy, t * 0.7);
    (this.scene.fog as THREE.Fog).color.setHex(fogHex);
    (this.scene.fog as THREE.Fog).far = 130 - t * 70; // rain reduces visibility
    this.ambientLight.intensity = frame.ambientInt * (1 - t * 0.4);
    this.cloudMat.opacity = 0.7 + t * 0.25; // clouds thicken
    this.skyZenith.setHex(skyHex);
    this.skyHorizon.setHex(fogHex);
  }

  /** Call when hotbar active slot changes. itemId = null for empty hand. */
  updateArmItem(itemId: string | null): void {
    while (this.armGroup.children.length > 1) {
      this.armGroup.remove(this.armGroup.children[1]);
    }
    if (!itemId) return;

    const def = ITEMS[itemId];
    if (!def) return;

    let itemMesh: THREE.Object3D | null;
    if (def.weaponType === "gun") {
      if (def.id === "pistol")  itemMesh = this.buildPistolMesh();
      else if (def.id === "shotgun") itemMesh = this.buildShotgunMesh();
      else itemMesh = this.buildGunMesh(def.color);
    } else {
      itemMesh = this.buildItemMesh(itemId, def.category, def.color);
    }
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

  /** Pump-action shotgun — wide double-barrel, wooden stock. */
  private buildShotgunMesh(): THREE.Object3D {
    const g = new THREE.Group();
    const metalMat = new THREE.MeshLambertMaterial({ color: 0x333333 });
    const woodMat  = new THREE.MeshLambertMaterial({ color: 0x7a3b10 });
    const darkMat  = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });

    const barrelL = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.34), metalMat);
    barrelL.position.set(-0.03, 0.27, -0.08);
    g.add(barrelL);

    const barrelR = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.055, 0.34), metalMat);
    barrelR.position.set(0.03, 0.27, -0.08);
    g.add(barrelR);

    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.09, 0.14), darkMat);
    receiver.position.set(0.0, 0.26, 0.10);
    g.add(receiver);

    const pump = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.05, 0.10), woodMat);
    pump.position.set(0.0, 0.22, -0.05);
    g.add(pump);

    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, 0.12), woodMat);
    stock.position.set(0.0, 0.21, 0.19);
    stock.rotation.x = -0.15;
    g.add(stock);

    const guard = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.07), darkMat);
    guard.position.set(0.0, 0.19, 0.09);
    g.add(guard);

    g.position.set(0.02, 0.06, 0.0);
    return g;
  }

  /** Long-barrel gun viewmodel — sniper and generic firearms. */
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

  private buildItemMesh(itemId: string, category: string, color: number): THREE.Object3D | null {
    if (category === "block") {
      const mat = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), mat);
      mesh.position.set(-0.06, 0.24, 0.0);
      mesh.rotation.set(0.3, 0.5, 0.2);
      return mesh;
    }
    if (category === "food" || category === "material") {
      const mat = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.16, 0.08), mat);
      mesh.position.set(-0.04, 0.22, 0.0);
      mesh.rotation.set(0.2, 0.4, 0.1);
      return mesh;
    }
    if (category === "weapon") {
      if (itemId === "bow") return this.buildBowMesh();
      return this.buildSwordMesh(color);
    }
    if (category === "tool") {
      if (itemId.includes("pickaxe")) return this.buildPickaxeMesh(color);
      if (itemId.includes("_axe"))    return this.buildAxeMesh(color);
      if (itemId.includes("shovel"))  return this.buildShovelMesh(color);
      if (itemId.includes("hoe"))     return this.buildHoeMesh(color);
    }
    return null;
  }

  private buildSwordMesh(color: number): THREE.Object3D {
    const g = new THREE.Group();
    const m = (c: number) => new THREE.MeshLambertMaterial({ color: c });
    const b = (w: number, h: number, d: number, c: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m(c));

    const grip = b(0.06, 0.18, 0.05, 0x5a3a1a);
    grip.position.set(0.0, 0.06, 0.0); grip.rotation.z = 0.3;
    g.add(grip);
    const pommel = b(0.10, 0.06, 0.06, color);
    pommel.position.set(0.03, -0.04, 0.0); pommel.rotation.z = 0.3;
    g.add(pommel);
    const guard = b(0.20, 0.045, 0.045, color);
    guard.position.set(-0.05, 0.20, 0.0); guard.rotation.z = 0.3;
    g.add(guard);
    const blade = b(0.055, 0.34, 0.022, color);
    blade.position.set(-0.10, 0.39, 0.0); blade.rotation.z = 0.3;
    g.add(blade);
    // Subtle edge highlight
    const edge = b(0.012, 0.32, 0.012, 0xffffff);
    (edge.material as THREE.MeshLambertMaterial).emissive.setHex(0xffffff);
    (edge.material as THREE.MeshLambertMaterial).emissiveIntensity = 0.10;
    edge.position.set(-0.072, 0.39, 0.0); edge.rotation.z = 0.3;
    g.add(edge);

    return g;
  }

  private buildPickaxeMesh(color: number): THREE.Object3D {
    const g = new THREE.Group();
    const m = (c: number) => new THREE.MeshLambertMaterial({ color: c });
    const b = (w: number, h: number, d: number, c: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m(c));

    const stick = b(0.05, 0.40, 0.05, 0x8b6914);
    stick.position.set(0.0, 0.18, 0.0); stick.rotation.z = 0.35;
    g.add(stick);
    const bar = b(0.22, 0.07, 0.07, color);
    bar.position.set(-0.06, 0.43, 0.0); bar.rotation.z = 0.35;
    g.add(bar);
    const prong1 = b(0.06, 0.12, 0.05, color);
    prong1.position.set(-0.16, 0.38, 0.0); prong1.rotation.z = 0.35 + 0.55;
    g.add(prong1);
    const prong2 = b(0.06, 0.10, 0.05, color);
    prong2.position.set(0.06, 0.48, 0.0); prong2.rotation.z = 0.35 - 0.45;
    g.add(prong2);

    return g;
  }

  private buildAxeMesh(color: number): THREE.Object3D {
    const g = new THREE.Group();
    const m = (c: number) => new THREE.MeshLambertMaterial({ color: c });
    const b = (w: number, h: number, d: number, c: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m(c));

    const stick = b(0.05, 0.40, 0.05, 0x8b6914);
    stick.position.set(0.0, 0.18, 0.0); stick.rotation.z = 0.35;
    g.add(stick);
    const blade = b(0.18, 0.22, 0.05, color);
    blade.position.set(-0.12, 0.44, 0.0); blade.rotation.z = 0.35;
    g.add(blade);
    const back = b(0.06, 0.14, 0.05, color);
    back.position.set(-0.02, 0.43, 0.0); back.rotation.z = 0.35;
    g.add(back);

    return g;
  }

  private buildShovelMesh(color: number): THREE.Object3D {
    const g = new THREE.Group();
    const m = (c: number) => new THREE.MeshLambertMaterial({ color: c });
    const b = (w: number, h: number, d: number, c: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m(c));

    const stick = b(0.05, 0.42, 0.05, 0x8b6914);
    stick.position.set(0.0, 0.18, 0.0); stick.rotation.z = 0.35;
    g.add(stick);
    const blade = b(0.16, 0.20, 0.03, color);
    blade.position.set(-0.07, 0.47, 0.0); blade.rotation.z = 0.35;
    g.add(blade);

    return g;
  }

  private buildHoeMesh(color: number): THREE.Object3D {
    const g = new THREE.Group();
    const m = (c: number) => new THREE.MeshLambertMaterial({ color: c });
    const b = (w: number, h: number, d: number, c: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m(c));

    const stick = b(0.05, 0.40, 0.05, 0x8b6914);
    stick.position.set(0.0, 0.18, 0.0); stick.rotation.z = 0.35;
    g.add(stick);
    const head = b(0.20, 0.06, 0.06, color);
    head.position.set(-0.07, 0.44, 0.0); head.rotation.z = 0.35;
    g.add(head);
    const tooth = b(0.05, 0.09, 0.05, color);
    tooth.position.set(-0.15, 0.40, 0.0); tooth.rotation.z = 0.35;
    g.add(tooth);

    return g;
  }

  private buildBowMesh(): THREE.Object3D {
    const g = new THREE.Group();
    const m = (c: number) => new THREE.MeshLambertMaterial({ color: c });
    const b = (w: number, h: number, d: number, c: number) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m(c));

    const bowCol = 0x7a5010;
    const center = b(0.06, 0.14, 0.06, bowCol);
    center.position.set(-0.04, 0.26, 0.0); center.rotation.z = 0.15;
    g.add(center);
    const upper = b(0.05, 0.17, 0.05, bowCol);
    upper.position.set(-0.12, 0.41, 0.0); upper.rotation.z = 0.15 + 0.52;
    g.add(upper);
    const lower = b(0.05, 0.17, 0.05, bowCol);
    lower.position.set(0.04, 0.11, 0.0); lower.rotation.z = 0.15 - 0.52;
    g.add(lower);
    // Bowstring
    const str = b(0.008, 0.40, 0.008, 0xddddcc);
    str.position.set(-0.16, 0.26, 0.0); str.rotation.z = 0.06;
    g.add(str);

    return g;
  }

  private static buildArmSkinTexture(): THREE.Texture {
    const canvas = document.createElement("canvas");
    canvas.width = 16; canvas.height = 16;
    const ctx = canvas.getContext("2d")!;
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        const n = Math.sin(x * 1.7 + y * 2.3 + 11.1) * Math.cos(x * 0.9 + y * 1.4 + 7.3);
        const v = (n * 14) | 0;
        const r = Math.max(0, Math.min(255, 208 + v));
        const g2 = Math.max(0, Math.min(255, 148 + v));
        const b = Math.max(0, Math.min(255, 96 + (v * 0.5) | 0));
        ctx.fillStyle = `rgb(${r},${g2},${b})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Wrist crease
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 13, 16, 1);
    // Top edge highlight
    ctx.fillStyle = "rgba(255,200,160,0.22)";
    ctx.fillRect(0, 0, 16, 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  private buildArmMesh(): void {
    const tex = SceneManager.buildArmSkinTexture();
    // Six faces: +X, -X, +Y, -Y, +Z, -Z  — tinted for directional shading
    const faceTints = [0xe0b898, 0xcca080, 0xb88868, 0x997050, 0xf0c8a8, 0xd0a888];
    const mats = faceTints.map(c => new THREE.MeshLambertMaterial({ map: tex, color: c }));

    const container = new THREE.Group();
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.36, 0.12), mats);
    container.add(arm);

    // Dark sleeve cuff at the upper end of the arm
    const sleeveMat = new THREE.MeshLambertMaterial({ color: 0x2a1c10 });
    const sleeve = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.075, 0.135), sleeveMat);
    sleeve.position.set(0, 0.142, 0);
    container.add(sleeve);

    this.armGroup.add(container);
  }

  private buildSkyDome(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(185, 24, 12);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        zenith:  { value: this.skyZenith },
        horizon: { value: this.skyHorizon },
      },
      vertexShader: `
        varying float vH;
        void main() {
          vH = normalize(position).y;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 zenith;
        uniform vec3 horizon;
        varying float vH;
        void main() {
          float t = smoothstep(-0.08, 0.38, vH);
          gl_FragColor = vec4(mix(horizon, zenith, t), 1.0);
        }
      `,
      side: THREE.BackSide,
      fog: false,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.renderOrder = -1;
    this.scene.background = null;
    this.scene.add(mesh);
    return mesh;
  }

  private buildStars(): THREE.Points[] {
    // 3 groups of ~267 stars each, slightly different sizes — staggered twinkle phases
    const GROUPS = 3;
    const PER_GROUP = 267;
    const r = 160;
    const groups: THREE.Points[] = [];
    for (let g = 0; g < GROUPS; g++) {
      const positions = new Float32Array(PER_GROUP * 3);
      for (let i = 0; i < PER_GROUP; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.acos(2 * Math.random() - 1);
        positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta) + 32;
        positions[i * 3 + 1] = Math.abs(r * Math.cos(phi));
        positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) + 32;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
      // Base size varies slightly per group so they don't all look the same
      const baseSize = 0.38 + g * 0.08;
      const mat = new THREE.PointsMaterial({ color: 0xffffff, size: baseSize, transparent: true, opacity: 0 });
      const pts = new THREE.Points(geo, mat);
      this.scene.add(pts);
      groups.push(pts);
    }
    return groups;
  }

  private buildMoon(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(4, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0xeeeedd, transparent: true, opacity: 0 });
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);
    return mesh;
  }

  private buildSun(): THREE.Mesh {
    // Flat billboard disc — oriented to face camera each frame
    const geo = new THREE.CircleGeometry(8, 20);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0, fog: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);

    // Glow corona ring with additive blending
    const glowGeo = new THREE.RingGeometry(8, 20, 24);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xffdd44, transparent: true, opacity: 0, fog: false,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
    });
    this.sunGlow = new THREE.Mesh(glowGeo, glowMat);
    this.scene.add(this.sunGlow);

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
      const cloud = new THREE.Group();
      // Flat base layer
      const base = new THREE.Mesh(new THREE.BoxGeometry(w, 0.75, d), this.cloudMat);
      cloud.add(base);
      // Left upper puff
      const puffL = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.56, 1.25, d * 0.72), this.cloudMat,
      );
      puffL.position.set(-w * 0.12, 0.88, 0);
      cloud.add(puffL);
      // Right upper puff (slightly smaller and offset)
      const puffR = new THREE.Mesh(
        new THREE.BoxGeometry(w * 0.45, 1.05, d * 0.58), this.cloudMat,
      );
      puffR.position.set(w * 0.17, 0.72, 0);
      cloud.add(puffR);
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
    this.skyDome.position.copy(this.camera.position);
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
    this.sunLight.position.set(60, 100, 52);
    this.sunLight.target.position.set(32, 0, 32); // world center
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.set(2048, 2048);
    this.sunLight.shadow.bias = -0.001;           // prevent shadow acne on blocks
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 250;
    this.sunLight.shadow.camera.left  = -80;
    this.sunLight.shadow.camera.right =  80;
    this.sunLight.shadow.camera.top   =  80;
    this.sunLight.shadow.camera.bottom = -80;
    this.scene.add(this.sunLight);
    this.scene.add(this.sunLight.target);

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
