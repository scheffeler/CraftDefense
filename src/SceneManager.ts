import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  private readonly controls: PointerLockControls;

  onPointerLockChange: (locked: boolean) => void = () => {};

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 40, 120);

    // FPS camera: FOV 75, positioned south of fortress looking north
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    this.camera.position.set(32, 2.62, 48);
    this.camera.lookAt(32, 2.62, 32);

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("lock",   () => this.onPointerLockChange(true));
    this.controls.addEventListener("unlock", () => this.onPointerLockChange(false));

    // Click on the 3D canvas to engage pointer lock
    this.renderer.domElement.addEventListener("click", () => {
      if (!this.controls.isLocked) this.controls.lock();
    });

    this.setupLighting();
    window.addEventListener("resize", () => this.onResize());
  }

  get isPointerLocked(): boolean { return this.controls.isLocked; }

  lockPointer():   void { this.controls.lock(); }
  unlockPointer(): void { this.controls.unlock(); }

  private setupLighting(): void {
    this.scene.add(new THREE.AmbientLight(0xc8d8f0, 0.9));

    const sun = new THREE.DirectionalLight(0xfff4d0, 1.3);
    sun.position.set(40, 80, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left  = -80;
    sun.shadow.camera.right =  80;
    sun.shadow.camera.top   =  80;
    sun.shadow.camera.bottom = -80;
    this.scene.add(sun);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  // Stub: camera position is controlled by Player each frame (Phase 3)
  resetCamera(): void {
    this.camera.position.set(32, 2.62, 48);
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
