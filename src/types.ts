// ---------------------------------------------------------------------------
// Shared type definitions — no Three.js imports
// ---------------------------------------------------------------------------

export type GamePhase = "menu" | "playing" | "wave_clear" | "gameover" | "win" | "endless";

export type EnemyTypeName = "zombie" | "spider" | "golem" | "goblin" | "orc" | "troll" | "goblin_miner" | "creeper" | "skeleton" | "uruk_captain";
export type TowerTypeName = "arrow" | "cannon" | "ice"; // kept for UI backward-compat
export type ProjectileType = "arrow" | "cannonball" | "icebolt" | "crossbow_bolt";

export type BlockId =
  | "air" | "grass" | "dirt" | "stone" | "wood"
  | "planks" | "cobblestone" | "sand" | "glass" | "leaves" | "obsidian"
  | "iron_ore" | "coal_ore" | "iron_block" | "crafting_table" | "furnace"
  | "torch" | "chest" | "water"
  | "farmland" | "wheat_0" | "wheat_1" | "wheat_2" | "wheat_3"
  | "bedrock" | "gravel" | "gold_ore" | "diamond_ore"
  | "snow" | "cactus"
  | "bookshelf" | "enchanting_table"
  | "bed" | "tnt" | "lava" | "fire";

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
  canBreakWalls?: boolean;
  xpReward?: number;
  drops?: Array<{ itemId: string; chance: number; count?: number }>;
}

// ---------------------------------------------------------------------------
// Wave config
// ---------------------------------------------------------------------------

export interface WaveGroup {
  type: EnemyTypeName;
  count: number;
  spawnInterval: number;
  gate?: "north" | "south"; // spawn gate (defaults to "north")
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
  useFlowField?: boolean;
  breakTarget?: { x: number; y: number; z: number } | null;
  breakTimer?: number;
  // Creeper-specific
  priming?: boolean;
  primeTimer?: number;
  flashTimer?: number;
  // Skeleton-specific
  shootCooldown?: number;
  strafeDir?: 1 | -1;       // +1 or -1 lateral strafe direction
  strafeTimer?: number;     // seconds until next strafe direction flip
  // Spider-specific
  webCooldown?: number;     // seconds until next web shot
  // Knockback / stagger (all melee enemy types)
  knockbackTimer?: number;  // > 0: briefly staggered, can't attack
  // Elite variant
  elite?: boolean;
  // Troll / uruk_captain stomp attack
  stompCooldown?: number;    // seconds until next stomp is available
  stompCharging?: boolean;   // true during wind-up before stomp fires
  stompChargeTimer?: number; // counts up to STOMP_CHARGE_TIME
  // uruk_captain war cry (buffs nearby enemies)
  warCryTimer?: number;      // counts down to next war cry
  warCryFlash?: number;      // countdown for the boss visual flash
}

// TowerState kept as a stub type so UI.ts stubs compile without error
export interface TowerState {
  id: number;
  type: TowerTypeName;
  gridX: number;
  gridZ: number;
  level: number;
  cooldown: number;
  totalSpent: number;
}
