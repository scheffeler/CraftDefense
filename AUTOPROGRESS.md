# CraftDefense Auto-Progress Log

## 2026-05-19 — Villager NPCs with Trading System

**What was done:**
- Added `VillagerNPC.ts`: manager class for stationary villager NPCs with distinctive 3D block-style meshes (robe + hat/accessory per profession, idle bob animation)
- Added `src/config/trades.ts`: 4 professions (farmer, blacksmith, librarian, butcher) each with 4 trades using items as currency (no separate currency needed)
- Spawned 6 villagers total: Farmer + Blacksmith + Librarian at NW village (cx=9, z=13), Butcher + Blacksmith + Farmer at SE village (cx=53, z=50)
- Integrated into `Game.ts`: spawns on mode select + continue, detects proximity (3 blocks), shows tooltip hint "Right-click to trade", opens trade overlay
- Added `UI.ts` trade overlay: shows profession name, lists all trades with have/need counts, clickable rows for affordable trades, closes with E or close button
- Both freeplay and Helms Deep modes spawn villagers

**Tested:**
- 6 villagers confirmed spawning after freeplay mode select
- Trade UI opens via `_openVillagerTrade()` call
- TypeScript compiles cleanly (only pre-existing moduleResolution deprecation warning)

**Ideas for next run:**
- Add emerald as proper trade currency (mine-able from stone, villager-exclusive)
- Villager greeting sound / ambient chatter
- Villager guards that fight back against hostile mobs during waves
- Trading restock cooldown (each trade usable N times before cooldown)
- Add "wandering trader" NPC that appears near spawn with unique trades
- Potion/brewing stand system (nether wart, blaze powder)
- Nether portal leading to a dangerous underground biome
- Boss mob for wave 11+ (post-victory siege)
- SE village has desert-adjacent location — add desert traders with sand-based goods
