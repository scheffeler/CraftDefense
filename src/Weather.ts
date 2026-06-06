import * as THREE from "three";

export type WeatherType = "clear" | "rain" | "thunder";

const RAIN_COUNT  = 2000;
const BOX_HALF    = 26;
const DROP_H      = 20;
const DROP_SPEED  = 22;
const WIND_X      = 4.0;   // horizontal drift speed (world units/s)
const STREAK_LEN  = 0.55;  // vertical length of each rain streak
const STREAK_DRIFT = STREAK_LEN * (WIND_X / DROP_SPEED); // horizontal offset of streak bottom
const RAIN_ALPHA  = 0.52;

// Snow constants
const SNOW_COUNT  = 600;
const SNOW_BOX    = 18;   // horizontal radius around camera
const SNOW_HEIGHT = 12;   // vertical spawn band
const SNOW_ALPHA  = 0.72;

export class WeatherSystem {
  private readonly geo: THREE.BufferGeometry;
  private readonly streaks: THREE.LineSegments;
  private readonly mat: THREE.LineBasicMaterial;

  // Snow flurry (taiga biome, always-on ambient)
  private readonly _snowGeo: THREE.BufferGeometry;
  private readonly _snowMat: THREE.PointsMaterial;
  private readonly _snowPoints: THREE.Points;
  private readonly _snowVelX: Float32Array;  // per-flake horizontal drift X
  private readonly _snowVelZ: Float32Array;  // per-flake horizontal drift Z
  private readonly _snowFallSpeed: Float32Array; // per-flake fall speed
  private _snowIntensity = 0;
  private _taigaSnow = false;

  private weather: WeatherType = "clear";
  private _intensity  = 0;   // 0..1, fades in/out
  private _stateTimer = 0;
  private _nextChange: number;

  onThunder: () => void = () => {};

  get currentWeather(): WeatherType { return this.weather; }
  get intensity(): number { return this._intensity; }

  constructor(private readonly scene: THREE.Scene) {
    this._nextChange = 90 + Math.random() * 150; // 1.5–4 min before first rain

    // Each streak = 2 vertices: top and bottom of a tilted line segment
    const pos = new Float32Array(RAIN_COUNT * 2 * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      const x = (Math.random() - 0.5) * BOX_HALF * 2;
      const y = Math.random() * DROP_H;
      const z = (Math.random() - 0.5) * BOX_HALF * 2;
      // Top vertex
      pos[i * 6 + 0] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;
      // Bottom vertex — tilted by wind drift
      pos[i * 6 + 3] = x + STREAK_DRIFT;
      pos[i * 6 + 4] = y - STREAK_LEN;
      pos[i * 6 + 5] = z;
    }

    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    this.mat = new THREE.LineBasicMaterial({
      color: 0xb8d8ff,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });

    this.streaks = new THREE.LineSegments(this.geo, this.mat);
    this.streaks.frustumCulled = false;
    this.streaks.visible = false;
    scene.add(this.streaks);

    // Snow flurry — points scattered in a box around the camera
    const snowPos = new Float32Array(SNOW_COUNT * 3);
    this._snowVelX = new Float32Array(SNOW_COUNT);
    this._snowVelZ = new Float32Array(SNOW_COUNT);
    this._snowFallSpeed = new Float32Array(SNOW_COUNT);
    for (let i = 0; i < SNOW_COUNT; i++) {
      snowPos[i * 3 + 0] = (Math.random() - 0.5) * SNOW_BOX * 2;
      snowPos[i * 3 + 1] = Math.random() * SNOW_HEIGHT;
      snowPos[i * 3 + 2] = (Math.random() - 0.5) * SNOW_BOX * 2;
      // Gentle swirling drift per flake — each flake has its own drift angle
      const driftAngle = Math.random() * Math.PI * 2;
      const driftSpeed = 0.15 + Math.random() * 0.25;
      this._snowVelX[i] = Math.cos(driftAngle) * driftSpeed;
      this._snowVelZ[i] = Math.sin(driftAngle) * driftSpeed;
      this._snowFallSpeed[i] = 0.9 + Math.random() * 1.0;
    }
    this._snowGeo = new THREE.BufferGeometry();
    this._snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPos, 3));
    this._snowMat = new THREE.PointsMaterial({
      color: 0xddeeff,
      size: 0.13,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    this._snowPoints = new THREE.Points(this._snowGeo, this._snowMat);
    this._snowPoints.frustumCulled = false;
    this._snowPoints.visible = false;
    scene.add(this._snowPoints);
  }

  setTaigaSnow(active: boolean): void {
    this._taigaSnow = active;
  }

  update(dt: number, camera: THREE.Camera): void {
    this._stateTimer += dt;

    if (this._stateTimer >= this._nextChange) {
      this._stateTimer = 0;
      if (this.weather === "clear") {
        this.weather = Math.random() < 0.25 ? "thunder" : "rain";
        this._nextChange = 60 + Math.random() * 120;
      } else {
        this.weather = "clear";
        this._nextChange = 180 + Math.random() * 240;
      }
    }

    // Trigger random thunder clap
    if (this.weather === "thunder" && this._intensity > 0.4 && Math.random() < 0.003) {
      this.onThunder();
    }

    // Rain — smooth fade in/out
    const target = this.weather !== "clear" ? RAIN_ALPHA : 0;
    this._intensity += (target - this._intensity) * Math.min(1, dt * 1.2);
    this.mat.opacity = this._intensity;
    this.streaks.visible = this._intensity > 0.01;

    const cx = camera.position.x, cy = camera.position.y, cz = camera.position.z;

    if (this.streaks.visible) {
      // Scroll streaks downward with wind drift, wrapping to camera box
      const attr = this.geo.attributes.position as THREE.BufferAttribute;
      const arr  = attr.array as Float32Array;

      for (let i = 0; i < RAIN_COUNT; i++) {
        const base = i * 6;
        arr[base + 1] -= DROP_SPEED * dt;
        arr[base + 4] -= DROP_SPEED * dt;
        arr[base + 0] += WIND_X * dt;
        arr[base + 3] += WIND_X * dt;

        const topY = arr[base + 1];
        const below    = topY < cy - 3;
        const outsideX = Math.abs(arr[base + 0] - cx) > BOX_HALF;
        const outsideZ = Math.abs(arr[base + 2] - cz) > BOX_HALF;

        if (below || outsideX || outsideZ) {
          const nx = cx + (Math.random() - 0.5) * BOX_HALF * 2;
          const ny = cy + 4 + Math.random() * DROP_H;
          const nz = cz + (Math.random() - 0.5) * BOX_HALF * 2;
          arr[base + 0] = nx;                arr[base + 1] = ny;
          arr[base + 2] = nz;
          arr[base + 3] = nx + STREAK_DRIFT; arr[base + 4] = ny - STREAK_LEN;
          arr[base + 5] = nz;
        }
      }
      attr.needsUpdate = true;
    }

    // Snow flurry — gentle drifting flakes in taiga biome (always-on, independent of rain)
    const snowTarget = this._taigaSnow ? SNOW_ALPHA : 0;
    this._snowIntensity += (snowTarget - this._snowIntensity) * Math.min(1, dt * 0.8);
    this._snowMat.opacity = this._snowIntensity;
    this._snowPoints.visible = this._snowIntensity > 0.01;

    if (this._snowPoints.visible) {
      const snowAttr = this._snowGeo.attributes.position as THREE.BufferAttribute;
      const sa = snowAttr.array as Float32Array;

      for (let i = 0; i < SNOW_COUNT; i++) {
        const base = i * 3;
        // Drift each flake with its own horizontal velocity + gentle sine sway
        const sway = Math.sin(sa[base + 1] * 0.7 + i * 0.31) * 0.18 * dt;
        sa[base + 0] += (this._snowVelX[i] + sway) * dt;
        sa[base + 1] -= this._snowFallSpeed[i] * dt;
        sa[base + 2] += this._snowVelZ[i] * dt;

        // Wrap flake back to top when it falls below camera or exits horizontal box
        const below    = sa[base + 1] < cy - 2;
        const outsideX = Math.abs(sa[base + 0] - cx) > SNOW_BOX;
        const outsideZ = Math.abs(sa[base + 2] - cz) > SNOW_BOX;

        if (below || outsideX || outsideZ) {
          sa[base + 0] = cx + (Math.random() - 0.5) * SNOW_BOX * 2;
          sa[base + 1] = cy + 3 + Math.random() * SNOW_HEIGHT;
          sa[base + 2] = cz + (Math.random() - 0.5) * SNOW_BOX * 2;
        }
      }
      snowAttr.needsUpdate = true;
    }
  }

  reset(): void {
    this.weather = "clear";
    this._intensity = 0;
    this._stateTimer = 0;
    this.mat.opacity = 0;
    this.streaks.visible = false;
    // Snow persists across wave resets — taiga is a world property, not wave-related
  }

  dispose(): void {
    this.scene.remove(this.streaks);
    this.geo.dispose();
    this.mat.dispose();
    this.scene.remove(this._snowPoints);
    this._snowGeo.dispose();
    this._snowMat.dispose();
  }
}
