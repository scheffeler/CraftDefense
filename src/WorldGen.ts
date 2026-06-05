import type { VoxelWorld } from "./Map";
import { WORLD_WIDTH, WORLD_DEPTH, GROUND_OFFSET } from "./config/map";

// ---------------------------------------------------------------------------
// Fortress geometry constants
// Wall columns: x=18..19 (west), x=44..45 (east), z=18..19 (north), z=44..45 (south)
// Interior:     x=20..43, z=20..43
// ---------------------------------------------------------------------------
const G = GROUND_OFFSET;               // surface Y alias (blocks sit at Y=G)
const WX1 = 18, WX2 = 45;              // west/east outermost wall columns
const WZ1 = 18, WZ2 = 45;              // north/south outermost wall columns
const WALL_H = 6;                       // wall height above surface
const GATE_X1 = 30, GATE_X2 = 33;      // gate x span (~centered on x=32)
const GATE_CENTER_X = 32;              // x center of gate/spawn marker
const GATE_H = 3;                       // gate opening height

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function hash(x: number, z: number): number {
  let h = (x * 374761393 + z * 1234567891) | 0;
  h = ((h ^ (h >> 13)) * 1274126177) | 0;
  return h >>> 0;
}

function inFortressBounds(x: number, z: number): boolean {
  return x >= WX1 && x <= WX2 && z >= WZ1 && z <= WZ2;
}

type Biome = "forest" | "desert" | "taiga";

function getBiome(x: number, z: number): Biome {
  if (inFortressBounds(x, z)) return "forest";
  if (z <= 10 || z >= WORLD_DEPTH - 11) return "forest";
  // Forest buffer zone around the fortress
  if (x >= WX1 - 5 && x <= WX2 + 5 && z >= WZ1 - 5 && z <= WZ2 + 5) return "forest";
  const bx = Math.floor(x / 22), bz = Math.floor(z / 22);
  const n1 = (hash(bx * 9871 + 3001, bz * 7649 + 2003) % 1000) / 1000;
  const fx = Math.floor(x / 11), fz = Math.floor(z / 11);
  const n2 = (hash(fx * 4567 + 1001, fz * 3457 + 5003) % 1000) / 1000;
  const n = n1 * 0.75 + n2 * 0.25;
  if (n < 0.28) return "desert";
  if (n > 0.70) return "taiga";
  return "forest";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
/** Return the biome at world coordinates (for fog, audio, and atmosphere tuning). */
export function getBiomeAt(x: number, z: number): "forest" | "desert" | "taiga" {
  return getBiome(x, z);
}

/** Positions of pre-generated dungeon chests for Game.ts loot seeding. */
export const DUNGEON_CHEST_POSITIONS: Array<[number, number, number]> = [
  [8,  3, 30], [55, 3, 25], [12, 3, 45], [50, 3, 48], [30, 3, 8],
];

export function generateWorld(world: VoxelWorld): void {
  generateTerrain(world);
  generateCaves(world);
  generateFortress(world);
  generateInterior(world);
  generateTrees(world);
  generateCacti(world);
  generateVillages(world);
  generateDesertTemples(world);
  generateDungeons(world);
  generateSpawnMarkers(world);
  generateWaterFeatures(world);
  generateRuins(world);
  generateMineShafts(world);
}

/** Returns [x, z] enemy spawn positions for the given gate. */
export function getSpawnPositions(gate: "north" | "south"): Array<[number, number]> {
  const z = gate === "north" ? 2 : 61;
  const positions: Array<[number, number]> = [];
  for (let x = 24; x <= 40; x += 2) positions.push([x, z]);
  return positions;
}

// ---------------------------------------------------------------------------
// Generation steps
// ---------------------------------------------------------------------------
function generateTerrain(world: VoxelWorld): void {
  for (let x = 0; x < WORLD_WIDTH; x++) {
    for (let z = 0; z < WORLD_DEPTH; z++) {
      world.setBlock(x, 0, z, "bedrock");

      for (let y = 1; y < G; y++) {
        const oreHash = hash(x * 1009 + y * 317, z * 769);
        if (y <= 2 && oreHash % 28 === 0) {
          world.setBlock(x, y, z, "diamond_ore");
        } else if (y <= 3 && oreHash % 18 === 0) {
          world.setBlock(x, y, z, "gold_ore");
        } else if (oreHash % 12 === 0) {
          world.setBlock(x, y, z, "iron_ore");
        } else if (oreHash % 7 === 0) {
          world.setBlock(x, y, z, "coal_ore");
        } else if (oreHash % 25 === 0) {
          world.setBlock(x, y, z, "gravel");
        } else {
          world.setBlock(x, y, z, "stone");
        }
      }

      if (inFortressBounds(x, z)) {
        world.setBlock(x, G, z, "cobblestone");
        continue;
      }

      if (z <= 8 || z >= WORLD_DEPTH - 9) {
        world.setBlock(x, G, z, "grass");
        continue;
      }

      const biome = getBiome(x, z);
      const n = smoothNoise(x, z);
      const hillHeight = Math.floor(n * 5.5);

      for (let y = 0; y <= hillHeight; y++) {
        if (biome === "desert") {
          // Sand surface over stone base
          world.setBlock(x, G + y, z, y < hillHeight - 1 ? "stone" : "sand");
        } else {
          // Forest / taiga: normal grass-dirt-stone layering
          if (y <= hillHeight - 3) {
            world.setBlock(x, G + y, z, "stone");
          } else if (y < hillHeight) {
            world.setBlock(x, G + y, z, "dirt");
          } else {
            world.setBlock(x, G + y, z, "grass");
          }
        }
      }

      // Snow cap one block above surface in taiga
      if (biome === "taiga") {
        world.setBlock(x, G + hillHeight + 1, z, "snow");
      }

      // Ore veins in exposed stone part of hills
      if (hillHeight >= 3) {
        const stoneTop = hillHeight - 3;
        for (let y = 0; y <= stoneTop; y++) {
          const oreHash = hash(x * 1009 + y * 317, z * 769 + 500);
          if (oreHash % 18 === 0) world.setBlock(x, G + y, z, "iron_ore");
          else if (oreHash % 10 === 0) world.setBlock(x, G + y, z, "coal_ore");
        }
      }
    }
  }
}

function smoothNoise(x: number, z: number): number {
  // 3-octave hash-based noise, range ~[0,1]
  const n1 = (hash(Math.floor(x / 6), Math.floor(z / 6)) % 1000) / 1000;
  const n2 = (hash(Math.floor(x / 3), Math.floor(z / 3)) % 1000) / 1000 * 0.5;
  const n3 = (hash(x, z) % 1000) / 1000 * 0.1;
  return (n1 + n2 + n3) / 1.6;
}

function generateFortress(world: VoxelWorld): void {
  buildWalls(world);
  buildCornerTowers(world);
}

function buildWalls(world: VoxelWorld): void {
  for (let x = WX1; x <= WX2; x++) {
    for (let z = WZ1; z <= WZ2; z++) {
      const onWest  = x <= WX1 + 1;
      const onEast  = x >= WX2 - 1;
      const onNorth = z <= WZ1 + 1;
      const onSouth = z >= WZ2 - 1;
      if (!(onWest || onEast || onNorth || onSouth)) continue;

      const gateX = x >= GATE_X1 && x <= GATE_X2;
      const northGate = onNorth && gateX;
      const southGate = onSouth && gateX;

      for (let y = G + 1; y <= G + WALL_H; y++) {
        if ((northGate || southGate) && y <= G + GATE_H) continue;
        world.setBlock(x, y, z, y % 3 === 0 ? "stone" : "cobblestone");
      }

      // Battlement merlons on top (alternating positions)
      if ((x + z) % 2 === 0) world.setBlock(x, G + WALL_H + 1, z, "cobblestone");
    }
  }

  // Torches along inner face of north/south walls every 6 blocks
  for (let x = WX1 + 3; x <= WX2 - 3; x += 6) {
    if (x < GATE_X1 - 1 || x > GATE_X2 + 1) {
      world.setBlock(x, G + 3, WZ1 + 2, "torch"); // north wall inner face
      world.setBlock(x, G + 3, WZ2 - 2, "torch"); // south wall inner face
    }
  }
  // Torches along inner face of east/west walls
  for (let z = WZ1 + 3; z <= WZ2 - 3; z += 6) {
    world.setBlock(WX1 + 2, G + 3, z, "torch"); // west wall inner face
    world.setBlock(WX2 - 2, G + 3, z, "torch"); // east wall inner face
  }
}

function buildCornerTowers(world: VoxelWorld): void {
  const corners: [number, number][] = [
    [WX1,     WZ1    ],
    [WX2 - 2, WZ1    ],
    [WX1,     WZ2 - 2],
    [WX2 - 2, WZ2 - 2],
  ];
  for (const [cx, cz] of corners) {
    for (let dx = 0; dx < 3; dx++) {
      for (let dz = 0; dz < 3; dz++) {
        for (let y = G + 1; y <= G + WALL_H + 2; y++) {
          world.setBlock(cx + dx, y, cz + dz, "cobblestone");
        }
      }
    }
    world.setBlock(cx + 1, G + WALL_H + 3, cz + 1, "torch");
  }
}

function generateTrees(world: VoxelWorld): void {
  for (let x = 2; x < WORLD_WIDTH - 2; x++) {
    for (let z = 2; z < WORLD_DEPTH - 2; z++) {
      if (x >= WX1 - 6 && x <= WX2 + 6 && z >= WZ1 - 6 && z <= WZ2 + 6) continue;
      if (z <= 7 || z >= WORLD_DEPTH - 8) continue;

      const biome = getBiome(x, z);
      if (biome === "desert") continue;

      if (hash(x, z) % 10 !== 0) continue;

      let groundY = G;
      for (let y = G + 12; y >= G; y--) {
        if (world.getBlock(x, y, z) !== "air") { groundY = y; break; }
      }

      const top = world.getBlock(x, groundY, z);
      if (top !== "grass" && top !== "snow") continue;

      if (biome === "taiga") {
        placePineTree(world, x, groundY, z);
      } else {
        placeOakBirchTree(world, x, groundY, z);
      }
    }
  }
}

function placePineTree(world: VoxelWorld, x: number, groundY: number, z: number): void {
  const trunkHeight = 5 + (hash(x * 3, z * 7) % 4); // 5–8

  for (let y = groundY + 1; y <= groundY + trunkHeight; y++) {
    world.setBlock(x, y, z, "wood");
  }

  // Conical canopy: wider at base, narrower toward tip
  const layers = [2, 2, 2, 1, 1, 1, 0] as const;
  const canopyBase = groundY + trunkHeight - 3;
  for (let li = 0; li < layers.length; li++) {
    const ly = canopyBase + li;
    const radius = layers[li];
    if (radius === 0) {
      world.setBlock(x, ly, z, "leaves");
      continue;
    }
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        if (Math.abs(dx) === radius && Math.abs(dz) === radius) continue;
        const bx = x + dx, bz = z + dz;
        if (bx < 0 || bz < 0 || bx >= WORLD_WIDTH || bz >= WORLD_DEPTH) continue;
        if (world.getBlock(bx, ly, bz) === "air") world.setBlock(bx, ly, bz, "leaves");
      }
    }
  }
}

function placeOakBirchTree(world: VoxelWorld, x: number, groundY: number, z: number): void {
  const h = hash(x * 3, z * 7);
  const trunkHeight = 4 + (h % 3);
  const isBirch = (hash(x * 17, z * 23) % 3) === 0;

  for (let y = groundY + 1; y <= groundY + trunkHeight; y++) {
    world.setBlock(x, y, z, "wood");
  }

  if (isBirch) {
    for (let ly = groundY + trunkHeight - 1; ly <= groundY + trunkHeight + 2; ly++) {
      const radius = (ly === groundY + trunkHeight + 2) ? 0 : (ly >= groundY + trunkHeight) ? 1 : 2;
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (radius === 2 && Math.abs(dx) === 2 && Math.abs(dz) === 2) continue;
          const bx = x + dx, bz = z + dz;
          if (bx < 0 || bz < 0 || bx >= WORLD_WIDTH || bz >= WORLD_DEPTH) continue;
          if (world.getBlock(bx, ly, bz) === "air") world.setBlock(bx, ly, bz, "leaves");
        }
      }
    }
    world.setBlock(x, groundY + trunkHeight + 2, z, "leaves");
  } else {
    for (let ly = groundY + trunkHeight - 1; ly <= groundY + trunkHeight + 1; ly++) {
      const radius = (ly <= groundY + trunkHeight) ? 2 : 1;
      for (let dx = -radius; dx <= radius; dx++) {
        for (let dz = -radius; dz <= radius; dz++) {
          if (Math.abs(dx) === radius && Math.abs(dz) === radius) continue;
          const bx = x + dx, bz = z + dz;
          if (bx < 0 || bz < 0 || bx >= WORLD_WIDTH || bz >= WORLD_DEPTH) continue;
          if (world.getBlock(bx, ly, bz) === "air") world.setBlock(bx, ly, bz, "leaves");
        }
      }
    }
    world.setBlock(x, groundY + trunkHeight + 2, z, "leaves");
  }
}

function generateCacti(world: VoxelWorld): void {
  for (let x = 2; x < WORLD_WIDTH - 2; x++) {
    for (let z = 2; z < WORLD_DEPTH - 2; z++) {
      if (getBiome(x, z) !== "desert") continue;
      if (z <= 7 || z >= WORLD_DEPTH - 8) continue;
      if (hash(x * 31, z * 37) % 25 !== 0) continue;

      let groundY = G;
      for (let y = G + 10; y >= G; y--) {
        if (world.getBlock(x, y, z) !== "air") { groundY = y; break; }
      }
      if (world.getBlock(x, groundY, z) !== "sand") continue;

      const height = 1 + (hash(x * 5, z * 7) % 3);
      for (let y = 1; y <= height; y++) {
        world.setBlock(x, groundY + y, z, "cactus");
      }
    }
  }
}

// Ore outcroppings now handled by terrain generation (ore embedded in hills)

function generateInterior(world: VoxelWorld): void {
  // Stone-paved floor path from north gate to south gate
  for (let z = WZ1 + 2; z <= WZ2 - 2; z++) {
    for (let x = GATE_X1; x <= GATE_X2; x++) {
      world.setBlock(x, G, z, "cobblestone");
    }
  }

  // Cobblestone border around interior perimeter
  for (let x = WX1 + 2; x <= WX2 - 2; x++) {
    world.setBlock(x, G, WZ1 + 2, "cobblestone");
    world.setBlock(x, G, WZ2 - 2, "cobblestone");
  }
  for (let z = WZ1 + 2; z <= WZ2 - 2; z++) {
    world.setBlock(WX1 + 2, G, z, "cobblestone");
    world.setBlock(WX2 - 2, G, z, "cobblestone");
  }

  // Central well
  const cx = 32, cz = 32;
  for (let angle = 0; angle < 8; angle++) {
    const a = angle / 8 * Math.PI * 2;
    const wx = Math.round(cx + Math.cos(a) * 2);
    const wz = Math.round(cz + Math.sin(a) * 2);
    world.setBlock(wx, G + 1, wz, "cobblestone");
    world.setBlock(wx, G + 2, wz, "cobblestone");
  }
  world.setBlock(cx, G, cz, "cobblestone");
  world.setBlock(cx, G + 3, cz - 2, "torch");
  world.setBlock(cx, G + 3, cz + 2, "torch");

  // Campfire — pre-lit in the open clearing south of the well
  world.setBlock(cx, G + 1, cz + 5, "campfire");

  // East shack (crafting area)
  for (let dx = 0; dx < 3; dx++) {
    world.setBlock(38 + dx, G + 1, 28, "planks");
    world.setBlock(38 + dx, G + 1, 31, "planks");
    world.setBlock(38 + dx, G + 2, 28, "planks");
    world.setBlock(38 + dx, G + 2, 31, "planks");
    world.setBlock(38 + dx, G + 3, 28, "wood");
    world.setBlock(38 + dx, G + 3, 31, "wood");
  }
  world.setBlock(38, G + 1, 29, "planks");
  world.setBlock(38, G + 1, 30, "planks");
  world.setBlock(38, G + 2, 29, "planks");
  world.setBlock(38, G + 2, 30, "planks");
  for (let dx = 0; dx < 3; dx++) {
    for (let dz = 0; dz < 4; dz++) {
      world.setBlock(38 + dx, G + 4, 28 + dz, "planks");
    }
  }
  world.setBlock(39, G + 1, 29, "crafting_table");
  world.setBlock(39, G + 1, 30, "furnace");
  world.setBlock(38, G + 1, 30, "chest");
  world.setBlock(40, G + 3, 30, "torch");

  // West shack (barracks)
  for (let dx = 0; dx < 3; dx++) {
    world.setBlock(22 + dx, G + 1, 28, "planks");
    world.setBlock(22 + dx, G + 1, 31, "planks");
    world.setBlock(22 + dx, G + 2, 28, "planks");
    world.setBlock(22 + dx, G + 2, 31, "planks");
    world.setBlock(22 + dx, G + 3, 28, "wood");
    world.setBlock(22 + dx, G + 3, 31, "wood");
  }
  world.setBlock(24, G + 1, 29, "planks");
  world.setBlock(24, G + 1, 30, "planks");
  world.setBlock(24, G + 2, 29, "planks");
  world.setBlock(24, G + 2, 30, "planks");
  for (let dx = 0; dx < 3; dx++) {
    for (let dz = 0; dz < 4; dz++) {
      world.setBlock(22 + dx, G + 4, 28 + dz, "planks");
    }
  }
  world.setBlock(24, G + 3, 30, "torch");
  world.setBlock(22, G + 1, 30, "chest");
}

function generateSpawnMarkers(world: VoxelWorld): void {
  for (let y = G + 1; y <= G + 5; y++) {
    world.setBlock(GATE_CENTER_X,     y, 2,  "obsidian");
    world.setBlock(GATE_CENTER_X + 1, y, 2,  "obsidian");
    world.setBlock(GATE_CENTER_X,     y, 61, "obsidian");
    world.setBlock(GATE_CENTER_X + 1, y, 61, "obsidian");
  }
}

function generateWaterFeatures(world: VoxelWorld): void {
  const ponds: [number, number, number, number][] = [
    [8,  15, 3, 3],
    [56, 12, 3, 2],
    [5,  48, 2, 3],
    [58, 50, 3, 3],
    [10, 35, 2, 2],
  ];

  for (const [pcx, pcz, rx, rz] of ponds) {
    for (let dx = -rx; dx <= rx; dx++) {
      for (let dz = -rz; dz <= rz; dz++) {
        if ((dx / rx) ** 2 + (dz / rz) ** 2 > 1) continue;
        const x = pcx + dx, z = pcz + dz;
        if (x < 0 || z < 0 || x >= WORLD_WIDTH || z >= WORLD_DEPTH) continue;
        world.setBlock(x, G,     z, "water");
        world.setBlock(x, G + 1, z, "air");
        world.setBlock(x, G + 2, z, "air");
        if (Math.abs(dx) === rx || Math.abs(dz) === rz ||
            Math.abs(dx) === rx - 1 || Math.abs(dz) === rz - 1) {
          for (const [ax, az] of [[x+1,z],[x-1,z],[x,z+1],[x,z-1]]) {
            if (ax < 0 || az < 0 || ax >= WORLD_WIDTH || az >= WORLD_DEPTH) continue;
            const cur = world.getBlock(ax, G, az);
            if (cur === "grass" || cur === "dirt") world.setBlock(ax, G, az, "sand");
          }
        }
      }
    }
  }
}

function generateMineShafts(world: VoxelWorld): void {
  const shaftPositions: [number, number][] = [
    [8, 25], [15, 18], [50, 22], [55, 40], [12, 50], [48, 52],
  ];

  for (const [sx, sz] of shaftPositions) {
    if (inFortressBounds(sx, sz)) continue;
    if (sz <= 10 || sz >= WORLD_DEPTH - 11) continue;

    // Find hill surface
    let surfaceY = G;
    for (let y = G + 10; y >= G; y--) {
      if (world.getBlock(sx, y, sz) !== "air") { surfaceY = y; break; }
    }
    if (surfaceY < G + 2) continue; // only in hilly areas

    // Shaft going all the way down to y=1 (just above bedrock)
    for (let y = 1; y < surfaceY; y++) {
      world.setBlock(sx,     y, sz,     "air");
      world.setBlock(sx + 1, y, sz,     "air");
      world.setBlock(sx,     y, sz + 1, "air");
      world.setBlock(sx + 1, y, sz + 1, "air");
    }

    // Wooden frame at shaft entrance
    world.setBlock(sx - 1, surfaceY, sz,     "planks");
    world.setBlock(sx + 2, surfaceY, sz,     "planks");
    world.setBlock(sx - 1, surfaceY, sz + 1, "planks");
    world.setBlock(sx + 2, surfaceY, sz + 1, "planks");
    world.setBlock(sx,     surfaceY, sz - 1, "torch");

    // Deep horizontal tunnel at y=2 (deep underground)
    const tunnelLen = 7 + (hash(sx, sz) % 6);
    for (let dx = 0; dx < tunnelLen; dx++) {
      const tx = sx + 3 + dx;
      if (tx < 1 || tx >= WORLD_WIDTH - 1) break;
      world.setBlock(tx, 2, sz,     "air");
      world.setBlock(tx, 3, sz,     "air");
      world.setBlock(tx, 2, sz + 1, "air");
      world.setBlock(tx, 3, sz + 1, "air");
      if (dx % 4 === 3) {
        world.setBlock(tx, 4, sz,     "planks");
        world.setBlock(tx, 4, sz + 1, "planks");
      }
      if (dx % 6 === 5) world.setBlock(tx, 3, sz, "torch");
    }

    // Mid-shaft branch tunnel at G-2 (mid-depth ore level)
    const midY = G - 2;
    const branchLen = 5 + (hash(sz, sx) % 5);
    for (let dx = 0; dx < branchLen; dx++) {
      const tx = sx - 1 - dx;
      if (tx < 1) break;
      world.setBlock(tx, midY,     sz,     "air");
      world.setBlock(tx, midY + 1, sz,     "air");
      world.setBlock(tx, midY,     sz + 1, "air");
      world.setBlock(tx, midY + 1, sz + 1, "air");
      if (dx % 6 === 5) world.setBlock(tx, midY + 1, sz, "torch");
    }
  }
}

function generateCaves(world: VoxelWorld): void {
  const NUM_WORMS = 30;
  for (let w = 0; w < NUM_WORMS; w++) {
    // Random underground start
    let x = 4 + (hash(w * 7 + 100, 0) % (WORLD_WIDTH - 8));
    let y = 1 + (hash(w * 3 + 200, 1) % (G - 2));
    let z = 4 + (hash(w * 11 + 300, 2) % (WORLD_DEPTH - 8));

    // Direction — mostly horizontal
    let dx = ((hash(w, 10) % 200) / 100 - 1) * 0.7;
    let dy = ((hash(w, 11) % 40) / 100 - 0.2) * 0.4;
    let dz = ((hash(w, 12) % 200) / 100 - 1) * 0.7;
    const hLen = Math.sqrt(dx * dx + dz * dz);
    if (hLen > 0.01) { dx /= hLen; dz /= hLen; }

    const steps = 12 + (hash(w, 20) % 16);
    for (let s = 0; s < steps; s++) {
      const radius = 1.1 + (hash(w * 100 + s, 5) % 6) / 10;
      const ry = radius * 0.55; // vertically squished
      for (let bx = Math.floor(x - radius); bx <= Math.ceil(x + radius); bx++) {
        for (let by = Math.floor(y - ry); by <= Math.ceil(y + ry); by++) {
          for (let bz = Math.floor(z - radius); bz <= Math.ceil(z + radius); bz++) {
            if (bx < 1 || bx >= WORLD_WIDTH - 1) continue;
            if (bz < 1 || bz >= WORLD_DEPTH - 1) continue;
            if (by <= 0 || by >= G) continue; // preserve bedrock and surface
            const d2 = ((bx - x) / radius) ** 2 + ((by - y) / ry) ** 2 + ((bz - z) / radius) ** 2;
            if (d2 <= 1) world.setBlock(bx, by, bz, "air");
          }
        }
      }
      // Occasional torch on cave floor
      if (s % 8 === 4) {
        const fx = Math.round(x), fz = Math.round(z);
        const floor = Math.floor(y - ry) - 1;
        if (floor >= 1 && floor < G) {
          const cur = world.getBlock(fx, floor, fz);
          const above = world.getBlock(fx, floor + 1, fz);
          if (cur !== "air" && above === "air") world.setBlock(fx, floor + 1, fz, "torch");
        }
      }
      // Advance with slight wander
      x += dx + ((hash(w * 100 + s, 30) % 100) / 100 - 0.5) * 0.5;
      y += dy + ((hash(w * 100 + s, 31) % 100) / 100 - 0.5) * 0.25;
      z += dz + ((hash(w * 100 + s, 32) % 100) / 100 - 0.5) * 0.5;
      y = Math.max(1, Math.min(G - 1, y));
    }
  }
}

// ---------------------------------------------------------------------------
// Desert temples
// ---------------------------------------------------------------------------

function generateDesertTemples(world: VoxelWorld): void {
  const temples: [number, number][] = [[14, 15], [48, 48]];
  for (const [cx, cz] of temples) {
    if (inFortressBounds(cx, cz)) continue;
    if (getBiome(cx, cz) !== "desert") {
      // Try nearby if not in desert
      const alt: [number, number][] = [[cx + 6, cz], [cx, cz + 6], [cx - 6, cz]];
      let placed = false;
      for (const [ax, az] of alt) {
        if (!inFortressBounds(ax, az) && getBiome(ax, az) === "desert" && az > 10 && az < WORLD_DEPTH - 11) {
          buildDesertTemple(world, ax, az);
          placed = true;
          break;
        }
      }
      if (!placed) continue;
    } else {
      buildDesertTemple(world, cx, cz);
    }
  }
}

function buildDesertTemple(world: VoxelWorld, cx: number, cz: number): void {
  if (cz <= 10 || cz >= WORLD_DEPTH - 11) return;
  const surfY = findSurfaceY(world, cx, cz);
  const BASE = 9;

  // Stepped pyramid: 5 layers
  for (let layer = 0; layer < 5; layer++) {
    const half = Math.floor(BASE / 2) - layer;
    const y = surfY + layer;
    for (let dx = -half; dx <= half; dx++) {
      for (let dz = -half; dz <= half; dz++) {
        const bx = cx + dx, bz = cz + dz;
        if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
        world.setBlock(bx, y, bz, "sand");
      }
    }
  }

  // Hollow interior at base layer
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      const bx = cx + dx, bz = cz + dz;
      if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
      for (let y = surfY + 1; y <= surfY + 2; y++) world.setBlock(bx, y, bz, "air");
    }
  }

  // Entry stairway on south face
  for (let step = 0; step <= 3; step++) {
    const bz = cz + 4 + step;
    if (bz < 1 || bz >= WORLD_DEPTH - 1) continue;
    world.setBlock(cx, surfY + step, bz, "cobblestone");
  }
  // Entry door gap
  world.setBlock(cx, surfY + 1, cz + 4, "air");
  world.setBlock(cx, surfY + 2, cz + 4, "air");

  // Interior chest with treasure
  world.setBlock(cx, surfY + 1, cz, "chest");
  // Torches inside
  world.setBlock(cx - 2, surfY + 2, cz - 2, "torch");
  world.setBlock(cx + 2, surfY + 2, cz - 2, "torch");
}

// ---------------------------------------------------------------------------
// Dungeons (underground cobblestone rooms with chests)
// ---------------------------------------------------------------------------

function generateDungeons(world: VoxelWorld): void {
  for (const [dx, roomY, dz] of DUNGEON_CHEST_POSITIONS) {
    if (dz <= 10 || dz >= WORLD_DEPTH - 11) continue;
    const x0 = dx - 2, z0 = dz - 2;
    const W = 5, D = 5, H = 4;

    // Cobblestone floor and ceiling
    for (let x = x0 - 1; x <= x0 + W; x++) {
      for (let z = z0 - 1; z <= z0 + D; z++) {
        if (x < 1 || z < 1 || x >= WORLD_WIDTH - 1 || z >= WORLD_DEPTH - 1) continue;
        world.setBlock(x, roomY - 1, z, "cobblestone");
        world.setBlock(x, roomY + H, z, "cobblestone");
      }
    }
    // Cobblestone walls + clear interior
    for (let x = x0; x < x0 + W; x++) {
      for (let y = roomY; y < roomY + H; y++) {
        for (let z = z0; z < z0 + D; z++) {
          if (x < 1 || z < 1 || x >= WORLD_WIDTH - 1 || z >= WORLD_DEPTH - 1) continue;
          const onWall = x === x0 || x === x0 + W - 1 || z === z0 || z === z0 + D - 1;
          world.setBlock(x, y, z, onWall ? "cobblestone" : "air");
        }
      }
    }
    // Torches
    world.setBlock(x0 + 1, roomY + 2, z0 + 1, "torch");
    world.setBlock(x0 + 3, roomY + 2, z0 + 1, "torch");
    world.setBlock(x0 + 1, roomY + 2, z0 + 3, "torch");
    world.setBlock(x0 + 3, roomY + 2, z0 + 3, "torch");
    // Chest (center)
    world.setBlock(dx, roomY, dz, "chest");
    // Entry passage upward (2×1 shaft from room to surface)
    for (let y = roomY + H; y <= G + 1; y++) {
      if (dx < 1 || dx >= WORLD_WIDTH - 1 || dz < 1 || dz >= WORLD_DEPTH - 1) continue;
      world.setBlock(dx, y, dz, "air");
    }
  }
}

// ---------------------------------------------------------------------------
// Village generation
// ---------------------------------------------------------------------------

function findSurfaceY(world: VoxelWorld, x: number, z: number): number {
  for (let y = G + 12; y >= G; y--) {
    if (world.getBlock(x, y, z) !== "air") return y;
  }
  return G;
}

function generateVillages(world: VoxelWorld): void {
  buildVillage(world,  9, 13);  // NW village
  buildVillage(world, 53, 50);  // SE village
}

function buildVillage(world: VoxelWorld, cx: number, cz: number): void {
  if (inFortressBounds(cx, cz)) return;
  if (cz <= 10 || cz >= WORLD_DEPTH - 11) return;

  const surfY = findSurfaceY(world, cx, cz);

  buildVillageWell(world, cx, cz, surfY);
  buildVillageHouse(world, cx - 8, cz, surfY);
  buildVillageHouse(world, cx + 4, cz, surfY);
  buildVillageHouse(world, cx, cz - 8, surfY);
  buildVillageFarm(world, cx + 4, cz + 4, surfY);

  // Cobblestone paths connecting well to each house
  for (let x = cx - 6; x <= cx + 3; x++) {
    const sy = findSurfaceY(world, x, cz);
    if (world.getBlock(x, sy, cz) !== "water") world.setBlock(x, sy, cz, "cobblestone");
  }
  for (let z = cz - 6; z <= cz + 3; z++) {
    const sy = findSurfaceY(world, cx, z);
    if (world.getBlock(cx, sy, z) !== "water") world.setBlock(cx, sy, z, "cobblestone");
  }
  // Torches along path every 3 blocks
  for (let x = cx - 5; x <= cx + 2; x += 3) {
    const sy = findSurfaceY(world, x, cz);
    world.setBlock(x, sy + 1, cz, "torch");
  }
}

function buildVillageWell(world: VoxelWorld, cx: number, cz: number, surfY: number): void {
  // 3×3 cobblestone ring, 3 high; water inside at surface
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) {
      const bx = cx + dx, bz = cz + dz;
      if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
      if (dx === 0 && dz === 0) {
        world.setBlock(bx, surfY, bz, "water");
        continue;
      }
      for (let y = surfY; y <= surfY + 2; y++) {
        world.setBlock(bx, y, bz, "cobblestone");
      }
    }
  }
  // Overhang: two wood posts + plank beam
  if (cx - 1 >= 1 && cx + 1 < WORLD_WIDTH - 1) {
    world.setBlock(cx - 1, surfY + 3, cz, "wood");
    world.setBlock(cx + 1, surfY + 3, cz, "wood");
    for (let dx = -1; dx <= 1; dx++) {
      world.setBlock(cx + dx, surfY + 4, cz, "planks");
    }
  }
}

function buildVillageHouse(world: VoxelWorld, hx: number, hz: number, refY: number): void {
  const W = 5, D = 4;
  // Use terrain height at house center
  const cx2 = hx + 2, cz2 = hz + 1;
  if (cx2 < 1 || cz2 < 1 || cx2 >= WORLD_WIDTH - 1 || cz2 >= WORLD_DEPTH - 1) return;
  const floorY = Math.max(refY, findSurfaceY(world, cx2, cz2));

  // Clear interior air
  for (let dx = 0; dx < W; dx++) {
    for (let dz = 0; dz < D; dz++) {
      const bx = hx + dx, bz = hz + dz;
      if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
      for (let y = floorY; y <= floorY + 5; y++) world.setBlock(bx, y, bz, "air");
    }
  }

  // Cobblestone floor
  for (let dx = 0; dx < W; dx++) {
    for (let dz = 0; dz < D; dz++) {
      const bx = hx + dx, bz = hz + dz;
      if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
      world.setBlock(bx, floorY, bz, "cobblestone");
    }
  }

  // Planks walls, 3 high; glass windows, door gap
  for (let y = 1; y <= 3; y++) {
    for (let dx = 0; dx < W; dx++) {
      for (let dz = 0; dz < D; dz++) {
        if (dx !== 0 && dx !== W - 1 && dz !== 0 && dz !== D - 1) continue; // interior
        const bx = hx + dx, bz = hz + dz;
        if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
        // Door opening: front face (dz===0), center column
        if (dz === 0 && dx === 2 && y <= 2) continue;
        // Glass windows
        if (y === 2 && (dz === 0 || dz === D - 1) && (dx === 1 || dx === 3)) {
          world.setBlock(bx, floorY + y, bz, "glass"); continue;
        }
        world.setBlock(bx, floorY + y, bz, "planks");
      }
    }
  }

  // Wooden roof slab
  for (let dx = -1; dx <= W; dx++) {
    for (let dz = -1; dz <= D; dz++) {
      const bx = hx + dx, bz = hz + dz;
      if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
      world.setBlock(bx, floorY + 4, bz, "planks");
    }
  }

  // Interior furnishings
  const bx1 = hx + 1, bz1 = hz + 1;
  const bx2 = hx + 3, bz2 = hz + 2;
  if (bx1 < WORLD_WIDTH - 1 && bz1 < WORLD_DEPTH - 1)
    world.setBlock(bx1, floorY + 1, bz1, "crafting_table");
  if (bx2 < WORLD_WIDTH - 1 && bz2 < WORLD_DEPTH - 1)
    world.setBlock(bx2, floorY + 1, bz2, "chest");
  // Torch inside
  if (hx + 1 < WORLD_WIDTH - 1 && hz + 3 < WORLD_DEPTH - 1)
    world.setBlock(hx + 1, floorY + 3, hz + 3, "torch");
  // Torch above door outside
  if (hx + 2 < WORLD_WIDTH - 1 && hz - 1 >= 1)
    world.setBlock(hx + 2, floorY + 3, hz - 1, "torch");
}

function buildVillageFarm(world: VoxelWorld, fx: number, fz: number, refY: number): void {
  const WHEAT_STAGES = ["wheat_0", "wheat_1", "wheat_2", "wheat_3"] as const;
  for (let dx = 0; dx < 5; dx++) {
    for (let dz = 0; dz < 3; dz++) {
      const bx = fx + dx, bz = fz + dz;
      if (bx < 1 || bz < 1 || bx >= WORLD_WIDTH - 1 || bz >= WORLD_DEPTH - 1) continue;
      const ly = Math.max(refY, findSurfaceY(world, bx, bz));
      world.setBlock(bx, ly, bz, "farmland");
      world.setBlock(bx, ly + 1, bz, WHEAT_STAGES[(dx + dz * 2) % 4]);
    }
  }
}

function generateRuins(world: VoxelWorld): void {
  const ruins: [number, number][] = [
    [6, 25], [12, 40], [55, 28], [50, 42], [14, 20], [50, 18],
  ];

  for (const [rx, rz] of ruins) {
    if (inFortressBounds(rx, rz)) continue;
    if (rz <= 10 || rz >= WORLD_DEPTH - 11) continue;

    const h = 2 + (hash(rx, rz) % 3);
    const len = 3 + (hash(rx * 3, rz) % 4);
    const ruinBlock = getBiome(rx, rz) === "desert" ? "sand" : "cobblestone";

    for (let i = 0; i < len; i++) {
      for (let y = 1; y <= h; y++) {
        if (hash(rx + i, y * 17 + rz) % 4 === 0) continue;
        world.setBlock(rx + i, G + y, rz, ruinBlock);
      }
    }

    const arm = 2 + (hash(rz, rx) % 3);
    for (let i = 0; i < arm; i++) {
      for (let y = 1; y <= Math.max(1, h - 1); y++) {
        if (hash(rz + i, y * 11 + rx) % 3 === 0) continue;
        world.setBlock(rx, G + y, rz + i, ruinBlock);
      }
    }
  }
}
