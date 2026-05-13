export type GameState = "menu" | "playing" | "paused" | "buildphase" | "gameover";
export type GameMode = "survival" | "endless";
export type Difficulty = "easy" | "normal" | "hard";
export type Quality = "low" | "medium" | "high";

export type BlockId =
  | "air" | "grass" | "dirt" | "stone" | "wood" | "planks"
  | "cobblestone" | "sand" | "glass" | "leaves" | "obsidian";

export type EnemyType = "zombie" | "skeleton" | "creeper" | "spider" | "enderman";

export type ToolId = "sword" | "bow" | "pickaxe" | "none";

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

export interface EnemyConfig {
  type: EnemyType;
  name: string;
  health: number;
  speed: number;
  damage: number;
  attackRange: number;
  attackRate: number;
  score: number;
  color: number;
  headColor: number;
  scale: number;
}

export interface WaveConfig {
  enemies: Array<{ type: EnemyType; count: number }>;
  spawnInterval: number;
}

export interface Settings {
  sensitivity: number;
  fov: number;
  quality: Quality;
  difficulty: Difficulty;
  volume: { master: number; effects: number; ui: number };
}
