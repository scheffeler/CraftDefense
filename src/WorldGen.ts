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
  generateInterior(world);
  generateTrees(world);
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
      if (inFortressBounds(x, z)) {
        world.setBlock(x, 0, z, "cobblestone");
        continue;
      }

      // Keep enemy spawn zones flat
      if (z <= 8 || z >= WORLD_DEPTH - 9) {
        world.setBlock(x, 0, z, "grass");
        continue;
      }

      // Hills outside fortress: up to 5 blocks tall
      const n = smoothNoise(x, z);
      const hillHeight = Math.floor(n * 5.5); // 0–5 blocks

      // Fill column: stone at base, dirt in middle, grass on top
      for (let y = 0; y <= hillHeight; y++) {
        if (y <= hillHeight - 3) {
          world.setBlock(x, y, z, "stone");
        } else if (y < hillHeight) {
          world.setBlock(x, y, z, "dirt");
        } else {
          world.setBlock(x, y, z, "grass");
        }
      }

      // Embed ore veins in stone layers
      if (hillHeight >= 3) {
        const stoneTop = hillHeight - 3;
        for (let y = 0; y <= stoneTop; y++) {
          const oreHash = hash(x * 1009 + y * 317, z * 769);
          if (oreHash % 18 === 0) world.setBlock(x, y, z, "iron_ore");
          else if (oreHash % 10 === 0) world.setBlock(x, y, z, "coal_ore");
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

      for (let y = 1; y <= WALL_H; y++) {
        if ((northGate || southGate) && y <= GATE_H) continue;
        // Alternate stone/cobblestone rows for visual texture
        world.setBlock(x, y, z, y % 3 === 0 ? "stone" : "cobblestone");
      }

      // Battlement merlons on top (alternating positions)
      if ((x + z) % 2 === 0) world.setBlock(x, WALL_H + 1, z, "cobblestone");
    }
  }

  // Torches along inner face of north/south walls every 6 blocks
  for (let x = WX1 + 3; x <= WX2 - 3; x += 6) {
    if (x < GATE_X1 - 1 || x > GATE_X2 + 1) {
      world.setBlock(x, 3, WZ1 + 2, "torch"); // north wall inner face
      world.setBlock(x, 3, WZ2 - 2, "torch"); // south wall inner face
    }
  }
  // Torches along inner face of east/west walls
  for (let z = WZ1 + 3; z <= WZ2 - 3; z += 6) {
    world.setBlock(WX1 + 2, 3, z, "torch"); // west wall inner face
    world.setBlock(WX2 - 2, 3, z, "torch"); // east wall inner face
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
          world.setBlock(cx + dx, y, cz + dz, "cobblestone");
        }
      }
    }
    // Torch on top of each tower
    world.setBlock(cx + 1, WALL_H + 3, cz + 1, "torch");
  }
}

function generateTrees(world: VoxelWorld): void {
  for (let x = 2; x < WORLD_WIDTH - 2; x++) {
    for (let z = 2; z < WORLD_DEPTH - 2; z++) {
      if (x >= WX1 - 8 && x <= WX2 + 8 && z >= WZ1 - 8 && z <= WZ2 + 8) continue;
      if (z <= 7 || z >= WORLD_DEPTH - 8) continue;
      if (hash(x, z) % 16 !== 0) continue;

      // Find surface height
      let groundY = 0;
      for (let y = 10; y >= 0; y--) {
        if (world.getBlock(x, y, z) !== "air") { groundY = y; break; }
      }

      const h = hash(x * 3, z * 7);
      const trunkHeight = 4 + (h % 3); // 4–6 blocks

      for (let y = groundY + 1; y <= groundY + trunkHeight; y++) {
        world.setBlock(x, y, z, "wood");
      }

      // Wide 3-layer canopy
      for (let ly = groundY + trunkHeight - 1; ly <= groundY + trunkHeight + 1; ly++) {
        const radius = (ly <= groundY + trunkHeight) ? 2 : 1;
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dz = -radius; dz <= radius; dz++) {
            if (Math.abs(dx) === radius && Math.abs(dz) === radius) continue;
            const bx = x + dx, bz = z + dz;
            if (bx < 0 || bz < 0 || bx >= WORLD_WIDTH || bz >= WORLD_DEPTH) continue;
            if (world.getBlock(bx, ly, bz) === "air") {
              world.setBlock(bx, ly, bz, "leaves");
            }
          }
        }
      }
      // Top cap
      world.setBlock(x, groundY + trunkHeight + 2, z, "leaves");
    }
  }
}

// Ore outcroppings now handled by terrain generation (ore embedded in hills)

function generateInterior(world: VoxelWorld): void {
  // Stone-paved floor path from north gate to south gate (x=30..33, all z inside fortress)
  for (let z = WZ1 + 2; z <= WZ2 - 2; z++) {
    for (let x = GATE_X1; x <= GATE_X2; x++) {
      world.setBlock(x, 0, z, "cobblestone");
    }
  }

  // Cobblestone border around interior perimeter (inner face of walls)
  for (let x = WX1 + 2; x <= WX2 - 2; x++) {
    world.setBlock(x, 0, WZ1 + 2, "cobblestone");
    world.setBlock(x, 0, WZ2 - 2, "cobblestone");
  }
  for (let z = WZ1 + 2; z <= WZ2 - 2; z++) {
    world.setBlock(WX1 + 2, 0, z, "cobblestone");
    world.setBlock(WX2 - 2, 0, z, "cobblestone");
  }

  // Central well (cobblestone ring at 32, 32)
  const cx = 32, cz = 32;
  for (let angle = 0; angle < 8; angle++) {
    const a = angle / 8 * Math.PI * 2;
    const wx = Math.round(cx + Math.cos(a) * 2);
    const wz = Math.round(cz + Math.sin(a) * 2);
    world.setBlock(wx, 1, wz, "cobblestone");
    world.setBlock(wx, 2, wz, "cobblestone");
  }
  world.setBlock(cx, 0, cz, "cobblestone");
  // Torch on top of well
  world.setBlock(cx, 3, cz - 2, "torch");
  world.setBlock(cx, 3, cz + 2, "torch");

  // Small wooden shack near east wall (crafting area)
  for (let dx = 0; dx < 3; dx++) {
    world.setBlock(38 + dx, 1, 28, "planks");
    world.setBlock(38 + dx, 1, 31, "planks");
    world.setBlock(38 + dx, 2, 28, "planks");
    world.setBlock(38 + dx, 2, 31, "planks");
    world.setBlock(38 + dx, 3, 28, "wood");
    world.setBlock(38 + dx, 3, 31, "wood");
  }
  world.setBlock(38, 1, 29, "planks");
  world.setBlock(38, 1, 30, "planks");
  world.setBlock(38, 2, 29, "planks");
  world.setBlock(38, 2, 30, "planks");
  // Roof
  for (let dx = 0; dx < 3; dx++) {
    for (let dz = 0; dz < 4; dz++) {
      world.setBlock(38 + dx, 4, 28 + dz, "planks");
    }
  }
  // Crafting table and furnace inside
  world.setBlock(39, 1, 29, "crafting_table");
  world.setBlock(39, 1, 30, "furnace");
  // Torch in the shack
  world.setBlock(40, 3, 30, "torch");

  // Second shack on west side (barracks feel)
  for (let dx = 0; dx < 3; dx++) {
    world.setBlock(22 + dx, 1, 28, "planks");
    world.setBlock(22 + dx, 1, 31, "planks");
    world.setBlock(22 + dx, 2, 28, "planks");
    world.setBlock(22 + dx, 2, 31, "planks");
    world.setBlock(22 + dx, 3, 28, "wood");
    world.setBlock(22 + dx, 3, 31, "wood");
  }
  world.setBlock(24, 1, 29, "planks");
  world.setBlock(24, 1, 30, "planks");
  world.setBlock(24, 2, 29, "planks");
  world.setBlock(24, 2, 30, "planks");
  for (let dx = 0; dx < 3; dx++) {
    for (let dz = 0; dz < 4; dz++) {
      world.setBlock(22 + dx, 4, 28 + dz, "planks");
    }
  }
  world.setBlock(24, 3, 30, "torch");
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
