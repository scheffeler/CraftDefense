export type VillagerProfession = "farmer" | "blacksmith" | "librarian" | "butcher";

export interface VillagerTrade {
  input:  { itemId: string; count: number };
  output: { itemId: string; count: number };
}

export const PROFESSION_COLORS: Record<VillagerProfession, { robe: number; hat: number; skin: number }> = {
  farmer:      { robe: 0x7a5430, hat: 0xc8a860, skin: 0xffd4a0 },
  blacksmith:  { robe: 0x333333, hat: 0x555555, skin: 0xffd4a0 },
  librarian:   { robe: 0x7a3a8a, hat: 0x9955aa, skin: 0xffd4a0 },
  butcher:     { robe: 0xdddddd, hat: 0xcccccc, skin: 0xffd4a0 },
};

export const VILLAGE_TRADES: Record<VillagerProfession, VillagerTrade[]> = {
  farmer: [
    { input: { itemId: "wheat",      count: 6 }, output: { itemId: "bread",       count: 3 } },
    { input: { itemId: "apple",      count: 4 }, output: { itemId: "gold_ingot",  count: 1 } },
    { input: { itemId: "gold_ingot", count: 1 }, output: { itemId: "wheat_seeds", count: 8 } },
    { input: { itemId: "gold_ingot", count: 2 }, output: { itemId: "cooked_beef", count: 4 } },
  ],
  blacksmith: [
    { input: { itemId: "iron_ingot", count: 5  }, output: { itemId: "iron_sword",      count: 1 } },
    { input: { itemId: "iron_ingot", count: 8  }, output: { itemId: "iron_pickaxe",    count: 1 } },
    { input: { itemId: "iron_ingot", count: 12 }, output: { itemId: "iron_chestplate", count: 1 } },
    { input: { itemId: "gold_ingot", count: 3  }, output: { itemId: "iron_helmet",     count: 1 } },
    { input: { itemId: "diamond",    count: 3  }, output: { itemId: "diamond_sword",   count: 1 } },
  ],
  librarian: [
    { input: { itemId: "paper",      count: 4 }, output: { itemId: "book",       count: 1 } },
    { input: { itemId: "book",       count: 2 }, output: { itemId: "gold_ingot", count: 1 } },
    { input: { itemId: "gold_ingot", count: 2 }, output: { itemId: "bookshelf",  count: 2 } },
    { input: { itemId: "iron_ingot", count: 4 }, output: { itemId: "bow",        count: 1 } },
  ],
  butcher: [
    { input: { itemId: "raw_beef",     count: 4 }, output: { itemId: "cooked_beef",     count: 4 } },
    { input: { itemId: "raw_porkchop", count: 4 }, output: { itemId: "cooked_porkchop", count: 4 } },
    { input: { itemId: "wool",         count: 4 }, output: { itemId: "gold_ingot",      count: 1 } },
    { input: { itemId: "gold_ingot",   count: 1 }, output: { itemId: "apple",           count: 5 } },
  ],
};
