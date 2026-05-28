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
// Block texture atlas constants — must match makeBlockTexture
// ---------------------------------------------------------------------------
const ATLAS_TILES = 32;  // number of horizontal tiles in the atlas

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
    case "gravel":       return 16;
    case "obsidian":     return 17;
    case "iron_block":   return 18;
    case "snow":         return 19;
    case "cactus":       return isTop ? 21 : 20;
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
    // 32 tiles × 32 px = 1024 px atlas width, 32 px tall
    const S = 32;
    const canvas = document.createElement("canvas");
    canvas.width = ATLAS_TILES * S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;

    // Seeded deterministic RNG
    const rng = (seed: number) => {
      let s = seed;
      return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; };
    };

    const px = (x: number, y: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); };
    const fill = (ox: number, col: string) => { ctx.fillStyle = col; ctx.fillRect(ox, 0, S, S); };
    const border = (ox: number) => {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(ox, 0, S, 1); ctx.fillRect(ox, S - 1, S, 1);
      ctx.fillRect(ox, 0, 1, S); ctx.fillRect(ox + S - 1, 0, 1, S);
    };
    const noise = (ox: number, baseR: number, baseG: number, baseB: number, variance: number, seed: number) => {
      const r = rng(seed);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * variance;
        const cr = Math.max(0, Math.min(255, baseR + v * 255)) | 0;
        const cg = Math.max(0, Math.min(255, baseG + v * 255)) | 0;
        const cb = Math.max(0, Math.min(255, baseB + v * 255)) | 0;
        px(ox + x, y, `rgb(${cr},${cg},${cb})`);
      }
    };

    // ── 0: Stone — gray with subtle cracks ──────────────────────────────────
    noise(0 * S, 128, 128, 128, 0.12, 1001);
    { const r = rng(3001);
      for (let c = 0; c < 5; c++) {
        let cx = (r() * (S - 4) + 2) | 0, cy = (r() * (S - 4) + 2) | 0;
        for (let step = 0; step < 10; step++) {
          ctx.fillStyle = `rgba(70,70,70,${0.4 + r() * 0.3})`;
          ctx.fillRect(0 * S + cx, cy, 1, 1);
          cx = Math.max(1, Math.min(S - 2, cx + ((r() * 4 - 2) | 0)));
          cy = Math.max(1, Math.min(S - 2, cy + ((r() * 4 - 2) | 0)));
        }
      }
      for (let c = 0; c < 6; c++) {
        const lx = (r() * (S - 4) + 1) | 0, ly = (r() * (S - 4) + 1) | 0;
        ctx.fillStyle = "rgba(168,168,168,0.4)";
        ctx.fillRect(0 * S + lx, ly, 3, 2);
      }
    }
    border(0 * S);

    // ── 1: Cobblestone — distinct stones in mortar ──────────────────────────
    fill(1 * S, "rgb(72,68,58)");
    { const r = rng(3002);
      const stones = [
        { x: 1, y: 1, w: 13, h: 12 }, { x: 16, y: 1, w: 14, h: 10 },
        { x: 1, y: 15, w: 11, h: 14 }, { x: 14, y: 13, w: 16, h: 16 },
        { x: 3, y: 27, w: 9, h: 4  }, { x: 24, y: 25, w: 7, h: 6  },
      ];
      for (const st of stones) {
        const gray = (108 + r() * 55) | 0;
        ctx.fillStyle = `rgb(${gray},${gray - 4},${gray - 10})`;
        ctx.fillRect(1 * S + st.x, st.y, st.w, st.h);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(1 * S + st.x, st.y, st.w, 2);
        ctx.fillRect(1 * S + st.x, st.y, 2, st.h);
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(1 * S + st.x, st.y + st.h - 2, st.w, 2);
        ctx.fillRect(1 * S + st.x + st.w - 2, st.y, 2, st.h);
      }
    }
    border(1 * S);

    // ── 2: Dirt — warm brown with pebbles ───────────────────────────────────
    noise(2 * S, 136, 89, 40, 0.13, 1003);
    { const r = rng(3003);
      for (let i = 0; i < 12; i++) {
        const ox2 = (r() * (S - 3) + 1) | 0, oy2 = (r() * (S - 3) + 1) | 0;
        ctx.fillStyle = "rgba(60,38,18,0.45)";
        ctx.fillRect(2 * S + ox2, oy2, 2, 1);
      }
      for (let i = 0; i < 7; i++) {
        const ox2 = (r() * (S - 3) + 1) | 0, oy2 = (r() * (S - 3) + 1) | 0;
        ctx.fillStyle = "rgba(175,128,72,0.4)";
        ctx.fillRect(2 * S + ox2, oy2, 2, 2);
      }
    }
    border(2 * S);

    // ── 3: Grass top — vibrant green ────────────────────────────────────────
    noise(3 * S, 88, 148, 48, 0.16, 1004);
    { const r = rng(3004);
      for (let i = 0; i < 8; i++) {
        const ox2 = (r() * (S - 6) + 1) | 0, oy2 = (r() * (S - 6) + 1) | 0;
        const w2 = (r() * 5 + 2) | 0, h2 = (r() * 3 + 1) | 0;
        ctx.fillStyle = `rgba(55,108,28,${0.22 + r() * 0.22})`;
        ctx.fillRect(3 * S + ox2, oy2, w2, h2);
      }
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * (S - 3) + 1) | 0, oy2 = (r() * (S - 3) + 1) | 0;
        ctx.fillStyle = "rgba(138,198,58,0.3)";
        ctx.fillRect(3 * S + ox2, oy2, 2, 1);
      }
    }
    border(3 * S);

    // ── 4: Grass side — dirt body, green capped top ─────────────────────────
    noise(4 * S, 136, 89, 40, 0.11, 1005);
    { const r = rng(3005);
      for (let x = 0; x < S; x++) for (let y = 0; y < 5; y++) {
        const v = (r() - 0.5) * 0.18;
        const cr = Math.max(0, Math.min(255, 88 + v * 255)) | 0;
        const cg = Math.max(0, Math.min(255, 148 + v * 255)) | 0;
        const cb = Math.max(0, Math.min(255, 48 + v * 255)) | 0;
        px(4 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
      for (let x = 0; x < S; x++) for (let y = 5; y < 10; y++) {
        const blend = (10 - y) / 5;
        if (r() < blend * 0.65)
          px(4 * S + x, y, `rgb(${(80 + r() * 40) | 0},${(120 + r() * 40) | 0},${(38 + r() * 30) | 0})`);
      }
      for (let i = 0; i < 5; i++) {
        const tx = (r() * (S - 2)) | 0;
        const len = (r() * 5 + 3) | 0;
        for (let j = 0; j < len; j++)
          px(4 * S + tx, 5 + j, `rgba(65,115,32,${0.55 - j * 0.09})`);
      }
    }
    border(4 * S);

    // ── 5: Sand — warm tan with grain ───────────────────────────────────────
    noise(5 * S, 208, 192, 128, 0.1, 1006);
    { const r = rng(3006);
      for (let y = 5; y < S; y += 6) {
        for (let x = 0; x < S; x++) {
          const wave = Math.sin(x * 0.45 + y * 0.12) * 0.04;
          if (r() < 0.35) {
            ctx.fillStyle = `rgba(175,162,100,${0.18 + wave})`;
            ctx.fillRect(5 * S + x, y, 1, 1);
          }
        }
      }
    }
    border(5 * S);

    // ── 6: Wood side — bark with vertical grain ──────────────────────────────
    noise(6 * S, 98, 67, 36, 0.11, 1007);
    { const r = rng(3007);
      let x = 1;
      while (x < S - 1) {
        const w2 = r() < 0.4 ? 1 : 2;
        const dark = r() < 0.5;
        ctx.fillStyle = dark ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.1)";
        ctx.fillRect(6 * S + x, 0, w2, S);
        x += w2 + 2 + (r() * 2 | 0);
      }
      for (let i = 0; i < 2; i++) {
        const kx = (r() * (S - 8) + 4) | 0, ky = (r() * (S - 5) + 2) | 0;
        ctx.fillStyle = "rgba(35,18,8,0.45)";
        ctx.fillRect(6 * S + kx - 2, ky - 1, 6, 3);
        ctx.fillStyle = "rgba(75,45,20,0.3)";
        ctx.fillRect(6 * S + kx - 1, ky, 4, 1);
      }
    }
    border(6 * S);

    // ── 7: Wood top — growth rings ──────────────────────────────────────────
    { const cx = S / 2 - 0.5, cy = S / 2 - 0.5;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        const isEdge = dist > S * 0.46;
        const ring = Math.sin(dist * 1.05) * 0.5 + 0.5;
        const cr = isEdge ? 72 : (168 * (0.58 + ring * 0.42)) | 0;
        const cg = isEdge ? 46 : (118 * (0.58 + ring * 0.42)) | 0;
        const cb = isEdge ? 22 : (58 * (0.58 + ring * 0.42)) | 0;
        px(7 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
    }
    border(7 * S);

    // ── 8: Planks — tan boards with seams and grain ─────────────────────────
    noise(8 * S, 194, 154, 90, 0.1, 1008);
    { const r = rng(3008);
      for (let y = 7; y < S; y += 8) {
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(8 * S, y, S, 1);
        ctx.fillStyle = "rgba(255,255,255,0.1)";
        ctx.fillRect(8 * S, y + 1, S, 1);
      }
      const offsets = [0, S / 2];
      for (let py = 0; py < S; py += 8) {
        const off = offsets[(py / 8) % 2 | 0];
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(8 * S + off, py, 1, 8);
        if (off + S / 2 < S) ctx.fillRect(8 * S + off + S / 2, py, 1, 8);
      }
      for (let i = 0; i < 10; i++) {
        const gx = (r() * (S - 5) + 2) | 0, gy = (r() * (S - 2) + 1) | 0;
        ctx.fillStyle = "rgba(125,95,55,0.22)";
        ctx.fillRect(8 * S + gx, gy, 5, 1);
      }
    }
    border(8 * S);

    // ── 9: Leaves — semi-transparent mottled green ──────────────────────────
    fill(9 * S, "rgba(0,0,0,0)");
    { const r = rng(1009);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = r();
        if (v < 0.13) continue;
        const brightness = 0.55 + r() * 0.6;
        px(9 * S + x, y, `rgb(${(52 * brightness) | 0},${(115 * brightness) | 0},${(33 * brightness) | 0})`);
      }
    }
    border(9 * S);

    // ── 10: Iron ore — stone + orange veins ─────────────────────────────────
    noise(10 * S, 126, 126, 126, 0.11, 1010);
    { const r = rng(2010);
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * (S - 10) + 4) | 0, oy2 = (r() * (S - 10) + 4) | 0;
        ctx.fillStyle = "#b86830"; ctx.fillRect(10 * S + ox2, oy2, 5, 4);
        ctx.fillStyle = "#d88040"; ctx.fillRect(10 * S + ox2 + 1, oy2 + 1, 3, 2);
        ctx.fillStyle = "#9a5525"; ctx.fillRect(10 * S + ox2, oy2 + 3, 5, 1);
      }
    }
    border(10 * S);

    // ── 11: Coal ore — stone + black clusters ───────────────────────────────
    noise(11 * S, 126, 126, 126, 0.11, 1011);
    { const r = rng(2011);
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * (S - 10) + 4) | 0, oy2 = (r() * (S - 10) + 4) | 0;
        ctx.fillStyle = "#1a1a1a"; ctx.fillRect(11 * S + ox2, oy2, 5, 4);
        ctx.fillStyle = "#2e2e2e"; ctx.fillRect(11 * S + ox2 + 1, oy2, 3, 2);
        ctx.fillStyle = "#111111"; ctx.fillRect(11 * S + ox2, oy2 + 2, 3, 2);
      }
    }
    border(11 * S);

    // ── 12: Bedrock — very dark with irregular patches ──────────────────────
    noise(12 * S, 44, 44, 44, 0.2, 1012);
    { const r = rng(2012);
      for (let i = 0; i < 10; i++) {
        const ox2 = (r() * (S - 6) + 2) | 0, oy2 = (r() * (S - 6) + 2) | 0;
        const w2 = (r() * 5 + 2) | 0, h2 = (r() * 4 + 1) | 0;
        ctx.fillStyle = "rgba(14,14,14,0.65)";
        ctx.fillRect(12 * S + ox2, oy2, w2, h2);
      }
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * (S - 4) + 2) | 0, oy2 = (r() * (S - 4) + 2) | 0;
        ctx.fillStyle = "rgba(80,80,80,0.3)";
        ctx.fillRect(12 * S + ox2, oy2, 3, 2);
      }
    }
    border(12 * S);

    // ── 13: Generic — white (vertex color controls appearance) ───────────────
    fill(13 * S, "#ffffff");
    border(13 * S);

    // ── 14: Gold ore — stone + gold veins ───────────────────────────────────
    noise(14 * S, 126, 126, 126, 0.11, 1014);
    { const r = rng(2014);
      for (let i = 0; i < 5; i++) {
        const ox2 = (r() * (S - 10) + 4) | 0, oy2 = (r() * (S - 10) + 4) | 0;
        ctx.fillStyle = "#c8a000"; ctx.fillRect(14 * S + ox2, oy2, 5, 4);
        ctx.fillStyle = "#f0c820"; ctx.fillRect(14 * S + ox2 + 1, oy2, 3, 2);
        ctx.fillStyle = "#a08000"; ctx.fillRect(14 * S + ox2, oy2 + 3, 5, 1);
      }
    }
    border(14 * S);

    // ── 15: Diamond ore — stone + cyan rhombus shapes ───────────────────────
    noise(15 * S, 126, 126, 126, 0.11, 1015);
    { const r = rng(2015);
      for (let i = 0; i < 3; i++) {
        const ox2 = (r() * (S - 12) + 4) | 0, oy2 = (r() * (S - 12) + 4) | 0;
        px(15 * S + ox2 + 2, oy2,     "#00aacc");
        px(15 * S + ox2 + 1, oy2 + 1, "#00cccc"); px(15 * S + ox2 + 2, oy2 + 1, "#55ffff"); px(15 * S + ox2 + 3, oy2 + 1, "#00cccc");
        px(15 * S + ox2,     oy2 + 2, "#00aacc"); px(15 * S + ox2 + 1, oy2 + 2, "#55ffff"); px(15 * S + ox2 + 2, oy2 + 2, "#aaffff"); px(15 * S + ox2 + 3, oy2 + 2, "#55ffff"); px(15 * S + ox2 + 4, oy2 + 2, "#00aacc");
        px(15 * S + ox2 + 1, oy2 + 3, "#00cccc"); px(15 * S + ox2 + 2, oy2 + 3, "#55ffff"); px(15 * S + ox2 + 3, oy2 + 3, "#00cccc");
        px(15 * S + ox2 + 2, oy2 + 4, "#00aaaa");
      }
    }
    border(15 * S);

    // ── 16: Gravel — mosaic of rounded pebbles ───────────────────────────────
    fill(16 * S, "rgb(80,80,76)");
    { const r = rng(2016);
      const pebbles = [
        { x: 1, y: 1, w: 7, h: 6  }, { x: 10, y: 1, w: 9, h: 7  }, { x: 21, y: 1, w: 9, h: 6  },
        { x: 1, y: 10, w: 10, h: 8 }, { x: 13, y: 10, w: 7, h: 7 }, { x: 22, y: 9, w: 9, h: 9  },
        { x: 1, y: 20, w: 9, h: 7  }, { x: 12, y: 19, w: 10, h: 9 }, { x: 24, y: 20, w: 7, h: 8 },
        { x: 2, y: 27, w: 9, h: 4  }, { x: 14, y: 27, w: 8, h: 5  }, { x: 24, y: 27, w: 7, h: 4 },
      ];
      for (const pb of pebbles) {
        const gray = (82 + r() * 72) | 0;
        ctx.fillStyle = `rgb(${gray},${gray - 2},${gray - 5})`;
        ctx.fillRect(16 * S + pb.x, pb.y, pb.w, pb.h);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(16 * S + pb.x + 1, pb.y + 1, pb.w - 2, 1);
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.fillRect(16 * S + pb.x, pb.y + pb.h - 1, pb.w, 1);
      }
    }
    border(16 * S);

    // ── 17: Obsidian — very dark purple with glassy highlights ──────────────
    noise(17 * S, 18, 8, 28, 0.07, 1017);
    { const r = rng(2017);
      for (let i = 0; i < 16; i++) {
        const ox2 = (r() * S) | 0, oy2 = (r() * S) | 0;
        ctx.fillStyle = `rgba(80,40,120,${0.12 + r() * 0.14})`;
        ctx.fillRect(17 * S + ox2, oy2, 1, 1);
      }
      for (let i = 0; i < 4; i++) {
        const ox2 = (r() * (S - 6)) | 0, oy2 = (r() * (S - 2)) | 0;
        ctx.fillStyle = "rgba(55,40,78,0.35)";
        ctx.fillRect(17 * S + ox2, oy2, 5, 1);
      }
    }
    border(17 * S);

    // ── 18: Iron block — brushed metal panels with rivets ───────────────────
    noise(18 * S, 165, 165, 165, 0.07, 1018);
    { // Panel dividers
      for (const gv of [16]) {
        ctx.fillStyle = "rgba(0,0,0,0.32)";
        ctx.fillRect(18 * S + gv, 0, 1, S);
        ctx.fillRect(18 * S, gv, S, 1);
        ctx.fillStyle = "rgba(255,255,255,0.16)";
        ctx.fillRect(18 * S + gv + 1, 0, 1, S);
        ctx.fillRect(18 * S, gv + 1, S, 1);
      }
      // Rivets at panel corners
      for (const [rx, ry] of [[7, 7], [23, 7], [7, 23], [23, 23]]) {
        ctx.fillStyle = "rgba(120,120,120,0.85)";
        ctx.fillRect(18 * S + rx, ry, 2, 2);
        ctx.fillStyle = "rgba(220,220,220,0.55)";
        ctx.fillRect(18 * S + rx, ry, 1, 1);
      }
    }
    border(18 * S);

    // ── 19: Snow — pale blue-white crystal ──────────────────────────────────
    noise(19 * S, 238, 243, 255, 0.06, 1019);
    { const r = rng(2019);
      for (let i = 0; i < 25; i++) {
        const ox2 = (r() * S) | 0, oy2 = (r() * S) | 0;
        ctx.fillStyle = "rgba(200,218,255,0.28)";
        ctx.fillRect(19 * S + ox2, oy2, 1, 1);
      }
      for (let i = 0; i < 6; i++) {
        const ox2 = (r() * (S - 5) + 2) | 0, oy2 = (r() * (S - 5) + 2) | 0;
        ctx.fillStyle = "rgba(175,198,240,0.22)";
        ctx.fillRect(19 * S + ox2, oy2, 4, 2);
      }
    }
    border(19 * S);

    // ── 20: Cactus side — ribbed green with thorns ──────────────────────────
    noise(20 * S, 36, 105, 36, 0.09, 1020);
    { const r = rng(2020);
      for (let x = 4; x < S; x += 8) {
        ctx.fillStyle = "rgba(72,162,72,0.45)";
        ctx.fillRect(20 * S + x, 1, 2, S - 2);
      }
      for (let x = 4; x < S; x += 8) {
        for (let y = 4; y < S; y += 9) {
          if (r() < 0.65) {
            ctx.fillStyle = "#ddddc8";
            ctx.fillRect(20 * S + x - 1, y, 1, 1);
            ctx.fillRect(20 * S + x + 2, y, 1, 1);
          }
        }
      }
    }
    border(20 * S);

    // ── 21: Cactus top — radial star pattern ────────────────────────────────
    fill(21 * S, "rgb(30,85,30)");
    { const cx = S / 2 - 0.5, cy = S / 2 - 0.5;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (dist >= S * 0.48) continue;
        const angle = Math.atan2(y - cy, x - cx);
        const radial = Math.sin(angle * 8) * 0.12 + 0.88;
        const fade = Math.max(0, 1 - dist / (S * 0.48));
        const base = 36 + 60 * fade;
        const cr = (base * radial * 0.38) | 0;
        const cg = (base * radial) | 0;
        const cb = (base * radial * 0.38) | 0;
        px(21 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
    }
    border(21 * S);

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
      const u0 = texIdx / ATLAS_TILES, u1 = (texIdx + 1) / ATLAS_TILES;
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
