# CraftDefense Auto-Progress Log

## 2026-05-18 — TNT + Gunpowder

**What was done:**
- Added `tnt` block and `gunpowder` item; creepers now drop gunpowder (2× at 85% chance) instead of coal ore
- TNT crafting recipe: 5 gunpowder + 4 sand in checkerboard pattern (authentic Minecraft)
- Right-click a placed TNT block to light a 4-second fuse (plays creeper hiss for feedback)
- Explosion: radius 4, damages enemies proportionally to distance (5–25 dmg), player takes 8 damage if within range
- Chain detonation: TNT within blast radius ignites with 0.5s shortened fuse — stack TNT for big booms
- Refactored `onCreeperExplode` to call shared `triggerExplosion()` method
- Fixed `dev`/`build` npm scripts: changed `&&` → `;` so tsc deprecation warning (exit code 2) no longer blocks the server
- Added 10 gunpowder to starter inventory for immediate testing

**Game state:**
- Recipes: planks, sticks, all tools (wood/stone/iron/diamond), armor, bow, bed, paper, book, bookshelf, enchanting table, **TNT** (new)
- Blocks: all biome blocks, fortress, farming, dungeons, temples, villages — fairly complete
- Mobs: goblin, orc, troll, goblin_miner, creeper, skeleton + passive (cow, pig, chicken, sheep)
- Systems: day/night, weather, save/load, hunger, farming, enchanting, chest storage, furnace

**Ideas for next run:**
- Flint and Steel item — required to light TNT/campfires (more authentic; currently just right-click)
- Potion system: Brewing Stand block + Speed/Healing/Strength potions from blaze powder loot in dungeon chests
- Fence + Fence Gate blocks — iconic Minecraft defensive structures, lighter than stone walls
- Trap pressure plate — triggers TNT automatically when enemies walk on it (wire up from block interaction)
- Boss enemy — "Orcish Warchief" with 1000 HP, knockback attack, spawns on wave 10 alongside the regular horde
- More ambient sounds per biome (desert wind, taiga wind howl)
- Loot table improvements — dungeon chests should sometimes contain gunpowder/TNT
