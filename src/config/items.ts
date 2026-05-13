import type { BlockId } from "../types";
import type { ToolCategory } from "./blocks";

export type ItemCategory = "block" | "tool" | "weapon" | "armor" | "food" | "material";
export type ToolTier     = "wood" | "stone" | "iron" | "diamond";
export type ArmorSlot    = "head" | "chest" | "legs" | "feet";

export interface ItemDef {
  id:         string;
  name:       string;
  category:   ItemCategory;
  stackSize:  number;          // 64 for blocks/materials, 1 for tools/weapons/armor
  color:      number;          // hex, used for hotbar icon
  // Tool / weapon
  toolCategory?: ToolCategory;
  tier?:         ToolTier;
  damage?:       number;
  speedMult?:    number;       // mining speed multiplier
  durability?:   number;
  // Food
  foodPoints?:   number;
  // Armor
  armorValue?:   number;
  armorSlot?:    ArmorSlot;
  // Placeable block
  placesBlock?:  BlockId;
}

export const ITEMS: Record<string, ItemDef> = {
  // --- Blocks (placeable) ---
  dirt:           { id:"dirt",           name:"Dirt",           category:"block",    stackSize:64, color:0x8b5c2a, placesBlock:"dirt"           },
  grass:          { id:"grass",          name:"Grass",          category:"block",    stackSize:64, color:0x5d9e3a, placesBlock:"grass"          },
  stone:          { id:"stone",          name:"Stone",          category:"block",    stackSize:64, color:0x888888, placesBlock:"stone"          },
  cobblestone:    { id:"cobblestone",    name:"Cobblestone",    category:"block",    stackSize:64, color:0x888070, placesBlock:"cobblestone"    },
  wood:           { id:"wood",           name:"Wood",           category:"block",    stackSize:64, color:0x6b4c2a, placesBlock:"wood"           },
  planks:         { id:"planks",         name:"Planks",         category:"block",    stackSize:64, color:0xc8a060, placesBlock:"planks"         },
  sand:           { id:"sand",           name:"Sand",           category:"block",    stackSize:64, color:0xd4c484, placesBlock:"sand"           },
  glass:          { id:"glass",          name:"Glass",          category:"block",    stackSize:64, color:0x88ccee, placesBlock:"glass"          },
  iron_block:     { id:"iron_block",     name:"Iron Block",     category:"block",    stackSize:64, color:0xaaaaaa, placesBlock:"iron_block"     },
  crafting_table: { id:"crafting_table", name:"Crafting Table", category:"block",    stackSize:64, color:0x8b5c2a, placesBlock:"crafting_table" },
  furnace:        { id:"furnace",        name:"Furnace",        category:"block",    stackSize:64, color:0x777777, placesBlock:"furnace"        },
  torch:          { id:"torch",          name:"Torch",          category:"block",    stackSize:64, color:0xffaa22, placesBlock:"torch"          },
  chest:          { id:"chest",          name:"Chest",          category:"block",    stackSize:64, color:0xa05020, placesBlock:"chest"          },

  // --- Raw materials ---
  stick:      { id:"stick",      name:"Stick",      category:"material", stackSize:64, color:0x8b6914 },
  iron_ore:   { id:"iron_ore",   name:"Iron Ore",   category:"material", stackSize:64, color:0x886655 },
  coal_ore:   { id:"coal_ore",   name:"Coal",       category:"material", stackSize:64, color:0x333333 },
  iron_ingot: { id:"iron_ingot", name:"Iron Ingot", category:"material", stackSize:64, color:0xbbbbbb },
  flint:      { id:"flint",      name:"Flint",      category:"material", stackSize:64, color:0x555555 },
  arrow_item: { id:"arrow_item", name:"Arrow",      category:"material", stackSize:64, color:0x888888 },

  // --- Food ---
  apple: { id:"apple", name:"Apple", category:"food", stackSize:64, color:0xdd2222, foodPoints:4 },
  bread: { id:"bread", name:"Bread", category:"food", stackSize:64, color:0xc8a060, foodPoints:5 },

  // --- Wooden tools & weapons ---
  wood_sword:   { id:"wood_sword",   name:"Wood Sword",   category:"weapon", stackSize:1, color:0xc8a060, damage:4, durability:59  },
  wood_pickaxe: { id:"wood_pickaxe", name:"Wood Pickaxe", category:"tool",   stackSize:1, color:0xc8a060, toolCategory:"pickaxe", tier:"wood",  speedMult:2.0, durability:59  },
  wood_axe:     { id:"wood_axe",     name:"Wood Axe",     category:"tool",   stackSize:1, color:0xc8a060, toolCategory:"axe",     tier:"wood",  speedMult:2.0, durability:59  },
  wood_shovel:  { id:"wood_shovel",  name:"Wood Shovel",  category:"tool",   stackSize:1, color:0xc8a060, toolCategory:"shovel",  tier:"wood",  speedMult:2.0, durability:59  },

  // --- Stone tools & weapons ---
  stone_sword:   { id:"stone_sword",   name:"Stone Sword",   category:"weapon", stackSize:1, color:0x888070, damage:5, durability:131 },
  stone_pickaxe: { id:"stone_pickaxe", name:"Stone Pickaxe", category:"tool",   stackSize:1, color:0x888070, toolCategory:"pickaxe", tier:"stone", speedMult:4.0, durability:131 },
  stone_axe:     { id:"stone_axe",     name:"Stone Axe",     category:"tool",   stackSize:1, color:0x888070, toolCategory:"axe",     tier:"stone", speedMult:4.0, durability:131 },

  // --- Iron tools & weapons ---
  iron_sword:   { id:"iron_sword",   name:"Iron Sword",   category:"weapon", stackSize:1, color:0xbbbbbb, damage:6, durability:250 },
  iron_pickaxe: { id:"iron_pickaxe", name:"Iron Pickaxe", category:"tool",   stackSize:1, color:0xbbbbbb, toolCategory:"pickaxe", tier:"iron",  speedMult:6.0, durability:250 },
  iron_axe:     { id:"iron_axe",     name:"Iron Axe",     category:"tool",   stackSize:1, color:0xbbbbbb, toolCategory:"axe",     tier:"iron",  speedMult:6.0, durability:250 },

  // --- Bow ---
  bow: { id:"bow", name:"Bow", category:"weapon", stackSize:1, color:0x8b6914, damage:8, durability:384 },

  // --- Iron armor ---
  iron_helmet:     { id:"iron_helmet",     name:"Iron Helmet",     category:"armor", stackSize:1, color:0xbbbbbb, armorValue:2, armorSlot:"head"  },
  iron_chestplate: { id:"iron_chestplate", name:"Iron Chestplate", category:"armor", stackSize:1, color:0xbbbbbb, armorValue:5, armorSlot:"chest" },
  iron_leggings:   { id:"iron_leggings",   name:"Iron Leggings",   category:"armor", stackSize:1, color:0xbbbbbb, armorValue:4, armorSlot:"legs"  },
  iron_boots:      { id:"iron_boots",      name:"Iron Boots",      category:"armor", stackSize:1, color:0xbbbbbb, armorValue:2, armorSlot:"feet"  },
};
