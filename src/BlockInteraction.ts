import * as THREE from "three";
import type { BlockId } from "./types";
import { VoxelWorld, BLOCK_DEFS } from "./Map";
import { BLOCK_BEHAVIORS } from "./config/blocks";
import { ITEMS } from "./config/items";
import type { ItemStack } from "./Inventory";
import type { ToolTier } from "./config/items";

const REACH = 4.5;

const TIER_SPEED: Record<ToolTier, number> = {
  wood:    2.0,
  stone:   4.0,
  iron:    6.0,
  diamond: 8.0,
};

export class BlockInteraction {
  private readonly raycaster = new THREE.Raycaster();
  private readonly _screenCenter = new THREE.Vector2(0, 0);
  private readonly targetHighlight: THREE.LineSegments;
  private readonly breakOverlay: THREE.Mesh;
  private readonly crackTextures: THREE.CanvasTexture[];
  private lastCrackStage = -1;

  private targetBlock:   { wx: number; wy: number; wz: number } | null = null;
  private adjacentBlock: { wx: number; wy: number; wz: number } | null = null;
  private isBreaking    = false;
  private breakTimer    = 0;
  private breakHardness = 1;
  private willYieldDrops = true;

  private activeItem: ItemStack | null = null;

  onBlockBroken: (wx: number, wy: number, wz: number, id: BlockId, yieldsDrops: boolean) => void = () => {};
  onBlockPlaced: (wx: number, wy: number, wz: number, id: BlockId) => void = () => {};

  constructor(
    private readonly world: VoxelWorld,
    scene: THREE.Scene,
    private readonly camera: THREE.PerspectiveCamera,
  ) {
    const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.002, 1.002, 1.002));
    const mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 });
    this.targetHighlight = new THREE.LineSegments(geo, mat);
    this.targetHighlight.renderOrder = 999;
    this.targetHighlight.visible = false;
    scene.add(this.targetHighlight);

    this.crackTextures = this.buildCrackTextures();

    const breakGeo = new THREE.BoxGeometry(1.01, 1.01, 1.01);
    const breakMat = new THREE.MeshBasicMaterial({
      map: this.crackTextures[0],
      transparent: true, opacity: 0, depthWrite: false,
    });
    this.breakOverlay = new THREE.Mesh(breakGeo, breakMat);
    this.breakOverlay.renderOrder = 998;
    this.breakOverlay.visible = false;
    scene.add(this.breakOverlay);
  }

  private buildCrackTextures(): THREE.CanvasTexture[] {
    // Each crack stage adds arms radiating from center
    const crackArms: [number, number][][] = [
      [[8,8],[13,3]],
      [[8,8],[3,3]],
      [[8,8],[14,14]],
      [[8,8],[3,14]],
      [[8,8],[14,8]],
      [[8,8],[2,8]],
      [[8,8],[8,2]],
      [[8,8],[8,15]],
      [[3,3],[6,8],[3,13]],
      [[13,4],[11,9],[13,13]],
    ];
    const textures: THREE.CanvasTexture[] = [];
    for (let stage = 0; stage < 10; stage++) {
      const canvas = document.createElement("canvas");
      canvas.width = 16; canvas.height = 16;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = `rgba(0,0,0,${0.08 + stage * 0.06})`;
      ctx.fillRect(0, 0, 16, 16);
      ctx.strokeStyle = "rgba(0,0,0,0.85)";
      ctx.lineWidth = 1;
      for (let c = 0; c <= stage && c < crackArms.length; c++) {
        const pts = crackArms[c];
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p][0], pts[p][1]);
        ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.magFilter = THREE.NearestFilter;
      tex.minFilter = THREE.NearestFilter;
      textures.push(tex);
    }
    return textures;
  }

  setActiveItem(item: ItemStack | null): void {
    this.activeItem = item;
    // Recompute break time if we have a target
    if (this.targetBlock) {
      const id = this.world.getBlock(
        this.targetBlock.wx, this.targetBlock.wy, this.targetBlock.wz,
      );
      if (id !== "air") this.computeBreakHardness(id);
    }
  }

  /**
   * Drives the hold-to-break state. Idempotent: the break timer is reset only on a
   * not-breaking -> breaking transition, so callers may invoke this every frame.
   */
  setBreaking(active: boolean): void {
    if (active === this.isBreaking) return;
    this.isBreaking = active;
    this.breakTimer = 0;
    if (!active) {
      this.lastCrackStage = -1;
      this.breakOverlay.visible = false;
    }
  }

  getBreakProgress(): number {
    return this.breakHardness > 0 ? Math.min(1, this.breakTimer / this.breakHardness) : 0;
  }

  getTargetBlock(): { wx: number; wy: number; wz: number } | null { return this.targetBlock; }

  tryPlace(blockId: BlockId): boolean {
    if (!this.adjacentBlock || blockId === "air") return false;
    const { wx, wy, wz } = this.adjacentBlock;
    if (wy < 0 || wy >= 32) return false;
    if (this.world.getBlock(wx, wy, wz) !== "air") return false;
    this.world.setBlock(wx, wy, wz, blockId);
    this.world.rebuildDirtyChunks();
    this.onBlockPlaced(wx, wy, wz, blockId);
    return true;
  }

  update(dt: number): void {
    this.updateTarget();

    if (this.isBreaking && this.targetBlock) {
      this.breakTimer += dt;
      const progress = this.getBreakProgress();
      const { wx, wy, wz } = this.targetBlock;
      this.breakOverlay.position.set(wx + 0.5, wy + 0.5, wz + 0.5);
      this.breakOverlay.visible = true;
      const stage = Math.min(9, Math.floor(progress * 10));
      if (stage !== this.lastCrackStage) {
        this.lastCrackStage = stage;
        (this.breakOverlay.material as THREE.MeshBasicMaterial).map = this.crackTextures[stage];
        (this.breakOverlay.material as THREE.MeshBasicMaterial).needsUpdate = true;
      }
      (this.breakOverlay.material as THREE.MeshBasicMaterial).opacity = 0.3 + progress * 0.5;

      if (this.breakTimer >= this.breakHardness) {
        const id = this.world.getBlock(wx, wy, wz);
        if (id !== "air") {
          this.world.setBlock(wx, wy, wz, "air");
          this.world.rebuildDirtyChunks();
          this.onBlockBroken(wx, wy, wz, id, this.willYieldDrops);
        }
        this.breakTimer = 0;
        this.breakOverlay.visible = false;
      }
    } else {
      this.breakOverlay.visible = false;
    }
  }

  private computeBreakHardness(id: BlockId): void {
    const hardness = BLOCK_DEFS[id].hardness;
    const behavior = BLOCK_BEHAVIORS[id];

    if (!behavior) {
      this.breakHardness = hardness;
      this.willYieldDrops = true;
      return;
    }

    const itemDef = this.activeItem ? ITEMS[this.activeItem.itemId] : null;
    const correctTool = itemDef?.toolCategory === behavior.toolCategory;
    const tier = itemDef?.tier;

    if (!correctTool) {
      if (behavior.requiresTool) {
        // Wrong/no tool on a tool-required block: very slow, no drops
        this.breakHardness = hardness * 3.33;
        this.willYieldDrops = false;
      } else {
        // Hand-breakable: normal hardness, yields drops
        this.breakHardness = hardness;
        this.willYieldDrops = true;
      }
      return;
    }

    // Correct tool: use tier speed multiplier (or item's own speedMult)
    const speedMult = itemDef?.speedMult ??
      (tier ? TIER_SPEED[tier] : 1);
    this.breakHardness = hardness / speedMult;
    this.willYieldDrops = true;
  }

  private updateTarget(): void {
    this.raycaster.setFromCamera(this._screenCenter, this.camera);
    const { origin, direction: dir } = this.raycaster.ray;

    // Voxel-grid DDA (Amanatides & Woo): march the ray cell by cell through the
    // block grid. This is independent of the render mesh, its winding and the
    // BVH, so it reliably picks the first solid voxel the player looks at.
    let x = Math.floor(origin.x), y = Math.floor(origin.y), z = Math.floor(origin.z);
    const stepX = dir.x >= 0 ? 1 : -1;
    const stepY = dir.y >= 0 ? 1 : -1;
    const stepZ = dir.z >= 0 ? 1 : -1;
    const tDeltaX = dir.x !== 0 ? Math.abs(1 / dir.x) : Infinity;
    const tDeltaY = dir.y !== 0 ? Math.abs(1 / dir.y) : Infinity;
    const tDeltaZ = dir.z !== 0 ? Math.abs(1 / dir.z) : Infinity;
    // Parametric distance from the ray origin to the first grid boundary per axis.
    let tMaxX = dir.x !== 0 ? (stepX > 0 ? x + 1 - origin.x : origin.x - x) * tDeltaX : Infinity;
    let tMaxY = dir.y !== 0 ? (stepY > 0 ? y + 1 - origin.y : origin.y - y) * tDeltaY : Infinity;
    let tMaxZ = dir.z !== 0 ? (stepZ > 0 ? z + 1 - origin.z : origin.z - z) * tDeltaZ : Infinity;

    let px = x, py = y, pz = z;   // last empty cell before the hit (placement spot)
    let hitId: BlockId = "air";
    for (let t = 0; t <= REACH; ) {
      const id = this.world.getBlock(x, y, z);
      if (id !== "air" && id !== "water") { hitId = id; break; }
      px = x; py = y; pz = z;
      if (tMaxX <= tMaxY && tMaxX <= tMaxZ)      { x += stepX; t = tMaxX; tMaxX += tDeltaX; }
      else if (tMaxY <= tMaxZ)                   { y += stepY; t = tMaxY; tMaxY += tDeltaY; }
      else                                       { z += stepZ; t = tMaxZ; tMaxZ += tDeltaZ; }
    }

    if (hitId === "air") { this.clearTarget(); return; }

    if (
      !this.targetBlock ||
      this.targetBlock.wx !== x ||
      this.targetBlock.wy !== y ||
      this.targetBlock.wz !== z
    ) {
      this.breakTimer = 0;
      this.computeBreakHardness(hitId);
    }

    this.targetBlock   = { wx: x, wy: y, wz: z };
    this.adjacentBlock = { wx: px, wy: py, wz: pz };

    this.targetHighlight.position.set(x + 0.5, y + 0.5, z + 0.5);
    this.targetHighlight.visible = true;
  }

  private clearTarget(): void {
    this.targetBlock   = null;
    this.adjacentBlock = null;
    this.targetHighlight.visible = false;
    this.breakOverlay.visible = false;
    if (this.isBreaking) this.breakTimer = 0;
  }
}
