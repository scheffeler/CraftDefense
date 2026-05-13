import * as THREE from "three";
import type { TowerTypeName, TowerState } from "./types";
import { TOWER_CONFIGS, SELL_REFUND_RATE } from "./config/towers";
import type { EnemyState } from "./types";
import type { ProjectileManager } from "./Projectile";
import type { GameMap } from "./Map";
import { TOWER_BASE_Y } from "./config/map";

export class TowerManager {
  private readonly towers = new Map<number, TowerState>();
  private readonly meshes = new Map<number, THREE.Group>();
  private readonly rangeRings = new Map<number, THREE.Mesh>();
  private idCounter = 0;
  private selectedId: number | null = null;

  constructor(
    private readonly scene: THREE.Scene,
    private readonly gameMap: GameMap,
  ) {}

  place(gx: number, gz: number, type: TowerTypeName): TowerState | null {
    if (!this.gameMap.isBuildable(gx, gz)) return null;
    const cfg = TOWER_CONFIGS[type];
    const cost = cfg.levels[0].cost;

    const id = this.idCounter++;
    const state: TowerState = {
      id, type, gridX: gx, gridZ: gz,
      level: 0, cooldown: 0, totalSpent: cost,
    };
    this.towers.set(id, state);
    this.gameMap.placeTower(gx, gz, id);

    const group = this.buildMesh(type, 0);
    group.position.set(gx + 0.5, TOWER_BASE_Y, gz + 0.5);
    this.scene.add(group);
    this.meshes.set(id, group);

    return state;
  }

  upgrade(id: number): { success: boolean; cost: number } {
    const state = this.towers.get(id);
    if (!state || state.level >= 2) return { success: false, cost: 0 };
    const cfg = TOWER_CONFIGS[state.type];
    const cost = cfg.levels[state.level + 1].cost;
    state.level++;
    state.totalSpent += cost;
    this.refreshMesh(id);
    return { success: true, cost };
  }

  sell(id: number): number {
    const state = this.towers.get(id);
    if (!state) return 0;
    const refund = Math.floor(state.totalSpent * SELL_REFUND_RATE);
    this.gameMap.removeTower(state.gridX, state.gridZ);
    this.removeMesh(id);
    this.towers.delete(id);
    if (this.selectedId === id) this.selectTower(null);
    return refund;
  }

  selectTower(id: number | null): void {
    // Hide old ring
    if (this.selectedId !== null) {
      const ring = this.rangeRings.get(this.selectedId);
      if (ring) ring.visible = false;
    }
    this.selectedId = id;
    if (id !== null) {
      const state = this.towers.get(id);
      if (state) this.showRangeRing(id, state);
    }
  }

  getSelected(): TowerState | null {
    if (this.selectedId === null) return null;
    return this.towers.get(this.selectedId) ?? null;
  }

  getSelectedId(): number | null { return this.selectedId; }

  getTowerAt(gx: number, gz: number): TowerState | null {
    const cell = this.gameMap.getCell(gx, gz);
    if (!cell || !cell.hasTower || cell.towerId === null) return null;
    return this.towers.get(cell.towerId) ?? null;
  }

  update(
    dt: number,
    enemies: EnemyState[],
    getEnemyProgress: (id: number) => number,
    getEnemyPos: (id: number) => THREE.Vector3 | null,
    projectiles: ProjectileManager,
  ): void {
    for (const [id, state] of this.towers) {
      state.cooldown = Math.max(0, state.cooldown - dt);
      if (state.cooldown > 0) continue;

      const cfg = TOWER_CONFIGS[state.type];
      const lvl = cfg.levels[state.level];
      const towerPos = this.meshes.get(id)!.position;

      // Find best target: most progress along path within range
      let bestId = -1;
      let bestProgress = -1;
      for (const enemy of enemies) {
        const epos = getEnemyPos(enemy.id);
        if (!epos) continue;
        const dist = towerPos.distanceTo(epos);
        if (dist > lvl.range) continue;
        const progress = getEnemyProgress(enemy.id);
        if (progress > bestProgress) {
          bestProgress = progress;
          bestId = enemy.id;
        }
      }

      if (bestId < 0) continue;

      // Rotate tower toward target
      const epos = getEnemyPos(bestId)!;
      const dir = epos.clone().sub(towerPos);
      dir.y = 0;
      if (dir.length() > 0.01) {
        const mesh = this.meshes.get(id)!;
        mesh.rotation.y = Math.atan2(dir.x, dir.z);
      }

      // Fire
      const fireFrom = towerPos.clone().add(new THREE.Vector3(0, 0.8, 0));
      projectiles.fire(
        cfg.projectile,
        fireFrom,
        bestId,
        lvl.damage,
        lvl.projectileSpeed,
        lvl.aoeRadius ?? 0,
        lvl.slowFactor ?? 1,
        lvl.slowDuration ?? 0,
      );

      state.cooldown = 1 / lvl.fireRate;
    }
  }

  showPlacementRing(gx: number, gz: number, type: TowerTypeName): void {
    this.hidePlacementRing();
    const cfg = TOWER_CONFIGS[type];
    const range = cfg.levels[0].range;
    const geo = new THREE.RingGeometry(range - 0.05, range + 0.05, 48);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3, side: THREE.DoubleSide, depthWrite: false });
    this._placementRing = new THREE.Mesh(geo, mat);
    this._placementRing.rotation.x = -Math.PI / 2;
    this._placementRing.position.set(gx + 0.5, 1.05, gz + 0.5);
    this.scene.add(this._placementRing);
  }

  private _placementRing: THREE.Mesh | null = null;

  hidePlacementRing(): void {
    if (this._placementRing) {
      this.scene.remove(this._placementRing);
      this._placementRing.geometry.dispose();
      (this._placementRing.material as THREE.Material).dispose();
      this._placementRing = null;
    }
  }

  getAllTowerMeshes(): Map<THREE.Object3D, number> {
    const map = new Map<THREE.Object3D, number>();
    this.meshes.forEach((group, id) => map.set(group, id));
    return map;
  }

  reset(): void {
    for (const id of [...this.towers.keys()]) {
      this.gameMap.removeTower(this.towers.get(id)!.gridX, this.towers.get(id)!.gridZ);
      this.removeMesh(id);
    }
    this.towers.clear();
    this.selectedId = null;
    this.hidePlacementRing();
    this.idCounter = 0;
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------
  private buildMesh(type: TowerTypeName, level: number): THREE.Group {
    const group = new THREE.Group();
    const cfg = TOWER_CONFIGS[type];

    if (type === "arrow") {
      // Sandstone column + wood platform + arrow tip
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 0.3, 0.7),
        new THREE.MeshLambertMaterial({ color: 0x998855 }),
      );
      base.position.y = 0.15;
      base.castShadow = true;
      group.add(base);

      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.45, 1.0 + level * 0.2, 0.45),
        new THREE.MeshLambertMaterial({ color: 0xc8a860 }),
      );
      col.position.y = 0.8 + level * 0.1;
      col.castShadow = true;
      group.add(col);

      const top = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.18, 0.65),
        new THREE.MeshLambertMaterial({ color: 0x7a5a20 }),
      );
      top.position.y = 1.35 + level * 0.2;
      group.add(top);

      // Arrow pointing outward
      const arrowGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 4);
      const arrow = new THREE.Mesh(arrowGeo, new THREE.MeshLambertMaterial({ color: 0x444444 }));
      arrow.rotation.x = Math.PI / 2;
      arrow.position.set(0, 1.35 + level * 0.2, 0.45);
      group.add(arrow);

      if (level >= 1) {
        const flags = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.3, 0.02), new THREE.MeshLambertMaterial({ color: 0xff4400 }));
        flags.position.set(0, 1.6 + level * 0.2, 0.23);
        group.add(flags);
      }
    } else if (type === "cannon") {
      // Stone foundation + gray cube + barrel
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.25, 0.9),
        new THREE.MeshLambertMaterial({ color: 0x666666 }),
      );
      base.position.y = 0.125;
      base.castShadow = true;
      group.add(base);

      const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.65 + level * 0.1, 0.65),
        new THREE.MeshLambertMaterial({ color: 0x444444 }),
      );
      body.position.y = 0.58 + level * 0.05;
      body.castShadow = true;
      group.add(body);

      // Barrel
      const barrelGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.6 + level * 0.1, 8);
      const barrel = new THREE.Mesh(barrelGeo, new THREE.MeshLambertMaterial({ color: 0x222222 }));
      barrel.rotation.x = Math.PI / 2;
      barrel.position.set(0, 0.7, 0.5 + level * 0.05);
      barrel.castShadow = true;
      group.add(barrel);

      if (level >= 1) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 6, 12), new THREE.MeshLambertMaterial({ color: 0x888888 }));
        ring.rotation.x = Math.PI / 2;
        ring.position.set(0, 0.7, 0.65);
        group.add(ring);
      }
    } else {
      // Ice tower: thin blue crystal
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.2, 0.6),
        new THREE.MeshLambertMaterial({ color: 0x88aacc }),
      );
      base.position.y = 0.1;
      group.add(base);

      const col = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 1.0 + level * 0.25, 0.3),
        new THREE.MeshLambertMaterial({ color: 0x99ddff, emissive: 0x3399ff, emissiveIntensity: 0.2 + level * 0.1 }),
      );
      col.position.y = 0.7 + level * 0.12;
      col.castShadow = true;
      group.add(col);

      // Crystal shard on top
      const shardGeo = new THREE.ConeGeometry(0.15 + level * 0.04, 0.5 + level * 0.1, 6);
      const shard = new THREE.Mesh(shardGeo, new THREE.MeshLambertMaterial({ color: 0xaaeeff, emissive: 0x66ccff, emissiveIntensity: 0.4 }));
      shard.position.y = 1.45 + level * 0.3;
      shard.castShadow = true;
      group.add(shard);

      if (level >= 1) {
        // Side crystals
        [-0.2, 0.2].forEach(ox => {
          const small = new THREE.Mesh(
            new THREE.ConeGeometry(0.08, 0.3, 6),
            new THREE.MeshLambertMaterial({ color: 0xccffff, emissive: 0x66ccff, emissiveIntensity: 0.3 }),
          );
          small.position.set(ox, 1.3 + level * 0.2, 0);
          group.add(small);
        });
      }
    }

    // Level indicator dots
    for (let i = 0; i <= level; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 6, 6),
        new THREE.MeshLambertMaterial({ color: cfg.color, emissive: cfg.color, emissiveIntensity: 0.5 }),
      );
      dot.position.set((i - level / 2) * 0.18, 0.35, 0.45);
      group.add(dot);
    }

    return group;
  }

  private refreshMesh(id: number): void {
    const state = this.towers.get(id)!;
    const group = this.meshes.get(id)!;
    const pos = group.position.clone();
    const rot = group.rotation.y;
    this.scene.remove(group);
    group.traverse(c => {
      const m = c as THREE.Mesh;
      if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
    });
    const newGroup = this.buildMesh(state.type, state.level);
    newGroup.position.copy(pos);
    newGroup.rotation.y = rot;
    this.scene.add(newGroup);
    this.meshes.set(id, newGroup);
  }

  private removeMesh(id: number): void {
    const group = this.meshes.get(id);
    if (group) {
      this.scene.remove(group);
      group.traverse(c => {
        const m = c as THREE.Mesh;
        if (m.isMesh) { m.geometry.dispose(); (m.material as THREE.Material).dispose(); }
      });
      this.meshes.delete(id);
    }
    const ring = this.rangeRings.get(id);
    if (ring) {
      this.scene.remove(ring);
      ring.geometry.dispose();
      (ring.material as THREE.Material).dispose();
      this.rangeRings.delete(id);
    }
  }

  private showRangeRing(id: number, state: TowerState): void {
    let ring = this.rangeRings.get(id);
    const range = TOWER_CONFIGS[state.type].levels[state.level].range;

    if (!ring) {
      const geo = new THREE.RingGeometry(range - 0.05, range + 0.05, 48);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff, transparent: true, opacity: 0.25,
        side: THREE.DoubleSide, depthWrite: false,
      });
      ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = -Math.PI / 2;
      this.scene.add(ring);
      this.rangeRings.set(id, ring);
    }

    const mesh = this.meshes.get(id)!;
    ring.position.set(mesh.position.x, 1.05, mesh.position.z);
    ring.visible = true;
  }
}
