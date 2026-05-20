// World dimensions (FPS game)
export const WORLD_WIDTH = 64;
export const WORLD_DEPTH = 64;
export const WORLD_HEIGHT = 32;

// Legacy aliases (still referenced by old TD code — removed in Phase 12)
export const GRID_WIDTH = WORLD_WIDTH;
export const GRID_DEPTH = WORLD_DEPTH;

export const CELL_SIZE = 1;
export const GROUND_OFFSET = 6; // underground depth — surface block at Y=GROUND_OFFSET
export const TERRAIN_Y = GROUND_OFFSET;   // ground surface block Y index
export const ENEMY_Y = GROUND_OFFSET + 1.5;   // enemy group center height
export const TOWER_BASE_Y = GROUND_OFFSET + 1; // legacy TD constant

// Fortress layout
export const FORTRESS_CENTER_X = 32;
export const FORTRESS_CENTER_Z = 32;
export const WALL_HEIGHT = 6;

// Fortress wall outer positions (matches WorldGen.ts constants)
export const FORTRESS_WALL_NORTH_Z = 18;
export const FORTRESS_WALL_SOUTH_Z = 45;
export const FORTRESS_WALL_WEST_X  = 18;
export const FORTRESS_WALL_EAST_X  = 45;
// Inner edges of the wall (first passable row inside fortress)
export const FORTRESS_INNER_NORTH_Z = 20;
export const FORTRESS_INNER_SOUTH_Z = 43;
// Gate opening — spiders choose wall X outside this range
export const FORTRESS_GATE_X1 = 29;
export const FORTRESS_GATE_X2 = 34;

// Enemy spawn gate positions (world Z)
export const SPAWN_GATE_NORTH_Z = 2;
export const SPAWN_GATE_SOUTH_Z = 61;
export const GATE_CENTER_X = 32;

// Player start (feet position, inside fortress)
export const PLAYER_START_X = 32;
export const PLAYER_START_Z = 32;
export const PLAYER_START_Y = GROUND_OFFSET + 1.0; // feet Y above surface

// Legacy TD constants (kept for Path.ts / Game.ts compatibility — removed in Phase 12)
export const PATH_WAYPOINTS: [number, number][] = [
  [0, 11], [5, 11], [5, 4], [13, 4], [13, 18], [19, 18], [19, 7], [23, 7],
];
export const STARTING_GOLD = 150;
export const BASE_MAX_HEALTH = 20;
export const TREE_POSITIONS: [number, number][] = [
  [1, 2], [2, 1], [22, 1], [22, 22], [1, 22],
  [8, 8], [16, 12], [6, 20], [20, 14],
];
