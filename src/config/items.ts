import type { BlockId } from "../types";
import type { ToolCategory } from "./blocks";

export type ItemCategory = "block" | "tool" | "weapon" | "armor" | "food" | "material" | "potion";
export type ToolTier     = "wood" | "stone" | "iron" | "diamond";
export type ArmorSlot    = "head" | "chest" | "legs" | "feet";

export type WeaponType = "melee" | "ranged" | "gun";

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
  // Gun-specific
  weaponType?:  WeaponType;
  ammoType?:    string;        // itemId of required ammo
  gunRange?:    number;        // hitscan range in world units
  gunCooldown?: number;        // seconds between shots
  // Food
  foodPoints?:   number;
  // Armor
  armorValue?:   number;
  armorSlot?:    ArmorSlot;
  // Placeable block
  placesBlock?:  BlockId;
  // Potion
  potionEffect?:    string;   // "heal" | "speed" | "strength" | "slowness"
  potionDuration?:  number;   // seconds (0 = instant)
  potionMagnitude?: number;   // effect strength
  potionSplash?:    boolean;  // true = throwable splash potion
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
  stick:        { id:"stick",        name:"Stick",        category:"material", stackSize:64, color:0x8b6914 },
  iron_ore:     { id:"iron_ore",     name:"Iron Ore",     category:"material", stackSize:64, color:0x886655 },
  coal_ore:     { id:"coal_ore",     name:"Coal",         category:"material", stackSize:64, color:0x333333 },
  iron_ingot:   { id:"iron_ingot",   name:"Iron Ingot",   category:"material", stackSize:64, color:0xbbbbbb },
  flint:        { id:"flint",        name:"Flint",        category:"material", stackSize:64, color:0x555555 },
  arrow_item:   { id:"arrow_item",   name:"Arrow",        category:"material", stackSize:64, color:0x888888 },
  gravel:       { id:"gravel",       name:"Gravel",       category:"block",    stackSize:64, color:0x888880, placesBlock:"gravel" },
  gold_ore:     { id:"gold_ore",     name:"Gold Ore",     category:"material", stackSize:64, color:0xddaa00 },
  diamond_ore:  { id:"diamond_ore",  name:"Diamond",      category:"material", stackSize:64, color:0x00cccc },
  gold_ingot:   { id:"gold_ingot",   name:"Gold Ingot",   category:"material", stackSize:64, color:0xffdd44 },
  diamond:      { id:"diamond",      name:"Diamond",      category:"material", stackSize:64, color:0x55ffff },

  // --- Food ---
  apple:           { id:"apple",           name:"Apple",           category:"food", stackSize:64, color:0xdd2222, foodPoints:4 },
  bread:           { id:"bread",           name:"Bread",           category:"food", stackSize:64, color:0xc8a060, foodPoints:5 },
  raw_beef:        { id:"raw_beef",        name:"Raw Beef",        category:"food", stackSize:64, color:0xcc5533, foodPoints:3 },
  cooked_beef:     { id:"cooked_beef",     name:"Cooked Beef",     category:"food", stackSize:64, color:0x8b3010, foodPoints:8 },
  raw_porkchop:    { id:"raw_porkchop",    name:"Raw Porkchop",    category:"food", stackSize:64, color:0xff9999, foodPoints:3 },
  cooked_porkchop: { id:"cooked_porkchop", name:"Cooked Porkchop", category:"food", stackSize:64, color:0xcc6644, foodPoints:8 },
  raw_chicken:     { id:"raw_chicken",     name:"Raw Chicken",     category:"food", stackSize:64, color:0xf0d0a0, foodPoints:2 },
  cooked_chicken:  { id:"cooked_chicken",  name:"Cooked Chicken",  category:"food", stackSize:64, color:0xdd8844, foodPoints:6 },
  wool:            { id:"wool",            name:"Wool",            category:"material", stackSize:64, color:0xeeeeee },

  // --- Bed ---
  bed: { id:"bed", name:"Bed", category:"block", stackSize:64, color:0xcc3333, placesBlock:"bed" },

  // --- Books & enchanting ---
  paper:            { id:"paper",            name:"Paper",            category:"material", stackSize:64, color:0xf0eedd },
  book:             { id:"book",             name:"Book",             category:"material", stackSize:64, color:0xc8a060 },
  bookshelf:        { id:"bookshelf",        name:"Bookshelf",        category:"block",    stackSize:64, color:0xc8a060, placesBlock:"bookshelf"        },
  enchanting_table: { id:"enchanting_table", name:"Enchanting Table", category:"block",    stackSize:64, color:0xaa0022, placesBlock:"enchanting_table" },

  // --- Farming ---
  wheat_seeds: { id:"wheat_seeds", name:"Wheat Seeds", category:"material", stackSize:64, color:0x8b8b3a },
  wheat:       { id:"wheat",       name:"Wheat",       category:"material", stackSize:64, color:0xe8c830 },
  wood_hoe:    { id:"wood_hoe",    name:"Wood Hoe",    category:"tool",     stackSize:1,  color:0xc8a060, durability:59  },
  iron_hoe:    { id:"iron_hoe",    name:"Iron Hoe",    category:"tool",     stackSize:1,  color:0xbbbbbb, durability:250 },

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

  // --- Diamond tools & weapons ---
  diamond_sword:   { id:"diamond_sword",   name:"Diamond Sword",   category:"weapon", stackSize:1, color:0x55ffff, damage:10, durability:1561 },
  diamond_pickaxe: { id:"diamond_pickaxe", name:"Diamond Pickaxe", category:"tool",   stackSize:1, color:0x55ffff, toolCategory:"pickaxe", tier:"diamond", speedMult:8.0, durability:1561 },
  diamond_axe:     { id:"diamond_axe",     name:"Diamond Axe",     category:"tool",   stackSize:1, color:0x55ffff, toolCategory:"axe",     tier:"diamond", speedMult:8.0, durability:1561 },

  // --- Diamond armor ---
  diamond_helmet:     { id:"diamond_helmet",     name:"Diamond Helmet",     category:"armor", stackSize:1, color:0x55ffff, armorValue:3,  armorSlot:"head"  },
  diamond_chestplate: { id:"diamond_chestplate", name:"Diamond Chestplate", category:"armor", stackSize:1, color:0x55ffff, armorValue:8,  armorSlot:"chest" },
  diamond_leggings:   { id:"diamond_leggings",   name:"Diamond Leggings",   category:"armor", stackSize:1, color:0x55ffff, armorValue:6,  armorSlot:"legs"  },
  diamond_boots:      { id:"diamond_boots",      name:"Diamond Boots",      category:"armor", stackSize:1, color:0x55ffff, armorValue:3,  armorSlot:"feet"  },

  // --- Bow ---
  bow: { id:"bow", name:"Bow", category:"weapon", stackSize:1, color:0x8b6914, damage:8, durability:384 },

  // --- Crossbow ---
  crossbow: { id:"crossbow", name:"Crossbow", category:"weapon", stackSize:1, color:0x5c3a1a, damage:12, durability:465 },

  // --- Gunpowder, TNT & Flint and Steel ---
  gunpowder:   { id:"gunpowder",   name:"Gunpowder",      category:"material", stackSize:64, color:0x444444 },
  tnt:         { id:"tnt",         name:"TNT",             category:"block",    stackSize:64, color:0xcc2222, placesBlock:"tnt" },
  flint_steel: { id:"flint_steel", name:"Flint and Steel", category:"tool",     stackSize:1,  color:0x999999, durability:64 },

  // --- Pistol + ammo ---
  bullet: { id:"bullet", name:"Bullet", category:"material", stackSize:64, color:0xcccccc },
  pistol: {
    id:"pistol", name:"Pistol", category:"weapon", stackSize:1,
    color:0x445566, damage:15, durability:400,
    weaponType:"gun" as const, ammoType:"bullet", gunCooldown:0.45, gunRange:60,
  },

  // --- Iron armor ---
  iron_helmet:     { id:"iron_helmet",     name:"Iron Helmet",     category:"armor", stackSize:1, color:0xbbbbbb, armorValue:2, armorSlot:"head"  },
  iron_chestplate: { id:"iron_chestplate", name:"Iron Chestplate", category:"armor", stackSize:1, color:0xbbbbbb, armorValue:5, armorSlot:"chest" },
  iron_leggings:   { id:"iron_leggings",   name:"Iron Leggings",   category:"armor", stackSize:1, color:0xbbbbbb, armorValue:4, armorSlot:"legs"  },
  iron_boots:      { id:"iron_boots",      name:"Iron Boots",      category:"armor", stackSize:1, color:0xbbbbbb, armorValue:2, armorSlot:"feet"  },

  // --- Guns & ammo ---
  sniper_ammo:  { id:"sniper_ammo",  name:"Sniper Ammo",  category:"material", stackSize:64, color:0xcccc88 },
  sniper_rifle: {
    id:"sniper_rifle", name:"Sniper Rifle", category:"weapon", stackSize:1, color:0x445566,
    damage:28, durability:60,
    weaponType:"gun", ammoType:"sniper_ammo", gunRange:60, gunCooldown:2.2,
  },

  // --- Shotgun (6 pellets, short range, pump-action) ---
  shotgun_shell: { id:"shotgun_shell", name:"Shotgun Shell", category:"material", stackSize:64, color:0xcc6622 },
  shotgun: {
    id:"shotgun", name:"Shotgun", category:"weapon", stackSize:1,
    color:0x8b4513, damage:24, durability:150,
    weaponType:"gun", ammoType:"shotgun_shell", gunRange:15, gunCooldown:1.2,
  },

  // --- Raygun (chain-lightning hitscan — hits up to 3 enemies per shot) ---
  energy_cell: { id:"energy_cell", name:"Energy Cell", category:"material", stackSize:32, color:0x00ddff },
  raygun: {
    id:"raygun", name:"Raygun", category:"weapon", stackSize:1,
    color:0x00ccff, damage:20, durability:999,
    weaponType:"gun", ammoType:"energy_cell", gunRange:50, gunCooldown:2.0,
  },

  // --- Potions & ingredients ---
  glass_bottle:    { id:"glass_bottle",    name:"Glass Bottle",         category:"material", stackSize:64, color:0x88ccee },
  healing_potion:  { id:"healing_potion",  name:"Potion of Healing",    category:"potion",   stackSize:16, color:0xff6688,
    potionEffect:"heal",     potionDuration:0,  potionMagnitude:8  },
  speed_potion:    { id:"speed_potion",    name:"Potion of Speed",      category:"potion",   stackSize:16, color:0xffdd44,
    potionEffect:"speed",    potionDuration:30, potionMagnitude:1.5 },
  strength_potion: { id:"strength_potion", name:"Potion of Strength",   category:"potion",   stackSize:16, color:0xcc2222,
    potionEffect:"strength", potionDuration:30, potionMagnitude:4  },
  splash_slowness: { id:"splash_slowness", name:"Splash of Slowness",   category:"potion",   stackSize:16, color:0x44aaff,
    potionEffect:"slowness", potionDuration:8,  potionMagnitude:0.4, potionSplash:true },
  regen_potion:    { id:"regen_potion",    name:"Potion of Regeneration",category:"potion",  stackSize:16, color:0xff88cc,
    potionEffect:"regen",    potionDuration:20, potionMagnitude:1  },
};
