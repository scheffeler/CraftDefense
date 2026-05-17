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

  // --- Diamond tools & weapons ---
  {
    id: "diamond_pickaxe",
    pattern: [
      [r("diamond"), r("diamond"), r("diamond")],
      [null,         r("stick"),   null        ],
      [null,         r("stick"),   null        ],
    ],
    result: { itemId: "diamond_pickaxe", count: 1 },
  },
  {
    id: "diamond_sword",
    pattern: [
      [r("diamond")],
      [r("diamond")],
      [r("stick")  ],
    ],
    result: { itemId: "diamond_sword", count: 1 },
  },
  {
    id: "diamond_axe",
    pattern: [
      [r("diamond"), r("diamond")],
      [r("diamond"), r("stick")  ],
      [null,         r("stick")  ],
    ],
    result: { itemId: "diamond_axe", count: 1 },
  },

  // --- Diamond armor ---
  {
    id: "diamond_helmet",
    pattern: [
      [r("diamond"), r("diamond"), r("diamond")],
      [r("diamond"), null,         r("diamond")],
    ],
    result: { itemId: "diamond_helmet", count: 1 },
  },
  {
    id: "diamond_chestplate",
    pattern: [
      [r("diamond"), null,         r("diamond")],
      [r("diamond"), r("diamond"), r("diamond")],
      [r("diamond"), r("diamond"), r("diamond")],
    ],
    result: { itemId: "diamond_chestplate", count: 1 },
  },
  {
    id: "diamond_leggings",
    pattern: [
      [r("diamond"), r("diamond"), r("diamond")],
      [r("diamond"), null,         r("diamond")],
      [r("diamond"), null,         r("diamond")],
    ],
    result: { itemId: "diamond_leggings", count: 1 },
  },
  {
    id: "diamond_boots",
    pattern: [
      [r("diamond"), null,         r("diamond")],
      [r("diamond"), null,         r("diamond")],
    ],
    result: { itemId: "diamond_boots", count: 1 },
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

  // --- Crossbow (iron_ingot + sticks + iron_ingot tripwire) ---
  {
    id: "crossbow",
    pattern: [
      [r("stick"),      r("iron_ingot"), r("stick")     ],
      [r("iron_ingot"), null,            r("iron_ingot")],
      [null,            r("stick"),      null           ],
    ],
    result: { itemId: "crossbow", count: 1 },
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

  // --- Bullets (gunpowder + iron ingot → 8 bullets) ---
  {
    id: "bullets",
    pattern: [
      [r("iron_ingot")],
      [r("gunpowder") ],
    ],
    result: { itemId: "bullet", count: 8 },
  },

  // --- Pistol ---
  {
    id: "pistol",
    pattern: [
      [r("iron_ingot"), r("iron_ingot"), null          ],
      [r("iron_ingot"), r("stick"),      r("iron_ingot")],
      [null,            r("iron_ingot"), null           ],
    ],
    result: { itemId: "pistol", count: 1 },
  },

  // --- Glass from sand (normally needs furnace, simplified here) ---
  {
    id: "glass",
    pattern: [[r("sand")]],
    result: { itemId: "glass", count: 1 },
  },

  // --- Chest ---
  {
    id: "chest",
    pattern: [
      [r("planks"), r("planks"), r("planks")],
      [r("planks"), null,        r("planks")],
      [r("planks"), r("planks"), r("planks")],
    ],
    result: { itemId: "chest", count: 1 },
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

  // --- Hoes ---
  {
    id: "wood_hoe",
    pattern: [
      [r("planks"), r("planks")],
      [null,        r("stick") ],
      [null,        r("stick") ],
    ],
    result: { itemId: "wood_hoe", count: 1 },
  },
  {
    id: "iron_hoe",
    pattern: [
      [r("iron_ingot"), r("iron_ingot")],
      [null,            r("stick")     ],
      [null,            r("stick")     ],
    ],
    result: { itemId: "iron_hoe", count: 1 },
  },


  // --- Bread (3 wheat in a row) ---
  {
    id: "bread",
    pattern: [
      [r("wheat"), r("wheat"), r("wheat")],
    ],
    result: { itemId: "bread", count: 1 },
  },

  // --- Bed (3 planks + 3 wool) ---
  {
    id: "bed",
    pattern: [
      [r("wool"),   r("wool"),   r("wool")  ],
      [r("planks"), r("planks"), r("planks")],
    ],
    result: { itemId: "bed", count: 1 },
  },

  // --- Paper (from wheat, simplified) ---
  {
    id: "paper",
    pattern: [
      [r("wheat"), r("wheat"), r("wheat")],
    ],
    result: { itemId: "paper", count: 3 },
  },

  // --- Book (3 paper + wool) ---
  {
    id: "book",
    pattern: [
      [r("paper")],
      [r("paper")],
      [r("paper")],
    ],
    result: { itemId: "book", count: 1 },
  },

  // --- Bookshelf (6 planks + 3 books) ---
  {
    id: "bookshelf",
    pattern: [
      [r("planks"), r("planks"), r("planks")],
      [r("book"),   r("book"),   r("book")  ],
      [r("planks"), r("planks"), r("planks")],
    ],
    result: { itemId: "bookshelf", count: 1 },
  },

  // --- Enchanting table (obsidian + diamonds + book) ---
  {
    id: "enchanting_table",
    pattern: [
      [null,          r("book"),    null         ],
      [r("diamond"),  r("obsidian"), r("diamond") ],
      [r("obsidian"), r("obsidian"), r("obsidian")],
    ],
    result: { itemId: "enchanting_table", count: 1 },
  },
  // --- Sniper Ammo (flint + iron ingot = 8 rounds) ---
  {
    id: "sniper_ammo",
    pattern: [
      [r("flint"), r("iron_ingot")],
    ],
    result: { itemId: "sniper_ammo", count: 8 },
  },

  // --- Sniper Rifle (iron ingots in barrel + body + grip) ---
  {
    id: "sniper_rifle",
    pattern: [
      [null,            r("iron_ingot"), r("iron_ingot")],
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [null,            r("iron_ingot"), null           ],
    ],
    result: { itemId: "sniper_rifle", count: 1 },
  },

  // --- Shotgun Shell (gunpowder + iron ingot = 8 shells) ---
  {
    id: "shotgun_shell",
    pattern: [
      [r("gunpowder"), r("iron_ingot")],
    ],
    result: { itemId: "shotgun_shell", count: 8 },
  },

  // --- Shotgun (iron barrels + wood stock) ---
  {
    id: "shotgun",
    pattern: [
      [r("iron_ingot"), r("iron_ingot"), r("iron_ingot")],
      [r("planks"),     r("planks"),     r("iron_ingot")],
      [null,            null,            null           ],
    ],
    result: { itemId: "shotgun", count: 1 },
  },

  // --- Energy Cell (diamond + gold ingot = 4 cells) ---
  {
    id: "energy_cell",
    pattern: [
      [r("diamond"),    r("gold_ingot")],
      [r("gold_ingot"), r("diamond")   ],
    ],
    result: { itemId: "energy_cell", count: 4 },
  },

  // --- Raygun (diamond barrel + gold body + iron grip) ---
  {
    id: "raygun",
    pattern: [
      [null,            r("diamond"),    r("diamond")   ],
      [r("gold_ingot"), r("gold_ingot"), r("diamond")   ],
      [null,            r("iron_ingot"), null           ],
    ],
    result: { itemId: "raygun", count: 1 },
  },
];

// Silence unused helper warning
void row;
