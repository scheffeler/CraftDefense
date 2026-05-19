import type { BlockId } from "../types";

export type ToolCategory = "hand" | "pickaxe" | "axe" | "shovel";

export interface BlockBehavior {
  toolCategory: ToolCategory;
  requiresTool: boolean;   // false = hand yields drops; true = wrong/no tool yields nothing
  drops: BlockId[];        // blocks that drop on break (replaced by item IDs in Phase 5)
}

export const BLOCK_BEHAVIORS: Partial<Record<BlockId, BlockBehavior>> = {
  grass:          { toolCategory: "shovel",  requiresTool: false, drops: ["dirt"]         },
  dirt:           { toolCategory: "shovel",  requiresTool: false, drops: ["dirt"]         },
  stone:          { toolCategory: "pickaxe", requiresTool: true,  drops: ["cobblestone"]  },
  cobblestone:    { toolCategory: "pickaxe", requiresTool: true,  drops: ["cobblestone"]  },
  wood:           { toolCategory: "axe",     requiresTool: false, drops: ["wood"]         },
  planks:         { toolCategory: "axe",     requiresTool: false, drops: ["planks"]       },
  leaves:         { toolCategory: "hand",    requiresTool: false, drops: []               },
  sand:           { toolCategory: "shovel",  requiresTool: false, drops: ["sand"]         },
  iron_ore:       { toolCategory: "pickaxe", requiresTool: true,  drops: ["iron_ore"]     },
  coal_ore:       { toolCategory: "pickaxe", requiresTool: true,  drops: ["coal_ore"]     },
  iron_block:     { toolCategory: "pickaxe", requiresTool: true,  drops: ["iron_block"]   },
  crafting_table: { toolCategory: "axe",     requiresTool: false, drops: ["crafting_table"] },
  furnace:        { toolCategory: "pickaxe", requiresTool: false, drops: ["furnace"]      },
  obsidian:       { toolCategory: "pickaxe", requiresTool: true,  drops: []               },
  torch:          { toolCategory: "hand",    requiresTool: false, drops: ["torch"]        },
  chest:          { toolCategory: "axe",     requiresTool: false, drops: ["chest"]        },
  bedrock:        { toolCategory: "pickaxe", requiresTool: true,  drops: []               },
  gravel:         { toolCategory: "shovel",  requiresTool: false, drops: ["gravel"]       },
  gold_ore:       { toolCategory: "pickaxe", requiresTool: true,  drops: ["gold_ore"]     },
  diamond_ore:    { toolCategory: "pickaxe", requiresTool: true,  drops: ["diamond_ore"]  },
  farmland:       { toolCategory: "shovel",  requiresTool: false, drops: []               },
  wheat_0:        { toolCategory: "hand",    requiresTool: false, drops: []               },
  wheat_1:        { toolCategory: "hand",    requiresTool: false, drops: []               },
  wheat_2:        { toolCategory: "hand",    requiresTool: false, drops: []               },
  wheat_3:        { toolCategory: "hand",    requiresTool: false, drops: []               },
  tnt:            { toolCategory: "hand",    requiresTool: false, drops: ["tnt"]          },
  lava:           { toolCategory: "hand",    requiresTool: false, drops: []               },
  fire:           { toolCategory: "hand",    requiresTool: false, drops: []               },
};
