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
// Block texture atlas — 32 tiles × 16 px wide = 512 px
// ---------------------------------------------------------------------------
const TEX_ATLAS_TILES = 32;

function getBlockTexIndex(id: BlockId, normalY: number): number {
  const isTop = normalY > 0;
  const isBot = normalY < 0;
  switch (id as string) {
    // --- original 16 tiles ---
    case "stone":             return 0;
    case "cobblestone":       return 1;
    case "dirt":              return 2;
    case "grass":             return isTop ? 3 : (isBot ? 2 : 4);
    case "sand":              return 5;
    case "wood":              return (isTop || isBot) ? 7 : 6;
    case "planks":            return 8;
    case "leaves":            return 9;
    case "iron_ore":          return 10;
    case "coal_ore":          return 11;
    case "bedrock":           return 12;
    case "gold_ore":          return 14;
    case "diamond_ore":       return 15;
    // --- new tiles ---
    case "gravel":            return 16;
    case "snow":              return 17;
    case "obsidian":          return 18;
    case "crafting_table":    return isTop ? 20 : 19;
    case "chest":             return isTop ? 24 : 21;
    case "farmland":          return isTop ? 22 : 2;
    case "cactus":            return isTop ? 3 : 23;
    case "bookshelf":         return (isTop || isBot) ? 8 : 24;
    case "enchanting_table":  return isTop ? 25 : 18;
    case "furnace":           return (isTop || isBot) ? 26 : 27;
    case "iron_block":        return 28;
    case "glass":             return 29;
    default:                  return 13;
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
    // 32 textures × 16px wide = 512px atlas, 16px tall
    const ATLAS_TILES = TEX_ATLAS_TILES;
    const S = 16;
    const canvas = document.createElement("canvas");
    canvas.width = ATLAS_TILES * S; canvas.height = S;
    const ctx = canvas.getContext("2d")!;

    // Seeded RNG per tile for deterministic pixel art
    const rng = (seed: number) => { let s = seed; return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff; }; };

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

    // 0: stone — gray with subtle noise
    noise(0 * S, 136, 136, 136, 0.08, 1001);
    border(0 * S);

    // 1: cobblestone — gray with stone shapes
    noise(1 * S, 136, 128, 112, 0.1, 1002);
    { const r = rng(2002);
      for (let i = 0; i < 6; i++) {
        const bx = (r() * 12 + 1) | 0, by = (r() * 12 + 1) | 0, bw = (r() * 3 + 2) | 0, bh = (r() * 2 + 2) | 0;
        ctx.fillStyle = "rgba(80,72,60,0.35)"; ctx.fillRect(1 * S + bx, by, bw, bh);
        ctx.fillStyle = "rgba(180,172,155,0.3)"; ctx.fillRect(1 * S + bx + 1, by + 1, bw, bh);
      }
    }
    border(1 * S);

    // 2: dirt — brown with noise
    noise(2 * S, 139, 92, 42, 0.1, 1003);
    border(2 * S);

    // 3: grass top — bright green
    noise(3 * S, 93, 158, 58, 0.1, 1004);
    border(3 * S);

    // 4: grass side — green strip top 3px, dirt below
    noise(4 * S, 139, 92, 42, 0.08, 1005);
    { ctx.fillStyle = "rgba(93,158,58,0.9)"; ctx.fillRect(4 * S, 0, S, 3); }
    { const r = rng(2005);
      for (let x = 0; x < S; x++) for (let y = 3; y < 5; y++)
        if (r() > 0.5) { ctx.fillStyle = `rgba(93,158,58,${0.4 + r() * 0.3})`; ctx.fillRect(4 * S + x, y, 1, 1); }
    }
    border(4 * S);

    // 5: sand — sandy with noise
    noise(5 * S, 212, 196, 132, 0.08, 1006);
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

    // 9: leaves — dark green mottled
    fill(9 * S, "transparent");
    { const r = rng(2009);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = r();
        if (v < 0.15) { pixel(9 * S + x, y, "rgba(0,0,0,0)"); continue; }
        const brightness = 0.6 + r() * 0.5;
        pixel(9 * S + x, y, `rgb(${(58 * brightness) | 0},${(122 * brightness) | 0},${(37 * brightness) | 0})`);
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

    // --- New tiles 16–29 ---

    // 16: gravel — rounded pebble shapes on grey base
    noise(16 * S, 128, 128, 122, 0.12, 1016);
    { const r = rng(3016);
      for (let i = 0; i < 9; i++) {
        const px = (r() * 11 + 1) | 0, py = (r() * 11 + 1) | 0;
        const pw = (r() * 3 + 2) | 0, ph = (r() * 2 + 2) | 0;
        const dark = 70 + (r() * 40) | 0;
        ctx.fillStyle = `rgb(${dark},${dark},${dark - 5})`; ctx.fillRect(16 * S + px, py, pw, ph);
        ctx.fillStyle = `rgba(200,200,195,0.5)`; ctx.fillRect(16 * S + px, py, 1, 1);
      }
    }
    border(16 * S);

    // 17: snow — white with pale blue tint and subtle crystal lines
    noise(17 * S, 235, 240, 252, 0.04, 1017);
    { const r = rng(3017);
      for (let i = 0; i < 6; i++) {
        const lx = (r() * 14 + 1) | 0, ly = (r() * 14 + 1) | 0;
        const len = (r() * 5 + 2) | 0;
        ctx.fillStyle = "rgba(200,210,240,0.4)";
        if (r() > 0.5) ctx.fillRect(17 * S + lx, ly, len, 1);
        else ctx.fillRect(17 * S + lx, ly, 1, len);
      }
    }
    border(17 * S);

    // 18: obsidian — deep purple-black with glassy highlights
    noise(18 * S, 22, 10, 38, 0.08, 1018);
    { const r = rng(3018);
      for (let i = 0; i < 8; i++) {
        const hx = (r() * 13 + 1) | 0, hy = (r() * 13 + 1) | 0;
        ctx.fillStyle = `rgba(120,80,180,${0.15 + r() * 0.2})`; ctx.fillRect(18 * S + hx, hy, 2, 1);
      }
      // glassy streaks
      for (let i = 0; i < 3; i++) {
        const sx = (r() * 12 + 2) | 0, sy = (r() * 12 + 2) | 0;
        ctx.fillStyle = "rgba(200,160,255,0.25)"; ctx.fillRect(18 * S + sx, sy, 3, 1);
      }
    }
    border(18 * S);

    // 19: crafting table side — wood planks texture with subtle marks
    fill(19 * S, "#7a5a32");
    { const r = rng(3019);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 24;
        pixel(19 * S + x, y, `rgb(${(122 + v) | 0},${(90 + v * 0.7) | 0},${(50 + v * 0.4) | 0})`);
      }
      // horizontal plank lines
      for (let y = 4; y < S; y += 4) { ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(19 * S, y, S, 1); }
    }
    border(19 * S);

    // 20: crafting table top — wood with 2×2 work-surface grid
    fill(20 * S, "#8b5c2a");
    { const r = rng(3020);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 20;
        pixel(20 * S + x, y, `rgb(${(139 + v) | 0},${(92 + v * 0.8) | 0},${(42 + v * 0.5) | 0})`);
      }
      // 2×2 divider lines (tool marks in red-brown)
      ctx.fillStyle = "rgba(120,40,20,0.55)";
      ctx.fillRect(20 * S + 7, 1, 2, S - 2);
      ctx.fillRect(20 * S + 1, 7, S - 2, 2);
    }
    border(20 * S);

    // 21: chest side — wood planks with horizontal metal band
    fill(21 * S, "#a05020");
    { const r = rng(3021);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 22;
        pixel(21 * S + x, y, `rgb(${(160 + v) | 0},${(80 + v * 0.7) | 0},${(32 + v * 0.3) | 0})`);
      }
      // metal band row
      ctx.fillStyle = "rgba(180,140,60,0.85)"; ctx.fillRect(21 * S, 6, S, 4);
      ctx.fillStyle = "rgba(220,180,80,0.5)"; ctx.fillRect(21 * S, 6, S, 1);
      // latch square
      ctx.fillStyle = "rgba(200,160,50,0.9)"; ctx.fillRect(21 * S + 7, 7, 2, 2);
    }
    border(21 * S);

    // 22: farmland top — dark soil with furrow marks
    noise(22 * S, 100, 64, 30, 0.1, 1022);
    { const r = rng(3022);
      for (let y = 1; y < S - 1; y += 4) {
        ctx.fillStyle = "rgba(60,35,15,0.35)"; ctx.fillRect(22 * S, y, S, 2);
      }
      // moisture highlight
      for (let i = 0; i < 4; i++) {
        const mx = (r() * 12 + 2) | 0, my = (r() * 12 + 2) | 0;
        ctx.fillStyle = "rgba(60,90,160,0.25)"; ctx.fillRect(22 * S + mx, my, 2, 1);
      }
    }
    border(22 * S);

    // 23: cactus side — mid-green with spine dots and ribbing
    noise(23 * S, 45, 122, 45, 0.09, 1023);
    { const r = rng(3023);
      // vertical rib lines
      for (let x = 3; x < S; x += 5) { ctx.fillStyle = "rgba(0,60,0,0.3)"; ctx.fillRect(23 * S + x, 0, 1, S); }
      // spine dots
      for (let i = 0; i < 8; i++) {
        const sx = (r() * 13 + 1) | 0, sy = (r() * 13 + 1) | 0;
        pixel(23 * S + sx, sy, "#eeeecc");
      }
    }
    border(23 * S);

    // 24: bookshelf side — wood frame with colored book spines
    fill(24 * S, "#c8a060");
    { const r = rng(3024);
      // wood frame top/bottom
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 18;
        if (y < 2 || y > S - 3) pixel(24 * S + x, y, `rgb(${(200 + v) | 0},${(160 + v) | 0},${(96 + v) | 0})`);
      }
      // books: 4 colored spines
      const bookColors = ["#cc2222","#2244bb","#226622","#aa6611","#884488","#225566","#bb8800","#336633"];
      for (let i = 0; i < 8; i++) {
        const bx = 1 + i * 2, bw = 1 + (r() > 0.5 ? 1 : 0);
        const bh = 8 + (r() * 3) | 0;
        const by = 2 + ((S - 4 - bh) / 2 | 0);
        ctx.fillStyle = bookColors[i % bookColors.length]; ctx.fillRect(24 * S + bx, by, bw, bh);
        ctx.fillStyle = "rgba(255,255,255,0.2)"; ctx.fillRect(24 * S + bx, by, bw, 1);
      }
    }
    border(24 * S);

    // 25: enchanting table top — dark stone with red/purple glyph
    noise(25 * S, 26, 12, 42, 0.1, 1025);
    { const r = rng(3025);
      // glowing rune circle outline
      const cx25 = 8, cy25 = 8;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const d = Math.sqrt((x - cx25) ** 2 + (y - cy25) ** 2);
        if (Math.abs(d - 5) < 1) { ctx.fillStyle = "rgba(180,20,60,0.7)"; ctx.fillRect(25 * S + x, y, 1, 1); }
      }
      // center gem
      ctx.fillStyle = "#cc0033"; ctx.fillRect(25 * S + 7, 7, 2, 2);
      ctx.fillStyle = "#ff3366"; ctx.fillRect(25 * S + 7, 7, 1, 1);
      // rune sparks
      for (let i = 0; i < 6; i++) {
        const hx = (r() * 12 + 2) | 0, hy = (r() * 12 + 2) | 0;
        ctx.fillStyle = `rgba(220,120,${160 + (r() * 60) | 0},0.6)`; ctx.fillRect(25 * S + hx, hy, 1, 1);
      }
    }
    border(25 * S);

    // 26: furnace top — stone with vent holes
    noise(26 * S, 110, 110, 110, 0.08, 1026);
    { const r = rng(3026);
      // vent slot
      ctx.fillStyle = "rgba(30,15,5,0.8)"; ctx.fillRect(26 * S + 5, 4, 6, 3);
      ctx.fillStyle = "rgba(80,40,10,0.4)"; ctx.fillRect(26 * S + 5, 4, 6, 1);
      // small rivet dots
      for (let i = 0; i < 4; i++) {
        const rx = 2 + (r() * 11) | 0, ry = 9 + (r() * 5) | 0;
        ctx.fillStyle = "rgba(80,80,80,0.6)"; ctx.fillRect(26 * S + rx, ry, 2, 2);
      }
    }
    border(26 * S);

    // 27: furnace front/side — stone with orange fire opening
    noise(27 * S, 118, 112, 105, 0.09, 1027);
    {
      ctx.fillStyle = "#1a0800"; ctx.fillRect(27 * S + 4, 3, 8, 9);
      ctx.fillStyle = "rgba(255,120,10,0.8)"; ctx.fillRect(27 * S + 5, 4, 6, 7);
      ctx.fillStyle = "rgba(255,220,60,0.7)"; ctx.fillRect(27 * S + 6, 5, 4, 4);
      ctx.fillStyle = "rgba(255,255,180,0.5)"; ctx.fillRect(27 * S + 7, 6, 2, 2);
      ctx.fillStyle = "#1a0800"; ctx.fillRect(27 * S + 5, 3, 6, 1);
      ctx.fillStyle = "#1a0800"; ctx.fillRect(27 * S + 6, 2, 4, 1);
      ctx.fillStyle = "rgba(255,100,0,0.2)"; ctx.fillRect(27 * S + 3, 2, 10, 11);
    }
    border(27 * S);

    // 28: iron block — silver with subtle grid of rivets
    noise(28 * S, 170, 172, 174, 0.06, 1028);
    {
      for (let y = 4; y < S; y += 4) { ctx.fillStyle = "rgba(120,122,128,0.3)"; ctx.fillRect(28 * S, y, S, 1); }
      for (let x = 4; x < S; x += 4) { ctx.fillStyle = "rgba(120,122,128,0.3)"; ctx.fillRect(28 * S + x, 0, 1, S); }
      for (let y = 4; y < S; y += 4) for (let x = 4; x < S; x += 4) {
        ctx.fillStyle = "rgba(200,202,208,0.6)"; ctx.fillRect(28 * S + x - 1, y - 1, 2, 2);
      }
    }
    border(28 * S);

    // 29: glass — very subtle pale blue tint with edge highlights
    fill(29 * S, "rgba(136,204,238,0.08)");
    { const r = rng(3029);
      // edge highlight lines
      ctx.fillStyle = "rgba(200,230,255,0.55)"; ctx.fillRect(29 * S + 1, 1, S - 2, 1);
      ctx.fillStyle = "rgba(200,230,255,0.55)"; ctx.fillRect(29 * S + 1, 1, 1, S - 2);
      ctx.fillStyle = "rgba(100,140,160,0.3)"; ctx.fillRect(29 * S + 1, S - 2, S - 2, 1);
      ctx.fillStyle = "rgba(100,140,160,0.3)"; ctx.fillRect(29 * S + S - 2, 1, 1, S - 2);
      // faint reflection streak
      for (let i = 0; i < 3; i++) {
        const gx = 3 + (r() * 9) | 0, gy = 3 + (r() * 9) | 0;
        ctx.fillStyle = "rgba(220,240,255,0.25)"; ctx.fillRect(29 * S + gx, gy, 4, 1);
      }
    }
    border(29 * S);

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
      const u0 = texIdx / TEX_ATLAS_TILES, u1 = (texIdx + 1) / TEX_ATLAS_TILES;
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
      alphaTest: 0.5,
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
