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
  private dayTime = 0.38; // start at morning
  private _totalDays = 0;
  private readonly DAY_DURATION = 600; // 10 real minutes per game day
  private sunLight!: THREE.DirectionalLight;
  private ambientLight!: THREE.AmbientLight;

  // Night sky elements
  private readonly stars: THREE.Points;
  private readonly moon: THREE.Mesh;

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
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x7ec8e3);
    this.scene.fog = new THREE.Fog(0xaad4e8, 48, 130);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(32, 2.62, 32);
    this.camera.lookAt(32, 2.62, 18);

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("lock",   () => this.onPointerLockChange(true));
    this.controls.addEventListener("unlock", () => this.onPointerLockChange(false));

    this.setupLighting();
    this.buildClouds();
    this.stars = this.buildStars();
    this.moon  = this.buildMoon();

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
  get daylight(): number {
    const frame = sampleDayCycle(this.dayTime);
    return frame.ambientInt;
  }
  get dayNumber(): number { return Math.floor(this._totalDays) + 1; }
  get isDay(): boolean { return this.daylight > 0.3; }

  lockPointer():   void { this.controls.lock(); }
  unlockPointer(): void { this.controls.unlock(); }

  /** Advance the day/night cycle. Call from game loop. */
  updateDayNight(dt: number): void {
    this._totalDays += dt / this.DAY_DURATION;
    this.dayTime = (this.dayTime + dt / this.DAY_DURATION) % 1;
    const frame = sampleDayCycle(this.dayTime);

    (this.scene.background as THREE.Color).setHex(frame.sky);
    (this.scene.fog as THREE.Fog).color.setHex(frame.fog);

    this.ambientLight.color.setHex(frame.ambientColor);
    this.ambientLight.intensity = frame.ambientInt;

    this.sunLight.intensity = frame.sunInt;
    this.sunLight.color.setHex(frame.sunColor);

    // Animate sun position around world center
    const angle = this.dayTime * Math.PI * 2;
    const r = 100;
    this.sunLight.position.set(
      Math.cos(angle) * r,
      Math.sin(angle) * r,
      20,
    );

    // Tone mapping exposure: brighter at noon, dimmer at night
    this.renderer.toneMappingExposure = 0.5 + frame.ambientInt * 0.8;

    // Stars and moon: visible at night (dayTime ~0-0.25 and ~0.75-1)
    const nightness = Math.max(0, 1 - frame.ambientInt * 4);
    (this.stars.material as THREE.PointsMaterial).opacity = nightness * 0.9;
    (this.moon.material as THREE.MeshBasicMaterial).opacity = nightness * 0.95;

    // Moon position: opposite side of sky from sun
    const moonAngle = this.dayTime * Math.PI * 2 + Math.PI;
    const mr = 130;
    this.moon.position.set(
      Math.cos(moonAngle) * mr + 32,
      Math.abs(Math.sin(moonAngle)) * mr,
      20,
    );
  }

  /** Call when hotbar active slot changes. itemId = null for empty hand. */
  updateArmItem(itemId: string | null): void {
    while (this.armGroup.children.length > 1) {
      this.armGroup.remove(this.armGroup.children[1]);
    }
    if (!itemId) return;

    const def = ITEMS[itemId];
    if (!def) return;

    const itemMesh = this.buildItemMesh(def.category, def.color);
    if (itemMesh) this.armGroup.add(itemMesh);
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

  private buildClouds(): void {
    const cloudMat = new THREE.MeshLambertMaterial({
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
      const cloud = new THREE.Mesh(new THREE.BoxGeometry(w, 1.0, d), cloudMat);
      cloud.position.set(cx, 22, cz);
      this.scene.add(cloud);
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
    this.camera.position.set(32, 2.62, 32);
    this.camera.lookAt(32, 2.62, 18);
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
