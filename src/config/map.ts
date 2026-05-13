export const GRID_WIDTH = 24;
export const GRID_DEPTH = 24;
export const CELL_SIZE = 1;
export const TERRAIN_Y = 0;   // grass top face Y
export const ENEMY_Y = 1.5;   // enemy group position Y while walking
export const TOWER_BASE_Y = 1; // tower mesh bottom Y

// Path waypoints [x, z] in grid coords — all segments are axis-aligned
export const PATH_WAYPOINTS: [number, number][] = [
  [0, 11],
  [5, 11],
  [5, 4],
  [13, 4],
  [13, 18],
  [19, 18],
  [19, 7],
  [23, 7],
];

export const STARTING_GOLD = 150;
export const BASE_MAX_HEALTH = 20; // lives; each enemy reduces by config.damage

export const TREE_POSITIONS: [number, number][] = [
  [1, 2], [2, 1], [22, 1], [22, 22], [1, 22],
  [8, 8], [16, 12], [6, 20], [20, 14],
];
