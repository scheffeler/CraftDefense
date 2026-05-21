import type { WaveConfig } from "../types";

// 10 Helm's Deep themed waves — escalating from goblin scouts to full siege
export const WAVE_CONFIGS: WaveConfig[] = [
  // Wave 1 — Goblin scouts probe the north gate
  { wave: 1, bonusGold: 20, groups: [
    { type: "goblin", count: 6, spawnInterval: 2.5, gate: "north" },
  ]},

  // Wave 2 — Goblins attack from both gates
  { wave: 2, bonusGold: 25, groups: [
    { type: "goblin", count: 8,  spawnInterval: 2.0, gate: "north" },
    { type: "goblin", count: 5,  spawnInterval: 2.5, gate: "south" },
  ]},

  // Wave 3 — Orcs and skeletons join the assault
  { wave: 3, bonusGold: 35, groups: [
    { type: "goblin",   count: 10, spawnInterval: 1.8, gate: "north" },
    { type: "orc",      count: 3,  spawnInterval: 3.0, gate: "north" },
    { type: "skeleton", count: 2,  spawnInterval: 5.0, gate: "north" },
  ]},

  // Wave 4 — Mixed orc and goblin assault, both gates
  { wave: 4, bonusGold: 40, groups: [
    { type: "orc",    count: 4,  spawnInterval: 2.5, gate: "north" },
    { type: "goblin", count: 10, spawnInterval: 1.5, gate: "south" },
    { type: "orc",    count: 3,  spawnInterval: 2.5, gate: "south" },
  ]},

  // Wave 5 — First creepers and goblin miners (walls at risk!)
  { wave: 5, bonusGold: 55, groups: [
    { type: "goblin",       count: 12, spawnInterval: 1.6, gate: "north" },
    { type: "goblin_miner", count: 2,  spawnInterval: 8.0, gate: "north" },
    { type: "creeper",      count: 1,  spawnInterval: 0.0, gate: "north" },
    { type: "orc",          count: 5,  spawnInterval: 2.5, gate: "south" },
  ]},

  // Wave 6 — The first troll
  { wave: 6, bonusGold: 65, groups: [
    { type: "goblin",       count: 15, spawnInterval: 1.4, gate: "north" },
    { type: "troll",        count: 1,  spawnInterval: 0.0, gate: "north" },
    { type: "goblin_miner", count: 3,  spawnInterval: 6.0, gate: "south" },
    { type: "orc",          count: 6,  spawnInterval: 2.2, gate: "south" },
  ]},

  // Wave 7 — Heavy orc push, two trolls, creepers
  { wave: 7, bonusGold: 80, groups: [
    { type: "orc",          count: 10, spawnInterval: 1.8, gate: "north" },
    { type: "troll",        count: 2,  spawnInterval: 5.0, gate: "north" },
    { type: "creeper",      count: 2,  spawnInterval: 6.0, gate: "north" },
    { type: "goblin",       count: 20, spawnInterval: 1.0, gate: "south" },
    { type: "goblin_miner", count: 4,  spawnInterval: 5.0, gate: "south" },
  ]},

  // Wave 8 — Three trolls and miners breach the walls
  { wave: 8, bonusGold: 100, groups: [
    { type: "troll",        count: 3,  spawnInterval: 4.0, gate: "north" },
    { type: "goblin_miner", count: 5,  spawnInterval: 4.0, gate: "north" },
    { type: "orc",          count: 12, spawnInterval: 1.6, gate: "south" },
    { type: "goblin",       count: 18, spawnInterval: 0.9, gate: "south" },
  ]},

  // Wave 9 — Full siege, both gates overwhelmed
  { wave: 9, bonusGold: 130, groups: [
    { type: "orc",          count: 15, spawnInterval: 1.4, gate: "north" },
    { type: "goblin_miner", count: 6,  spawnInterval: 3.5, gate: "north" },
    { type: "troll",        count: 3,  spawnInterval: 5.0, gate: "north" },
    { type: "creeper",      count: 3,  spawnInterval: 4.0, gate: "north" },
    { type: "goblin",       count: 25, spawnInterval: 0.8, gate: "south" },
    { type: "goblin_miner", count: 4,  spawnInterval: 4.0, gate: "south" },
    { type: "orc",          count: 8,  spawnInterval: 2.0, gate: "south" },
  ]},

  // Wave 10 — The final battle of Helm's Deep: The Balrog arrives
  { wave: 10, bonusGold: 400, groups: [
    { type: "balrog",       count: 1,  spawnInterval: 0.0, gate: "north" },
    { type: "troll",        count: 3,  spawnInterval: 5.0, gate: "north" },
    { type: "goblin_miner", count: 6,  spawnInterval: 2.5, gate: "north" },
    { type: "orc",          count: 15, spawnInterval: 1.0, gate: "north" },
    { type: "goblin",       count: 25, spawnInterval: 0.6, gate: "south" },
    { type: "goblin_miner", count: 5,  spawnInterval: 3.0, gate: "south" },
    { type: "troll",        count: 2,  spawnInterval: 4.0, gate: "south" },
    { type: "orc",          count: 12, spawnInterval: 1.2, gate: "south" },
  ]},
];
