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
const ATLAS_TILE_COUNT = 32;

function getBlockTexIndex(id: BlockId, normalY: number): number {
  const isTop = normalY > 0;
  const isBot = normalY < 0;
  switch (id as string) {
    case "stone":        return 0;
    case "cobblestone":  return 1;
    case "dirt":         return 2;
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
    case "snow":         return 17;
    case "iron_block":   return 18;
    case "glass":        return 19;
    case "water":        return 20;
    case "farmland":     return isTop ? 21 : 2;
    case "cactus":       return isTop ? 22 : 23;
    case "bookshelf":    return isTop ? 8 : 24;
    case "furnace":      return isTop ? 0 : 25;
    case "chest":        return isTop ? 26 : 27;
    case "obsidian":     return 28;
    case "enchanting_table": return isTop ? 29 : 30;
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
    // 32 textures × 16px wide = 512px atlas, 16px tall
    const ATLAS_TILES = ATLAS_TILE_COUNT;
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

    // 1: cobblestone — distinct stone cells with mortar
    noise(1 * S, 130, 124, 110, 0.07, 1002);
    { // Mortar lines (dark gaps between stones) — two-row layout offset like real cobblestone
      const M = "rgba(45,42,36,0.80)";
      ctx.fillStyle = M;
      // horizontal mortar
      ctx.fillRect(1*S, 7, S, 1); ctx.fillRect(1*S, 14, S, 1);
      // top row vertical splits: 3 stones
      ctx.fillRect(1*S+5, 0, 1, 7); ctx.fillRect(1*S+10, 0, 1, 7);
      // bottom row vertical splits: offset (2.5 stones)
      ctx.fillRect(1*S+3, 8, 1, 6); ctx.fillRect(1*S+8, 8, 1, 6); ctx.fillRect(1*S+13, 8, 1, 6);
      // highlights (top+left edge of each stone) — 3 top-row stones
      ctx.fillStyle = "rgba(200,192,175,0.50)";
      ctx.fillRect(1*S+1, 1, 3, 1); ctx.fillRect(1*S+1, 1, 1, 5); // stone TL top-row
      ctx.fillRect(1*S+6, 1, 3, 1); ctx.fillRect(1*S+6, 1, 1, 5); // stone TM
      ctx.fillRect(1*S+11, 1, 4, 1); ctx.fillRect(1*S+11, 1, 1, 5); // stone TR
      // highlights — bottom row stones
      ctx.fillRect(1*S+1, 9, 1, 1); ctx.fillRect(1*S+1, 9, 1, 4); // BL
      ctx.fillRect(1*S+4, 9, 3, 1); ctx.fillRect(1*S+4, 9, 1, 4); // BML
      ctx.fillRect(1*S+9, 9, 3, 1); ctx.fillRect(1*S+9, 9, 1, 4); // BMR
      ctx.fillRect(1*S+14, 9, 1, 1); ctx.fillRect(1*S+14, 9, 1, 4); // BR
      // shadows (bottom+right edge) — top row
      ctx.fillStyle = "rgba(50,46,38,0.45)";
      ctx.fillRect(1*S+1, 5, 3, 1); ctx.fillRect(1*S+4, 1, 1, 5);
      ctx.fillRect(1*S+6, 5, 3, 1); ctx.fillRect(1*S+9, 1, 1, 5);
      ctx.fillRect(1*S+11, 5, 4, 1); ctx.fillRect(1*S+14, 2, 1, 4);
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

    // 16: gravel — rounded pebbles of varying gray
    noise(16 * S, 132, 130, 122, 0.09, 1016);
    { const r = rng(2016);
      const pebbles: [number,number,number,number][] = [];
      for (let i = 0; i < 9; i++) {
        const px = (r() * 10 + 1) | 0, py = (r() * 10 + 1) | 0;
        const pw = (r() * 3 + 2) | 0,  ph = (r() * 2 + 2) | 0;
        pebbles.push([px, py, pw, ph]);
      }
      for (const [px, py, pw, ph] of pebbles) {
        const bright = 0.7 + r() * 0.5;
        const br = (145 * bright) | 0, bg = (142 * bright) | 0, bb = (134 * bright) | 0;
        ctx.fillStyle = `rgb(${br},${bg},${bb})`; ctx.fillRect(16*S+px, py, pw, ph);
        ctx.fillStyle = "rgba(200,198,190,0.5)"; ctx.fillRect(16*S+px, py, pw, 1); ctx.fillRect(16*S+px, py, 1, ph);
        ctx.fillStyle = "rgba(70,68,60,0.5)"; ctx.fillRect(16*S+px, py+ph-1, pw, 1); ctx.fillRect(16*S+px+pw-1, py, 1, ph);
      }
    }
    border(16 * S);

    // 17: snow — bright white with subtle blue-gray sheen
    fill(17 * S, "#eef2fc");
    { const r = rng(2017);
      for (let y = 1; y < S-1; y++) for (let x = 1; x < S-1; x++) {
        const v = r();
        if (v > 0.85) pixel(17*S+x, y, "#ffffff");
        else if (v < 0.08) pixel(17*S+x, y, "#d8e2f4");
      }
    }
    border(17 * S);

    // 18: iron block — metallic panels with grid seams
    fill(18 * S, "#b4b4b8");
    { // 4×4 grid of 4px panels with 1px dark seam
      ctx.fillStyle = "rgba(60,60,65,0.6)";
      ctx.fillRect(18*S+4, 0, 1, S); ctx.fillRect(18*S+9, 0, 1, S); ctx.fillRect(18*S+14, 0, 1, S);
      ctx.fillRect(18*S, 4, S, 1);   ctx.fillRect(18*S, 9, S, 1);   ctx.fillRect(18*S, 14, S, 1);
      // Panel highlights (top-left edge of each panel)
      ctx.fillStyle = "rgba(210,210,215,0.7)";
      for (let px = 0; px < S; px += 5) for (let py = 0; py < S; py += 5) {
        ctx.fillRect(18*S+px, py, 3, 1);
        ctx.fillRect(18*S+px, py, 1, 3);
      }
      // Panel shadows (bottom-right edge)
      ctx.fillStyle = "rgba(80,80,85,0.5)";
      for (let px = 0; px < S; px += 5) for (let py = 0; py < S; py += 5) {
        ctx.fillRect(18*S+px+2, py+3, 1, 1);
        ctx.fillRect(18*S+px+3, py, 1, 4);
      }
    }
    border(18 * S);

    // 19: glass — pale blue-white with corner marks
    fill(19 * S, "#c8e8f8");
    { // Slight inner highlight cross
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(19*S+1, 1, S-2, 1); ctx.fillRect(19*S+1, 1, 1, S-2);
      ctx.fillStyle = "rgba(80,140,200,0.3)";
      ctx.fillRect(19*S+S-2, 2, 1, S-3); ctx.fillRect(19*S+2, S-2, S-3, 1);
      // Corner ornaments
      ctx.fillStyle = "rgba(60,120,180,0.5)";
      ctx.fillRect(19*S+2, 2, 2, 2); ctx.fillRect(19*S+S-4, 2, 2, 2);
      ctx.fillRect(19*S+2, S-4, 2, 2); ctx.fillRect(19*S+S-4, S-4, 2, 2);
    }
    border(19 * S);

    // 20: water surface — blue with diagonal wave ripples
    fill(20 * S, "#2e7ec0");
    { const r = rng(2020);
      // Lighter wave lines (diagonal)
      ctx.fillStyle = "rgba(100,180,240,0.6)";
      for (let d = -S; d < S*2; d += 4) {
        for (let t = 0; t < S; t++) {
          const wx = d + t, wy = t;
          if (wx >= 0 && wx < S) pixel(20*S+wx, wy, `rgba(100,180,240,${0.4 + r()*0.3})`);
        }
      }
      // Sparkle highlights
      for (let i = 0; i < 6; i++) {
        const sx = (r() * 14 + 1) | 0, sy = (r() * 14 + 1) | 0;
        pixel(20*S+sx, sy, "#aaddff");
      }
      // Slight darker troughs
      ctx.fillStyle = "rgba(10,50,120,0.3)";
      for (let d = -S; d < S*2; d += 4) {
        for (let t = 0; t < S; t++) {
          const wx = d+2+t, wy = t;
          if (wx >= 0 && wx < S) pixel(20*S+wx, wy, "rgba(10,50,120,0.25)");
        }
      }
    }
    border(20 * S);

    // 21: farmland top — dark moist soil with crack lines
    noise(21 * S, 90, 58, 28, 0.1, 1021);
    { // Crack lines
      ctx.fillStyle = "rgba(40,22,8,0.55)";
      ctx.fillRect(21*S+3, 3, 1, 5); ctx.fillRect(21*S+3, 8, 4, 1);
      ctx.fillRect(21*S+9, 5, 1, 6); ctx.fillRect(21*S+5, 11, 5, 1);
      ctx.fillRect(21*S+11, 2, 1, 4); ctx.fillRect(21*S+11, 6, 3, 1);
      // Moisture sheen
      ctx.fillStyle = "rgba(60,40,20,0.25)";
      for (let i = 0; i < 4; i++) ctx.fillRect(21*S+2+i*4, 1, 2, 1);
    }
    border(21 * S);

    // 22: cactus top — circular green cross
    fill(22 * S, "#2a7a2a");
    { ctx.fillStyle = "#1a5a1a";
      ctx.fillRect(22*S, 0, S, 5); ctx.fillRect(22*S, S-5, S, 5);
      ctx.fillRect(22*S, 0, 5, S); ctx.fillRect(22*S+S-5, 0, 5, S);
      ctx.fillStyle = "#3a9a3a";
      ctx.fillRect(22*S+5, 5, 6, 6);
    }
    border(22 * S);

    // 23: cactus side — green with vertical ribs and spine nubs
    fill(23 * S, "#2a6a2a");
    { const r = rng(2023);
      // Vertical lighter ribs
      for (let x = 2; x < S-1; x += 5) {
        ctx.fillStyle = "rgba(70,160,70,0.5)"; ctx.fillRect(23*S+x, 0, 2, S);
        ctx.fillStyle = "rgba(15,60,15,0.4)"; ctx.fillRect(23*S+x+2, 0, 1, S);
      }
      // Spine attachment nubs
      ctx.fillStyle = "rgba(230,230,200,0.9)";
      for (let y = 2; y < S-1; y += 4) {
        for (let x = 0; x < S; x += 5) {
          if (r() > 0.3) pixel(23*S+x+1, y, "#e0e0c0");
        }
      }
    }
    border(23 * S);

    // 24: bookshelf side — wood frame with colorful book spines
    noise(24 * S, 160, 126, 74, 0.05, 5024);
    { const r = rng(2024);
      const bookColors = ["#cc2222","#2244cc","#226622","#aa6600","#882288","#cc8800","#335599"];
      let bx = 1;
      for (let bi = 0; bi < 7; bi++) {
        const bw = 1 + (r() * 1.2 | 0);
        ctx.fillStyle = bookColors[bi % bookColors.length]; ctx.fillRect(24*S+bx, 2, bw, 12);
        ctx.fillStyle = "rgba(0,0,0,0.3)"; ctx.fillRect(24*S+bx+bw, 2, 1, 12);
        ctx.fillStyle = "rgba(255,255,255,0.4)"; ctx.fillRect(24*S+bx, 5, bw, 1);
        bx += bw + 1;
        if (bx > S - 2) break;
      }
      // Wood strip overlaid at top/bottom
      ctx.fillStyle = "rgba(180,140,80,0.9)"; ctx.fillRect(24*S, 0, S, 2); ctx.fillRect(24*S, S-2, S, 2);
    }
    border(24 * S);

    // 25: furnace front — stone face with furnace opening
    noise(25 * S, 118, 110, 100, 0.07, 1025);
    { // Furnace opening (dark rectangle)
      ctx.fillStyle = "#1a1008"; ctx.fillRect(25*S+4, 3, 8, 9);
      // Orange glow around opening
      ctx.fillStyle = "rgba(220,120,20,0.4)"; ctx.fillRect(25*S+3, 2, 10, 1);
      ctx.fillStyle = "rgba(200,100,10,0.3)"; ctx.fillRect(25*S+2, 3, 1, 9); ctx.fillRect(25*S+13, 3, 1, 9);
      ctx.fillStyle = "rgba(180,80,5,0.25)"; ctx.fillRect(25*S+3, 12, 10, 1);
      // Glowing coals at bottom of opening
      ctx.fillStyle = "#ff6600"; ctx.fillRect(25*S+5, 10, 2, 1); ctx.fillRect(25*S+9, 10, 2, 1);
      ctx.fillStyle = "#ff9900"; ctx.fillRect(25*S+7, 9, 2, 2);
    }
    border(25 * S);

    // 26: chest top — wood with lock
    fill(26 * S, "#b07838");
    { const r = rng(2026);
      // Wood grain lines
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 18;
        pixel(26*S+x, y, `rgb(${(176+v)|0},${(120+v*0.7)|0},${(56+v*0.4)|0})`);
      }
      // Seams
      ctx.fillStyle = "rgba(0,0,0,0.2)"; ctx.fillRect(26*S, 7, S, 1); ctx.fillRect(26*S+7, 0, 1, S);
      // Iron lock
      ctx.fillStyle = "#888888"; ctx.fillRect(26*S+6, 6, 4, 3);
      ctx.fillStyle = "#aaaaaa"; ctx.fillRect(26*S+7, 6, 2, 1);
      ctx.fillStyle = "#555555"; ctx.fillRect(26*S+7, 7, 2, 2);
    }
    border(26 * S);

    // 27: chest side — oak planks with lock clasp
    fill(27 * S, "#c08844");
    { const r = rng(2027);
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
        const v = (r() - 0.5) * 16;
        pixel(27*S+x, y, `rgb(${(192+v)|0},${(136+v*0.7)|0},${(68+v*0.4)|0})`);
      }
      // Horizontal plank lines
      ctx.fillStyle = "rgba(0,0,0,0.18)"; ctx.fillRect(27*S, 5, S, 1); ctx.fillRect(27*S, 10, S, 1);
      // Iron clasp (center)
      ctx.fillStyle = "#909090"; ctx.fillRect(27*S+6, 7, 4, 2);
      ctx.fillStyle = "#bbbbbb"; ctx.fillRect(27*S+7, 7, 2, 1);
      ctx.fillStyle = "#444444"; ctx.fillRect(27*S+7, 8, 2, 1);
      // Corner metal trim
      ctx.fillStyle = "#888888";
      ctx.fillRect(27*S+1, 1, 2, 1); ctx.fillRect(27*S+1, 1, 1, 2);
      ctx.fillRect(27*S+S-3, 1, 2, 1); ctx.fillRect(27*S+S-2, 1, 1, 2);
      ctx.fillRect(27*S+1, S-2, 2, 1); ctx.fillRect(27*S+1, S-3, 1, 2);
      ctx.fillRect(27*S+S-3, S-2, 2, 1); ctx.fillRect(27*S+S-2, S-3, 1, 2);
    }
    border(27 * S);

    // 28: obsidian — very dark purple with crystal flecks
    noise(28 * S, 26, 12, 42, 0.07, 1028);
    { const r = rng(2028);
      for (let i = 0; i < 6; i++) {
        const ox2 = (r() * 13 + 1) | 0, oy2 = (r() * 13 + 1) | 0;
        pixel(28*S+ox2, oy2, "#9944cc");
        pixel(28*S+ox2+1, oy2, "#6622aa");
        pixel(28*S+ox2, oy2+1, "#6622aa");
      }
      // Subtle deep purple sheen overlay
      ctx.fillStyle = "rgba(60,20,80,0.25)";
      for (let y = 0; y < S; y += 3) ctx.fillRect(28*S, y, S, 1);
    }
    border(28 * S);

    // 29: enchanting table top — dark with arcane rune design
    fill(29 * S, "#180a20");
    { // Outer ring / book
      ctx.fillStyle = "#660011"; ctx.fillRect(29*S+3, 2, 10, 12);
      ctx.fillStyle = "#440008"; ctx.fillRect(29*S+4, 3, 8, 10);
      ctx.fillStyle = "#cc0022"; ctx.fillRect(29*S+3, 2, 10, 1); ctx.fillRect(29*S+3, 13, 10, 1);
      ctx.fillStyle = "#880011"; ctx.fillRect(29*S+3, 3, 1, 10); ctx.fillRect(29*S+12, 3, 1, 10);
      // Arcane symbols on the book
      ctx.fillStyle = "#ff4466";
      pixel(29*S+7, 5, "#ff4466"); pixel(29*S+8, 5, "#ff4466");
      pixel(29*S+6, 6, "#ff4466"); pixel(29*S+9, 6, "#ff4466");
      pixel(29*S+6, 7, "#ff4466"); pixel(29*S+9, 7, "#ff4466");
      pixel(29*S+7, 8, "#ff4466"); pixel(29*S+8, 8, "#ff4466");
      pixel(29*S+7, 10, "#ff8844"); pixel(29*S+8, 11, "#ff8844");
    }
    border(29 * S);

    // 30: enchanting table side — obsidian base with red gem
    noise(30 * S, 26, 12, 42, 0.06, 1030);
    { // Red gem/crystal
      ctx.fillStyle = "#cc0022"; ctx.fillRect(30*S+6, 4, 4, 5);
      ctx.fillStyle = "#ff2244"; ctx.fillRect(30*S+7, 4, 2, 1); ctx.fillRect(30*S+6, 5, 1, 3);
      ctx.fillStyle = "#880011"; ctx.fillRect(30*S+7, 8, 2, 1); ctx.fillRect(30*S+9, 5, 1, 3);
      // Subtle purple glow around gem
      ctx.fillStyle = "rgba(180,0,40,0.25)";
      ctx.fillRect(30*S+5, 3, 6, 1); ctx.fillRect(30*S+5, 9, 6, 1);
      ctx.fillRect(30*S+5, 3, 1, 7); ctx.fillRect(30*S+10, 3, 1, 7);
    }
    border(30 * S);

    // 31: spare — white (unused)
    fill(31 * S, "#ffffff");
    border(31 * S);

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
      const u0 = texIdx / ATLAS_TILE_COUNT, u1 = (texIdx + 1) / ATLAS_TILE_COUNT;
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
