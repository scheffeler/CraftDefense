import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { ITEMS } from "./config/items";
import { blockFaceUV } from "./Map";
import type { BlockId } from "./types";

// ---------------------------------------------------------------------------
// Day/night cycle keyframes (t=0 midnight, t=0.5 noon, t=1 midnight)
// ---------------------------------------------------------------------------
interface DayFrame {
  t: number; sky: number; fog: number; topSky: number;
  ambientColor: number; ambientInt: number;
  sunInt: number; sunColor: number;
}
// topSky = zenith color — stays dark blue even when horizon turns orange at dawn/dusk
const DAY_FRAMES: DayFrame[] = [
  { t: 0.00, sky: 0x050510, fog: 0x060615, topSky: 0x020208, ambientColor: 0x203050, ambientInt: 0.08, sunInt: 0.0, sunColor: 0xffffff },
  { t: 0.20, sky: 0x0a1535, fog: 0x0a1830, topSky: 0x060e20, ambientColor: 0x304070, ambientInt: 0.15, sunInt: 0.0, sunColor: 0xffffff },
  { t: 0.27, sky: 0xff8040, fog: 0xdd6030, topSky: 0x1a2850, ambientColor: 0xcc6633, ambientInt: 0.5,  sunInt: 0.7, sunColor: 0xff9060 },
  { t: 0.35, sky: 0x7ec8e3, fog: 0xaad4e8, topSky: 0x1a5090, ambientColor: 0xb0c8e8, ambientInt: 0.8,  sunInt: 1.6, sunColor: 0xffe8b0 },
  { t: 0.50, sky: 0x5ab3dd, fog: 0x80ccee, topSky: 0x1255a8, ambientColor: 0xb8d8f0, ambientInt: 1.0,  sunInt: 1.9, sunColor: 0xfffde0 },
  { t: 0.65, sky: 0x7ec8e3, fog: 0xaad4e8, topSky: 0x1a5090, ambientColor: 0xb0c8e8, ambientInt: 0.8,  sunInt: 1.6, sunColor: 0xffe8b0 },
  { t: 0.73, sky: 0xff6020, fog: 0xcc4010, topSky: 0x1a2850, ambientColor: 0xcc5522, ambientInt: 0.5,  sunInt: 0.7, sunColor: 0xff7040 },
  { t: 0.80, sky: 0x0a1535, fog: 0x0a1830, topSky: 0x060e20, ambientColor: 0x304070, ambientInt: 0.15, sunInt: 0.0, sunColor: 0xffffff },
  { t: 1.00, sky: 0x050510, fog: 0x060615, topSky: 0x020208, ambientColor: 0x203050, ambientInt: 0.08, sunInt: 0.0, sunColor: 0xffffff },
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
    topSky:      lerpHex(lo.topSky, hi.topSky, f),
    ambientColor: lerpHex(lo.ambientColor, hi.ambientColor, f),
    ambientInt:  lo.ambientInt + (hi.ambientInt - lo.ambientInt) * f,
    sunInt:      lo.sunInt  + (hi.sunInt  - lo.sunInt)  * f,
    sunColor:    lerpHex(lo.sunColor, hi.sunColor, f),
  };
}

// ---------------------------------------------------------------------------

interface RainLensDrop {
  x: number;      // normalized 0–1 screen x of drop centre
  y: number;      // normalized 0–1 screen y of drop top
  w: number;      // half-width in px
  h: number;      // half-height in px
  speed: number;  // downward slide in px/s
  age: number;    // seconds elapsed
  life: number;   // total lifetime in seconds
}

// ---------------------------------------------------------------------------

interface Firefly {
  sprite: THREE.Sprite;
  vx: number;
  vz: number;
  vyDir: number;   // +1 or -1 for slow vertical bob direction
  phase: number;   // blink phase offset (radians)
  blinkFreq: number; // blinks per second
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
  private _milkyWay!: THREE.Points;
  private _starTime = 0;
  private readonly moon: THREE.Mesh;
  private readonly moonShadow: THREE.Mesh;
  private readonly moonGlow: THREE.Mesh;
  private readonly sun:  THREE.Mesh;
  private readonly skyDome: THREE.Mesh;
  private readonly skyZenith  = new THREE.Color(0x5ab3dd);
  private readonly skyHorizon = new THREE.Color(0x80ccee);
  private readonly _skyHazeColor   = new THREE.Color(0xffaa44);
  private _skyHazeOpacity = 0.0;

  // Clouds
  private readonly cloudMeshes: THREE.Object3D[] = [];
  private cloudMat!: THREE.MeshLambertMaterial;
  private readonly cloudShadowMeshes: THREE.Mesh[] = [];
  private _cloudShadowMat!: THREE.MeshBasicMaterial;

  // Sun glow halo
  private sunGlow!: THREE.Mesh;

  // Underwater effect
  private _underwaterEffect  = false;
  private _nightVisionEffect = false;
  private _fogFarBase = 130; // base far fog distance, overridden per biome
  private _nightFarReduction = 0; // reduced at night for atmospheric darkness

  // Block texture shared with the voxel world — used for the held-block cube
  private _blockTex: THREE.Texture | null = null;

  // Screen shake
  private _shakeTimer = 0;
  private _shakeMagnitude = 0;

  // First-person arm + swing animation
  private readonly armScene: THREE.Scene;
  private readonly armGroup: THREE.Group;
  private armSwingTimer = 0;
  private readonly ARM_SWING_DURATION = 0.25;
  private _swingArcMesh!: THREE.Mesh;
  private _swingWeaponEquipped = false;

  // Arm walk-bob
  private _armBobTime = 0;
  private _armBobSpeed = 0;
  private _armBobLastPos = new THREE.Vector3();

  // Wave-start exposure pulse (0 = inactive)
  private _wavePulseTimer = 0;

  // Player ground-shadow blob
  private _playerShadowBlob!: THREE.Mesh;

  // Fireflies — glow sprites drifting in the clearing at night
  private readonly _fireflies: Firefly[] = [];
  private _fireflyTime = 0;

  // Rain lens drops + underwater vignette — canvas overlay
  private readonly _rainLensCanvas: HTMLCanvasElement;
  private readonly _rainLensCtx: CanvasRenderingContext2D;
  private readonly _rainLensDrops: RainLensDrop[] = [];
  private _rainLensSpawnTimer = 0;
  private _rainLensIntensity = 0;
  private _underwaterVigTime = 0; // drives ripple animation when underwater

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

    // Rain lens drop overlay — transparent canvas on top of game canvas
    {
      const lc = document.createElement("canvas");
      lc.width  = window.innerWidth;
      lc.height = window.innerHeight;
      lc.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:5;";
      container.appendChild(lc);
      this._rainLensCanvas = lc;
      this._rainLensCtx    = lc.getContext("2d")!;
    }

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
    this._milkyWay  = this.buildMilkyWay();
    [this.moon, this.moonShadow, this.moonGlow] = this.buildMoon();
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

    // Translucent swing arc — sits in armScene, shown during melee swings
    {
      const arcGeo = new THREE.PlaneGeometry(0.35, 0.55);
      const arcMat = new THREE.MeshBasicMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      });
      this._swingArcMesh = new THREE.Mesh(arcGeo, arcMat);
      this.armScene.add(this._swingArcMesh);
    }

    // Player ground-shadow blob — soft-edge dark disc projected at feet level
    {
      const blobGeo = new THREE.CircleGeometry(0.52, 24);

      // Radial gradient: opaque black at centre, fading to transparent at rim
      const alphaCanvas = document.createElement("canvas");
      alphaCanvas.width = alphaCanvas.height = 64;
      const actx = alphaCanvas.getContext("2d")!;
      const grad = actx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0,    "rgba(255,255,255,1)");
      grad.addColorStop(0.50, "rgba(255,255,255,0.75)");
      grad.addColorStop(0.82, "rgba(255,255,255,0.25)");
      grad.addColorStop(1,    "rgba(0,0,0,0)");
      actx.fillStyle = grad;
      actx.fillRect(0, 0, 64, 64);

      const blobMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        opacity: 0.0,
        depthWrite: false,
        alphaMap: new THREE.CanvasTexture(alphaCanvas),
      });
      this._playerShadowBlob = new THREE.Mesh(blobGeo, blobMat);
      this._playerShadowBlob.rotation.x = -Math.PI / 2;
      this._playerShadowBlob.renderOrder = 1;
      this._playerShadowBlob.visible = false;
      this.scene.add(this._playerShadowBlob);
    }

    this.buildFireflies();

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
  get moonPhase(): number { return (this._totalDays % 8) / 8; }
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
      // At night, tighten fog to simulate limited visibility in darkness.
      // ambientInt ≈ 0.08 at midnight → reduces far by up to 55 units; dawn/dusk unchanged.
      this._nightFarReduction = Math.max(0, 1 - frame.ambientInt / 0.18) * 55;
      const nightNearPull = Math.max(0, 1 - frame.ambientInt / 0.18) * 10;
      (this.scene.fog as THREE.Fog).color.setHex(frame.fog);
      (this.scene.fog as THREE.Fog).near = 48 - nightNearPull;
      (this.scene.fog as THREE.Fog).far  = this._fogFarBase - this._nightFarReduction;
      this.skyZenith.setHex(frame.topSky);
      this.skyHorizon.setHex(frame.sky);
      // Biome sky tint: desert = warmer/sandier, taiga = cooler/bluer
      if (this._biome === "desert") {
        this.skyZenith.r  = Math.min(1, this.skyZenith.r  * 1.06);
        this.skyZenith.g  = Math.min(1, this.skyZenith.g  * 1.02);
        this.skyZenith.b  *= 0.88;
        this.skyHorizon.r = Math.min(1, this.skyHorizon.r * 1.10);
        this.skyHorizon.g = Math.min(1, this.skyHorizon.g * 1.04);
        this.skyHorizon.b *= 0.80;
      } else if (this._biome === "taiga") {
        this.skyZenith.r  *= 0.94;
        this.skyZenith.b  = Math.min(1, this.skyZenith.b  * 1.05);
        this.skyHorizon.r *= 0.95;
        this.skyHorizon.b = Math.min(1, this.skyHorizon.b * 1.04);
      }
    }

    // Horizon haze: warm golden at dawn/dusk, cool blue-white at noon, invisible at night
    const dawnDusk = Math.max(0, Math.min(1,
      1 - Math.abs(frame.ambientInt - 0.5) * 4.5)); // peaks at ambientInt≈0.5 (sunrise/sunset)
    const hazeIntensity = frame.ambientInt * 0.55 + dawnDusk * 0.45;
    // Dawn/dusk = warm orange; mid-day = pale yellow-white; night = off
    const hazeR = lerpHex(0xffbb44, 0xfff0cc, 1 - dawnDusk);
    this._skyHazeColor.setHex(hazeR);
    this._skyHazeOpacity = hazeIntensity * (this._underwaterEffect || this._inLavaEffect ? 0 : 1);
    const skyMat = this.skyDome.material as THREE.ShaderMaterial;
    skyMat.uniforms["hazeOpacity"].value = this._skyHazeOpacity;

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
    const baseExposure = 0.5 + frame.ambientInt * 0.8;
    this.renderer.toneMappingExposure = baseExposure * this._getWavePulseMult(dt);

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
    // Milky Way: dense star band — fades in once the sky is dark
    (this._milkyWay.material as THREE.PointsMaterial).opacity = nightness * 0.38;
    (this.moon.material as THREE.MeshBasicMaterial).opacity = nightness * 0.95;

    // Moon position: high at midnight (t=0), offset PI/2 so |sin|=1 at t=0
    const moonAngle = this._dayTime * Math.PI * 2 + Math.PI * 0.5;
    const mr = 130;
    this.moon.position.set(
      Math.cos(moonAngle) * mr + 32,
      Math.abs(Math.sin(moonAngle)) * mr,
      20,
    );
    // Billboard: moon disc always faces camera
    this.moon.quaternion.copy(this.camera.quaternion);

    // Moon phase shadow: a dark disc slides over the lit face over 8-day cycle.
    // phase=0 → full moon (shadow fully off to right), phase=0.5 → new moon (centered).
    const moonPhase = (this._totalDays % 8) / 8;
    const moonR = 7.0;
    // Shadow x offset in local billboard space: waxing = moves left, waning = moves right
    const shadowOffsetX = moonR * 1.85 * (1.0 - moonPhase * 2.0);
    const camRight = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
    const camFwd   = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.moonShadow.position.copy(this.moon.position)
      .addScaledVector(camRight, shadowOffsetX)
      .addScaledVector(camFwd, -0.5);
    this.moonShadow.quaternion.copy(this.camera.quaternion);
    (this.moonShadow.material as THREE.MeshBasicMaterial).opacity = nightness * 0.95;

    // Moon corona glow: blue-white at full moon, faint grey halo at new moon.
    const moonFullness = Math.abs(1 - moonPhase * 2); // 1=full, 0=new
    // At new moon a faint grey halo hints at the dark disc in the sky.
    const newMoonRim = Math.max(0, 0.28 - moonFullness * 0.56); // peaks at phase=0.5
    const coronaOpacity = nightness * (moonFullness * 0.28 + newMoonRim * 0.14);
    const coronaColor = moonFullness > 0.12
      ? 0xaaccff                                             // full/crescent — blue-white
      : lerpHex(0x334466, 0xaaccff, moonFullness / 0.12);   // fades to dark grey-blue at new
    (this.moonGlow.material as THREE.MeshBasicMaterial).color.setHex(coronaColor);
    (this.moonGlow.material as THREE.MeshBasicMaterial).opacity = coronaOpacity;
    this.moonGlow.position.copy(this.moon.position).addScaledVector(camFwd, -0.3);
    this.moonGlow.quaternion.copy(this.camera.quaternion);

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

    // Drift clouds + matching ground shadows with day cycle.
    // Shadow offset is driven by sun elevation: at dawn/dusk the sun is near the horizon
    // so shadows stretch away from the sun (cast eastward at dusk, westward at dawn).
    // Cloud height ≈ 22, shadow plane at y=7.05 → height diff = 14.95.
    const sunVX = Math.cos(angle) * 130;
    const sunVY = Math.max(30, Math.abs(Math.sin(angle)) * 130); // clamp avoids singularity near horizon
    const shadowXShift = Math.max(-20, Math.min(20, -sunVX * 14.95 / (sunVY - 22)));
    for (let ci = 0; ci < this.cloudMeshes.length; ci++) {
      this.cloudMeshes[ci].position.x += 0.8 * dt;
      if (this.cloudMeshes[ci].position.x > 80) this.cloudMeshes[ci].position.x = -16;
      if (this.cloudShadowMeshes[ci]) {
        this.cloudShadowMeshes[ci].position.x = this.cloudMeshes[ci].position.x + shadowXShift;
      }
    }
    if (this.cloudMat) {
      this.cloudMat.opacity = 0.5 + frame.ambientInt * 0.4;
      if (this._cloudShadowMat) {
        this._cloudShadowMat.opacity = frame.ambientInt * 0.16;
      }
    }

    // Fireflies: drift + blink at night, invisible by day
    this._fireflyTime += dt;
    if (nightness > 0.01) {
      for (const ff of this._fireflies) {
        const p = ff.sprite.position;

        // Gentle horizontal drift
        p.x += ff.vx * dt;
        p.z += ff.vz * dt;

        // Slow vertical bob — reverse direction at height limits
        p.y += ff.vyDir * 0.28 * dt;
        if (p.y > 11.0) { p.y = 11.0; ff.vyDir = -1; }
        if (p.y < 7.8)  { p.y = 7.8;  ff.vyDir =  1; }

        // Bounce off clearing bounds (fortress interior + surroundings)
        if (p.x < 18) { p.x = 18; ff.vx =  Math.abs(ff.vx); }
        if (p.x > 46) { p.x = 46; ff.vx = -Math.abs(ff.vx); }
        if (p.z < 18) { p.z = 18; ff.vz =  Math.abs(ff.vz); }
        if (p.z > 46) { p.z = 46; ff.vz = -Math.abs(ff.vz); }

        // Blink: half-sine-cycle pulse — squared for a sharper, more insect-like flash
        const raw = Math.max(0, Math.sin(this._fireflyTime * ff.blinkFreq * Math.PI * 2 + ff.phase));
        const glow = raw * raw;
        (ff.sprite.material as THREE.SpriteMaterial).opacity = nightness * 0.9 * glow;
        ff.sprite.scale.setScalar(0.15 + 0.10 * glow);
      }
    } else {
      for (const ff of this._fireflies) {
        (ff.sprite.material as THREE.SpriteMaterial).opacity = 0;
      }
    }
  }

  private _inLavaEffect = false;
  private _biome = "forest";

  /** Set the current biome so the sky colour can be tinted accordingly. */
  setBiome(biome: string): void { this._biome = biome; }

  /** Enable/disable the underwater fog effect. */
  setUnderwaterEffect(inWater: boolean): void {
    if (inWater && !this._underwaterEffect) {
      // Drain rain drops when submerging
      this._rainLensDrops.length = 0;
      this._underwaterVigTime = 0;
    }
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
    this._rainLensIntensity = intensity;
    if (this._underwaterEffect || this._inLavaEffect || intensity < 0.01) return;
    const frame = sampleDayCycle(this._dayTime);
    const rainyZenith = 0x2a3340;
    const rainyHorizon = 0x556677;
    const fogRainy = 0x445566;
    const t = intensity;
    const fogHex = lerpHex(frame.fog, fogRainy, t * 0.7);
    (this.scene.fog as THREE.Fog).color.setHex(fogHex);
    (this.scene.fog as THREE.Fog).far = this._fogFarBase - this._nightFarReduction - t * 70; // rain + night
    this.ambientLight.intensity = frame.ambientInt * (1 - t * 0.4);
    this.cloudMat.opacity = 0.7 + t * 0.25; // clouds thicken
    if (this._cloudShadowMat) {
      this._cloudShadowMat.opacity = frame.ambientInt * 0.16 * Math.max(0, 1 - t * 1.2);
    }
    this.skyZenith.setHex(lerpHex(frame.topSky, rainyZenith, t * 0.7));
    this.skyHorizon.setHex(lerpHex(frame.sky, rainyHorizon, t * 0.7));
  }

  setBlockTexture(tex: THREE.Texture): void { this._blockTex = tex; }

  /** Set the base far fog distance (biome-dependent; 130 default, 165 desert, 115 taiga). */
  setFogFarBase(far: number): void { this._fogFarBase = far; }

  /** Trigger a brief exposure pulse when a wave begins: bright flash → dark dip → recovery. */
  triggerWavePulse(): void { this._wavePulseTimer = 0.55; }

  /** Returns the current wave-pulse exposure multiplier and advances the timer. */
  private _getWavePulseMult(dt: number): number {
    if (this._wavePulseTimer <= 0) return 1.0;
    this._wavePulseTimer = Math.max(0, this._wavePulseTimer - dt);
    const t = 1 - this._wavePulseTimer / 0.55; // 0 → 1 over 550 ms
    // 0–0.25: ramp up to bright flash (×1.5), 0.25–0.45: dip dark (×0.7), 0.45–1.0: recover
    if (t < 0.25) return 1 + (t / 0.25) * 0.5;
    if (t < 0.45) return 1.5 - ((t - 0.25) / 0.20) * 0.8;
    return 0.7 + ((t - 0.45) / 0.55) * 0.3;
  }

  /** Call when hotbar active slot changes. itemId = null for empty hand. */
  updateArmItem(itemId: string | null): void {
    while (this.armGroup.children.length > 1) {
      this.armGroup.remove(this.armGroup.children[1]);
    }
    this._swingWeaponEquipped = false;
    if (!itemId) return;

    const def = ITEMS[itemId];
    if (!def) return;

    this._swingWeaponEquipped =
      (def.category === "weapon" && itemId !== "bow" && itemId !== "crossbow" && def.weaponType !== "gun") ||
      (def.category === "tool" && itemId.includes("_axe"));

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

  private buildBlockCubeMesh(blockId: BlockId): THREE.Mesh {
    const geo = new THREE.BoxGeometry(0.22, 0.22, 0.22);
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z
    const faceNormals = [0, 0, 1, -1, 0, 0];
    const uvAttr = geo.attributes.uv as THREE.BufferAttribute;
    for (let fi = 0; fi < 6; fi++) {
      const { u0, u1, v0, v1 } = blockFaceUV(blockId, faceNormals[fi]);
      const base = fi * 4;
      uvAttr.setXY(base,     u0, v1);
      uvAttr.setXY(base + 1, u1, v1);
      uvAttr.setXY(base + 2, u0, v0);
      uvAttr.setXY(base + 3, u1, v0);
    }
    uvAttr.needsUpdate = true;
    const mat = new THREE.MeshLambertMaterial({ map: this._blockTex! });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(-0.06, 0.24, 0.0);
    mesh.rotation.set(0.3, 0.5, 0.2);
    return mesh;
  }

  private buildItemMesh(itemId: string, category: string, color: number): THREE.Object3D | null {
    if (category === "block") {
      const placesBlock = ITEMS[itemId]?.placesBlock;
      if (this._blockTex && placesBlock) {
        return this.buildBlockCubeMesh(placesBlock);
      }
      const mat = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), mat);
      mesh.position.set(-0.06, 0.24, 0.0);
      mesh.rotation.set(0.3, 0.5, 0.2);
      return mesh;
    }
    if (category === "food" || category === "material" || category === "armor" || category === "potion") {
      return this.buildItemSprite(itemId, color);
    }
    if (category === "weapon") {
      if (itemId === "bow")       return this.buildBowMesh();
      if (itemId === "crossbow")  return this.buildCrossbowMesh();
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

  private buildItemSprite(itemId: string, color: number): THREE.Object3D {
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, S, S);

    const hasArt = SceneManager.drawItemPixelArt(ctx, itemId, S, color);
    if (!hasArt) {
      // fallback: plain color quad
      const r = (color >> 16) & 0xff, g = (color >> 8) & 0xff, b = color & 0xff;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(2, 2, S - 4, S - 4);
      ctx.fillStyle = `rgba(255,255,255,0.25)`;
      ctx.fillRect(2, 2, S - 4, 2);
      ctx.fillRect(2, 2, 2, S - 4);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;

    const mat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, alphaTest: 0.05,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.24), mat);
    mesh.position.set(-0.04, 0.20, 0.0);
    // Slight tilt toward the player like a held card
    mesh.rotation.set(0.15, 0.35, 0.10);
    return mesh;
  }

  private static drawItemPixelArt(ctx: CanvasRenderingContext2D, itemId: string, _S: number, color = 0xffffff): boolean {
    const p = (x: number, y: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1); };
    const rect = (x: number, y: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
    const shade = (x: number, y: number, w: number, h: number, base: [number,number,number], v: number) => {
      const [r,g,b] = base;
      const d = (v - 0.5) * 60;
      ctx.fillStyle = `rgb(${Math.min(255,(r+d)|0)},${Math.min(255,(g+d)|0)},${Math.min(255,(b+d)|0)})`;
      ctx.fillRect(x, y, w, h);
    };

    switch (itemId) {
      case "apple": {
        // Red apple body
        rect(5, 4, 6, 1, "#cc1111"); rect(4, 5, 8, 5, "#dd2222"); rect(5, 10, 6, 1, "#cc1111");
        rect(5, 4, 6, 1, "#ee3333"); // highlight row
        p(5,5,"#ff4444"); p(6,5,"#ff5555");
        // Stem
        rect(7, 2, 2, 2, "#4a2a0a");
        // Leaf
        rect(9, 2, 2, 1, "#228822"); rect(9, 1, 1, 1, "#228822");
        // Dark shadow side
        rect(10, 5, 2, 5, "#aa1111");
        return true;
      }
      case "bread": {
        // Golden-brown loaf shape
        rect(3, 7, 10, 1, "#8b5c20"); // bottom
        rect(2, 5, 12, 2, "#c8860a"); // lower body
        rect(3, 3, 10, 2, "#e8a020"); // upper body
        rect(4, 2, 8, 1, "#d4900a"); // top rounded
        rect(5, 1, 6, 1, "#c07800"); // very top
        // Score lines
        rect(7, 3, 1, 4, "#a06808");
        // Highlights
        rect(4, 3, 3, 1, "#f0c040"); rect(4, 2, 2, 1, "#f4cc44");
        // Crust
        rect(2, 7, 12, 1, "#7a4a10");
        return true;
      }
      case "raw_beef":
      case "raw_porkchop":
      case "raw_chicken": {
        const isChicken = itemId === "raw_chicken";
        const base: [number,number,number] = isChicken ? [230, 180, 140] : [200, 100, 80];
        // Irregular meat shape
        rect(3, 4, 10, 7, `rgb(${base[0]},${base[1]},${base[2]})`);
        shade(3, 4, 5, 3, base, 0.7); shade(3, 7, 10, 2, base, 1.3);
        rect(4, 3, 8, 1, `rgb(${base[0]-20},${base[1]-10},${base[2]-10})`);
        rect(4, 11, 8, 1, `rgb(${base[0]-30},${base[1]-20},${base[2]-20})`);
        // Fat/marbling
        rect(6, 5, 2, 2, "#ffddcc");
        return true;
      }
      case "cooked_beef":
      case "cooked_porkchop":
      case "cooked_chicken": {
        // Darker browned meat
        const base: [number,number,number] = [140, 70, 30];
        rect(3, 4, 10, 7, `rgb(${base[0]},${base[1]},${base[2]})`);
        shade(3, 4, 5, 3, base, 0.75); shade(3, 7, 10, 2, base, 1.3);
        rect(4, 3, 8, 1, "#8b4010"); rect(4, 11, 8, 1, "#5a2a08");
        // Char marks
        rect(5, 6, 3, 1, "#1a0800"); rect(8, 8, 3, 1, "#1a0800");
        return true;
      }
      case "iron_ingot": {
        // Silver trapezoid
        rect(4, 3, 8, 2, "#cccccc"); // top
        rect(3, 5, 10, 6, "#aaaaaa"); // body
        rect(3, 11, 10, 2, "#888888"); // bottom/shadow
        // Highlight
        rect(4, 5, 3, 2, "#dddddd"); rect(4, 3, 3, 1, "#eeeeee");
        // Side sheen
        rect(11, 6, 2, 4, "#666666");
        return true;
      }
      case "gold_ingot": {
        rect(4, 3, 8, 2, "#ffee44"); // top
        rect(3, 5, 10, 6, "#ddaa00"); // body
        rect(3, 11, 10, 2, "#aa7700"); // bottom
        rect(4, 5, 3, 2, "#ffee88"); rect(4, 3, 3, 1, "#ffff88");
        rect(11, 6, 2, 4, "#886600");
        return true;
      }
      case "diamond": {
        // Cyan diamond gem shape
        rect(7, 2, 2, 1, "#66ffff"); // tip
        rect(5, 3, 6, 2, "#44eeff"); rect(3, 5, 10, 4, "#22ccee");
        rect(4, 9, 8, 2, "#11aabb"); rect(5, 11, 6, 1, "#0099aa");
        rect(7, 12, 2, 1, "#008899"); // bottom point
        // Facet highlights
        rect(5, 3, 2, 1, "#aaffff"); rect(5, 5, 2, 2, "#88eeff");
        p(12,5,"#005566"); p(3,9,"#001122");
        return true;
      }
      case "coal_ore": {
        // Dark coal chunk - rough shape
        rect(4, 3, 8, 10, "#222222");
        rect(3, 5, 10, 6, "#111111");
        // Coal veins/highlights
        p(5,5,"#333333"); p(7,4,"#2a2a2a"); p(10,8,"#2a2a2a");
        p(6,10,"#333333"); p(9,6,"#333333");
        // Shiny edges
        rect(4, 3, 1, 2, "#444444"); rect(4, 3, 4, 1, "#444444");
        return true;
      }
      case "iron_ore": {
        // Stone with orange-brown flecks
        rect(3, 3, 10, 10, "#888888");
        rect(5, 2, 6, 1, "#777777"); rect(3, 12, 10, 1, "#666666");
        // Ore flecks
        rect(5, 5, 2, 2, "#cc7744"); p(5,5,"#dd8855");
        rect(9, 8, 2, 2, "#cc7744"); p(9,8,"#dd8855");
        rect(7, 4, 1, 1, "#bb6633");
        // Stone noise
        p(4,6,"#999999"); p(10,5,"#777777"); p(6,10,"#aaaaaa");
        return true;
      }
      case "gold_ore": {
        rect(3, 3, 10, 10, "#888888");
        rect(5, 2, 6, 1, "#777777"); rect(3, 12, 10, 1, "#666666");
        rect(5, 5, 2, 2, "#ddaa00"); p(5,5,"#eebb22");
        rect(9, 8, 2, 2, "#ddaa00"); p(9,8,"#eebb22");
        rect(7, 4, 1, 1, "#cc9900");
        p(4,6,"#999999"); p(10,5,"#777777");
        return true;
      }
      case "diamond_ore": {
        rect(3, 3, 10, 10, "#888888");
        rect(5, 5, 1, 2, "#00cccc"); p(6,6,"#44ffff");
        rect(5, 6, 1, 1, "#00cccc"); p(5,5,"#55ffff");
        rect(9, 7, 1, 2, "#00cccc"); p(9,7,"#44ffff");
        p(4,6,"#999999"); p(10,9,"#777777");
        return true;
      }
      case "wheat": {
        // Wheat stalk with grains
        rect(7, 1, 2, 12, "#c8a030"); // stalk
        // Grain heads on sides
        for (let i = 0; i < 5; i++) {
          const y = 2 + i * 2;
          rect(4, y, 3, 1, "#e8c840"); // left grain
          rect(9, y+1, 3, 1, "#e8c840"); // right grain
        }
        p(7,13,"#c8a030"); // bottom
        return true;
      }
      case "wheat_seeds": {
        // Small seed dots
        rect(4, 5, 2, 2, "#8b8b3a"); rect(8, 4, 2, 2, "#8b8b3a");
        rect(5, 9, 2, 2, "#8b8b3a"); rect(10, 8, 2, 2, "#8b8b3a");
        rect(3, 11, 2, 2, "#8b8b3a");
        p(5,5,"#aabb44"); p(9,4,"#aabb44"); p(6,9,"#aabb44");
        return true;
      }
      case "flint": {
        // Dark gray chip with sharp edges
        rect(5, 3, 6, 8, "#555555");
        rect(4, 5, 8, 5, "#444444");
        rect(6, 2, 4, 2, "#666666"); // top edge
        rect(6, 11, 4, 2, "#333333"); // bottom
        // Sharp highlight
        rect(5, 3, 1, 4, "#777777"); rect(5, 3, 3, 1, "#777777");
        return true;
      }
      case "stick": {
        // Diagonal brown stick
        rect(10, 2, 2, 2, "#8b6914"); rect(9, 4, 2, 2, "#7a5a10");
        rect(8, 6, 2, 2, "#8b6914"); rect(7, 8, 2, 2, "#7a5a10");
        rect(6, 10, 2, 2, "#8b6914"); rect(5, 12, 2, 2, "#7a5a10");
        // Highlight
        p(10,2,"#c8a060"); p(9,4,"#c8a060");
        return true;
      }
      case "arrow_item": {
        // Arrow: head + shaft + fletch
        rect(11, 4, 2, 3, "#888888"); // metal head
        p(12,3,"#999999"); p(11,3,"#888888"); // tip
        rect(4, 5, 7, 1, "#c8a060"); // shaft
        rect(4, 6, 7, 1, "#a07040"); // shaft shadow
        // Fletch
        rect(2, 4, 2, 1, "#dd4444"); rect(2, 6, 2, 1, "#dd4444");
        rect(3, 5, 1, 1, "#ff5555");
        return true;
      }
      case "paper": {
        rect(3, 2, 10, 12, "#f0eedd");
        rect(3, 2, 10, 1, "#e0ddc8"); // top edge
        rect(3, 2, 1, 12, "#e0ddc8"); // left edge
        // Ruled lines
        for (let y = 5; y < 13; y += 2) rect(5, y, 7, 1, "#d8d5c0");
        return true;
      }
      case "book": {
        rect(3, 2, 10, 12, "#c8a060"); // cover
        rect(3, 2, 1, 12, "#8b5a20"); // spine
        rect(4, 3, 9, 10, "#f0e8d0"); // pages
        // Page lines
        for (let y = 5; y < 13; y += 2) rect(5, y, 7, 1, "#d8d0b8");
        rect(3, 14, 10, 1, "#a07030"); // bottom
        return true;
      }

      // ---- Potions (bottle silhouette, color-coded by effect) ----
      case "potion_healing":
      case "potion_regeneration":
      case "potion_speed":
      case "potion_strength":
      case "potion_fire_resistance":
      case "potion_slowness":
      case "potion_night_vision":
      case "potion_haste": {
        const pr = (color >> 16) & 0xff, pg = (color >> 8) & 0xff, pb = color & 0xff;
        const lighter = `rgb(${Math.min(255,pr+60)},${Math.min(255,pg+60)},${Math.min(255,pb+60)})`;
        const darker  = `rgb(${Math.max(0,pr-40)},${Math.max(0,pg-40)},${Math.max(0,pb-40)})`;
        const base    = `rgb(${pr},${pg},${pb})`;
        // Cork / stopper
        rect(6, 1, 4, 2, "#8b6914");
        rect(7, 0, 2, 1, "#6b4c10");
        // Neck
        rect(6, 3, 4, 2, "#cccccc");
        // Bottle body (rounded trapezoid)
        rect(4, 5, 8, 1, base);
        rect(3, 6, 10, 6, base);
        rect(4, 12, 8, 1, base);
        rect(5, 13, 6, 1, darker);
        // Liquid highlight
        rect(5, 6, 3, 4, lighter);
        p(5, 6, "#ffffff"); p(6, 6, "rgba(255,255,255,0.7)");
        // Shadow side
        rect(11, 6, 2, 6, darker);
        return true;
      }

      // ---- Misc materials ----
      case "wool": {
        // Fluffy white square with wavy texture
        rect(2, 2, 12, 12, "#eeeeee");
        // Wavy texture lines
        for (let wy = 3; wy < 13; wy += 3) {
          for (let wx2 = 2; wx2 < 14; wx2++) {
            const cy2 = wy + Math.round(Math.sin(wx2 * 0.9 + wy * 0.5) * 0.5);
            p(wx2, cy2, "#cccccc");
          }
        }
        // Highlight
        rect(2, 2, 12, 1, "#ffffff"); rect(2, 2, 1, 12, "#ffffff");
        return true;
      }
      case "gunpowder": {
        // Dark gray heap with grain dots
        rect(4, 4, 8, 8, "#444444");
        rect(3, 6, 10, 4, "#333333");
        rect(5, 3, 6, 10, "#3a3a3a");
        // Grain dots
        const gpColors = ["#555555","#2a2a2a","#4a4a4a","#606060"];
        for (let gi = 0; gi < 12; gi++) {
          const gx = 3 + (gi * 7 + gi * gi * 3) % 10;
          const gy = 3 + (gi * 11 + gi * 5) % 10;
          p(gx, gy, gpColors[gi % 4]);
        }
        // Spark highlight at top
        p(7, 3, "#ddcc44"); p(8, 2, "#ffee88"); p(9, 3, "#ddcc44");
        return true;
      }
      case "bullet": {
        // Small silver cylindrical bullet
        rect(6, 2, 4, 1, "#dddddd"); // tip
        rect(5, 3, 6, 7, "#aaaaaa"); // body
        rect(5, 10, 6, 2, "#888888"); // base
        // Highlight
        rect(6, 3, 2, 5, "#eeeeee");
        p(6, 3, "#ffffff");
        // Casing seam
        rect(5, 9, 6, 1, "#999999");
        return true;
      }
      case "glass_bottle": {
        // Clear bottle (glassy)
        rect(6, 3, 4, 2, "#ccddee"); // neck
        rect(7, 1, 2, 2, "#aabbcc"); // mouth
        rect(4, 5, 8, 1, "#aaccee");
        rect(3, 6, 10, 5, "#99bbdd");
        rect(4, 11, 8, 1, "#aaccee");
        rect(5, 12, 6, 1, "#88aacc");
        // Highlight (glass shine)
        rect(5, 6, 3, 3, "#ddeeff");
        p(5, 6, "#ffffff"); p(6, 6, "#eef8ff");
        return true;
      }
      case "nether_wart": {
        // Bumpy red fungus
        rect(4, 8, 8, 4, "#881111");
        rect(3, 9, 10, 3, "#aa1111");
        rect(4, 5, 3, 3, "#cc2222"); // left knob
        rect(9, 6, 3, 4, "#cc2222"); // right knob
        rect(6, 4, 4, 2, "#dd3333"); // center top
        // Highlight dots
        p(5, 5, "#ff4444"); p(10, 7, "#ff4444"); p(7, 4, "#ff5555");
        // Stem
        rect(7, 11, 2, 3, "#551100");
        return true;
      }

      // ---- Armor items (each slot has a recognisable silhouette) ----
      case "gold_helmet":
      case "iron_helmet":
      case "diamond_helmet": {
        const hr = (color >> 16) & 0xff, hg = (color >> 8) & 0xff, hb = color & 0xff;
        const hBase = `rgb(${hr},${hg},${hb})`;
        const hDark = `rgb(${Math.max(0,hr-40)},${Math.max(0,hg-40)},${Math.max(0,hb-40)})`;
        const hLight= `rgb(${Math.min(255,hr+50)},${Math.min(255,hg+50)},${Math.min(255,hb+50)})`;
        // Crown
        rect(3, 3, 10, 5, hBase);
        rect(2, 5, 12, 3, hBase);
        rect(2, 8, 12, 2, hDark); // cheek guards
        // Visor slit
        rect(4, 7, 8, 1, "#111111");
        // Highlights
        rect(3, 3, 8, 1, hLight);
        rect(3, 3, 1, 5, hLight);
        return true;
      }
      case "gold_chestplate":
      case "iron_chestplate":
      case "diamond_chestplate": {
        const cr = (color >> 16) & 0xff, cg = (color >> 8) & 0xff, cb = color & 0xff;
        const cBase = `rgb(${cr},${cg},${cb})`;
        const cDark = `rgb(${Math.max(0,cr-40)},${Math.max(0,cg-40)},${Math.max(0,cb-40)})`;
        const cLight= `rgb(${Math.min(255,cr+50)},${Math.min(255,cg+50)},${Math.min(255,cb+50)})`;
        // Shoulder pads
        rect(2, 2, 4, 3, cBase); rect(10, 2, 4, 3, cBase);
        // Torso plate
        rect(3, 5, 10, 9, cBase);
        rect(3, 14, 10, 1, cDark);
        // Center line
        rect(7, 5, 2, 9, cDark);
        // Rivet dots at shoulders
        p(4, 3, cDark); p(11, 3, cDark);
        // Highlight
        rect(3, 5, 4, 1, cLight); rect(3, 5, 1, 9, cLight);
        return true;
      }
      case "gold_leggings":
      case "iron_leggings":
      case "diamond_leggings": {
        const lr = (color >> 16) & 0xff, lg = (color >> 8) & 0xff, lb = color & 0xff;
        const lBase = `rgb(${lr},${lg},${lb})`;
        const lDark = `rgb(${Math.max(0,lr-40)},${Math.max(0,lg-40)},${Math.max(0,lb-40)})`;
        const lLight= `rgb(${Math.min(255,lr+50)},${Math.min(255,lg+50)},${Math.min(255,lb+50)})`;
        // Waist band
        rect(2, 2, 12, 3, lBase);
        // Left leg
        rect(2, 5, 5, 9, lBase);
        rect(2, 14, 5, 1, lDark);
        // Right leg
        rect(9, 5, 5, 9, lBase);
        rect(9, 14, 5, 1, lDark);
        // Gap between legs
        rect(7, 5, 2, 3, "#00000000");
        // Highlights
        rect(2, 2, 12, 1, lLight); rect(2, 5, 1, 9, lLight);
        return true;
      }
      case "gold_boots":
      case "iron_boots":
      case "diamond_boots": {
        const br = (color >> 16) & 0xff, bg2 = (color >> 8) & 0xff, bb = color & 0xff;
        const bBase = `rgb(${br},${bg2},${bb})`;
        const bDark = `rgb(${Math.max(0,br-40)},${Math.max(0,bg2-40)},${Math.max(0,bb-40)})`;
        const bLight= `rgb(${Math.min(255,br+50)},${Math.min(255,bg2+50)},${Math.min(255,bb+50)})`;
        // Ankle cuff
        rect(3, 3, 10, 3, bBase);
        // Boot body
        rect(3, 6, 10, 6, bBase);
        // Toe cap — extends forward
        rect(3, 12, 11, 3, bBase);
        // Sole (dark)
        rect(3, 15, 11, 1, bDark);
        // Highlight
        rect(3, 3, 8, 1, bLight); rect(3, 3, 1, 6, bLight);
        return true;
      }

      default:
        return false;
    }
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

  private buildCrossbowMesh(): THREE.Object3D {
    const g = new THREE.Group();
    const woodMat   = new THREE.MeshLambertMaterial({ color: 0x5c3a1a });
    const darkWood  = new THREE.MeshLambertMaterial({ color: 0x3d2410 });
    const metalMat  = new THREE.MeshLambertMaterial({ color: 0x444444 });
    const stringMat = new THREE.MeshLambertMaterial({ color: 0xe8e0cc });
    const b = (w: number, h: number, d: number, mat: THREE.Material) =>
      new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);

    // Tiller (main body stock, pointing forward into screen in -z)
    const tiller = b(0.09, 0.065, 0.34, woodMat);
    tiller.position.set(0, 0.28, -0.07);
    g.add(tiller);

    // Limb (horizontal bow piece at front — the T-bar)
    const limb = b(0.30, 0.042, 0.042, darkWood);
    limb.position.set(0, 0.28, -0.22);
    g.add(limb);

    // Metal rail/prod channel on top of tiller
    const rail = b(0.038, 0.026, 0.26, metalMat);
    rail.position.set(0, 0.317, -0.09);
    g.add(rail);

    // Prod nock tips (metal end caps on limb tips)
    const tipL = b(0.018, 0.058, 0.018, metalMat);
    tipL.position.set(-0.14, 0.28, -0.22);
    g.add(tipL);
    const tipR = b(0.018, 0.058, 0.018, metalMat);
    tipR.position.set( 0.14, 0.28, -0.22);
    g.add(tipR);

    // Bowstring: two diagonal segments from limb tips to center front
    const strL = b(0.006, 0.006, 0.17, stringMat);
    strL.position.set(-0.075, 0.28, -0.145);
    strL.rotation.y = 0.42;
    g.add(strL);
    const strR = b(0.006, 0.006, 0.17, stringMat);
    strR.position.set( 0.075, 0.28, -0.145);
    strR.rotation.y = -0.42;
    g.add(strR);

    // Trigger housing / pistol grip
    const grip = b(0.070, 0.15, 0.068, woodMat);
    grip.position.set(0, 0.18, 0.06);
    grip.rotation.x = 0.18;
    g.add(grip);

    // Trigger guard (thin metal loop)
    const guard = b(0.013, 0.06, 0.04, metalMat);
    guard.position.set(0, 0.21, 0.0);
    guard.rotation.x = 0.3;
    g.add(guard);

    // Butt plate
    const butt = b(0.09, 0.085, 0.055, darkWood);
    butt.position.set(0, 0.256, 0.20);
    g.add(butt);

    // Trigger lever
    const trigger = b(0.012, 0.07, 0.016, metalMat);
    trigger.position.set(0, 0.215, 0.02);
    trigger.rotation.x = 0.4;
    g.add(trigger);

    // Nocked bolt — dark shaft, grey arrowhead, red-orange fletching
    const boltShaftMat = new THREE.MeshLambertMaterial({ color: 0x2a1a08 });
    const boltTipMat   = new THREE.MeshLambertMaterial({ color: 0x666666 });
    const fletchMat    = new THREE.MeshLambertMaterial({ color: 0xcc4422 });
    const boltShaft = b(0.012, 0.012, 0.190, boltShaftMat);
    boltShaft.position.set(0, 0.317, -0.082);
    g.add(boltShaft);
    const boltTip = b(0.016, 0.016, 0.022, boltTipMat);
    boltTip.position.set(0, 0.317, -0.179);
    g.add(boltTip);
    const fletchH = b(0.030, 0.007, 0.038, fletchMat);
    fletchH.position.set(0, 0.317, 0.012);
    g.add(fletchH);
    const fletchV = b(0.007, 0.030, 0.038, fletchMat);
    fletchV.position.set(0, 0.317, 0.012);
    g.add(fletchV);

    g.position.set(0.02, 0.06, 0.0);
    return g;
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
        zenith:      { value: this.skyZenith },
        horizon:     { value: this.skyHorizon },
        hazeColor:   { value: this._skyHazeColor },
        hazeOpacity: { value: this._skyHazeOpacity },
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
        uniform vec3 hazeColor;
        uniform float hazeOpacity;
        varying float vH;
        void main() {
          // Base gradient: horizon to zenith with power curve
          float t = smoothstep(-0.05, 0.70, vH);
          t = t * t;
          vec3 sky = mix(horizon, zenith, t);
          // Atmospheric horizon haze: narrow Gaussian band at vH=0
          float hazeBand = exp(-abs(vH) * 18.0) * hazeOpacity;
          sky = mix(sky, hazeColor, clamp(hazeBand, 0.0, 0.85));
          gl_FragColor = vec4(sky, 1.0);
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
      const mat = new THREE.PointsMaterial({ color: 0xffffff, size: baseSize, transparent: true, opacity: 0, fog: false, depthWrite: false });
      const pts = new THREE.Points(geo, mat);
      this.scene.add(pts);
      groups.push(pts);
    }
    return groups;
  }

  private buildMilkyWay(): THREE.Points {
    // Dense star band arcing across the upper hemisphere — a tilted galactic plane.
    // Uses a sinusoidal-latitude formula which is the spherical-coords projection
    // of a tilted great circle: phi_center = A + B*cos(theta).
    const COUNT = 800;
    const r = 155; // slightly inside star sphere (r=160)

    // Crude 3-sample Gaussian approximation (mean=0, σ≈0.58, clipped)
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) * 0.72;

    const positions = new Float32Array(COUNT * 3);
    const colors    = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;

      // Sinusoidal band: phi oscillates ±(π/4) around a base of π/3 (~60° from zenith).
      // Result: band sweeps from near-zenith on one side to near-horizon on the other.
      const phi_center = Math.PI / 3 + (Math.PI / 4) * Math.cos(theta);
      const phi = Math.max(0.03, Math.min(Math.PI * 0.48, phi_center + gauss() * 0.11));

      const x = r * Math.sin(phi) * Math.cos(theta) + 32;
      const y = r * Math.cos(phi);                         // always ≥ 0 (upper hemisphere)
      const z = r * Math.sin(phi) * Math.sin(theta) + 32;

      positions[i * 3]     = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Colour: warm toward the galactic-centre arc, cool toward the rim.
      // phi_center near 0 = galactic centre (high overhead) → warm yellow-white.
      // phi_center near π/2 = galactic rim → cool blue-white.
      const warmth  = Math.max(0, 1 - phi_center / (Math.PI / 2));
      const bright  = 0.45 + Math.random() * 0.55;
      colors[i * 3]     = bright;
      colors[i * 3 + 1] = bright * (0.88 + warmth * 0.12);
      colors[i * 3 + 2] = bright * (0.78 + (1 - warmth) * 0.22);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors,    3));

    const mat = new THREE.PointsMaterial({
      size:         0.28,
      transparent:  true,
      opacity:      0,
      vertexColors: true,
      blending:     THREE.AdditiveBlending,
      depthWrite:   false,
      fog:          false,
    });

    const pts = new THREE.Points(geo, mat);
    this.scene.add(pts);
    return pts;
  }

  private buildMoon(): [THREE.Mesh, THREE.Mesh, THREE.Mesh] {
    const geo = new THREE.PlaneGeometry(14, 14);
    const tex = SceneManager.makeMoonTexture();
    const mat = new THREE.MeshBasicMaterial({
      map: tex, transparent: true, opacity: 0, fog: false,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);

    // Shadow disc: same radius as moon, slides to produce crescent phases over 8 days.
    const shadowGeo = new THREE.CircleGeometry(7.3, 32);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x040408, transparent: true, opacity: 0,
      fog: false, side: THREE.DoubleSide, depthWrite: false,
    });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    this.scene.add(shadow);

    // Soft corona glow ring — additive blending, blue-white, strongest at full moon.
    const glowGeo = new THREE.RingGeometry(7.5, 22, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xaaccff, transparent: true, opacity: 0,
      fog: false, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    this.scene.add(glow);

    return [mesh, shadow, glow];
  }

  private static makeMoonTexture(): THREE.CanvasTexture {
    const S = 64;
    const canvas = document.createElement("canvas");
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;

    // Seed-based RNG for deterministic craters
    let seed = 4447;
    const rand = () => { seed = (seed * 1664525 + 1013904223) & 0x7fffffff; return seed / 0x7fffffff; };

    const cx = S / 2, cy = S / 2, R = S / 2 - 1;

    // Base moon disc — off-white
    ctx.clearRect(0, 0, S, S);
    const baseGrad = ctx.createRadialGradient(cx - 4, cy - 4, R * 0.1, cx, cy, R);
    baseGrad.addColorStop(0, "rgb(240,240,230)");
    baseGrad.addColorStop(0.7, "rgb(220,220,205)");
    baseGrad.addColorStop(1, "rgb(180,180,168)");
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = baseGrad; ctx.fill();

    // Maria (dark lunar seas) — large irregular patches
    const mariaSpots = [
      { x: 20, y: 22, rx: 12, ry: 9 },
      { x: 38, y: 28, rx: 8,  ry: 6 },
      { x: 26, y: 42, rx: 7,  ry: 5 },
      { x: 44, y: 44, rx: 5,  ry: 4 },
    ];
    for (const m of mariaSpots) {
      ctx.save();
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.ellipse(m.x, m.y, m.rx, m.ry, rand() * Math.PI, 0, Math.PI * 2);
      ctx.fillStyle = "rgb(140,140,128)";
      ctx.fill();
      ctx.restore();
    }

    // Surface noise — per-pixel grey variation
    const imageData = ctx.getImageData(0, 0, S, S);
    for (let py = 0; py < S; py++) {
      for (let px = 0; px < S; px++) {
        const dx = px - cx, dy = py - cy;
        if (dx * dx + dy * dy > R * R) continue;
        const i = (py * S + px) * 4;
        const v = (rand() - 0.5) * 10;
        imageData.data[i]     = Math.max(0, Math.min(255, imageData.data[i]     + v));
        imageData.data[i + 1] = Math.max(0, Math.min(255, imageData.data[i + 1] + v));
        imageData.data[i + 2] = Math.max(0, Math.min(255, imageData.data[i + 2] + v));
      }
    }
    ctx.putImageData(imageData, 0, 0);

    // Craters — dark pit with light rim
    const craters = [
      { x: 14, y: 18, r: 4.5 }, { x: 44, y: 14, r: 3.5 }, { x: 32, y: 48, r: 3.0 },
      { x: 50, y: 36, r: 2.5 }, { x: 22, y: 36, r: 2.0 }, { x: 38, y: 52, r: 1.8 },
      { x: 16, y: 50, r: 1.5 }, { x: 54, y: 54, r: 2.2 }, { x: 42, y: 20, r: 1.6 },
      { x: 28, y: 14, r: 1.4 }, { x: 12, y: 38, r: 1.3 }, { x: 58, y: 24, r: 1.2 },
    ];
    for (const cr of craters) {
      // Shadow pit
      ctx.beginPath(); ctx.arc(cr.x, cr.y, cr.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,100,90,0.55)"; ctx.fill();
      // Bright rim (upper-left highlight)
      ctx.beginPath(); ctx.arc(cr.x - cr.r * 0.2, cr.y - cr.r * 0.2, cr.r * 1.05, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(248,248,235,0.5)"; ctx.lineWidth = 0.8; ctx.stroke();
    }

    // Limb darkening — darker toward the edge
    const limbGrad = ctx.createRadialGradient(cx, cy, R * 0.55, cx, cy, R);
    limbGrad.addColorStop(0, "rgba(0,0,0,0)");
    limbGrad.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = limbGrad; ctx.fill();

    // Shadow half — varies per phase (shadow moves left→right over 8 days)
    // Phase 0 = full moon (no shadow), Phase 4 = new moon (full shadow)
    // Use totalDays progression — stored externally; apply a fixed half-shadow for now
    // (slight crescent look: shadow covers rightmost 30% of disc)
    const shadowGrad = ctx.createLinearGradient(cx - R, cy, cx + R, cy);
    shadowGrad.addColorStop(0, "rgba(0,0,0,0)");
    shadowGrad.addColorStop(0.62, "rgba(0,0,0,0)");
    shadowGrad.addColorStop(0.82, "rgba(0,0,0,0.5)");
    shadowGrad.addColorStop(1, "rgba(0,0,0,0.88)");
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = shadowGrad; ctx.fill();

    return new THREE.CanvasTexture(canvas);
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
      color: 0xfafafa, transparent: true, opacity: 0.88,
    });

    // Shared soft-edge alphaMap for all cloud shadow planes
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = shadowCanvas.height = 64;
    const sctx = shadowCanvas.getContext("2d")!;
    const sgrad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    sgrad.addColorStop(0,    "rgba(255,255,255,0.92)");
    sgrad.addColorStop(0.45, "rgba(255,255,255,0.65)");
    sgrad.addColorStop(0.78, "rgba(255,255,255,0.22)");
    sgrad.addColorStop(1,    "rgba(0,0,0,0)");
    sctx.fillStyle = sgrad;
    sctx.fillRect(0, 0, 64, 64);
    this._cloudShadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.0,
      depthWrite: false,
      alphaMap: new THREE.CanvasTexture(shadowCanvas),
    });

    // Expanded cloud positions — more coverage across the map, including far edges
    const positions: [number, number][] = [
      [10, 8], [28, 5], [48, 12], [15, 42], [45, 38],
      [5, 22], [38, 25], [55, 50], [22, 55], [50, 20],
      [35, 14], [18, 48], [52, 32], [8, 36], [42, 58],
      [-8, 14], [62, 8], [32, 70], [-4, 50], [68, 40],
      [25, -5], [55, 65], [0, 35],
    ];
    // Simple hash for deterministic variety
    const hash = (n: number) => { let x = (n * 2654435761) >>> 0; x ^= x >> 16; return x / 0xffffffff; };
    for (let ci = 0; ci < positions.length; ci++) {
      const [cx, cz] = positions[ci];
      const w = 5 + (cx & 0xff) % 7;
      const d = 3 + (cz & 0xff) % 5;
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

      // Optional center top puff on larger clouds
      if (hash(ci * 13 + 7) > 0.45 && w > 8) {
        const puffC = new THREE.Mesh(
          new THREE.BoxGeometry(w * 0.35, 1.55, d * 0.5), this.cloudMat,
        );
        puffC.position.set(w * 0.03, 1.1, 0);
        cloud.add(puffC);
      }

      cloud.position.set(cx, 22, cz);
      this.scene.add(cloud);
      this.cloudMeshes.push(cloud);

      // Ground shadow — soft ellipse at terrain surface directly below the cloud
      const shadowW = w * 1.8;
      const shadowD = d * 1.8;
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(shadowW, shadowD),
        this._cloudShadowMat,
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.renderOrder = 1;
      shadow.position.set(cx, 7.05, cz);
      this.scene.add(shadow);
      this.cloudShadowMeshes.push(shadow);
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
    this._updateRainLens(dt);
  }

  private renderArm(dt: number): void {
    if (this.armSwingTimer > 0) this.armSwingTimer = Math.max(0, this.armSwingTimer - dt);

    const worldPos  = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    this.camera.getWorldPosition(worldPos);
    this.camera.getWorldQuaternion(worldQuat);

    // Walk-bob: detect XZ movement speed, advance bob timer, compute offsets
    const camSpeed = worldPos.distanceTo(this._armBobLastPos) / Math.max(dt, 0.001);
    this._armBobLastPos.copy(worldPos);
    this._armBobSpeed += (Math.min(camSpeed, 8) - this._armBobSpeed) * Math.min(1, dt * 12);
    if (this._armBobSpeed > 0.15) this._armBobTime += dt * 7.8;
    const bobAmt = Math.min(1, this._armBobSpeed * 0.16);

    // Swing: rotate arm forward and back over the swing duration
    const swingPct = this.armSwingTimer / this.ARM_SWING_DURATION;
    const swingAngle = Math.sin(swingPct * Math.PI) * 1.2; // 1.2 rad ≈ 69 degrees

    // Bob fades out during swings so they don't fight each other
    const activeBob = bobAmt * (1 - swingPct);
    const bobY   = Math.sin(this._armBobTime) * 0.022 * activeBob;
    const bobX   = Math.cos(this._armBobTime * 0.5) * 0.009 * activeBob;
    const bobTilt = Math.cos(this._armBobTime * 0.5) * 0.04 * activeBob; // subtle roll

    const localOffset = new THREE.Vector3(0.38 + bobX, -0.52 + swingPct * 0.08 + bobY, -0.75);
    localOffset.applyQuaternion(worldQuat);
    this.armGroup.position.copy(worldPos).add(localOffset);

    const tiltQ = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0.25 - swingAngle, -0.2, 0.12 + bobTilt, "YXZ"),
    );
    this.armGroup.quaternion.copy(worldQuat).multiply(tiltQ);

    // Swing arc: translucent blade-trail plane, peaks at mid-swing
    const arcMat = this._swingArcMesh.material as THREE.MeshBasicMaterial;
    if (this._swingWeaponEquipped && this.armSwingTimer > 0) {
      arcMat.opacity = Math.sin(swingPct * Math.PI) * 0.45;
      const arcOffset = new THREE.Vector3(0.22, -0.10, -0.80);
      arcOffset.applyQuaternion(worldQuat);
      this._swingArcMesh.position.copy(worldPos).add(arcOffset);
      this._swingArcMesh.quaternion.copy(worldQuat).multiply(
        new THREE.Quaternion().setFromEuler(new THREE.Euler(0.25, 0.0, 0.30)),
      );
    } else {
      arcMat.opacity = 0;
    }

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

  /**
   * Position the blob shadow under the player.
   * groundSurfY  — Y-world of the top face of the block directly below the player.
   * heightAbove  — player.position.y minus groundSurfY (0 = standing, positive = airborne).
   */
  updatePlayerShadow(px: number, groundSurfY: number, pz: number, heightAbove: number): void {
    if (heightAbove < 0 || heightAbove > 6) {
      this._playerShadowBlob.visible = false;
      return;
    }
    const t = Math.max(0, 1.0 - heightAbove / 5.5);
    this._playerShadowBlob.visible = true;
    this._playerShadowBlob.position.set(px, groundSurfY + 0.03, pz);
    const s = 0.65 + t * 0.35;
    this._playerShadowBlob.scale.set(s, 1, s);
    (this._playerShadowBlob.material as THREE.MeshBasicMaterial).opacity = t * 0.30;
  }

  /** Hide the player shadow (e.g., during title screen). */
  hidePlayerShadow(): void {
    this._playerShadowBlob.visible = false;
  }

  private buildFireflies(): void {
    // Shared glow texture: soft chartreuse radial gradient
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 24;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(12, 12, 0, 12, 12, 12);
    grad.addColorStop(0,    "rgba(220,255,80,1)");
    grad.addColorStop(0.30, "rgba(160,240,40,0.7)");
    grad.addColorStop(0.65, "rgba(60,180,10,0.2)");
    grad.addColorStop(1,    "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 24, 24);
    const tex = new THREE.CanvasTexture(canvas);

    for (let i = 0; i < 14; i++) {
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        fog: false,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.setScalar(0.15);

      // Scatter across the clearing interior (fortress + surrounding open area)
      const px = 19 + Math.random() * 26;
      const py = 8.0 + Math.random() * 3.0;
      const pz = 19 + Math.random() * 26;
      sprite.position.set(px, py, pz);

      const angle = Math.random() * Math.PI * 2;
      const spd   = 0.25 + Math.random() * 0.45;
      this.scene.add(sprite);
      this._fireflies.push({
        sprite,
        vx:        Math.cos(angle) * spd,
        vz:        Math.sin(angle) * spd,
        vyDir:     Math.random() < 0.5 ? 1 : -1,
        phase:     Math.random() * Math.PI * 2,
        blinkFreq: 0.7 + Math.random() * 1.3,
      });
    }
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
    this.sunLight.shadow.normalBias = 0.02;        // reduce peter-panning on angled surfaces
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
    this._rainLensCanvas.width  = window.innerWidth;
    this._rainLensCanvas.height = window.innerHeight;
  }

  private _updateRainLens(dt: number): void {
    const W   = this._rainLensCanvas.width;
    const H   = this._rainLensCanvas.height;
    const ctx = this._rainLensCtx;
    const raw = this._rainLensIntensity;

    // Clear previous frame
    ctx.clearRect(0, 0, W, H);

    // ── Underwater ripple vignette ──────────────────────────────────────────
    if (this._underwaterEffect) {
      this._underwaterVigTime += dt;
      const t = this._underwaterVigTime;

      // Multiple additive radial-gradient rings that pulse inward at different rates
      const cx = W * 0.5;
      const cy = H * 0.5;
      const diag = Math.hypot(cx, cy);

      // Base vignette (dark edges, always present)
      const baseGrad = ctx.createRadialGradient(cx, cy, diag * 0.40, cx, cy, diag * 1.05);
      baseGrad.addColorStop(0, "rgba(0,30,80,0)");
      baseGrad.addColorStop(0.65, "rgba(0,20,70,0.28)");
      baseGrad.addColorStop(1, "rgba(0,10,50,0.72)");
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, W, H);

      // Slow ripple 1 — large, slow
      const r1 = diag * (0.55 + Math.sin(t * 0.9) * 0.07);
      const g1 = ctx.createRadialGradient(cx, cy, r1 * 0.82, cx, cy, r1);
      g1.addColorStop(0, "rgba(0,60,160,0)");
      g1.addColorStop(1, "rgba(0,40,120,0.14)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, W, H);

      // Fast ripple 2 — smaller, faster, offset phase
      const r2 = diag * (0.45 + Math.sin(t * 1.7 + 1.2) * 0.05);
      const g2 = ctx.createRadialGradient(cx, cy, r2 * 0.80, cx, cy, r2);
      g2.addColorStop(0, "rgba(0,80,180,0)");
      g2.addColorStop(1, "rgba(0,50,140,0.10)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);

      // Caustic shimmer top-edge (light rays from above)
      const shim = 0.04 + Math.sin(t * 2.3) * 0.02 + Math.sin(t * 3.7 + 0.8) * 0.015;
      const shimGrad = ctx.createLinearGradient(0, 0, 0, H * 0.35);
      shimGrad.addColorStop(0, `rgba(100,200,255,${shim.toFixed(3)})`);
      shimGrad.addColorStop(1, "rgba(0,100,200,0)");
      ctx.fillStyle = shimGrad;
      ctx.fillRect(0, 0, W, H * 0.35);

      return; // skip rain drops while underwater
    }
    // ── End underwater ──────────────────────────────────────────────────────

    // Suppress drops when not actively raining (also covers underwater/lava/clear)
    if (raw < 0.08) {
      // Drain existing drops when rain stops
      for (let i = this._rainLensDrops.length - 1; i >= 0; i--) {
        this._rainLensDrops[i].life = Math.min(this._rainLensDrops[i].life, this._rainLensDrops[i].age + 0.8);
      }
    }

    // Advance existing drops
    for (let i = this._rainLensDrops.length - 1; i >= 0; i--) {
      const d = this._rainLensDrops[i];
      d.y   += d.speed * dt / H;
      d.age += dt;
      if (d.age >= d.life || d.y > 1.12) {
        this._rainLensDrops.splice(i, 1);
      }
    }

    // Spawn new drops when raining
    if (raw >= 0.08 && this._rainLensDrops.length < 18) {
      this._rainLensSpawnTimer -= dt;
      if (this._rainLensSpawnTimer <= 0) {
        const rate = 0.35 + raw * 1.0; // 0.43–1.35 drops/s at intensity 0.08–1
        this._rainLensSpawnTimer = 1 / rate + Math.random() * 0.3;
        const hw = 6  + Math.random() * 10;   // half-width  6–16 px
        const hh = hw * (1.5 + Math.random() * 0.8); // half-height 1.5–2.3× width
        this._rainLensDrops.push({
          x:     0.04 + Math.random() * 0.92,
          y:    -0.06 - Math.random() * 0.08,
          w: hw,
          h: hh,
          speed: 28 + Math.random() * 55,
          age:   0,
          life:  2.0 + Math.random() * 3.0,
        });
      }
    }

    // Draw drops
    for (const d of this._rainLensDrops) {
      const t       = d.age / d.life;
      const fadeIn  = Math.min(1, t / 0.10);
      const fadeOut = Math.min(1, (1 - t) / 0.22);
      const alpha   = fadeIn * fadeOut * (0.14 + raw * 0.12);
      if (alpha < 0.005) continue;

      const cx = d.x * W;
      const cy = d.y * H + d.h; // centre of body (below top)

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(cx, cy);

      // Teardrop body via bezier path
      ctx.beginPath();
      ctx.moveTo(0, -d.h);
      ctx.bezierCurveTo( d.w * 1.15, -d.h + d.h * 0.4,  d.w, d.h * 0.4,  0,  d.h);
      ctx.bezierCurveTo(-d.w, d.h * 0.4, -d.w * 1.15, -d.h + d.h * 0.4,  0, -d.h);
      ctx.closePath();

      // Glassy blue-white gradient fill
      const gr = ctx.createRadialGradient(-d.w * 0.15, -d.h * 0.5, 0, 0, 0, Math.hypot(d.w, d.h) * 0.9);
      gr.addColorStop(0,   "rgba(230,245,255,0.55)");
      gr.addColorStop(0.4, "rgba(190,225,255,0.28)");
      gr.addColorStop(1,   "rgba(150,200,255,0.04)");
      ctx.fillStyle = gr;
      ctx.fill();

      // Subtle stroke
      ctx.strokeStyle = "rgba(160,210,255,0.28)";
      ctx.lineWidth   = 0.7;
      ctx.stroke();

      // Highlight oval (upper-left interior — simulates refraction highlight)
      ctx.beginPath();
      ctx.ellipse(-d.w * 0.22, -d.h * 0.55, d.w * 0.28, d.h * 0.22, -0.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.60)";
      ctx.fill();

      ctx.restore();
    }
  }
}
