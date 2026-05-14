import * as THREE from "three";

export type WeatherType = "clear" | "rain" | "thunder";

const RAIN_COUNT = 2500;
const BOX_HALF   = 26;
const DROP_H     = 20;
const DROP_SPEED = 22;
const RAIN_ALPHA = 0.48;

export class WeatherSystem {
  private readonly geo: THREE.BufferGeometry;
  private readonly points: THREE.Points;
  private readonly mat: THREE.PointsMaterial;

  private weather: WeatherType = "clear";
  private _intensity  = 0;   // 0..1, fades in/out
  private _stateTimer = 0;
  private _nextChange: number;

  onThunder: () => void = () => {};

  get currentWeather(): WeatherType { return this.weather; }
  get intensity(): number { return this._intensity; }

  constructor(private readonly scene: THREE.Scene) {
    this._nextChange = 90 + Math.random() * 150; // 1.5–4 min before first rain

    const pos = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * BOX_HALF * 2;
      pos[i * 3 + 1] = Math.random() * DROP_H;
      pos[i * 3 + 2] = (Math.random() - 0.5) * BOX_HALF * 2;
    }

    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    this.mat = new THREE.PointsMaterial({
      color: 0xaaccff,
      size: 0.09,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    this.points.visible = false;
    scene.add(this.points);
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

    // Smooth fade
    const target = this.weather !== "clear" ? RAIN_ALPHA : 0;
    this._intensity += (target - this._intensity) * Math.min(1, dt * 1.2);
    this.mat.opacity = this._intensity;
    this.points.visible = this._intensity > 0.01;
    if (!this.points.visible) return;

    // Scroll drops downward, wrapping to camera box
    const attr = this.geo.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;
    const cx = camera.position.x, cy = camera.position.y, cz = camera.position.z;

    for (let i = 0; i < RAIN_COUNT; i++) {
      arr[i * 3 + 1] -= DROP_SPEED * dt;

      const below  = arr[i * 3 + 1] < cy - 3;
      const outsideX = Math.abs(arr[i * 3]     - cx) > BOX_HALF;
      const outsideZ = Math.abs(arr[i * 3 + 2] - cz) > BOX_HALF;

      if (below || outsideX || outsideZ) {
        arr[i * 3]     = cx + (Math.random() - 0.5) * BOX_HALF * 2;
        arr[i * 3 + 1] = cy + 4 + Math.random() * DROP_H;
        arr[i * 3 + 2] = cz + (Math.random() - 0.5) * BOX_HALF * 2;
      }
    }
    attr.needsUpdate = true;
  }

  reset(): void {
    this.weather = "clear";
    this._intensity = 0;
    this._stateTimer = 0;
    this.mat.opacity = 0;
    this.points.visible = false;
  }

  dispose(): void {
    this.scene.remove(this.points);
    this.geo.dispose();
    this.mat.dispose();
  }
}
