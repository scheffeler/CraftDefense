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
// Block texture atlas index (0-31; 13 = default white, uses vertex color)
// ---------------------------------------------------------------------------
function getBlockTexIndex(id: BlockId, normalY: number): number {
  const isTop = normalY > 0;
  const isBot = normalY < 0;
  switch (id as string) {
    case "stone":           return 0;
    case "cobblestone":     return 1;
    case "dirt":            return 2;
    case "farmland":        return 27;
    case "grass":           return isTop ? 3 : (isBot ? 2 : 4);
    case "sand":            return 5;
    case "wood":            return (isTop || isBot) ? 7 : 6;
    case "planks":          return 8;
    case "leaves":          return 9;
    case "iron_ore":        return 10;
    case "coal_ore":        return 11;
    case "bedrock":         return 12;
    case "gold_ore":        return 14;
    case "diamond_ore":     return 15;
    case "water":           return 16;
    case "glass":           return 17;
    case "gravel":          return 18;
    case "snow":            return 19;
    case "obsidian":        return 20;
    case "chest":           return isTop ? 22 : 21;
    case "bookshelf":       return 23;
    case "crafting_table":  return isTop ? 24 : 8;
    case "cactus":          return isTop ? 26 : 25;
    default:                return 13;
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
    const ATLAS_TILES = 32;
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

    // ── New tiles 16–31 ──────────────────────────────────────────────────────

    // 16: water — deep blue with diagonal wave ripples
    { const r = rng(3016);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const wave = Math.sin((x + y * 0.6) * 0.9) * 0.5 + Math.sin((x * 0.7 - y * 0.5) * 1.1) * 0.3;
        const n = (r() - 0.5) * 0.06;
        const t = wave * 0.25 + n;
        const cr = Math.max(0, Math.min(255, (22 + t * 35) | 0));
        const cg = Math.max(0, Math.min(255, (102 + t * 55) | 0));
        const cb = Math.max(0, Math.min(255, (168 + t * 50) | 0));
        pixel(16 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
      // Foam/highlight lines following wave crests
      for (let x = 0; x < S; x++) {
        const wy = Math.floor(Math.sin(x * 0.85) * 2 + 7);
        if (wy >= 0 && wy < S) pixel(16 * S + x, wy, "rgba(130,200,255,0.6)");
        const wy2 = Math.floor(Math.cos(x * 1.1 + 2) * 1.5 + 3);
        if (wy2 >= 0 && wy2 < S) pixel(16 * S + x, wy2, "rgba(100,180,240,0.4)");
      }
    }

    // 17: glass — pale cyan with subtle pane grid and corner shine
    { const r = rng(3017);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const n = (r() - 0.5) * 0.09;
        const cr = Math.max(0, Math.min(255, (160 + n * 255) | 0));
        const cg = Math.max(0, Math.min(255, (218 + n * 200) | 0));
        const cb = Math.max(0, Math.min(255, (238 + n * 150) | 0));
        pixel(17 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
      // Pane grid lines
      ctx.fillStyle = "rgba(50,90,110,0.28)";
      ctx.fillRect(17 * S + 8, 0, 1, S);
      ctx.fillRect(17 * S, 8, S, 1);
      // Corner sparkle
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      ctx.fillRect(17 * S + 1, 1, 3, 1);
      ctx.fillRect(17 * S + 1, 1, 1, 3);
      ctx.fillRect(17 * S + 1, 9, 3, 1);
      ctx.fillRect(17 * S + 1, 9, 1, 3);
    }
    border(17 * S);

    // 18: gravel — mid-gray with varied pebble shapes
    noise(18 * S, 125, 122, 116, 0.13, 3018);
    { const r = rng(4018);
      for (let i = 0; i < 11; i++) {
        const px = (r() * 11 + 1) | 0, py = (r() * 11 + 1) | 0;
        const pw = (r() * 2 + 2) | 0, ph = (r() * 2 + 2) | 0;
        const bright = (r() > 0.5 ? 35 : -28) | 0;
        ctx.fillStyle = `rgb(${(125+bright)|0},${(122+bright)|0},${(116+bright)|0})`;
        ctx.fillRect(18 * S + px, py, pw, ph);
        ctx.fillStyle = "rgba(80,78,72,0.45)";
        ctx.fillRect(18 * S + px + pw, py, 1, ph + 1);
        ctx.fillRect(18 * S + px, py + ph, pw, 1);
        ctx.fillStyle = "rgba(200,198,190,0.3)";
        ctx.fillRect(18 * S + px, py, pw, 1);
        ctx.fillRect(18 * S + px, py, 1, ph);
      }
    }
    border(18 * S);

    // 19: snow — near-white with pale blue shadows and sparkle highlights
    noise(19 * S, 232, 238, 248, 0.04, 3019);
    { const r = rng(4019);
      for (let i = 0; i < 4; i++) {
        const px = (r() * 10 + 3) | 0, py = (r() * 10 + 3) | 0;
        ctx.fillStyle = "rgba(160,185,230,0.22)";
        ctx.fillRect(19 * S + px, py, 3, 2);
      }
      // Sparkle crosses
      for (let i = 0; i < 4; i++) {
        const px = (r() * 12 + 2) | 0, py = (r() * 12 + 2) | 0;
        pixel(19 * S + px, py, "#ffffff");
        if (px > 0)   pixel(19 * S + px - 1, py, "rgba(200,220,255,0.8)");
        if (px < S-1) pixel(19 * S + px + 1, py, "rgba(200,220,255,0.8)");
        if (py > 0)   pixel(19 * S + px, py - 1, "rgba(200,220,255,0.8)");
        if (py < S-1) pixel(19 * S + px, py + 1, "rgba(200,220,255,0.8)");
      }
    }

    // 20: obsidian — very dark purple-black with purple gloss highlights
    noise(20 * S, 13, 8, 25, 0.18, 3020);
    { const r = rng(4020);
      for (let i = 0; i < 4; i++) {
        const px = (r() * 11 + 2) | 0, py = (r() * 11 + 2) | 0;
        ctx.fillStyle = "rgba(110,20,200,0.3)";
        ctx.fillRect(20 * S + px, py, 2, 2);
      }
      ctx.fillStyle = "rgba(180,100,255,0.28)";
      ctx.fillRect(20 * S + 3, 2, 5, 1);
      ctx.fillRect(20 * S + 2, 3, 1, 4);
      ctx.fillStyle = "rgba(220,160,255,0.18)";
      ctx.fillRect(20 * S + 10, 9, 4, 1);
    }
    border(20 * S);

    // 21: chest side/front — dark oak wood with centered gold latch
    { const r = rng(3021);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 0.11;
        const cr = Math.max(0, Math.min(255, (122 + v * 180) | 0));
        const cg = Math.max(0, Math.min(255, (74 + v * 130) | 0));
        const cb = Math.max(0, Math.min(255, (30 + v * 80) | 0));
        pixel(21 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      for (let y = 4; y < S; y += 5) ctx.fillRect(21 * S, y, S, 1);
      // Gold clasp centred
      ctx.fillStyle = "#c49200";
      ctx.fillRect(21 * S + 6, 5, 4, 6);
      ctx.fillStyle = "#f0be30";
      ctx.fillRect(21 * S + 7, 6, 2, 2);
      ctx.fillStyle = "#7a5c00";
      ctx.fillRect(21 * S + 6, 5, 4, 1);
      ctx.fillRect(21 * S + 6, 5, 1, 6);
      ctx.fillRect(21 * S + 9, 5, 1, 6);
      ctx.fillRect(21 * S + 6, 10, 4, 1);
    }
    border(21 * S);

    // 22: chest top — wood grain with two gold hinges on back edge
    { const r = rng(3022);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 0.1;
        const cr = Math.max(0, Math.min(255, (138 + v * 180) | 0));
        const cg = Math.max(0, Math.min(255, (84 + v * 130) | 0));
        const cb = Math.max(0, Math.min(255, (42 + v * 80) | 0));
        pixel(22 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
      for (let x = 3; x < S; x += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.13)";
        ctx.fillRect(22 * S + x, 0, 1, S);
      }
      // Hinges (top edge)
      ctx.fillStyle = "#c49200";
      ctx.fillRect(22 * S + 2, 13, 4, 2);
      ctx.fillRect(22 * S + 10, 13, 4, 2);
      ctx.fillStyle = "#f0be30";
      ctx.fillRect(22 * S + 3, 14, 2, 1);
      ctx.fillRect(22 * S + 11, 14, 2, 1);
    }
    border(22 * S);

    // 23: bookshelf — wood frame top/bottom, colorful book spines in middle
    { const r = rng(3023);
      // Whole face: wood base
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 0.08;
        pixel(23 * S + x, y, `rgb(${(200+v*180)|0},${(160+v*130)|0},${(96+v*80)|0})`);
      }
      // Dark wood top and bottom bars
      ctx.fillStyle = "#5a3810";
      ctx.fillRect(23 * S, 0, S, 2);
      ctx.fillRect(23 * S, S - 2, S, 2);
      ctx.fillRect(23 * S + 7, 0, 2, S);
      // Colorful book spines (left half)
      const bookCols = ["#cc2020", "#2244cc", "#22aa44", "#cc8800", "#884499", "#cc4422"];
      const widths   = [2, 2, 1, 2, 2, 2];
      let bx = 1;
      for (let i = 0; i < bookCols.length; i++) {
        ctx.fillStyle = bookCols[i];
        ctx.fillRect(23 * S + bx, 2, widths[i], S - 4);
        ctx.fillStyle = "rgba(255,255,255,0.18)";
        ctx.fillRect(23 * S + bx, 2, 1, S - 4);
        bx += widths[i] + 1;
        if (bx >= 7) break;
      }
      // Right half mirror
      bx = 9;
      for (let i = 0; i < bookCols.length; i++) {
        ctx.fillStyle = bookCols[(i + 2) % bookCols.length];
        ctx.fillRect(23 * S + bx, 2, widths[i], S - 4);
        bx += widths[i] + 1;
        if (bx >= S - 1) break;
      }
    }
    border(23 * S);

    // 24: crafting table top — worn oak with cross-groove crafting grid
    { const r = rng(3024);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 0.1;
        pixel(24 * S + x, y, `rgb(${(152+v*180)|0},${(98+v*130)|0},${(60+v*80)|0})`);
      }
      ctx.fillStyle = "rgba(0,0,0,0.32)";
      ctx.fillRect(24 * S + 7, 0, 2, S);
      ctx.fillRect(24 * S, 7, S, 2);
      ctx.fillStyle = "rgba(255,180,100,0.18)";
      ctx.fillRect(24 * S + 6, 0, 1, S);
      ctx.fillRect(24 * S, 6, S, 1);
    }
    border(24 * S);

    // 25: cactus side — vivid green with vertical ridges and spine tips
    noise(25 * S, 42, 120, 42, 0.08, 3025);
    { // Darker vertical ridge seams
      for (let x = 0; x < S; x += 4) {
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(25 * S + x, 0, 1, S);
        ctx.fillStyle = "rgba(80,200,80,0.18)";
        ctx.fillRect(25 * S + (x + 1) % S, 0, 1, S);
      }
      // Spine tips at ridge edges
      ctx.fillStyle = "rgba(230,230,160,0.75)";
      for (let y = 1; y < S; y += 3) {
        pixel(25 * S,     y, "#ddd890");
        pixel(25 * S + S - 1, y, "#ddd890");
      }
    }
    border(25 * S);

    // 26: cactus top — green with radiating spoke pattern
    { for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const dx = x - 7.5, dy = y - 7.5;
        const dist  = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        const spoke = (Math.abs(Math.sin(angle * 4)) * 0.4 + 0.6) * Math.max(0, 1 - dist / 8);
        const t = spoke * 0.35;
        const cr = Math.max(0, Math.min(255, (42 + t * 30) | 0));
        const cg = Math.max(0, Math.min(255, (120 + t * 45) | 0));
        const cb = Math.max(0, Math.min(255, (42 + t * 20) | 0));
        pixel(26 * S + x, y, `rgb(${cr},${cg},${cb})`);
      }
    }
    border(26 * S);

    // 27: farmland — dark moist soil with horizontal tilled furrows
    noise(27 * S, 98, 64, 28, 0.11, 3027);
    { for (let y = 1; y < S; y += 3) {
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(27 * S, y, S, 1);
        ctx.fillStyle = "rgba(60,30,8,0.25)";
        ctx.fillRect(27 * S, y + 1, S, 1);
      }
    }
    border(27 * S);

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
      const u0 = texIdx / 32, u1 = (texIdx + 1) / 32;
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
