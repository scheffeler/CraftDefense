import type { WaveConfig } from "../types";

export const WAVE_CONFIGS: WaveConfig[] = [
  // Wave 1 — Tutorial: slow zombies only
  { wave: 1, bonusGold: 25, groups: [
    { type: "zombie", count: 6, spawnInterval: 2.5 },
  ]},
  // Wave 2 — More zombies
  { wave: 2, bonusGold: 30, groups: [
    { type: "zombie", count: 10, spawnInterval: 2.0 },
  ]},
  // Wave 3 — First spiders
  { wave: 3, bonusGold: 35, groups: [
    { type: "zombie", count: 8,  spawnInterval: 2.0 },
    { type: "spider", count: 4,  spawnInterval: 1.5 },
  ]},
  // Wave 4 — Mixed pressure
  { wave: 4, bonusGold: 40, groups: [
    { type: "spider", count: 6,  spawnInterval: 1.2 },
    { type: "zombie", count: 10, spawnInterval: 1.8 },
  ]},
  // Wave 5 — First golem
  { wave: 5, bonusGold: 60, groups: [
    { type: "zombie", count: 8,  spawnInterval: 1.8 },
    { type: "golem",  count: 1,  spawnInterval: 4.0 },
  ]},
  // Wave 6 — Golem + spider swarm
  { wave: 6, bonusGold: 65, groups: [
    { type: "spider", count: 10, spawnInterval: 1.0 },
    { type: "golem",  count: 2,  spawnInterval: 5.0 },
  ]},
  // Wave 7 — Heavy assault
  { wave: 7, bonusGold: 75, groups: [
    { type: "zombie", count: 15, spawnInterval: 1.4 },
    { type: "spider", count: 8,  spawnInterval: 1.0 },
  ]},
  // Wave 8 — Multi-golem push
  { wave: 8, bonusGold: 80, groups: [
    { type: "golem",  count: 3,  spawnInterval: 4.0 },
    { type: "spider", count: 12, spawnInterval: 0.9 },
  ]},
  // Wave 9 — Everything at once
  { wave: 9, bonusGold: 100, groups: [
    { type: "zombie", count: 20, spawnInterval: 1.2 },
    { type: "spider", count: 15, spawnInterval: 0.8 },
    { type: "golem",  count: 3,  spawnInterval: 3.5 },
  ]},
  // Wave 10 — Final boss wave
  { wave: 10, bonusGold: 200, groups: [
    { type: "golem",  count: 5,  spawnInterval: 3.0 },
    { type: "spider", count: 20, spawnInterval: 0.6 },
    { type: "zombie", count: 25, spawnInterval: 0.9 },
  ]},
];
