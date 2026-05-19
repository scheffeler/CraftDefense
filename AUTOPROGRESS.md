# CraftDefense Auto-Iteration Progress

## 2026-05-19 — TNT block, gunpowder, flint-and-steel

**What was done:**
- Added TNT block with procedural red/white side texture (TNT label band) and checkerboard top
- Added gunpowder material item (dropped by creepers 80%, 2 count)
- Added flint_and_steel tool (durability 64, craft from iron_ingot + flint)
- TNT recipe: 5 gunpowder + 4 sand in checkerboard 3×3 pattern
- Right-click TNT with flint_and_steel = 4-second flashing fuse with accelerating flash rate
- Explosion damages enemies with radial falloff, destroys blocks, chains nearby TNT
- Refactored creeper explosion to use shared triggerExplosion() method
- Expanded block texture atlas from 16 → 18 tiles; fixed UV denominator accordingly
- Dungeon loot includes starter TNT kit (gunpowder, flint_and_steel, 2 TNT)

**Ideas for next time:**
- **Potion brewing**: Brewing stand + blaze powder + nether wart + glass bottles; potions for speed, strength, healing. Would need new blocks and item types.
- **Redstone/dispensers**: Auto-firing arrow dispensers triggered by player-placed pressure plates would be a great defense mechanic.
- **Boss waves**: A named "Siege Commander" boss on wave 5 or 10 with special abilities (summons reinforcements, breaks walls faster).
- **Nether portal**: obsidian frame lit with flint_and_steel teleports player to Nether biome with different resources (blaze rods, nether wart for potions).
- **Bow enchantments**: "Flame" (sets enemies on fire, DoT damage), "Infinity" (no arrow consumption).
- **Sound for TNT**: A distinct sizzling/fuse sound different from creeper hiss would improve feedback.
- **Block variety**: Brick blocks (smelted stone bricks), mossy cobblestone — for more fortress aesthetics.
