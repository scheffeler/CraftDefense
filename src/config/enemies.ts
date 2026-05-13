import type { EnemyConfig, EnemyTypeName } from "../types";

export const ENEMY_CONFIGS: Record<EnemyTypeName, EnemyConfig> = {
  zombie: {
    type: "zombie",
    name: "Zombie",
    maxHealth: 60,
    speed: 1.8,
    reward: 10,
    damage: 1,
    color: 0x3a7a3a,
    headColor: 0xc8b090,
    scale: 1.0,
  },
  spider: {
    type: "spider",
    name: "Spider",
    maxHealth: 35,
    speed: 3.4,
    reward: 15,
    damage: 1,
    color: 0x1a1a1a,
    headColor: 0x1a1a1a,
    scale: 0.75,
  },
  golem: {
    type: "golem",
    name: "Stone Golem",
    maxHealth: 280,
    speed: 0.9,
    reward: 40,
    damage: 3,
    color: 0x888888,
    headColor: 0x666666,
    scale: 1.5,
  },
};
