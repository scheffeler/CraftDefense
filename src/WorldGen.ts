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

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export function generateWorld(world: VoxelWorld): void {
  generateTerrain(world);
  generateFortress(world);
  generateInterior(world);
  generateTrees(world);
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
      // Bedrock layer (unbreakable)
      world.setBlock(x, 0, z, "bedrock");

      // Underground stone + ores (y=1..G-1)
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

      // Keep enemy spawn zones flat
      if (z <= 8 || z >= WORLD_DEPTH - 9) {
        world.setBlock(x, G, z, "grass");
        continue;
      }

      // Hills outside fortress: up to 5 blocks tall above surface
      const n = smoothNoise(x, z);
      const hillHeight = Math.floor(n * 5.5); // 0–5 blocks above G

      // Surface + hill column
      for (let y = 0; y <= hillHeight; y++) {
        if (y <= hillHeight - 3) {
          world.setBlock(x, G + y, z, "stone");
        } else if (y < hillHeight) {
          world.setBlock(x, G + y, z, "dirt");
        } else {
          world.setBlock(x, G + y, z, "grass");
        }
      }

      // Ore veins in stone part of hills
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
      if (hash(x, z) % 10 !== 0) continue;

      // Find surface height (scan from above)
      let groundY = G;
      for (let y = G + 10; y >= G; y--) {
        if (world.getBlock(x, y, z) !== "air") { groundY = y; break; }
      }
      if (world.getBlock(x, groundY, z) !== "grass") continue;

      const h = hash(x * 3, z * 7);
      const trunkHeight = 4 + (h % 3); // 4–6 blocks
      // 30% chance birch (lighter wood color — we still use "wood" block but vary canopy)
      const isBirch = (hash(x * 17, z * 23) % 3) === 0;

      for (let y = groundY + 1; y <= groundY + trunkHeight; y++) {
        world.setBlock(x, y, z, "wood");
      }

      if (isBirch) {
        // Tall, narrow birch canopy
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
        // Wide oak canopy — 3 layers
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

function generateRuins(world: VoxelWorld): void {
  const ruins: [number, number][] = [
    [6, 25], [12, 40], [55, 28], [50, 42], [14, 20], [50, 18],
  ];

  for (const [rx, rz] of ruins) {
    if (inFortressBounds(rx, rz)) continue;
    if (rz <= 10 || rz >= WORLD_DEPTH - 11) continue;

    const h = 2 + (hash(rx, rz) % 3);
    const len = 3 + (hash(rx * 3, rz) % 4);

    for (let i = 0; i < len; i++) {
      for (let y = 1; y <= h; y++) {
        if (hash(rx + i, y * 17 + rz) % 4 === 0) continue;
        world.setBlock(rx + i, G + y, rz, "cobblestone");
      }
    }

    const arm = 2 + (hash(rz, rx) % 3);
    for (let i = 0; i < arm; i++) {
      for (let y = 1; y <= Math.max(1, h - 1); y++) {
        if (hash(rz + i, y * 11 + rx) % 3 === 0) continue;
        world.setBlock(rx, G + y, rz + i, "cobblestone");
      }
    }
  }
}
