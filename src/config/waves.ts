import type { WaveConfig, WaveGroup } from "../types";

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

  // Wave 3 — Orcs, skeletons, and spiders join the assault
  { wave: 3, bonusGold: 35, groups: [
    { type: "goblin",   count: 10, spawnInterval: 1.8, gate: "north" },
    { type: "orc",      count: 3,  spawnInterval: 3.0, gate: "north" },
    { type: "skeleton", count: 2,  spawnInterval: 5.0, gate: "north" },
    { type: "spider",   count: 3,  spawnInterval: 3.5, gate: "south" },
  ]},

  // Wave 4 — Mixed assault, spiders flanking through south gate
  { wave: 4, bonusGold: 40, groups: [
    { type: "orc",    count: 4,  spawnInterval: 2.5, gate: "north" },
    { type: "goblin", count: 10, spawnInterval: 1.5, gate: "south" },
    { type: "orc",    count: 3,  spawnInterval: 2.5, gate: "south" },
    { type: "spider", count: 4,  spawnInterval: 3.0, gate: "north" },
  ]},

  // Wave 5 — Creepers, miners, and spiders (walls at risk!)
  { wave: 5, bonusGold: 55, groups: [
    { type: "goblin",       count: 12, spawnInterval: 1.6, gate: "north" },
    { type: "goblin_miner", count: 2,  spawnInterval: 8.0, gate: "north" },
    { type: "creeper",      count: 1,  spawnInterval: 0.0, gate: "north" },
    { type: "orc",          count: 5,  spawnInterval: 2.5, gate: "south" },
    { type: "spider",       count: 5,  spawnInterval: 2.8, gate: "south" },
  ]},

  // Wave 6 — The first troll + spider swarm
  { wave: 6, bonusGold: 65, groups: [
    { type: "goblin",       count: 15, spawnInterval: 1.4, gate: "north" },
    { type: "troll",        count: 1,  spawnInterval: 0.0, gate: "north" },
    { type: "goblin_miner", count: 3,  spawnInterval: 6.0, gate: "south" },
    { type: "orc",          count: 6,  spawnInterval: 2.2, gate: "south" },
    { type: "spider",       count: 6,  spawnInterval: 2.5, gate: "south" },
  ]},

  // Wave 7 — Heavy orc push, two trolls, creepers, first golem
  { wave: 7, bonusGold: 80, groups: [
    { type: "orc",          count: 10, spawnInterval: 1.8, gate: "north" },
    { type: "troll",        count: 2,  spawnInterval: 5.0, gate: "north" },
    { type: "creeper",      count: 2,  spawnInterval: 6.0, gate: "north" },
    { type: "golem",        count: 1,  spawnInterval: 0.0, gate: "north" },
    { type: "goblin",       count: 20, spawnInterval: 1.0, gate: "south" },
    { type: "goblin_miner", count: 4,  spawnInterval: 5.0, gate: "south" },
    { type: "spider",       count: 5,  spawnInterval: 2.8, gate: "south" },
  ]},

  // Wave 8 — Three trolls, miners, and golems breach the walls
  { wave: 8, bonusGold: 100, groups: [
    { type: "troll",        count: 3,  spawnInterval: 4.0, gate: "north" },
    { type: "goblin_miner", count: 5,  spawnInterval: 4.0, gate: "north" },
    { type: "golem",        count: 2,  spawnInterval: 7.0, gate: "north" },
    { type: "orc",          count: 12, spawnInterval: 1.6, gate: "south" },
    { type: "goblin",       count: 18, spawnInterval: 0.9, gate: "south" },
    { type: "spider",       count: 7,  spawnInterval: 2.5, gate: "south" },
  ]},

  // Wave 9 — Full siege, golems and spiders overwhelm both gates
  { wave: 9, bonusGold: 130, groups: [
    { type: "orc",          count: 15, spawnInterval: 1.4, gate: "north" },
    { type: "goblin_miner", count: 6,  spawnInterval: 3.5, gate: "north" },
    { type: "troll",        count: 3,  spawnInterval: 5.0, gate: "north" },
    { type: "creeper",      count: 3,  spawnInterval: 4.0, gate: "north" },
    { type: "golem",        count: 2,  spawnInterval: 8.0, gate: "north" },
    { type: "goblin",       count: 25, spawnInterval: 0.8, gate: "south" },
    { type: "goblin_miner", count: 4,  spawnInterval: 4.0, gate: "south" },
    { type: "orc",          count: 8,  spawnInterval: 2.0, gate: "south" },
    { type: "spider",       count: 8,  spawnInterval: 2.2, gate: "south" },
  ]},

  // Wave 10 — The final battle of Helm's Deep: Troll King leads the siege
  { wave: 10, bonusGold: 500, groups: [
    { type: "troll_king",   count: 1,  spawnInterval: 0.0, gate: "north" },
    { type: "troll",        count: 3,  spawnInterval: 3.0, gate: "north" },
    { type: "goblin_miner", count: 8,  spawnInterval: 2.5, gate: "north" },
    { type: "orc",          count: 20, spawnInterval: 1.0, gate: "north" },
    { type: "golem",        count: 2,  spawnInterval: 6.0, gate: "north" },
    { type: "goblin",       count: 28, spawnInterval: 0.6, gate: "south" },
    { type: "goblin_miner", count: 6,  spawnInterval: 3.0, gate: "south" },
    { type: "troll",        count: 3,  spawnInterval: 4.0, gate: "south" },
    { type: "orc",          count: 12, spawnInterval: 1.2, gate: "south" },
    { type: "spider",       count: 10, spawnInterval: 2.0, gate: "south" },
  ]},
];

/**
 * Procedurally generate an endless wave beyond the 10 scripted waves.
 * n = waveNumber - WAVE_CONFIGS.length (1, 2, 3…)
 * All 9 enemy types are included for maximum variety.
 */
export function generateEndlessWave(waveNumber: number): WaveConfig {
  const n = waveNumber - WAVE_CONFIGS.length; // 1, 2, 3…
  const interval = (base: number): number => Math.max(0.3, base * Math.pow(0.93, n - 1));
  const scale    = (base: number): number => Math.round(base * (1 + n * 0.18));

  const groups: WaveGroup[] = [
    // North gate — orc-heavy siege
    { type: "goblin",       count: scale(12), spawnInterval: interval(1.2), gate: "north" },
    { type: "orc",          count: scale(8),  spawnInterval: interval(1.8), gate: "north" },
    { type: "troll",        count: Math.min(8, 2 + Math.floor(n / 2)), spawnInterval: interval(4.0), gate: "north" },
    { type: "goblin_miner", count: scale(4),  spawnInterval: interval(3.5), gate: "north" },
    // South gate — speed & spider rush
    { type: "goblin",  count: scale(18), spawnInterval: interval(0.9), gate: "south" },
    { type: "spider",  count: scale(6),  spawnInterval: interval(2.5), gate: "south" },
    { type: "orc",     count: scale(8),  spawnInterval: interval(1.6), gate: "south" },
    { type: "troll",   count: Math.min(6, 1 + Math.floor(n / 2)), spawnInterval: interval(4.5), gate: "south" },
  ];

  // Creepers from endless wave 1
  groups.push({ type: "creeper", count: Math.min(6, 1 + Math.floor(n / 2)), spawnInterval: interval(4.0), gate: "north" });

  // Golems and skeletons from endless wave 2
  if (n >= 2) {
    groups.push({ type: "golem",    count: Math.min(4, 1 + Math.floor(n / 3)), spawnInterval: interval(6.0), gate: "north" });
    groups.push({ type: "skeleton", count: scale(4), spawnInterval: interval(3.0), gate: "south" });
  }

  // Uruk-hai Captain boss every 5 endless waves (wave 15, 20, 25…)
  if (n % 5 === 0) {
    groups.push({ type: "uruk_captain", count: 1, spawnInterval: 0, gate: "north" });
  }

  return {
    wave: waveNumber,
    bonusGold: Math.round(150 * (1 + n * 0.3)),
    groups,
  };
}
