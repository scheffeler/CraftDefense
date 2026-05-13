import type { TowerConfig, TowerTypeName } from "../types";

export const TOWER_CONFIGS: Record<TowerTypeName, TowerConfig> = {
  arrow: {
    type: "arrow",
    name: "Arrow Tower",
    description: "Fast single-target attacks",
    color: 0x8b6914,
    projectile: "arrow",
    levels: [
      { damage: 15, range: 6,   fireRate: 1.2, cost: 50,  projectileSpeed: 14 },
      { damage: 28, range: 7,   fireRate: 1.5, cost: 75,  projectileSpeed: 16 },
      { damage: 50, range: 8,   fireRate: 2.0, cost: 100, projectileSpeed: 18 },
    ],
  },
  cannon: {
    type: "cannon",
    name: "Cannon Tower",
    description: "Slow AoE damage",
    color: 0x555555,
    projectile: "cannonball",
    levels: [
      { damage: 40,  range: 5, fireRate: 0.5, cost: 100, projectileSpeed: 10, aoeRadius: 1.5 },
      { damage: 75,  range: 6, fireRate: 0.7, cost: 125, projectileSpeed: 11, aoeRadius: 2.0 },
      { damage: 130, range: 7, fireRate: 0.9, cost: 175, projectileSpeed: 12, aoeRadius: 2.5 },
    ],
  },
  ice: {
    type: "ice",
    name: "Ice Tower",
    description: "Slows enemies",
    color: 0x66ccff,
    projectile: "icebolt",
    levels: [
      { damage: 8,  range: 5.5, fireRate: 1.0, cost: 75,  projectileSpeed: 12, slowFactor: 0.5,  slowDuration: 1.5 },
      { damage: 15, range: 6.5, fireRate: 1.2, cost: 100, projectileSpeed: 13, slowFactor: 0.35, slowDuration: 2.0 },
      { damage: 25, range: 7.5, fireRate: 1.5, cost: 125, projectileSpeed: 14, slowFactor: 0.2,  slowDuration: 2.5 },
    ],
  },
};

export const SELL_REFUND_RATE = 0.5;
