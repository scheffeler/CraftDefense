export interface Recipe {
  id:      string;
  pattern: (string | null)[][];  // 2×2 or 3×3 grid, null = empty
  result:  { itemId: string; count: number };
}

// Helper to build compact shaped recipes without trailing nulls
const row = (...cells: (string | null)[]): (string | null)[] => cells;
const r = (id: string | null) => id;

export const RECIPES: Recipe[] = [
  // --- From wood to planks ---
  {
    id: "planks_from_wood",
    pattern: [[r("wood")]],
    result:  { itemId: "planks", count: 4 },
  },

  // --- Sticks ---
  {
    id: "sticks",
    pattern: [
      [r("planks")],
      [r("planks")],
    ],
    result: { itemId: "stick", count: 4 },
  },

  // --- Crafting table ---
  {
    id: "crafting_table",
    pattern: [
      [r("planks"), r("planks")],
      [r("planks"), r("planks")],
    ],
    result: { itemId: "crafting_table", count: 1 },
  },

  // --- Wooden tools & weapons ---
  {
    id: "wood_pickaxe",
    pattern: [
      [r("planks"), r("planks"), r("planks")],
      [null,        r("stick"),  null       ],
      [null,        r("stick"),  null       ],
    ],
    result: { itemId: "wood_pickaxe", count: 1 },
  },
  {
    id: "wood_sword",
    pattern: [
      [r("planks")],
      [r("planks")],
      [r("stick") ],
    ],
    result: { itemId: "wood_sword", count: 1 },
  },
  {
    id: "wood_axe",
    pattern: [
      [r("planks"), r("planks")],
      [r("planks"), r("stick") ],
      [null,        r("stick") ],
    ],
    result: { itemId: "wood_axe", count: 1 },
  },
  {
    id: "wood_shovel",
    pattern: [
      [r("planks")],
      [r("stick") ],
      [r("stick") ],
    ],
    result: { itemId: "wood_shovel", count: 1 },
  },

  // --- Stone tools & weapons ---
  {
    id: "stone_pickaxe",
    pattern: [
      [r("cobblestone"), r("cobblestone"), r("cobblestone")],
      [null,             r("stick"),       null            ],
      [null,             r("stick"),       null            ],
    ],
    result: { itemId: "stone_pickaxe", count: 1 },
  },
  {
    id: "stone_sword",
    pattern: [
      [r("cobblestone")],
      [r("cobblestone")],
      [r("stick")      ],
    ],
    result: { itemId: "stone_sword", count: 1 },
  },
  {
    id: "stone_axe",
    pattern: [
      [r("cobblestone"), r("cobblestone")],
      [r("cobblestone"), r("stick")      ],
      [null,             r("stick")      ],
    ],
    result: { itemId: "stone_axe", count: 1 },
  },

  // --- Iron tools & weapons ---
  {
    id: "iron_pickaxe",
    pattern: [
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [null,            r("stick"),      null           ],
      [null,            r("stick"),      null           ],
    ],
    result: { itemId: "iron_pickaxe", count: 1 },
  },
  {
    id: "iron_sword",
    pattern: [
      [r("iron_ingot")],
      [r("iron_ingot")],
      [r("stick")     ],
    ],
    result: { itemId: "iron_sword", count: 1 },
  },
  {
    id: "iron_axe",
    pattern: [
      [r("iron_ingot"), r("iron_ingot")],
      [r("iron_ingot"), r("stick")     ],
      [null,            r("stick")     ],
    ],
    result: { itemId: "iron_axe", count: 1 },
  },

  // --- Iron block ---
  {
    id: "iron_block",
    pattern: [
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
    ],
    result: { itemId: "iron_block", count: 1 },
  },

  // --- Iron armor ---
  {
    id: "iron_helmet",
    pattern: [
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [r("iron_ingot"), null,            r("iron_ingot")],
    ],
    result: { itemId: "iron_helmet", count: 1 },
  },
  {
    id: "iron_chestplate",
    pattern: [
      [r("iron_ingot"), null,            r("iron_ingot")],
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
    ],
    result: { itemId: "iron_chestplate", count: 1 },
  },
  {
    id: "iron_leggings",
    pattern: [
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [r("iron_ingot"), null,            r("iron_ingot")],
      [r("iron_ingot"), null,            r("iron_ingot")],
    ],
    result: { itemId: "iron_leggings", count: 1 },
  },
  {
    id: "iron_boots",
    pattern: [
      [r("iron_ingot"), null,            r("iron_ingot")],
      [r("iron_ingot"), null,            r("iron_ingot")],
    ],
    result: { itemId: "iron_boots", count: 1 },
  },

  // --- Bow ---
  {
    id: "bow",
    pattern: [
      [null,        r("stick"),  r("arrow_item")],
      [r("stick"),  null,        r("arrow_item")],
      [null,        r("stick"),  r("arrow_item")],
    ],
    result: { itemId: "bow", count: 1 },
  },

  // --- Arrows ---
  {
    id: "arrows",
    pattern: [
      [r("flint") ],
      [r("stick") ],
    ],
    result: { itemId: "arrow_item", count: 4 },
  },

  // --- Glass from sand (normally needs furnace, simplified here) ---
  {
    id: "glass",
    pattern: [[r("sand")]],
    result: { itemId: "glass", count: 1 },
  },

  // --- Torches ---
  {
    id: "torches",
    pattern: [
      [r("coal_ore")],
      [r("stick")   ],
    ],
    result: { itemId: "torch", count: 4 },
  },
];

// Silence unused helper warning
void row;
