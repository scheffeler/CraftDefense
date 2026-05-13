import type { VoxelWorld } from "./Map";
import { WORLD_WIDTH, WORLD_DEPTH } from "./config/map";

// ---------------------------------------------------------------------------
// Fortress geometry constants
// Wall columns: x=18..19 (west), x=44..45 (east), z=18..19 (north), z=44..45 (south)
// Interior:     x=20..43, z=20..43
// ---------------------------------------------------------------------------
const WX1 = 18, WX2 = 45;              // west/east outermost wall columns
const WZ1 = 18, WZ2 = 45;              // north/south outermost wall columns
const WALL_H = 6;                       // wall height in blocks (y=1..6)
const GATE_X1 = 30, GATE_X2 = 33;      // gate x span (~centered on x=32)
const GATE_CENTER_X = 32;              // x center of gate/spawn marker
const GATE_H = 3;                       // gate opening height (y=1..3 cleared)

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
  generateTrees(world);
  generateOreOutcroppings(world);
  generateSpawnMarkers(world);
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
      // Surface block: stone inside fortress bounds, grass outside
      world.setBlock(x, 0, z, inFortressBounds(x, z) ? "stone" : "grass");
    }
  }
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

      for (let y = 1; y <= WALL_H; y++) {
        if ((northGate || southGate) && y <= GATE_H) continue;
        world.setBlock(x, y, z, "stone");
      }

      // Battlement merlons on top (alternating positions)
      if ((x + z) % 2 === 0) world.setBlock(x, WALL_H + 1, z, "stone");
    }
  }
}

function buildCornerTowers(world: VoxelWorld): void {
  // 3×3 towers at each corner, 2 blocks taller than curtain wall
  const corners: [number, number][] = [
    [WX1,     WZ1    ],
    [WX2 - 2, WZ1    ],
    [WX1,     WZ2 - 2],
    [WX2 - 2, WZ2 - 2],
  ];
  for (const [cx, cz] of corners) {
    for (let dx = 0; dx < 3; dx++) {
      for (let dz = 0; dz < 3; dz++) {
        for (let y = 1; y <= WALL_H + 2; y++) {
          world.setBlock(cx + dx, y, cz + dz, "stone");
        }
      }
    }
  }
}

function generateTrees(world: VoxelWorld): void {
  for (let x = 2; x < WORLD_WIDTH - 2; x++) {
    for (let z = 2; z < WORLD_DEPTH - 2; z++) {
      // Skip buffer around fortress and spawn zones
      if (x >= WX1 - 4 && x <= WX2 + 4 && z >= WZ1 - 4 && z <= WZ2 + 4) continue;
      if (z <= 7 || z >= WORLD_DEPTH - 8) continue;
      if (hash(x, z) % 18 !== 0) continue;

      world.setBlock(x, 1, z, "wood");
      world.setBlock(x, 2, z, "wood");
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          world.setBlock(x + dx, 3, z + dz, "leaves");
        }
      }
    }
  }
}

function generateOreOutcroppings(world: VoxelWorld): void {
  // Small stone mounds with ore exposed on top, on a 6-unit grid
  for (let x = 6; x < WORLD_WIDTH - 6; x += 6) {
    for (let z = 6; z < WORLD_DEPTH - 6; z += 6) {
      if (x >= WX1 - 6 && x <= WX2 + 6 && z >= WZ1 - 6 && z <= WZ2 + 6) continue;
      if (z <= 10 || z >= WORLD_DEPTH - 11) continue;
      const h = hash(x * 7, z * 13);
      if (h % 4 !== 0) continue;

      const oreId = h % 3 === 0 ? "iron_ore" : "coal_ore";
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          world.setBlock(x + dx, 1, z + dz, "stone");
        }
      }
      world.setBlock(x, 2, z, oreId);
    }
  }
}

function generateSpawnMarkers(world: VoxelWorld): void {
  // Tall obsidian columns flanking each spawn gate as visual landmarks
  for (let y = 1; y <= 5; y++) {
    world.setBlock(GATE_CENTER_X,     y, 2,  "obsidian");
    world.setBlock(GATE_CENTER_X + 1, y, 2,  "obsidian");
    world.setBlock(GATE_CENTER_X,     y, 61, "obsidian");
    world.setBlock(GATE_CENTER_X + 1, y, 61, "obsidian");
  }
}
