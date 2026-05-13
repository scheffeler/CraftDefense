import * as THREE from "three";
import type { TowerTypeName } from "./types";
import type { GameMap } from "./Map";
import type { TowerManager } from "./Tower";
import type { GamePhase } from "./types";

export class InputManager {
  private readonly raycaster = new THREE.Raycaster();
  private readonly mouse = new THREE.Vector2(-999, -999);
  private readonly groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private readonly planeTarget = new THREE.Vector3();
  private readonly hoverIndicator: THREE.Mesh;

  selectedTowerType: TowerTypeName | null = null;

  onPlaceTower: (gx: number, gz: number, type: TowerTypeName) => void = () => {};
  onSelectTower: (gx: number, gz: number) => void = () => {};
  onDeselect: () => void = () => {};
  getPhase: () => GamePhase = () => "menu";

  constructor(
    private readonly canvas: HTMLElement,
    private readonly camera: THREE.Camera,
    private readonly gameMap: GameMap,
    private readonly towerManager: TowerManager,
  ) {
    // Hover cell highlight
    const geo = new THREE.PlaneGeometry(0.95, 0.95);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffffff, transparent: true, opacity: 0.2,
      side: THREE.DoubleSide, depthWrite: false,
    });
    this.hoverIndicator = new THREE.Mesh(geo, mat);
    this.hoverIndicator.rotation.x = -Math.PI / 2;
    this.hoverIndicator.visible = false;

    canvas.addEventListener("mousemove", e => this.onMouseMove(e));
    canvas.addEventListener("click",     e => this.onClick(e));
    window.addEventListener("keydown",   e => this.onKey(e));
  }

  addHoverToScene(scene: THREE.Scene): void {
    scene.add(this.hoverIndicator);
  }

  private onMouseMove(e: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.set(
      ((e.clientX - rect.left) / rect.width)  * 2 - 1,
      -((e.clientY - rect.top)  / rect.height) * 2 + 1,
    );

    if (this.getPhase() !== "playing" && this.getPhase() !== "wave_clear") {
      this.hoverIndicator.visible = false;
      return;
    }

    this.raycaster.setFromCamera(this.mouse, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.groundPlane, this.planeTarget)) {
      this.hoverIndicator.visible = false;
      return;
    }

    const gx = Math.floor(this.planeTarget.x);
    const gz = Math.floor(this.planeTarget.z);

    if (this.selectedTowerType !== null && this.gameMap.isBuildable(gx, gz)) {
      this.hoverIndicator.position.set(gx + 0.5, 1.02, gz + 0.5);
      (this.hoverIndicator.material as THREE.MeshBasicMaterial).color.setHex(0x88ff88);
      this.hoverIndicator.visible = true;
      this.towerManager.showPlacementRing(gx, gz, this.selectedTowerType);
    } else if (this.selectedTowerType !== null) {
      this.hoverIndicator.position.set(gx + 0.5, 1.02, gz + 0.5);
      (this.hoverIndicator.material as THREE.MeshBasicMaterial).color.setHex(0xff4444);
      this.hoverIndicator.visible = true;
      this.towerManager.hidePlacementRing();
    } else {
      this.hoverIndicator.visible = false;
      this.towerManager.hidePlacementRing();
    }
  }

  private onClick(e: MouseEvent): void {
    if (this.getPhase() !== "playing" && this.getPhase() !== "wave_clear") return;

    const rect = this.canvas.getBoundingClientRect();
    this.mouse.set(
      ((e.clientX - rect.left) / rect.width)  * 2 - 1,
      -((e.clientY - rect.top)  / rect.height) * 2 + 1,
    );

    this.raycaster.setFromCamera(this.mouse, this.camera);
    if (!this.raycaster.ray.intersectPlane(this.groundPlane, this.planeTarget)) return;

    const gx = Math.floor(this.planeTarget.x);
    const gz = Math.floor(this.planeTarget.z);

    if (this.selectedTowerType !== null) {
      this.onPlaceTower(gx, gz, this.selectedTowerType);
    } else {
      // Check if there's a tower at this cell
      const tower = this.towerManager.getTowerAt(gx, gz);
      if (tower) {
        this.onSelectTower(gx, gz);
      } else {
        this.onDeselect();
      }
    }
  }

  private onKey(e: KeyboardEvent): void {
    if (e.key === "Escape") {
      this.selectedTowerType = null;
      this.towerManager.hidePlacementRing();
      this.onDeselect();
    }
    if (e.key === "1") this.selectedTowerType = "arrow";
    if (e.key === "2") this.selectedTowerType = "cannon";
    if (e.key === "3") this.selectedTowerType = "ice";
  }

  setSelectedType(type: TowerTypeName | null): void {
    this.selectedTowerType = type;
    if (!type) this.towerManager.hidePlacementRing();
  }
}
