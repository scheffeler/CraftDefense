import * as THREE from "three";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";
import type { BlockId, BlockDef } from "./types";
import { generateWorld } from "./WorldGen";

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

class Chunk {
  readonly cx: number;
  readonly cz: number;
  readonly data: Uint8Array;
  mesh: THREE.Mesh | null = null;
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
// ---------------------------------------------------------------------------
function getBlockTexIndex(id: BlockId, normalY: number): number {
  const isTop = normalY > 0;
  const isBot = normalY < 0;
  switch (id as string) {
    case "stone":        return 0;
    case "cobblestone":  return 1;
    case "dirt":
    case "farmland":     return 2;
    case "grass":        return isTop ? 3 : (isBot ? 2 : 4);
    case "sand":         return 5;
    case "wood":         return (isTop || isBot) ? 7 : 6;
    case "planks":       return 8;
    case "leaves":       return 9;
    case "iron_ore":     return 10;
    case "coal_ore":     return 11;
    case "bedrock":      return 12;
    case "gold_ore":     return 14;
    case "diamond_ore":  return 15;
    default:             return 13;
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

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.chunkMeshGroup = new THREE.Group();
    scene.add(this.chunkMeshGroup);
    this.blockTex = VoxelWorld.makeBlockTexture();
  }

  private static makeBlockTexture(): THREE.Texture {
    // 16 textures × 32px wide = 512px atlas, 32px tall — 4× more detail per tile
    const ATLAS_TILES = 16;
    const S = 32;
    const canvas = document.createElement("canvas");
    canvas.width = ATLAS_TILES * S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;

    const rng = (seed: number) => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; };

    const pixel = (x: number, y: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); };
    const fill   = (ox: number, col: string)           => { ctx.fillStyle = col; ctx.fillRect(ox, 0, S, S); };
    const border = (ox: number) => {
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(ox, 0, S, 1); ctx.fillRect(ox, S - 1, S, 1);
      ctx.fillRect(ox, 0, 1, S); ctx.fillRect(ox + S - 1, 0, 1, S);
    };
    const noise = (ox: number, bR: number, bG: number, bB: number, variance: number, seed: number) => {
      const r = rng(seed);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * variance;
        pixel(ox + x, y, `rgb(${Math.max(0,Math.min(255,bR+v*255))|0},${Math.max(0,Math.min(255,bG+v*255))|0},${Math.max(0,Math.min(255,bB+v*255))|0})`);
      }
    };

    // ── 0: stone — gray noise with subtle crack lines ──────────────────────────
    noise(0, 128, 128, 128, 0.1, 1001);
    {
      const r = rng(3001);
      for (let i = 0; i < 5; i++) {
        const x0 = (r() * 26 + 2) | 0, y0 = (r() * 26 + 2) | 0, len = (r() * 9 + 5) | 0;
        const horiz = r() > 0.5;
        for (let j = 0; j < len; j++) {
          const cx = Math.min(S - 1, x0 + (horiz ? j : 0));
          const cy = Math.min(S - 1, y0 + (horiz ? 0 : j));
          ctx.fillStyle = "rgba(55,55,55,0.55)"; ctx.fillRect(cx, cy, 1, 1);
          if (cx + 1 < S) { ctx.fillStyle = "rgba(165,165,165,0.28)"; ctx.fillRect(cx + 1, cy, 1, 1); }
        }
      }
    }
    border(0);

    // ── 1: cobblestone — brick-like stone shapes with mortar ───────────────────
    fill(1 * S, "#6a6050");
    {
      const bricks: [number, number, number, number][] = [
        [1, 1, 13, 10], [16, 1, 15, 10],
        [1, 13, 11, 10], [14, 13, 17, 10],
        [1, 25, 14, 6],  [17, 25, 14, 6],
      ];
      for (const [bx, by, bw, bh] of bricks) {
        const r = rng(2100 + bx + by * 32);
        const baseV = (r() - 0.5) * 20;
        const sr = (136 + baseV) | 0, sg = (126 + baseV * 0.8) | 0, sb = (110 + baseV * 0.6) | 0;
        for (let py = by; py < by + bh; py++) {
          for (let px = bx; px < bx + bw; px++) {
            const nv = (r() - 0.5) * 22;
            pixel(1 * S + px, py, `rgb(${Math.max(0,Math.min(255,sr+nv))|0},${Math.max(0,Math.min(255,sg+nv*0.8))|0},${Math.max(0,Math.min(255,sb+nv*0.6))|0})`);
          }
        }
        ctx.fillStyle = "rgba(192,180,162,0.42)"; // highlight top & left
        ctx.fillRect(1 * S + bx, by, bw, 1); ctx.fillRect(1 * S + bx, by, 1, bh);
        ctx.fillStyle = "rgba(38,32,24,0.36)";   // shadow bottom & right
        ctx.fillRect(1 * S + bx, by + bh - 1, bw, 1); ctx.fillRect(1 * S + bx + bw - 1, by, 1, bh);
      }
    }
    border(1 * S);

    // ── 2: dirt — brown with organic specks ────────────────────────────────────
    noise(2 * S, 134, 88, 40, 0.12, 1003);
    {
      const r = rng(3003);
      for (let i = 0; i < 10; i++) {
        const dx = (r() * 29) | 0, dy = (r() * 29) | 0;
        const alpha = (0.25 + r() * 0.3).toFixed(2);
        ctx.fillStyle = `rgba(${(68+r()*18)|0},${(38+r()*14)|0},${(14+r()*10)|0},${alpha})`;
        ctx.fillRect(2 * S + dx, dy, (r() * 3 + 1) | 0, (r() * 2 + 1) | 0);
      }
      for (let i = 0; i < 5; i++) {
        const dx = (r() * 30) | 0, dy = (r() * 30) | 0;
        ctx.fillStyle = "rgba(175,118,66,0.35)"; ctx.fillRect(2 * S + dx, dy, 1, 2);
      }
    }
    border(2 * S);

    // ── 3: grass top — vibrant green with variation ────────────────────────────
    noise(3 * S, 98, 165, 56, 0.13, 1004);
    {
      const r = rng(3004);
      for (let i = 0; i < 9; i++) {
        const dx = (r() * 26 + 2) | 0, dy = (r() * 26 + 2) | 0;
        const dw = (r() * 5 + 2) | 0, dh = (r() * 4 + 2) | 0;
        const alpha = (0.26 + r() * 0.22).toFixed(2);
        ctx.fillStyle = `rgba(${(38+r()*32)|0},${(108+r()*42)|0},${(16+r()*22)|0},${alpha})`;
        ctx.fillRect(3 * S + dx, dy, dw, dh);
      }
      for (let i = 0; i < 5; i++) {
        const dx = (r() * 28 + 2) | 0, dy = (r() * 28 + 2) | 0;
        ctx.fillStyle = "rgba(148,215,76,0.38)"; ctx.fillRect(3 * S + dx, dy, 2, 2);
      }
    }
    border(3 * S);

    // ── 4: grass side — dirt body with green strip + grass blades ──────────────
    noise(4 * S, 134, 88, 40, 0.1, 1005);
    {
      const r = rng(3005);
      ctx.fillStyle = "rgb(98,165,56)"; ctx.fillRect(4 * S, 0, S, 5);
      for (let x = 0; x < S; x++) {
        const nv = (r() - 0.5) * 28;
        for (let y = 0; y < 3; y++)
          pixel(4 * S + x, y, `rgb(${(98+nv)|0},${(165+nv*0.7)|0},${(56+nv*0.4)|0})`);
      }
      for (let x = 0; x < S; x++) {
        if (r() > 0.48) {
          const al = (0.55 + r() * 0.38).toFixed(2);
          pixel(4 * S + x, 5, `rgba(86,148,44,${al})`);
          if (r() > 0.62) pixel(4 * S + x, 6, `rgba(65,125,33,${(0.3+r()*0.28).toFixed(2)})`);
        }
      }
    }
    border(4 * S);

    // ── 5: sand — subtle layered grain ────────────────────────────────────────
    {
      const r = rng(3006);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const band = Math.sin(y * 0.52) * 6, nv = (r() - 0.5) * 14 + band;
        pixel(5 * S + x, y, `rgb(${(208+nv)|0},${(191+nv*0.84)|0},${(124+nv*0.55)|0})`);
      }
    }
    border(5 * S);

    // ── 6: wood side — vertical grain with knot ────────────────────────────────
    fill(6 * S, "#7a5530");
    {
      const r = rng(3007);
      for (let x = 0; x < S; x++) {
        const grainShift = Math.sin(x * 0.85) * 5 + (x % 6 === 3 ? -18 : 0);
        for (let y = 0; y < S; y++) {
          const nv = (r() - 0.5) * 20 + grainShift;
          pixel(6 * S + x, y, `rgb(${Math.max(0,Math.min(255,122+nv))|0},${Math.max(0,Math.min(255,85+nv*0.7))|0},${Math.max(0,Math.min(255,48+nv*0.4))|0})`);
        }
      }
      const kx = 14, ky = 16;
      for (let dy = -5; dy <= 5; dy++) for (let dx = -4; dx <= 4; dx++) {
        const d = Math.sqrt(dx * dx * 0.8 + dy * dy * 1.2);
        if (d <= 5) {
          const al = Math.max(0, 0.58 - d * 0.1).toFixed(2);
          ctx.fillStyle = `rgba(42,24,8,${al})`; ctx.fillRect(6 * S + kx + dx, ky + dy, 1, 1);
        }
      }
      ctx.fillStyle = "rgba(35,20,6,0.6)";
      ctx.fillRect(6 * S, 0, 1, S); ctx.fillRect(6 * S + S - 1, 0, 1, S);
    }

    // ── 7: wood top — concentric ring cross-section ────────────────────────────
    {
      const cx2 = 16, cy2 = 16;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const dist = Math.sqrt((x - cx2) ** 2 + (y - cy2) ** 2);
        const ring = Math.cos(dist * 1.05) * 0.13 + 0.95;
        pixel(7 * S + x, y, `rgb(${Math.min(255,Math.round(190*ring))|0},${Math.min(255,Math.round(148*ring))|0},${Math.min(255,Math.round(90*ring))|0})`);
      }
      ctx.fillStyle = "rgba(50,28,6,0.55)"; ctx.fillRect(7 * S + cx2 - 1, cy2 - 1, 2, 2);
      ctx.fillStyle = "rgba(68,38,12,0.3)";
      for (let a = 0; a < Math.PI * 2; a += 0.13) {
        const bx = (cx2 + Math.cos(a) * 14.5) | 0, by2 = (cy2 + Math.sin(a) * 14.5) | 0;
        ctx.fillRect(7 * S + bx, by2, 1, 1);
      }
    }
    border(7 * S);

    // ── 8: planks — tan with seams and grain ──────────────────────────────────
    fill(8 * S, "#c8a060");
    {
      const r = rng(2008);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const grain = Math.sin(y * 0.38) * 4, nv = (r() - 0.5) * 16 + grain;
        pixel(8 * S + x, y, `rgb(${(200+nv)|0},${(160+nv*0.8)|0},${(96+nv*0.5)|0})`);
      }
      for (let y = 7; y < S; y += 8) {
        ctx.fillStyle = "rgba(0,0,0,0.26)"; ctx.fillRect(8 * S, y, S, 1);
        ctx.fillStyle = "rgba(215,180,116,0.2)"; ctx.fillRect(8 * S, y + 1, S, 1);
      }
      ctx.fillStyle = "rgba(0,0,0,0.17)";
      ctx.fillRect(8 * S + 16, 0, 1, 8);  ctx.fillRect(8 * S + 16, 16, 1, 8);
      ctx.fillRect(8 * S + 8, 8, 1, 8);   ctx.fillRect(8 * S + 8, 24, 1, 8);
      ctx.fillRect(8 * S + 24, 8, 1, 8);  ctx.fillRect(8 * S + 24, 24, 1, 8);
    }
    border(8 * S);

    // ── 9: leaves — mottled green with subtle variation ────────────────────────
    ctx.clearRect(9 * S, 0, S, S);
    {
      const r = rng(2009);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        if (r() < 0.1) continue;
        const bright = 0.5 + r() * 0.55;
        const warm = r() > 0.7;
        const cr = warm ? (84 * bright) | 0 : (46 * bright) | 0;
        const cg = warm ? (142 * bright) | 0 : (120 * bright) | 0;
        const cb = warm ? (30 * bright) | 0 : (36 * bright) | 0;
        pixel(9 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
    }
    border(9 * S);

    // ── Ore helper: stone base + round ore blobs ───────────────────────────────
    const oreBlobs = (
      tile: number,
      sR: number, sG: number, sB: number,
      inner: string, outer: string, highlight: string,
      seed: number,
    ) => {
      noise(tile * S, sR, sG, sB, 0.09, seed);
      const r = rng(seed + 1000);
      for (let i = 0; i < 8; i++) {
        const ox2 = (r() * 22 + 4) | 0, oy2 = (r() * 22 + 4) | 0;
        const rad = (r() * 1.5 + 1.5);
        for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
          const d2 = dx * dx + dy * dy;
          if (d2 > rad * rad + 0.5) continue;
          const px = ox2 + dx, py = oy2 + dy;
          if (px < 0 || px >= S || py < 0 || py >= S) continue;
          pixel(tile * S + px, py, d2 <= (rad - 0.8) * (rad - 0.8) ? inner : outer);
        }
        if (ox2 > 0 && oy2 > 0) pixel(tile * S + ox2 - 1, oy2 - 1, highlight);
      }
      border(tile * S);
    };

    // ── 10: iron ore ───────────────────────────────────────────────────────────
    oreBlobs(10, 128, 128, 128, "#d08840", "#b06828", "#e8a858", 1010);

    // ── 11: coal ore ───────────────────────────────────────────────────────────
    oreBlobs(11, 128, 128, 128, "#242424", "#141414", "#404040", 1011);

    // ── 12: bedrock — chaotic dark pattern ────────────────────────────────────
    {
      const r = rng(2012);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = r();
        const val = v < 0.2 ? 15 : v < 0.5 ? 30 : v < 0.82 ? 44 : 58;
        pixel(12 * S + x, y, `rgb(${val},${val},${val})`);
      }
      for (let i = 0; i < 8; i++) {
        const r2 = rng(5000 + i);
        const val = (50 + r2() * 20) | 0;
        ctx.fillStyle = `rgba(${val},${val},${val},0.34)`;
        ctx.fillRect(12 * S + (r2() * 26) | 0, (r2() * 26) | 0, (r2() * 5 + 2) | 0, (r2() * 4 + 1) | 0);
      }
    }
    border(12 * S);

    // ── 13: generic — white with subtle edge darkening (vertex color drives look) ─
    fill(13 * S, "#ffffff");
    {
      ctx.fillStyle = "rgba(0,0,0,0.14)";
      ctx.fillRect(13 * S, 0, S, 1); ctx.fillRect(13 * S, S - 1, S, 1);
      ctx.fillRect(13 * S, 0, 1, S); ctx.fillRect(13 * S + S - 1, 0, 1, S);
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.fillRect(13 * S + 1, 1, S - 2, 1); ctx.fillRect(13 * S + 1, S - 2, S - 2, 1);
      ctx.fillRect(13 * S + 1, 1, 1, S - 2); ctx.fillRect(13 * S + S - 2, 1, 1, S - 2);
    }

    // ── 14: gold ore ───────────────────────────────────────────────────────────
    oreBlobs(14, 128, 128, 128, "#f0be00", "#c89200", "#ffe040", 1014);

    // ── 15: diamond ore — cyan crystal diamond shapes ──────────────────────────
    noise(15 * S, 128, 128, 128, 0.09, 1015);
    {
      const r = rng(2015);
      const diamond = (dcx: number, dcy: number, sz: number) => {
        for (let dy = -sz; dy <= sz; dy++) for (let dx = -sz; dx <= sz; dx++) {
          if (Math.abs(dx) + Math.abs(dy) > sz) continue;
          const px = dcx + dx, py = dcy + dy;
          if (px < 0 || px >= S || py < 0 || py >= S) continue;
          pixel(15 * S + px, py, Math.abs(dx) + Math.abs(dy) === sz ? "#00aaaa" : "#22dddd");
        }
        if (dcx > 0 && dcy > 0) pixel(15 * S + dcx - 1, dcy - 1, "#88ffff");
      };
      for (let i = 0; i < 6; i++)
        diamond((r() * 22 + 4) | 0, (r() * 22 + 4) | 0, (r() * 1.5 + 2) | 0);
    }
    border(15 * S);

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

    const positions: number[] = [];
    const normals: number[]   = [];
    const colors: number[]    = [];
    const uvs: number[]       = [];
    const indices: number[]   = [];
    let vi = 0;

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
      const u0 = texIdx / 16, u1 = (texIdx + 1) / 16;
      uvs.push(u0, 0,  u1, 0,  u0, 1,  u1, 1);
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
          const def = BLOCK_DEFS[id];
          const wx = offX + lx, wy = ly, wz = offZ + lz;

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
            const f = faces[fi];
            const fTexIdx = getBlockTexIndex(id, f.n[1]);
            // For textured blocks, use white vertex color so atlas texture defines color
            let fr = f.cr, fg = f.cg, fb = f.cb;
            if (fTexIdx !== 13) fr = fg = fb = 1.0;

            // Per-vertex AO: check adjacent blocks in tangent directions only
            const [tax, tay, taz] = f.a;
            const [tbx, tby, tbz] = f.b;
            const s1n = isSolidAO(wx - tax, wy - tay, wz - taz);
            const s1p = isSolidAO(wx + tax, wy + tay, wz + taz);
            const s2n = isSolidAO(wx - tbx, wy - tby, wz - tbz);
            const s2p = isSolidAO(wx + tbx, wy + tby, wz + tbz);
            const ao0 = vertAO(s1n, s2n, isSolidAO(wx - tax - tbx, wy - tay - tby, wz - taz - tbz));
            const ao1 = vertAO(s1p, s2n, isSolidAO(wx + tax - tbx, wy + tay - tby, wz + taz - tbz));
            const ao2 = vertAO(s1n, s2p, isSolidAO(wx - tax + tbx, wy - tay + tby, wz - taz + tbz));
            const ao3 = vertAO(s1p, s2p, isSolidAO(wx + tax + tbx, wy + tay + tby, wz + taz + tbz));

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
    });
    chunk.mesh = new THREE.Mesh(geo, mat);
    chunk.mesh.receiveShadow = true;
    chunk.mesh.castShadow = false;
    this.chunkMeshGroup.add(chunk.mesh);
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

  getChunkMeshes(): THREE.Mesh[] {
    return this.world.getChunkMeshes();
  }
}
