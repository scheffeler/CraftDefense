import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { ITEMS } from "./config/items";

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  private readonly controls: PointerLockControls;

  // First-person arm
  private readonly armScene: THREE.Scene;
  private readonly armGroup: THREE.Group;

  onPointerLockChange: (locked: boolean) => void = () => {};

  constructor(container: HTMLElement) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
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
    // Start outside north gate looking at sunlit fortress wall
    this.camera.position.set(32, 4, 12);
    this.camera.lookAt(32, 4, 24);

    this.controls = new PointerLockControls(this.camera, this.renderer.domElement);
    this.controls.addEventListener("lock",   () => this.onPointerLockChange(true));
    this.controls.addEventListener("unlock", () => this.onPointerLockChange(false));

    this.setupLighting();

    // Arm scene — rendered after main scene with depth cleared so arm always shows
    this.armScene = new THREE.Scene();
    this.armScene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const armSun = new THREE.DirectionalLight(0xffe8b0, 0.8);
    armSun.position.set(1, 2, 1);
    this.armScene.add(armSun);

    this.armGroup = new THREE.Group();
    this.armGroup.scale.setScalar(0.65);
    this.armScene.add(this.armGroup);

    this.buildArmMesh();
    this.buildClouds();

    window.addEventListener("resize", () => this.onResize());
  }

  get isPointerLocked(): boolean { return this.controls.isLocked; }

  lockPointer():   void { this.controls.lock(); }
  unlockPointer(): void { this.controls.unlock(); }

  /** Call when hotbar active slot changes. itemId = null for empty hand. */
  updateArmItem(itemId: string | null): void {
    // Remove all children except the arm itself (index 0)
    while (this.armGroup.children.length > 1) {
      this.armGroup.remove(this.armGroup.children[1]);
    }
    if (!itemId) return;

    const def = ITEMS[itemId];
    if (!def) return;

    const itemMesh = this.buildItemMesh(itemId, def.category, def.color);
    if (itemMesh) this.armGroup.add(itemMesh);
  }

  private buildItemMesh(
    _id: string,
    category: string,
    color: number,
  ): THREE.Object3D | null {
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
    arm.position.set(0, 0, 0);
    this.armGroup.add(arm);
  }

  private buildClouds(): void {
    const cloudMat = new THREE.MeshLambertMaterial({
      color: 0xffffff, transparent: true, opacity: 0.85,
    });

    // Scattered flat cloud boxes at y=22
    const positions: [number, number][] = [
      [10, 8], [28, 5], [48, 12], [15, 42], [45, 38],
      [5, 22], [38, 25], [55, 50], [22, 55], [50, 20],
    ];

    for (const [cx, cz] of positions) {
      const w = 6 + (cx % 5);
      const d = 4 + (cz % 4);
      const geo = new THREE.BoxGeometry(w, 1.2, d);
      const cloud = new THREE.Mesh(geo, cloudMat);
      cloud.position.set(cx, 22, cz);
      this.scene.add(cloud);
    }
  }

  render(): void {
    // Sync arm camera to main camera
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
    this.renderer.clearDepth();
    // Render arm with same camera perspective (camera is not in armScene — we position arm manually)
    this.renderArmWithCamera();
  }

  private renderArmWithCamera(): void {
    const worldPos  = new THREE.Vector3();
    const worldQuat = new THREE.Quaternion();
    this.camera.getWorldPosition(worldPos);
    this.camera.getWorldQuaternion(worldQuat);

    // Push arm into lower-right corner — far enough to stay small on screen
    const localOffset = new THREE.Vector3(0.38, -0.52, -0.75);
    localOffset.applyQuaternion(worldQuat);
    this.armGroup.position.copy(worldPos).add(localOffset);

    const tiltQ = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(0.25, -0.2, 0.12, "YXZ"),
    );
    this.armGroup.quaternion.copy(worldQuat).multiply(tiltQ);

    this.renderer.render(this.armScene, this.camera);
  }

  resetCamera(): void {
    this.camera.position.set(32, 2.62, 48);
    this.camera.lookAt(32, 2.62, 32);
  }

  private setupLighting(): void {
    this.scene.add(new THREE.AmbientLight(0xb0c8e8, 0.7));

    const sun = new THREE.DirectionalLight(0xffe8b0, 1.6);
    sun.position.set(60, 100, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 220;
    sun.shadow.camera.left  = -90;
    sun.shadow.camera.right =  90;
    sun.shadow.camera.top   =  90;
    sun.shadow.camera.bottom = -90;
    this.scene.add(sun);

    // Fill lights from multiple angles to prevent pitch-black shadow sides
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
