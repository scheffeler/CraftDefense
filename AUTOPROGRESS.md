# CraftDefense Auto-Progress Log

## 2026-05-20 — TNT Traps + Pressure Plates (+ TS6 fix)

### What was done
- Added **TNT block** and **Pressure Plate block** — the core Minecraft trap-defense system.
  - TNT: red block (hardness 0, instant-break), drops itself on mining
  - Pressure Plate: stone-colored thin block, drops itself on mining
- Added **Gunpowder** as a new material item (dropped by Creepers at 60% chance).
- Added crafting recipes:
  - TNT: 3×3 alternating sand/gunpowder (classic Minecraft recipe)
  - Pressure Plate: 2 planks side-by-side
- **Explosion system** (`triggerExplosion` in Game.ts):
  - Damages all enemies in radius (proportional falloff)
  - Damages player if too close
  - Breaks random blocks in blast radius
  - Detects and **chain-reacts** with adjacent TNT (0.25s staggered delays)
  - Recomputes flow field after block changes
- **Pressure plate trigger** in Enemy.ts: enemies walking over a pressure_plate
  fire `onPressurePlateTriggered` → removes plate → detonates adjacent TNT
- Recipe book updated with TNT and Pressure Plate entries.
- Fixed TypeScript 6.0 compatibility: `moduleResolution: "bundler"` (was `"Node"`, deprecated in TS6).

### Ideas for next run
- **Flint & Steel** item: right-click to prime TNT with a 3-second fuse (manual detonation)
- **Redstone wire / lever** mechanic: player-controlled TNT trigger
- **Dispenser block**: auto-fires arrows at enemies (real tower-defense flavor)
- **More explosive variety**: Large TNT (radius 8), Timed TNT
- **Villager NPCs** with trading: villages have buildings but no NPCs yet
- **Potion system**: brewing stand, glass bottles, potions of healing/speed/strength
- **Better mob AI variety**: ranged goblin archers, shield-carrying orcs
- **Dungeon loot improvements**: rarer chest contents, keys to locked rooms
