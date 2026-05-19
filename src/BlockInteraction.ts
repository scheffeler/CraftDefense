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
  gold:    12.0,
  diamond: 8.0,
};

export class BlockInteraction {
  private readonly raycaster = new THREE.Raycaster();
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

  startBreaking(): void { this.isBreaking = true; this.breakTimer = 0; }
  stopBreaking():  void { this.isBreaking = false; this.breakTimer = 0; this.lastCrackStage = -1; }

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
    let speedMult = itemDef?.speedMult ?? (tier ? TIER_SPEED[tier] : 1);
    // Efficiency enchantment bonus
    if (this.activeItem?.enchantments?.includes("efficiency_2")) speedMult *= 2.0;
    else if (this.activeItem?.enchantments?.includes("efficiency_1")) speedMult *= 1.5;
    this.breakHardness = hardness / speedMult;
    this.willYieldDrops = true;
  }

  private updateTarget(): void {
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    this.raycaster.far = REACH;

    const hits = this.raycaster.intersectObjects(this.world.getChunkMeshes());
    if (hits.length === 0 || !hits[0].face) {
      this.clearTarget();
      return;
    }

    const hit = hits[0];
    const n   = hit.face!.normal;
    const p   = hit.point;

    const bx = Math.floor(p.x - n.x * 0.001);
    const by = Math.floor(p.y - n.y * 0.001);
    const bz = Math.floor(p.z - n.z * 0.001);

    const id = this.world.getBlock(bx, by, bz);
    if (id === "air") { this.clearTarget(); return; }

    if (
      !this.targetBlock ||
      this.targetBlock.wx !== bx ||
      this.targetBlock.wy !== by ||
      this.targetBlock.wz !== bz
    ) {
      this.breakTimer = 0;
      this.computeBreakHardness(id);
    }

    this.targetBlock   = { wx: bx, wy: by, wz: bz };
    this.adjacentBlock = {
      wx: Math.floor(p.x + n.x * 0.001),
      wy: Math.floor(p.y + n.y * 0.001),
      wz: Math.floor(p.z + n.z * 0.001),
    };

    this.targetHighlight.position.set(bx + 0.5, by + 0.5, bz + 0.5);
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
