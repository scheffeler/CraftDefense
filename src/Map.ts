import * as THREE from "three";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";
import type { BlockId, BlockDef } from "./types";
import { generateWorld } from "./WorldGen";
import { WORLD_DEPTH } from "./config/map";

// BVH acceleration for raycasting
(THREE.BufferGeometry.prototype as any).computeBoundsTree = computeBoundsTree;
(THREE.BufferGeometry.prototype as any).disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// ---------------------------------------------------------------------------
// Block definitions
// ---------------------------------------------------------------------------
export const BLOCK_DEFS: Record<BlockId, BlockDef> = {
  air:            { id: "air",            name: "Air",            color: 0x000000,                   hardness: 0,    placeable: false, transparent: true  },
  grass:          { id: "grass",          name: "Grass",          color: 0x8b5c2a, topColor: 0x5d9e3a, hardness: 1, placeable: true,  transparent: false },
  dirt:           { id: "dirt",           name: "Dirt",           color: 0x8b5c2a,                   hardness: 1,    placeable: true,  transparent: false },
  stone:          { id: "stone",          name: "Stone",          color: 0x888888,                   hardness: 3,    placeable: true,  transparent: false },
  wood:           { id: "wood",           name: "Wood",           color: 0x6b4c2a, topColor: 0xb8905a, hardness: 2,  placeable: true,  transparent: false },
  planks:         { id: "planks",         name: "Planks",         color: 0xc8a060,                   hardness: 2,    placeable: true,  transparent: false },
  cobblestone:    { id: "cobblestone",    name: "Cobblestone",    color: 0x888070,                   hardness: 3,    placeable: true,  transparent: false },
  sand:           { id: "sand",           name: "Sand",           color: 0xd4c484,                   hardness: 1,    placeable: true,  transparent: false },
  glass:          { id: "glass",          name: "Glass",          color: 0x88ccee,                   hardness: 1,    placeable: true,  transparent: true  },
  leaves:         { id: "leaves",         name: "Leaves",         color: 0x3a7a25,                   hardness: 0.5,  placeable: true,  transparent: true  },
  obsidian:       { id: "obsidian",       name: "Obsidian",       color: 0x1a0a2a,                   hardness: 10,   placeable: true,  transparent: false },
  iron_ore:       { id: "iron_ore",       name: "Iron Ore",       color: 0x888888, topColor: 0x998877, hardness: 4,  placeable: true,  transparent: false },
  coal_ore:       { id: "coal_ore",       name: "Coal Ore",       color: 0x888888, topColor: 0x555555, hardness: 3,  placeable: true,  transparent: false },
  iron_block:     { id: "iron_block",     name: "Iron Block",     color: 0xaaaaaa,                   hardness: 5,    placeable: true,  transparent: false },
  crafting_table: { id: "crafting_table", name: "Crafting Table", color: 0x6b4c2a, topColor: 0x7a3a2a, hardness: 2,  placeable: true,  transparent: false },
  furnace:        { id: "furnace",        name: "Furnace",        color: 0x777777, topColor: 0x555555, hardness: 3,  placeable: true,  transparent: false },
  torch:          { id: "torch",          name: "Torch",          color: 0xffaa22,                   hardness: 0,    placeable: true,  transparent: true  },
  chest:          { id: "chest",          name: "Chest",          color: 0xa05020, topColor: 0x8b6914, hardness: 2, placeable: true,  transparent: false },
  water:          { id: "water",          name: "Water",          color: 0x3a9aee,                   hardness: 0,    placeable: false, transparent: true  },
  bedrock:        { id: "bedrock",        name: "Bedrock",        color: 0x333333,                   hardness: 999,  placeable: false, transparent: false },
  gravel:         { id: "gravel",         name: "Gravel",         color: 0x888880,                   hardness: 0.8,  placeable: true,  transparent: false },
  gold_ore:       { id: "gold_ore",       name: "Gold Ore",       color: 0x888888, topColor: 0xddaa00, hardness: 4,  placeable: false, transparent: false },
  diamond_ore:    { id: "diamond_ore",    name: "Diamond Ore",    color: 0x888888, topColor: 0x00cccc, hardness: 5,  placeable: false, transparent: false },
  farmland:       { id: "farmland",       name: "Farmland",       color: 0x7a4f2e,                   hardness: 0.6,  placeable: false, transparent: false },
  wheat_0:        { id: "wheat_0",        name: "Wheat (sprout)", color: 0x3d7a15,                   hardness: 0,    placeable: false, transparent: true  },
  wheat_1:        { id: "wheat_1",        name: "Wheat (young)",  color: 0x5a9a20,                   hardness: 0,    placeable: false, transparent: true  },
  wheat_2:        { id: "wheat_2",        name: "Wheat (mature)", color: 0x8aaa2a,                   hardness: 0,    placeable: false, transparent: true  },
  wheat_3:        { id: "wheat_3",        name: "Wheat (ready!)", color: 0xd4a820, topColor: 0xe8d040, hardness: 0, placeable: false, transparent: true  },
  snow:             { id: "snow",             name: "Snow",             color: 0xe8eef8,                   hardness: 0.5,  placeable: true,  transparent: false },
  cactus:           { id: "cactus",           name: "Cactus",           color: 0x2d7a2d,                   hardness: 0.5,  placeable: false, transparent: false },
  bookshelf:        { id: "bookshelf",        name: "Bookshelf",        color: 0xc8a060, topColor: 0x7a3a14, hardness: 1.5,  placeable: true,  transparent: false },
  enchanting_table: { id: "enchanting_table", name: "Enchanting Table", color: 0x1a0a2a, topColor: 0xaa0022, hardness: 5.0,  placeable: true,  transparent: false },
  bed:              { id: "bed",              name: "Bed",              color: 0xcc3333, topColor: 0xaa2222, hardness: 0.2,  placeable: true,  transparent: false },
  dispenser:        { id: "dispenser",        name: "Arrow Dispenser",  color: 0x555544, topColor: 0x888866, hardness: 3.5,  placeable: true,  transparent: false },
  tnt:              { id: "tnt",              name: "TNT",              color: 0xcc2222, topColor: 0xeeeeee, hardness: 0.0,  placeable: true,  transparent: false },
  lava:             { id: "lava",             name: "Lava",             color: 0xff6600, topColor: 0xff4400, hardness: 0,    placeable: true,  transparent: true  },
  fire:             { id: "fire",             name: "Fire",             color: 0xff8800, topColor: 0xffcc00, hardness: 0.0,  placeable: false, transparent: true  },
};

const BLOCK_ID_INDEX: BlockId[] = Object.keys(BLOCK_DEFS) as BlockId[];
const BLOCK_TO_IDX: Record<BlockId, number> = {} as Record<BlockId, number>;
BLOCK_ID_INDEX.forEach((id, i) => { BLOCK_TO_IDX[id] = i; });

// ---------------------------------------------------------------------------
// Voxel chunk
// ---------------------------------------------------------------------------
const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 32;
const BLOCK_SIZE = 1.0;

// ---------------------------------------------------------------------------
// Biome grass tinting — matches WorldGen biome detection so grass color
// varies by region (forest=lush green, desert=dry yellow, taiga=cool blue)
// ---------------------------------------------------------------------------
function biomeHash(x: number, z: number): number {
  let h = (x * 374761393 + z * 1234567891) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return h >>> 0;
}

function grassBiomeTint(wx: number, wz: number): [number, number, number] {
  // Near map edges → always forest
  if (wz <= 12 || wz >= WORLD_DEPTH - 13) return [1.0, 1.0, 1.0];
  // Coarse + fine noise matches WorldGen.getBiome
  const bx = Math.floor(wx / 22), bz = Math.floor(wz / 22);
  const n1 = (biomeHash(bx * 9871 + 3001, bz * 7649 + 2003) % 1000) / 1000;
  const fx = Math.floor(wx / 11), fz = Math.floor(wz / 11);
  const n2 = (biomeHash(fx * 4567 + 1001, fz * 3457 + 5003) % 1000) / 1000;
  const n = n1 * 0.75 + n2 * 0.25;
  if (n < 0.28) return [1.04, 0.84, 0.62]; // desert: warm dry tan-green
  if (n > 0.70) return [0.80, 0.96, 0.88]; // taiga: cool blue-green
  return [1.0, 1.0, 1.0];                   // forest: vibrant green (unchanged)
}

class Chunk {
  readonly cx: number;
  readonly cz: number;
  readonly data: Uint8Array;
  mesh: THREE.Mesh | null = null;
  waterMesh: THREE.Mesh | null = null;
  lavaMesh: THREE.Mesh | null = null;
  wheatMesh: THREE.Mesh | null = null;
  dirty = true;

  constructor(cx: number, cz: number) {
    this.cx = cx;
    this.cz = cz;
    this.data = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);
  }

  getBlock(lx: number, ly: number, lz: number): BlockId {
    if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) return "air";
    return BLOCK_ID_INDEX[this.data[lx + lz * CHUNK_SIZE + ly * CHUNK_SIZE * CHUNK_SIZE]];
  }

  setBlock(lx: number, ly: number, lz: number, id: BlockId): void {
    if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) return;
    this.data[lx + lz * CHUNK_SIZE + ly * CHUNK_SIZE * CHUNK_SIZE] = BLOCK_TO_IDX[id];
    this.dirty = true;
  }
}

// ---------------------------------------------------------------------------
// Block texture atlas index
// Atlas is 16 tiles wide × 2 rows tall (32 total tiles).
// Row 0 = tiles 0–15 (v = 0.0–0.5), Row 1 = tiles 16–31 (v = 0.5–1.0).
// Tile 13 = generic white (lets vertex color control appearance).
// ---------------------------------------------------------------------------
function getBlockTexIndex(id: BlockId, normalY: number): number {
  const isTop = normalY > 0;
  const isBot = normalY < 0;
  switch (id as string) {
    // Row 0 — original tiles
    case "stone":          return 0;
    case "cobblestone":    return 1;
    case "dirt":
    case "farmland":       return 2;
    case "grass":          return isTop ? 3 : (isBot ? 2 : 4);
    case "sand":           return 5;
    case "wood":           return (isTop || isBot) ? 7 : 6;
    case "planks":         return 8;
    case "leaves":         return 9;
    case "iron_ore":       return 10;
    case "coal_ore":       return 11;
    case "bedrock":        return 12;
    case "gold_ore":       return 14;
    case "diamond_ore":    return 15;
    // Row 1 — new distinct textures
    case "furnace":        return isTop ? 0 : 16;
    case "chest":          return 17;
    case "crafting_table": return isTop ? 18 : 8;
    case "obsidian":       return 19;
    case "iron_block":     return 20;
    case "glass":          return 21;
    case "water":          return 22;
    case "bookshelf":      return isTop ? 8 : 23;
    case "snow":             return 24;
    case "cactus":           return 25;
    case "tnt":              return 26;
    case "gravel":           return 27;
    case "enchanting_table": return isTop ? 28 : 19;
    case "lava":             return 29;
    case "dispenser":        return isTop ? 0 : 30;
    case "bed":              return isTop ? 31 : 8;
    default:                 return 13;
  }
}

// ---------------------------------------------------------------------------
// Voxel world
// ---------------------------------------------------------------------------
export class VoxelWorld {
  private readonly chunks = new Map<string, Chunk>();
  readonly scene: THREE.Scene;
  private readonly chunkMeshGroup: THREE.Group;
  private readonly blockTex: THREE.Texture;
  private readonly waterMat: THREE.MeshLambertMaterial;
  private readonly lavaMat: THREE.MeshLambertMaterial;
  private readonly wheatMat: THREE.MeshLambertMaterial;
  private _fluidTime = 0;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.chunkMeshGroup = new THREE.Group();
    scene.add(this.chunkMeshGroup);
    this.blockTex = VoxelWorld.makeBlockTexture();
    this.waterMat = VoxelWorld.makeFluidMaterial("water");
    this.lavaMat = VoxelWorld.makeFluidMaterial("lava");
    this.wheatMat = VoxelWorld.makeWheatMaterial();
  }

  /** Advance fluid animation — call every frame with elapsed seconds. */
  updateFluidAnimation(dt: number): void {
    this._fluidTime += dt;
    const t = this._fluidTime;
    // Water: diagonal scroll with a gentle wave
    const wMap = this.waterMat.map!;
    wMap.offset.x = (t * 0.04) % 1;
    wMap.offset.y = (t * 0.06 + Math.sin(t * 0.7) * 0.008) % 1;
    // Lava: slow counter-diagonal scroll
    const lMap = this.lavaMat.map!;
    lMap.offset.x = (t * -0.018) % 1;
    lMap.offset.y = (t * 0.012) % 1;
  }

  private static makeFluidMaterial(type: "water" | "lava"): THREE.MeshLambertMaterial {
    const S = 32;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = S;
    const ctx = canvas.getContext("2d")!;

    if (type === "water") {
      // Deep blue base
      ctx.fillStyle = "#1a5fa8";
      ctx.fillRect(0, 0, S, S);
      // Diagonal ripple lines (tileable at 45°)
      for (let i = -S; i < S * 2; i += 7) {
        const alpha = 0.12 + 0.07 * Math.sin(i * 0.45);
        ctx.strokeStyle = `rgba(80,180,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i + S, S);
        ctx.stroke();
      }
      // Secondary finer ripples
      for (let i = -S; i < S * 2; i += 3) {
        ctx.strokeStyle = "rgba(140,220,255,0.06)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(i, 0); ctx.lineTo(i + S, S);
        ctx.stroke();
      }
      // Bright highlight blobs for light-scatter feel
      for (let j = 0; j < 7; j++) {
        const bx = ((j * 13 + 5) % S);
        const bz = ((j * 9  + 3) % S);
        const grad = ctx.createRadialGradient(bx, bz, 0, bx, bz, 5);
        grad.addColorStop(0, "rgba(180,240,255,0.30)");
        grad.addColorStop(1, "rgba(180,240,255,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, S, S);
      }
    } else {
      // Dark lava base
      ctx.fillStyle = "#991800";
      ctx.fillRect(0, 0, S, S);
      // Bright molten blob cores
      const blobData: [number, number, number][] = [
        [4,  4,  6], [14, 10, 5], [24, 6,  7], [8,  22, 5],
        [20, 20, 6], [28, 16, 4], [2,  16, 4], [16, 28, 5],
      ];
      for (const [bx, bz, r] of blobData) {
        const grad = ctx.createRadialGradient(bx, bz, 0, bx, bz, r * 2);
        grad.addColorStop(0,   "rgba(255,210,0,0.95)");
        grad.addColorStop(0.4, "rgba(255,110,0,0.75)");
        grad.addColorStop(1,   "rgba(160,20,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, S, S);
      }
      // Dark crackling veins
      ctx.strokeStyle = "rgba(50,5,0,0.75)";
      ctx.lineWidth = 1;
      const veins: [number,number,number,number][] = [
        [0,8, 12,20], [12,20,28,14], [28,14,20,32], [5,0,18,10], [22,26,32,18],
      ];
      for (const [x0,y0,x1,y1] of veins) {
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      }
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.generateMipmaps = true;

    const mat = new THREE.MeshLambertMaterial({
      map: tex,
      transparent: type === "water",
      opacity: type === "water" ? 0.80 : 1.0,
    });
    if (type === "lava") {
      mat.emissive = new THREE.Color(0xff3300);
      mat.emissiveIntensity = 0.55;
    }
    return mat;
  }

  private static makeWheatMaterial(): THREE.MeshLambertMaterial {
    // 4-stage wheat sprite sheet: 64×16 canvas, each 16×16 tile is one growth stage.
    // Sprites drawn with transparent backgrounds; cross geometry uses alphaTest:0.5.
    const STAGES = 4, S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = STAGES * S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, STAGES * S, S);

    const px = (x: number, y: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); };

    const drawStage = (ox: number, stage: number) => {
      const stemCols: [string, string][] = [
        ["#3d7a15", "#2d6010"],   // stage 0: dark young green
        ["#5a9a20", "#4a8018"],   // stage 1: medium green
        ["#8aaa2a", "#7a9a22"],   // stage 2: maturing yellow-green
        ["#d4a820", "#c09018"],   // stage 3: golden ready
      ];
      const headCol = "#e8d040";
      const [stemA, stemB] = stemCols[stage];

      // Plant height (in pixels from bottom) per stage
      const heights = [5, 9, 12, 16];
      const h = heights[stage];
      const y0 = S - h;  // top of plant in canvas coords (canvas y=0 is top)

      // Main stem: 2px wide at center
      for (let y = y0 + 2; y < S; y++) {
        px(ox + 7, y, stemA);
        px(ox + 8, y, stemB);
      }

      // Side leaves (stages 1+)
      if (stage >= 1) {
        const lf = y0 + 4;
        for (let x = ox + 4; x <= ox + 6; x++) px(x, lf, stemA);  // left leaf
        for (let x = ox + 9; x <= ox + 11; x++) px(x, lf + 1, stemA);  // right leaf staggered
      }
      if (stage >= 2) {
        const lf2 = y0 + 6;
        for (let x = ox + 3; x <= ox + 6; x++) px(x, lf2, stemA);
        for (let x = ox + 9; x <= ox + 12; x++) px(x, lf2 + 1, stemA);
        // Short drooping tip
        px(ox + 7, y0 + 1, stemA); px(ox + 8, y0 + 1, stemB);
      }

      // Seed heads for stage 3 (golden top cluster)
      if (stage === 3) {
        for (let y = y0; y <= y0 + 3; y++) {
          for (let x = ox + 5; x <= ox + 10; x++) px(x, y, headCol);
        }
        // Bright highlights inside head
        for (let y = y0; y <= y0 + 1; y++) {
          for (let x = ox + 6; x <= ox + 9; x++) px(x, y, "#f0e050");
        }
        // Individual grain bumps
        px(ox + 5, y0, stemA); px(ox + 10, y0, stemA);
        px(ox + 5, y0 + 2, stemA); px(ox + 10, y0 + 2, stemA);
      }
    };

    for (let s = 0; s < STAGES; s++) drawStage(s * S, s);

    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return new THREE.MeshLambertMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.4,
      side: THREE.DoubleSide,
    });
  }

  private static makeBlockTexture(): THREE.Texture {
    // 16 textures × 16px wide = 256px atlas, 32px tall (2 rows of 16 tiles each).
    const ATLAS_TILES = 16;
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = ATLAS_TILES * S; canvas.height = S * 2;
    const ctx = canvas.getContext("2d")!;

    // Seeded RNG per tile for deterministic pixel art
    const rng = (seed: number) => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; };

    // Row-0 helpers (y offset = 0)
    const pixel = (x: number, y: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); };
    const border = (ox: number) => {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(ox, 0, S, 1); ctx.fillRect(ox, S-1, S, 1);
      ctx.fillRect(ox, 0, 1, S); ctx.fillRect(ox+S-1, 0, 1, S);
    };
    const fill = (ox: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(ox, 0, S, S); };
    const noise = (ox: number, baseR: number, baseG: number, baseB: number, variance: number, seed: number) => {
      const r = rng(seed);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * variance;
        const cr = Math.max(0, Math.min(255, baseR + v * 255)) | 0;
        const cg = Math.max(0, Math.min(255, baseG + v * 255)) | 0;
        const cb = Math.max(0, Math.min(255, baseB + v * 255)) | 0;
        pixel(ox + x, y, `rgb(${cr},${cg},${cb})`);
      }
    };

    // Row-1 helpers (y offset = S — tiles 16–31)
    const pixel1 = (tx: number, x: number, y: number, col: string) => {
      ctx.fillStyle = col; ctx.fillRect(tx + x, S + y, 1, 1);
    };
    const fill1 = (tx: number, col: string) => {
      ctx.fillStyle = col; ctx.fillRect(tx, S, S, S);
    };
    const border1 = (tx: number) => {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.fillRect(tx, S, S, 1); ctx.fillRect(tx, S + S-1, S, 1);
      ctx.fillRect(tx, S, 1, S); ctx.fillRect(tx+S-1, S, 1, S);
    };
    const noise1 = (tx: number, baseR: number, baseG: number, baseB: number, variance: number, seed: number) => {
      const r = rng(seed);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * variance;
        const cr = Math.max(0, Math.min(255, baseR + v * 255)) | 0;
        const cg = Math.max(0, Math.min(255, baseG + v * 255)) | 0;
        const cb = Math.max(0, Math.min(255, baseB + v * 255)) | 0;
        pixel1(tx, x, y, `rgb(${cr},${cg},${cb})`);
      }
    };

    // 0: stone — gray noise with subtle crack detail lines
    noise(0 * S, 136, 136, 136, 0.08, 1001);
    { const rc = rng(2001);
      ctx.strokeStyle = "rgba(80,80,80,0.55)"; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const sx = (rc() * 10 + 3) | 0, sy = (rc() * 8 + 2) | 0;
        const mx = (rc() * 4 + sx + 14) % 16 | 0, my = Math.min(14, sy + 2 + (rc() * 3) | 0);
        const ex = (rc() * 3 + mx + 15) % 16 | 0, ey = Math.min(15, my + 1 + (rc() * 2) | 0);
        ctx.beginPath();
        ctx.moveTo(0 * S + sx + 0.5, sy + 0.5);
        ctx.lineTo(0 * S + mx + 0.5, my + 0.5);
        ctx.lineTo(0 * S + ex + 0.5, ey + 0.5);
        ctx.stroke();
        ctx.fillStyle = "rgba(175,175,175,0.28)";
        ctx.fillRect(0 * S + sx, Math.max(0, sy - 1), 1, 1);
      }
    }
    border(0 * S);

    // 1: cobblestone — dark mortar with defined stone blocks
    fill(1 * S, "#6e6658");
    { const r = rng(2002);
      const stones: [number,number,number,number,number,number,number][] = [
        [1,0,6,5,138,130,114], [8,0,7,4,124,118,102],
        [0,6,5,8,144,136,118], [7,5,8,9,130,122,106],
        [1,13,5,3,136,128,112], [8,14,7,2,126,120,104],
      ];
      for (const [sx,sy,sw,sh,br,bg,bb] of stones) {
        for (let py = 1; py < sh-1; py++) for (let px = 1; px < sw-1; px++) {
          const v = (r() - 0.5) * 0.1;
          pixel(1*S + sx+px, sy+py,
            `rgb(${Math.max(0,Math.min(255,(br + v*255)|0))},${Math.max(0,Math.min(255,(bg + v*255)|0))},${Math.max(0,Math.min(255,(bb + v*255)|0))})`);
        }
        ctx.fillStyle = "rgba(255,255,255,0.14)";
        ctx.fillRect(1*S + sx+1, sy+1, sw-2, 1);
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        ctx.fillRect(1*S + sx+1, sy+sh-2, sw-2, 1);
      }
    }

    // 2: dirt — brown with noise
    noise(2 * S, 139, 92, 42, 0.1, 1003);
    border(2 * S);

    // 3: grass top — bright green with varied tufts
    noise(3 * S, 90, 155, 55, 0.12, 1004);
    { const r = rng(2004);
      for (let i = 0; i < 5; i++) {
        const px2 = (r() * 12 + 2) | 0, py2 = (r() * 12 + 2) | 0;
        ctx.fillStyle = "rgba(55,105,25,0.45)"; ctx.fillRect(3 * S + px2, py2, 2, 2);
      }
      for (let i = 0; i < 5; i++) {
        const px2 = (r() * 12 + 2) | 0, py2 = (r() * 12 + 2) | 0;
        ctx.fillStyle = "rgba(140,215,85,0.35)"; ctx.fillRect(3 * S + px2, py2, 2, 1);
      }
    }
    border(3 * S);

    // 4: grass side — 4px green band with blade highlights and fading transition
    noise(4 * S, 139, 92, 42, 0.08, 1005);
    { const rg = rng(2005);
      ctx.fillStyle = "rgba(88,155,50,0.94)"; ctx.fillRect(4 * S, 0, S, 4);
      for (let x = 0; x < S; x++) {
        if (rg() > 0.48) { ctx.fillStyle = "rgba(115,192,65,0.72)"; ctx.fillRect(4 * S + x, 0, 1, rg() > 0.6 ? 2 : 1); }
      }
      for (let x = 0; x < S; x++) for (let y = 4; y < 7; y++) {
        const f = (7 - y) / 3.5;
        if (rg() < f * 0.55) { ctx.fillStyle = `rgba(88,155,50,${(0.28 + rg() * 0.42).toFixed(2)})`; ctx.fillRect(4 * S + x, y, 1, 1); }
      }
    }
    border(4 * S);

    // 5: sand — sandy with subtle horizontal dune ripple lines
    noise(5 * S, 212, 196, 132, 0.07, 1006);
    { for (let y = 1; y < S; y += 3) {
        ctx.fillStyle = "rgba(175,160,100,0.14)"; ctx.fillRect(5 * S, y, S, 1);
        ctx.fillStyle = "rgba(235,220,162,0.18)"; ctx.fillRect(5 * S, y + 1, S, 1);
      }
    }
    border(5 * S);

    // 6: wood side — brown with vertical grain
    fill(6 * S, "#6b4c2a");
    { const r = rng(2006);
      for (let x = 1; x < S - 1; x++) {
        const dark = r() > 0.6;
        for (let y = 1; y < S - 1; y++) {
          const v = (r() - 0.5) * 30;
          const b = dark ? -20 : 0;
          const cr = Math.max(0, Math.min(255, 107 + b + v)) | 0;
          const cg = Math.max(0, Math.min(255, 76 + b + v)) | 0;
          const cb = Math.max(0, Math.min(255, 42 + b + v * 0.5)) | 0;
          pixel(6 * S + x, y, `rgb(${cr},${cg},${cb})`);
        }
      }
    }
    border(6 * S);

    // 7: wood top — annular ring pattern
    fill(7 * S, "#b8905a");
    { const cx = 8, cy = 8;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const ring = Math.abs(Math.sin(dist * 0.8)) * 0.2 + 0.9;
        const cr = Math.min(255, Math.round(184 * ring)) | 0;
        const cg = Math.min(255, Math.round(144 * ring)) | 0;
        const cb = Math.min(255, Math.round(90 * ring)) | 0;
        pixel(7 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
    }
    border(7 * S);

    // 8: planks — tan with plank seams
    fill(8 * S, "#c8a060");
    { const r = rng(2008);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 20;
        pixel(8 * S + x, y, `rgb(${(200 + v) | 0},${(160 + v * 0.8) | 0},${(96 + v * 0.5) | 0})`);
      }
      // horizontal seams every 4px
      for (let y = 3; y < S; y += 4) { ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(8 * S, y, S, 1); }
      // vertical offset seam
      ctx.fillStyle = "rgba(0,0,0,0.15)"; ctx.fillRect(8 * S + 8, 0, 1, 4); ctx.fillRect(8 * S + 8, 8, 1, 4);
    }
    border(8 * S);

    // 9: leaves — mottled green with varied palette and highlight accents
    fill(9 * S, "transparent");
    { const rl = rng(2009);
      const lp: [number,number,number][] = [
        [46, 104, 28], [60, 128, 40], [72, 150, 52], [40, 92, 22], [85, 165, 54],
      ];
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        if (rl() < 0.12) { pixel(9 * S + x, y, "rgba(0,0,0,0)"); continue; }
        const [lr, lg, lb] = lp[(rl() * lp.length) | 0];
        const bright = 0.74 + rl() * 0.36;
        pixel(9 * S + x, y, `rgb(${(lr * bright)|0},${(lg * bright)|0},${(lb * bright)|0})`);
      }
      for (let i = 0; i < 3; i++) {
        const hx = (rl() * 12 + 2) | 0, hy = (rl() * 12 + 2) | 0;
        ctx.fillStyle = "rgba(100,192,62,0.30)"; ctx.fillRect(9 * S + hx, hy, 2, 1);
      }
    }
    border(9 * S);

    // 10: iron ore — stone base with orange flecks
    noise(10 * S, 136, 136, 136, 0.07, 1010);
    { const r = rng(2010);
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * 11 + 2) | 0, oy2 = (r() * 11 + 2) | 0;
        ctx.fillStyle = "#cc8844"; ctx.fillRect(10 * S + ox2, oy2, 2, 2);
        ctx.fillStyle = "#dd9955"; ctx.fillRect(10 * S + ox2, oy2, 1, 1);
      }
    }
    border(10 * S);

    // 11: coal ore — stone base with dark spots
    noise(11 * S, 136, 136, 136, 0.07, 1011);
    { const r = rng(2011);
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * 11 + 2) | 0, oy2 = (r() * 11 + 2) | 0;
        ctx.fillStyle = "#222222"; ctx.fillRect(11 * S + ox2, oy2, 2, 2);
        ctx.fillStyle = "#333333"; ctx.fillRect(11 * S + ox2 + 1, oy2, 1, 1);
      }
    }
    border(11 * S);

    // 12: bedrock — very dark irregular
    noise(12 * S, 51, 51, 51, 0.15, 1012);
    { const r = rng(2012);
      for (let i = 0; i < 8; i++) {
        const ox2 = (r() * 12 + 1) | 0, oy2 = (r() * 12 + 1) | 0;
        ctx.fillStyle = "#111111"; ctx.fillRect(12 * S + ox2, oy2, 2, 2);
      }
    }
    border(12 * S);

    // 13: generic/default — white with border (vertex color controls appearance)
    fill(13 * S, "#ffffff");
    border(13 * S);

    // 14: gold ore — stone base with gold flecks
    noise(14 * S, 136, 136, 136, 0.07, 1014);
    { const r = rng(2014);
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * 11 + 2) | 0, oy2 = (r() * 11 + 2) | 0;
        ctx.fillStyle = "#ddaa00"; ctx.fillRect(14 * S + ox2, oy2, 2, 2);
        ctx.fillStyle = "#eebb22"; ctx.fillRect(14 * S + ox2, oy2, 1, 1);
      }
    }
    border(14 * S);

    // 15: diamond ore — stone base with cyan diamonds
    noise(15 * S, 136, 136, 136, 0.07, 1015);
    { const r = rng(2015);
      for (let i = 0; i < 4; i++) {
        const ox2 = (r() * 10 + 3) | 0, oy2 = (r() * 10 + 3) | 0;
        pixel(15 * S + ox2, oy2 + 1, "#00cccc"); pixel(15 * S + ox2 + 1, oy2, "#00cccc");
        pixel(15 * S + ox2 + 1, oy2 + 2, "#00cccc"); pixel(15 * S + ox2 + 2, oy2 + 1, "#00cccc");
        pixel(15 * S + ox2 + 1, oy2 + 1, "#55ffff");
      }
    }
    border(15 * S);

    // ── Row 1: tiles 16–31 ───────────────────────────────────────────────────

    // Tile 16: furnace side — stone with fire opening
    noise1(0 * S, 108, 108, 108, 0.09, 3016);
    { // Stone block pattern
      const r = rng(4016);
      for (let i = 0; i < 4; i++) {
        const bx = (r() * 10 + 2) | 0, by = (r() * 10 + 2) | 0, bw = (r() * 3 + 2) | 0, bh = (r() * 2 + 1) | 0;
        ctx.fillStyle = "rgba(60,60,60,0.3)"; ctx.fillRect(0 * S + bx, S + by, bw, bh);
      }
      // Dark surround for fire opening (centered, lower half)
      ctx.fillStyle = "#222222"; ctx.fillRect(0 * S + 4, S + 5, 8, 8);
      // Orange fire
      ctx.fillStyle = "#cc5500"; ctx.fillRect(0 * S + 5, S + 7, 6, 5);
      ctx.fillStyle = "#ff7700"; ctx.fillRect(0 * S + 6, S + 8, 4, 3);
      ctx.fillStyle = "#ffcc00"; ctx.fillRect(0 * S + 7, S + 9, 2, 2);
      // Top decorative bar
      ctx.fillStyle = "rgba(60,60,60,0.4)"; ctx.fillRect(0 * S + 3, S + 3, 10, 1);
    }
    border1(0 * S);

    // Tile 17: chest — wood with metal trim and clasp
    fill1(1 * S, "#7a4a22");
    { const r = rng(3017);
      // Wood grain noise
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 20;
        pixel1(1 * S, x, y, `rgb(${(122 + v) | 0},${(74 + v * 0.7) | 0},${(34 + v * 0.4) | 0})`);
      }
      // Metal trim frame (1px inner border)
      ctx.fillStyle = "#996633"; ctx.fillRect(1 * S + 1, S + 1, S - 2, 1);
      ctx.fillStyle = "#996633"; ctx.fillRect(1 * S + 1, S + S-2, S - 2, 1);
      ctx.fillStyle = "#996633"; ctx.fillRect(1 * S + 1, S + 1, 1, S - 2);
      ctx.fillStyle = "#996633"; ctx.fillRect(1 * S + S-2, S + 1, 1, S - 2);
      // Horizontal seam (lid line at y=6)
      ctx.fillStyle = "#553311"; ctx.fillRect(1 * S + 1, S + 6, S-2, 1);
      ctx.fillStyle = "#aa7733"; ctx.fillRect(1 * S + 1, S + 7, S-2, 1);
      // Clasp (gold, center)
      ctx.fillStyle = "#ddaa00"; ctx.fillRect(1 * S + 6, S + 5, 4, 5);
      ctx.fillStyle = "#ffdd44"; ctx.fillRect(1 * S + 7, S + 6, 2, 2);
      ctx.fillStyle = "#aa8800"; ctx.fillRect(1 * S + 7, S + 8, 2, 2);
    }
    border1(1 * S);

    // Tile 18: crafting table top — plank base with 3×3 grid marks
    { const r = rng(3018);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 18;
        pixel1(2 * S, x, y, `rgb(${(200 + v) | 0},${(160 + v * 0.8) | 0},${(96 + v * 0.5) | 0})`);
      }
      // 3×3 cell grid lines (every 5px, offset by 1)
      for (let i = 0; i < 3; i++) {
        const gx = 1 + i * 5, gz = 1 + i * 5;
        ctx.fillStyle = "rgba(80,50,20,0.4)";
        ctx.fillRect(2 * S + gx, S, 1, S); // vertical
        ctx.fillRect(2 * S, S + gz, S, 1); // horizontal
      }
      // Slight highlight offset lines
      ctx.fillStyle = "rgba(255,220,150,0.2)";
      for (let i = 0; i < 3; i++) {
        ctx.fillRect(2 * S + 2 + i * 5, S, 1, S);
        ctx.fillRect(2 * S, S + 2 + i * 5, S, 1);
      }
    }
    border1(2 * S);

    // Tile 19: obsidian — deep purple-black with faint crystal shimmer
    { const r = rng(3019);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 0.15;
        const cr = Math.max(0, Math.min(255, 18  + v * 255)) | 0;
        const cg = Math.max(0, Math.min(255,  8  + v * 255)) | 0;
        const cb = Math.max(0, Math.min(255, 28  + v * 255)) | 0;
        pixel1(3 * S, x, y, `rgb(${cr},${cg},${cb})`);
      }
      // Faint purple crystal inclusions
      const r2 = rng(4019);
      for (let i = 0; i < 6; i++) {
        const px2 = (r2() * 12 + 2) | 0, py2 = (r2() * 12 + 2) | 0;
        ctx.fillStyle = `rgba(${(80 + r2() * 60) | 0},${(20 + r2() * 20) | 0},${(100 + r2() * 80) | 0},0.5)`;
        ctx.fillRect(3 * S + px2, S + py2, 2, 1);
      }
    }
    border1(3 * S);

    // Tile 20: iron block — smooth silver with subtle grid seams
    noise1(4 * S, 172, 172, 176, 0.06, 3020);
    { // Subtle seams every 4px
      ctx.fillStyle = "rgba(100,100,110,0.25)";
      for (let i = 4; i < S; i += 4) {
        ctx.fillRect(4 * S, S + i, S, 1);
        ctx.fillRect(4 * S + i, S, 1, S);
      }
      // Highlight on seam corners
      ctx.fillStyle = "rgba(220,220,230,0.3)";
      for (let i = 4; i < S; i += 4) {
        ctx.fillRect(4 * S + i + 1, S + i + 1, 2, 2);
      }
    }
    border1(4 * S);

    // Tile 21: glass — light blue with frosted border frame
    fill1(5 * S, "rgba(160,210,240,0.7)");
    { const r = rng(3021);
      // Slight inner variation
      for (let y = 2; y < S-2; y++) for (let x = 2; x < S-2; x++) {
        const v = r() * 0.12;
        pixel1(5 * S, x, y, `rgba(${(150 + v * 100) | 0},${(200 + v * 80) | 0},${(235 + v * 20) | 0},0.6)`);
      }
      // White border frame (2px)
      ctx.fillStyle = "rgba(220,235,245,0.9)";
      ctx.fillRect(5 * S,     S,     S, 2);
      ctx.fillRect(5 * S,     S+S-2, S, 2);
      ctx.fillRect(5 * S,     S,     2, S);
      ctx.fillRect(5 * S+S-2, S,     2, S);
      // Corner highlights
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.fillRect(5 * S + 1, S + 1, 2, 2);
      ctx.fillRect(5 * S + S-3, S + 1, 2, 2);
      ctx.fillRect(5 * S + 1, S + S-3, 2, 2);
      ctx.fillRect(5 * S + S-3, S + S-3, 2, 2);
    }

    // Tile 22: water top — blue with darker ripple lines
    { const r = rng(3022);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const ripple = Math.sin((x + y * 0.7) * 0.9) * 0.12 + Math.sin((x * 0.6 - y) * 1.2) * 0.08;
        const brightness = 0.85 + ripple;
        const cr = Math.min(255, (50  * brightness + (r() - 0.5) * 10)) | 0;
        const cg = Math.min(255, (130 * brightness + (r() - 0.5) * 10)) | 0;
        const cb = Math.min(255, (220 * brightness + (r() - 0.5) * 10)) | 0;
        pixel1(6 * S, x, y, `rgb(${cr},${cg},${cb})`);
      }
      // Subtle foam/highlight streaks
      ctx.fillStyle = "rgba(180,220,255,0.3)";
      for (let i = 0; i < 3; i++) {
        const lx = (i * 5 + 2), ly = (i * 4 + 1);
        ctx.fillRect(6 * S + lx, S + ly, 4, 1);
      }
    }

    // Tile 23: bookshelf side — two rows of coloured book spines on wood
    { const r = rng(3023);
      // Wood background
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 18;
        pixel1(7 * S, x, y, `rgb(${(200 + v) | 0},${(160 + v * 0.8) | 0},${(96 + v * 0.5) | 0})`);
      }
      // Top and bottom plank rails (2px)
      ctx.fillStyle = "#8b6020"; ctx.fillRect(7 * S, S,     S, 2);
      ctx.fillStyle = "#8b6020"; ctx.fillRect(7 * S, S+S-2, S, 2);
      // Middle rail
      ctx.fillStyle = "#8b6020"; ctx.fillRect(7 * S, S + 7, S, 2);
      // Book spines — top row (y 2–6)
      const bookColors = ["#cc2222","#2244cc","#228833","#cc9900","#882299","#cc4411","#116688","#554422"];
      for (let i = 0; i < 8; i++) {
        const bx = i * 2;
        ctx.fillStyle = bookColors[i % bookColors.length];
        ctx.fillRect(7 * S + bx, S + 2, 2, 5);
        // Lighter spine highlight
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(7 * S + bx, S + 2, 1, 5);
      }
      // Book spines — bottom row (y 9–13)
      for (let i = 0; i < 8; i++) {
        const bx = i * 2;
        ctx.fillStyle = bookColors[(i + 3) % bookColors.length];
        ctx.fillRect(7 * S + bx, S + 9, 2, 5);
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(7 * S + bx, S + 9, 1, 5);
      }
    }
    border1(7 * S);

    // Tile 24: snow — white with subtle cold blue-white noise
    noise1(8 * S, 230, 235, 245, 0.05, 3024);
    { const r = rng(4024);
      // Occasional sparkle pixel
      for (let i = 0; i < 8; i++) {
        const sx = (r() * 14 + 1) | 0, sy = (r() * 14 + 1) | 0;
        pixel1(8 * S, sx, sy, "#ffffff");
      }
    }
    border1(8 * S);

    // Tile 25: cactus — green with lighter stripe and spine dots
    fill1(9 * S, "#2d7a2d");
    { const r = rng(3025);
      // Green noise base
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 20;
        pixel1(9 * S, x, y, `rgb(${(45 + v) | 0},${(122 + v) | 0},${(45 + v) | 0})`);
      }
      // Lighter vertical stripe in center (the rib)
      ctx.fillStyle = "rgba(100,180,100,0.4)";
      ctx.fillRect(9 * S + 6, S, 4, S);
      // Even lighter highlight on stripe
      ctx.fillStyle = "rgba(150,210,150,0.3)";
      ctx.fillRect(9 * S + 7, S, 2, S);
      // Spine dots on edges (every 4px)
      ctx.fillStyle = "#e0e8b0";
      for (let sy = 2; sy < S; sy += 4) {
        ctx.fillRect(9 * S + 1, S + sy, 1, 1);
        ctx.fillRect(9 * S + S-2, S + sy, 1, 1);
      }
    }
    border1(9 * S);

    // Tile 26: TNT — red body with dark cross (classic Minecraft look)
    fill1(10 * S, "#cc2222");
    { ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(10 * S, S + 5, S, 6);     // horizontal dark band
      ctx.fillRect(10 * S + 5, S, 6, S);     // vertical dark band
      ctx.fillStyle = "#ee4444";
      ctx.fillRect(10 * S + 6, S + 6, 4, 4); // bright center highlight
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++)
        ctx.fillRect(10 * S + x, S + y, 1, 1);
      for (let y = 11; y < S; y++) for (let x = 11; x < S; x++)
        ctx.fillRect(10 * S + x, S + y, 1, 1);
    }
    border1(10 * S);

    // Tile 27: gravel — rounded pebble shapes on gray base
    noise1(11 * S, 112, 110, 106, 0.12, 3027);
    { const r = rng(4027);
      for (let i = 0; i < 9; i++) {
        const px2 = (r() * 11 + 1) | 0, py2 = (r() * 11 + 1) | 0;
        const pw = (r() * 3 + 2) | 0,  ph = (r() * 2 + 2) | 0;
        ctx.fillStyle = "rgba(65,62,58,0.55)";  ctx.fillRect(11 * S + px2, S + py2, pw, ph);
        ctx.fillStyle = "rgba(155,150,144,0.4)"; ctx.fillRect(11 * S + px2 - 1, S + py2 - 1, pw, ph);
      }
    }
    border1(11 * S);

    // Tile 28: enchanting table top — dark purple with glowing rune marks
    { const r = rng(3028);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 0.2;
        pixel1(12 * S, x, y, `rgb(${(22 + v * 255 * 0.5) | 0},${(8 + v * 255 * 0.3) | 0},${(40 + v * 255) | 0})`);
      }
      // Glowing rune marks — red and cyan
      const runeColors = ["#cc0033","#ee1144","#00aacc","#0088aa","#ff2266","#22ccee"];
      const r2 = rng(4028);
      for (let i = 0; i < 9; i++) {
        const rx = (r2() * 12 + 2) | 0, ry = (r2() * 10 + 3) | 0;
        const rw = (r2() * 3 + 1) | 0;
        ctx.fillStyle = runeColors[i % runeColors.length];
        ctx.fillRect(12 * S + rx, S + ry, rw, 1);
        if (r2() > 0.5) ctx.fillRect(12 * S + rx, S + ry + 1, 1, 1);
      }
      // Bright center glow
      pixel1(12 * S, 7, 7, "#ff3366");
      pixel1(12 * S, 8, 8, "#33ddff");
    }
    border1(12 * S);

    // Tile 29: lava top — molten orange with hot-spot glow
    { const r = rng(3029);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const heat = Math.sin((x * 0.6 + y * 0.4) * 0.9) * 0.18 + Math.cos((x * 0.4 - y * 0.7) * 1.1) * 0.12;
        const v = (r() - 0.5) * 0.12 + heat;
        const cr = Math.min(255, (220 + v * 255 * 0.3)) | 0;
        const cg = Math.min(255, (80  + v * 255 * 0.6)) | 0;
        const cb = Math.max(0,   (5   + v * 255 * 0.1)) | 0;
        pixel1(13 * S, x, y, `rgb(${cr},${cg},${cb})`);
      }
      // Bright yellow hotspots
      const r2 = rng(4029);
      for (let i = 0; i < 5; i++) {
        const hx = (r2() * 12 + 2) | 0, hy = (r2() * 12 + 2) | 0;
        ctx.fillStyle = "#ffee00"; ctx.fillRect(13 * S + hx, S + hy, 2, 1);
        ctx.fillStyle = "#ffffff"; ctx.fillRect(13 * S + hx, S + hy, 1, 1);
      }
    }

    // Tile 30: dispenser front — stone with arrow slot opening
    noise1(14 * S, 115, 113, 110, 0.09, 3030);
    { // Dark arrow slot (narrow rectangle center)
      ctx.fillStyle = "#1a1a1a"; ctx.fillRect(14 * S + 5, S + 4, 6, 8);
      // Arrow tip pointing forward (outward)
      ctx.fillStyle = "#888870"; ctx.fillRect(14 * S + 7, S + 6, 2, 4);
      ctx.fillStyle = "#aaaaaa"; ctx.fillRect(14 * S + 8, S + 7, 1, 2);
      // Arrow head v-shape
      ctx.fillStyle = "#ccccaa"; ctx.fillRect(14 * S + 6, S + 5, 4, 1);
      ctx.fillStyle = "#aaaaaa"; ctx.fillRect(14 * S + 7, S + 4, 2, 1);
    }
    border1(14 * S);

    // Tile 31: bed top — red blanket with tan pillow
    { const r = rng(3031);
      // Red blanket noise (lower 2/3)
      for (let y = 5; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 20;
        pixel1(15 * S, x, y, `rgb(${(180 + v) | 0},${(35 + v * 0.3) | 0},${(35 + v * 0.3) | 0})`);
      }
      // Tan pillow (top ~1/3)
      for (let y = 0; y < 5; y++) for (let x = 1; x < S - 1; x++) {
        const v = (r() - 0.5) * 15;
        pixel1(15 * S, x, y, `rgb(${(215 + v) | 0},${(195 + v * 0.8) | 0},${(165 + v * 0.6) | 0})`);
      }
      // Dividing seam
      ctx.fillStyle = "#701515"; ctx.fillRect(15 * S, S + 5, S, 1);
      ctx.fillStyle = "#c04040"; ctx.fillRect(15 * S, S + 4, S, 1);
    }
    border1(15 * S);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestFilter;
    return tex;
  }

  private key(cx: number, cz: number) { return `${cx},${cz}`; }

  getChunk(cx: number, cz: number): Chunk {
    const k = this.key(cx, cz);
    if (!this.chunks.has(k)) this.chunks.set(k, new Chunk(cx, cz));
    return this.chunks.get(k)!;
  }

  getBlock(wx: number, wy: number, wz: number): BlockId {
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const lx = ((wx % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    const lz = ((wz % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
    return this.getChunk(cx, cz).getBlock(lx, wy, lz);
  }

  setBlock(wx: number, wy: number, wz: number, id: BlockId): void {
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const lx = wx - cx * CHUNK_SIZE;
    const lz = wz - cz * CHUNK_SIZE;
    this.getChunk(cx, cz).setBlock(lx, wy, lz, id);
    if (lx === 0)              this.getChunk(cx - 1, cz).dirty = true;
    if (lx === CHUNK_SIZE - 1) this.getChunk(cx + 1, cz).dirty = true;
    if (lz === 0)              this.getChunk(cx, cz - 1).dirty = true;
    if (lz === CHUNK_SIZE - 1) this.getChunk(cx, cz + 1).dirty = true;
  }

  rebuildDirtyChunks(): void {
    this.chunks.forEach(chunk => {
      if (!chunk.dirty) return;
      chunk.dirty = false;
      this.rebuildChunkMesh(chunk);
    });
  }

  private rebuildChunkMesh(chunk: Chunk): void {
    if (chunk.mesh) {
      this.chunkMeshGroup.remove(chunk.mesh);
      chunk.mesh.geometry.dispose();
      (chunk.mesh.material as THREE.Material).dispose();
      chunk.mesh = null;
    }
    if (chunk.waterMesh) {
      this.chunkMeshGroup.remove(chunk.waterMesh);
      chunk.waterMesh.geometry.dispose();
      chunk.waterMesh = null;
    }
    if (chunk.lavaMesh) {
      this.chunkMeshGroup.remove(chunk.lavaMesh);
      chunk.lavaMesh.geometry.dispose();
      chunk.lavaMesh = null;
    }
    if (chunk.wheatMesh) {
      this.chunkMeshGroup.remove(chunk.wheatMesh);
      chunk.wheatMesh.geometry.dispose();
      chunk.wheatMesh = null;
    }

    const positions: number[] = [];
    const normals: number[]   = [];
    const colors: number[]    = [];
    const uvs: number[]       = [];
    const indices: number[]   = [];
    let vi = 0;

    // Separate geometry for animated fluid (water/lava) top faces
    const wPos: number[] = [], wUV: number[] = [], wIdx: number[] = []; let wvi = 0;
    const lPos: number[] = [], lUV: number[] = [], lIdx: number[] = []; let lvi = 0;

    // Wheat cross geometry: collect positions during main pass, build at end
    const wheatEntries: [number, number, number, number][] = []; // [wx, wy, wz, stage]

    const isSolidAO = (bx: number, by: number, bz: number): boolean => {
      const bid = this.getBlock(bx, by, bz);
      return bid !== "air" && !BLOCK_DEFS[bid].transparent;
    };
    const vertAO = (s1: boolean, s2: boolean, c: boolean): number =>
      s1 && s2 ? 0.5 : 1.0 - (s1 ? 0.2 : 0) - (s2 ? 0.2 : 0) - (c ? 0.1 : 0);

    const addFace = (
      ox: number, oy: number, oz: number,
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      nx: number, ny: number, nz: number,
      r: number, g: number, b: number,
      shade: number,
      texIdx = 13,
      ao0 = 1.0, ao1 = 1.0, ao2 = 1.0, ao3 = 1.0
    ) => {
      positions.push(ox, oy, oz, ox+ax, oy+ay, oz+az, ox+bx, oy+by, oz+bz, ox+ax+bx, oy+ay+by, oz+az+bz);
      for (let i = 0; i < 4; i++) normals.push(nx, ny, nz);
      const s = shade;
      colors.push(
        r*s*ao0, g*s*ao0, b*s*ao0,
        r*s*ao1, g*s*ao1, b*s*ao1,
        r*s*ao2, g*s*ao2, b*s*ao2,
        r*s*ao3, g*s*ao3, b*s*ao3,
      );
      const col = texIdx % 16;
      const row = Math.floor(texIdx / 16);
      const u0 = col / 16, u1 = (col + 1) / 16;
      const v0 = row * 0.5, v1 = v0 + 0.5;
      uvs.push(u0, v0, u1, v0, u0, v1, u1, v1);
      // Flip quad diagonal when AO values require it to avoid seam artifacts
      if (ao0 + ao3 > ao1 + ao2) {
        indices.push(vi, vi+1, vi+2, vi+1, vi+3, vi+2);
      } else {
        indices.push(vi+1, vi+3, vi, vi+3, vi+2, vi);
      }
      vi += 4;
    };

    const offX = chunk.cx * CHUNK_SIZE;
    const offZ = chunk.cz * CHUNK_SIZE;

    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let ly = 0; ly < WORLD_HEIGHT; ly++) {
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const id = chunk.getBlock(lx, ly, lz);
          if (id === "air") continue;
          if (id === "torch") continue; // rendered as dedicated 3D mesh, not chunk geometry
          const wx = offX + lx, wy = ly, wz = offZ + lz;
          // Wheat renders as crossed quads, not a solid cube
          if (id === "wheat_0" || id === "wheat_1" || id === "wheat_2" || id === "wheat_3") {
            const stage = id === "wheat_0" ? 0 : id === "wheat_1" ? 1 : id === "wheat_2" ? 2 : 3;
            wheatEntries.push([wx, wy, wz, stage]);
            continue;
          }
          const def = BLOCK_DEFS[id];

          const c = def.color;
          const r = ((c >> 16) & 0xff) / 255;
          const g = ((c >> 8)  & 0xff) / 255;
          const b = (c         & 0xff) / 255;

          const topC = def.topColor ?? def.color;
          const tr = ((topC >> 16) & 0xff) / 255;
          const tg = ((topC >> 8)  & 0xff) / 255;
          const tb = (topC         & 0xff) / 255;

          const clamp = (v: number) => Math.max(0, Math.min(1, v));
          // Hash-based noise with unique seed per face direction for texture variety
          const hn = (ox: number, oz: number, oz2: number) => {
            let h = (wx * 374761393 + wy * 1234567 + wz * 769 + ox * 31337 + oz * 91 + oz2 * 23) | 0;
            h = ((h ^ (h >> 13)) * 1274126177) | 0;
            return ((h >>> 0) % 1000) / 1000 * 0.18 - 0.09;
          };
          const nTop  = hn(1, 0, 0);
          const nBot  = hn(2, 0, 0);
          const nPosX = hn(3, 0, 0);
          const nNegX = hn(4, 0, 0);
          const nPosZ = hn(5, 0, 0);
          const nNegZ = hn(6, 0, 0);

          const neighbors: [number,number,number][] = [[0,1,0],[0,-1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
          const faces = [
            { n:[0,1,0],  a:[1,0,0], b:[0,0,1], shade:1.0,  cr:clamp(tr+nTop),  cg:clamp(tg+nTop),  cb:clamp(tb+nTop)  },
            { n:[0,-1,0], a:[0,0,1], b:[1,0,0], shade:0.45, cr:clamp(r+nBot),   cg:clamp(g+nBot),   cb:clamp(b+nBot)   },
            { n:[1,0,0],  a:[0,0,1], b:[0,1,0], shade:0.8,  cr:clamp(r+nPosX),  cg:clamp(g+nPosX),  cb:clamp(b+nPosX)  },
            { n:[-1,0,0], a:[0,1,0], b:[0,0,1], shade:0.7,  cr:clamp(r+nNegX),  cg:clamp(g+nNegX),  cb:clamp(b+nNegX)  },
            { n:[0,0,1],  a:[0,1,0], b:[1,0,0], shade:0.6,  cr:clamp(r+nPosZ),  cg:clamp(g+nPosZ),  cb:clamp(b+nPosZ)  },
            { n:[0,0,-1], a:[1,0,0], b:[0,1,0], shade:0.6,  cr:clamp(r+nNegZ),  cg:clamp(g+nNegZ),  cb:clamp(b+nNegZ)  },
          ];

          for (let fi = 0; fi < 6; fi++) {
            const [nx, ny, nz] = neighbors[fi];
            const nbId = this.getBlock(wx + nx, wy + ny, wz + nz);
            if (nbId !== "air" && !BLOCK_DEFS[nbId].transparent) continue;

            // Water/lava top faces go to separate animated fluid meshes
            if (fi === 0 && (id === "water" || id === "lava")) {
              const y = wy + 1.008; // fractionally above the solid face to avoid z-fighting
              const p = id === "water" ? { pos: wPos, uv: wUV, idx: wIdx } : { pos: lPos, uv: lUV, idx: lIdx };
              const fvi = id === "water" ? wvi : lvi;
              p.pos.push(wx, y, wz,   wx+1, y, wz,   wx, y, wz+1,   wx+1, y, wz+1);
              // World-space UV so adjacent blocks tile seamlessly; scrolling offset animates them
              p.uv.push(wx, wz,  wx+1, wz,  wx, wz+1,  wx+1, wz+1);
              p.idx.push(fvi, fvi+1, fvi+2, fvi+1, fvi+3, fvi+2);
              if (id === "water") wvi += 4; else lvi += 4;
              continue;
            }

            const f = faces[fi];
            const fTexIdx = getBlockTexIndex(id, f.n[1]);
            // For textured blocks use white vertex colors; grass applies biome tint
            let fr = f.cr, fg = f.cg, fb = f.cb;
            if (fTexIdx !== 13) {
              if (id === "grass") {
                [fr, fg, fb] = grassBiomeTint(wx, wz);
              } else {
                fr = fg = fb = 1.0;
              }
            }
            // Lava and fire self-illuminate: boost HDR above 1.0 so ACES tone mapping glows
            if (id === "lava" || id === "fire") { fr = 2.8; fg = 1.1; fb = 0.1; }

            // Per-vertex AO: check adjacent blocks in tangent directions only
            // Emissive blocks skip AO so glow doesn't get darkened by corners
            const skipAO = (id === "lava" || id === "fire");
            const [tax, tay, taz] = f.a;
            const [tbx, tby, tbz] = f.b;
            const s1n = skipAO ? false : isSolidAO(wx - tax, wy - tay, wz - taz);
            const s1p = skipAO ? false : isSolidAO(wx + tax, wy + tay, wz + taz);
            const s2n = skipAO ? false : isSolidAO(wx - tbx, wy - tby, wz - tbz);
            const s2p = skipAO ? false : isSolidAO(wx + tbx, wy + tby, wz + tbz);
            const ao0 = vertAO(s1n, s2n, skipAO ? false : isSolidAO(wx - tax - tbx, wy - tay - tby, wz - taz - tbz));
            const ao1 = vertAO(s1p, s2n, skipAO ? false : isSolidAO(wx + tax - tbx, wy + tay - tby, wz + taz - tbz));
            const ao2 = vertAO(s1n, s2p, skipAO ? false : isSolidAO(wx - tax + tbx, wy - tay + tby, wz - taz + tbz));
            const ao3 = vertAO(s1p, s2p, skipAO ? false : isSolidAO(wx + tax + tbx, wy + tay + tby, wz + taz + tbz));

            addFace(
              wx + (f.n[0] < 0 ? 0 : f.n[0] > 0 ? 1 : 0),
              wy + (f.n[1] < 0 ? 0 : f.n[1] > 0 ? 1 : 0),
              wz + (f.n[2] < 0 ? 0 : f.n[2] > 0 ? 1 : 0),
              f.a[0] * BLOCK_SIZE, f.a[1] * BLOCK_SIZE, f.a[2] * BLOCK_SIZE,
              f.b[0] * BLOCK_SIZE, f.b[1] * BLOCK_SIZE, f.b[2] * BLOCK_SIZE,
              f.n[0], f.n[1], f.n[2],
              fr, fg, fb,
              f.shade, fTexIdx,
              ao0, ao1, ao2, ao3
            );
          }
        }
      }
    }

    if (positions.length === 0) return;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal",   new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors, 3));
    geo.setAttribute("uv",       new THREE.Float32BufferAttribute(uvs, 2));
    geo.setIndex(indices);
    geo.computeBoundsTree();

    const mat = new THREE.MeshLambertMaterial({
      vertexColors: true,
      map: this.blockTex,
      side: THREE.FrontSide,
      alphaTest: 0.1,
    });
    chunk.mesh = new THREE.Mesh(geo, mat);
    chunk.mesh.receiveShadow = true;
    chunk.mesh.castShadow = true;
    this.chunkMeshGroup.add(chunk.mesh);

    // Build animated water fluid mesh
    if (wPos.length > 0) {
      const wGeo = new THREE.BufferGeometry();
      wGeo.setAttribute("position", new THREE.Float32BufferAttribute(wPos, 3));
      const wNorm = new Float32Array(wPos.length); // all Y normals
      for (let i = 1; i < wNorm.length; i += 3) wNorm[i] = 1;
      wGeo.setAttribute("normal", new THREE.BufferAttribute(wNorm, 3));
      wGeo.setAttribute("uv", new THREE.Float32BufferAttribute(wUV, 2));
      wGeo.setIndex(wIdx);
      chunk.waterMesh = new THREE.Mesh(wGeo, this.waterMat);
      chunk.waterMesh.receiveShadow = false;
      this.chunkMeshGroup.add(chunk.waterMesh);
    }

    // Build animated lava fluid mesh
    if (lPos.length > 0) {
      const lGeo = new THREE.BufferGeometry();
      lGeo.setAttribute("position", new THREE.Float32BufferAttribute(lPos, 3));
      const lNorm = new Float32Array(lPos.length);
      for (let i = 1; i < lNorm.length; i += 3) lNorm[i] = 1;
      lGeo.setAttribute("normal", new THREE.BufferAttribute(lNorm, 3));
      lGeo.setAttribute("uv", new THREE.Float32BufferAttribute(lUV, 2));
      lGeo.setIndex(lIdx);
      chunk.lavaMesh = new THREE.Mesh(lGeo, this.lavaMat);
      chunk.lavaMesh.receiveShadow = false;
      this.chunkMeshGroup.add(chunk.lavaMesh);
    }

    // Build wheat cross geometry (two X-shaped quads per wheat block)
    if (wheatEntries.length > 0) {
      const wpPos: number[] = [], wpNorm: number[] = [], wpUV: number[] = [], wpIdx: number[] = [];
      let wpi = 0;
      const DIAG = 1 / Math.SQRT2; // 0.7071
      const HW = 0.44, YB = 0.02, YT = 0.96; // half-width, y-bottom, y-top within block

      const addWheatQuad = (cx: number, cy: number, cz: number, dx: number, dz: number, u0: number, u1: number) => {
        // Four corners of a diagonal quad: bottom-left, bottom-right, top-left, top-right
        const x0 = cx - dx * HW, z0 = cz - dz * HW;
        const x1 = cx + dx * HW, z1 = cz + dz * HW;
        const y0 = cy + YB, y1 = cy + YT;
        wpPos.push(x0, y0, z0,  x1, y0, z1,  x0, y1, z0,  x1, y1, z1);
        // Upward normals for uniform overhead lighting
        for (let i = 0; i < 4; i++) wpNorm.push(0, 1, 0);
        wpUV.push(u0, 0,  u1, 0,  u0, 1,  u1, 1);
        wpIdx.push(wpi, wpi+1, wpi+2, wpi+1, wpi+3, wpi+2);
        wpi += 4;
      };

      for (const [wx, wy, wz, stage] of wheatEntries) {
        const cx = wx + 0.5, cy = wy, cz = wz + 0.5;
        const u0 = stage / 4, u1 = (stage + 1) / 4;
        addWheatQuad(cx, cy, cz,  DIAG,  DIAG, u0, u1); // 45° diagonal
        addWheatQuad(cx, cy, cz,  DIAG, -DIAG, u0, u1); // 135° diagonal
      }

      const wGeo = new THREE.BufferGeometry();
      wGeo.setAttribute("position", new THREE.Float32BufferAttribute(wpPos, 3));
      wGeo.setAttribute("normal",   new THREE.Float32BufferAttribute(wpNorm, 3));
      wGeo.setAttribute("uv",       new THREE.Float32BufferAttribute(wpUV, 2));
      wGeo.setIndex(wpIdx);
      chunk.wheatMesh = new THREE.Mesh(wGeo, this.wheatMat);
      chunk.wheatMesh.receiveShadow = false;
      this.chunkMeshGroup.add(chunk.wheatMesh);
    }
  }

  /** Return world-space positions of all blocks with the given id. */
  scanForBlock(id: BlockId): Array<[number, number, number]> {
    const out: Array<[number, number, number]> = [];
    this.chunks.forEach(chunk => {
      for (let lx = 0; lx < CHUNK_SIZE; lx++)
        for (let ly = 0; ly < WORLD_HEIGHT; ly++)
          for (let lz = 0; lz < CHUNK_SIZE; lz++)
            if (chunk.getBlock(lx, ly, lz) === id)
              out.push([chunk.cx * CHUNK_SIZE + lx, ly, chunk.cz * CHUNK_SIZE + lz]);
    });
    return out;
  }

  getChunkMeshes(): THREE.Mesh[] {
    const meshes: THREE.Mesh[] = [];
    this.chunks.forEach(c => { if (c.mesh) meshes.push(c.mesh); });
    return meshes;
  }
}

// ---------------------------------------------------------------------------
// GameMap — wraps VoxelWorld; TD-specific grid removed
// ---------------------------------------------------------------------------
export class GameMap {
  readonly world: VoxelWorld;

  constructor(scene: THREE.Scene) {
    this.world = new VoxelWorld(scene);
    generateWorld(this.world);
    this.world.rebuildDirtyChunks();
  }

  updateFluidAnimation(dt: number): void {
    this.world.updateFluidAnimation(dt);
  }

  scanForBlock(id: import("./types").BlockId): Array<[number, number, number]> {
    return this.world.scanForBlock(id);
  }

  getChunkMeshes(): THREE.Mesh[] {
    return this.world.getChunkMeshes();
  }
}
