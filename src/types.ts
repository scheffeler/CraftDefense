// ---------------------------------------------------------------------------
// Shared type definitions — no Three.js imports
// ---------------------------------------------------------------------------

export type GamePhase = "menu" | "playing" | "wave_clear" | "gameover" | "win";

export type EnemyTypeName = "zombie" | "spider" | "golem";
export type TowerTypeName = "arrow" | "cannon" | "ice";
export type ProjectileType = "arrow" | "cannonball" | "icebolt";

export type BlockId =
  | "air" | "grass" | "dirt" | "stone" | "wood"
  | "planks" | "cobblestone" | "sand" | "glass" | "leaves" | "obsidian";

export interface BlockDef {
  id: BlockId;
  name: string;
  color: number;
  topColor?: number;
  bottomColor?: number;
  hardness: number;
  placeable: boolean;
  transparent: boolean;
}

// ---------------------------------------------------------------------------
// Tower config
// ---------------------------------------------------------------------------

export interface TowerLevelConfig {
  damage: number;
  range: number;
  fireRate: number;      // shots per second
  cost: number;          // purchase cost (level 0) or upgrade cost (levels 1-2)
  projectileSpeed: number;
  aoeRadius?: number;    // cannon only
  slowFactor?: number;   // ice only — fraction of normal speed
  slowDuration?: number; // ice only — seconds
}

export interface TowerConfig {
  type: TowerTypeName;
  name: string;
  description: string;
  color: number;
  projectile: ProjectileType;
  levels: [TowerLevelConfig, TowerLevelConfig, TowerLevelConfig];
}

// ---------------------------------------------------------------------------
// Enemy config
// ---------------------------------------------------------------------------

export interface EnemyConfig {
  type: EnemyTypeName;
  name: string;
  maxHealth: number;
  speed: number;
  reward: number;
  damage: number;
  color: number;
  headColor: number;
  scale: number;
}

// ---------------------------------------------------------------------------
// Wave config
// ---------------------------------------------------------------------------

export interface WaveGroup {
  type: EnemyTypeName;
  count: number;
  spawnInterval: number;
}

export interface WaveConfig {
  wave: number;
  groups: WaveGroup[];
  bonusGold: number;
}

// ---------------------------------------------------------------------------
// Runtime state (plain data, no Three.js)
// ---------------------------------------------------------------------------

export interface EnemyState {
  id: number;
  config: EnemyConfig;
  health: number;
  waypointIndex: number;
  speed: number;
  slowTimer: number;
  alive: boolean;
  dying: boolean;
  dyingTimer: number;
  movePhase: number;
}

export interface TowerState {
  id: number;
  type: TowerTypeName;
  gridX: number;
  gridZ: number;
  level: number;
  cooldown: number;
  totalSpent: number;
}

export interface GridCell {
  x: number;
  z: number;
  isPath: boolean;
  hasTower: boolean;
  towerId: number | null;
}
