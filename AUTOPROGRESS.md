# CraftDefense Auto-Progress Log

## 2026-05-18 — TNT, Flint & Steel, chain explosions

**What was done:**
- Added `tnt` block (red/dark, hardness 0, instant-mine) to world and block system
- Added `gunpowder` material item — now drops from creepers (80% chance, ×2)
- Added `flint_steel` tool (iron_ingot + flint recipe, 64 uses)
- TNT crafting recipe: 5 gunpowder + 4 sand in alternating 3×3 pattern
- Right-clicking TNT with Flint & Steel primes it: removes block, spawns blinking red mesh + point light with accelerating flash rate (0.4s → 0.15s period)
- 4-second fuse then _doExplosion(): breaks blocks in radius 4.5, damages player and all nearby enemies (via new EnemyManager.damageInRadius()), screen shake, explosion particles
- Chain explosions: TNT inside blast radius is auto-primed (delayed chain reaction)
- Extracted _doExplosion() shared helper — creeper explosions now call it too
- Merge-resolved with upstream branch (uruk_captain boss, crossbow, sniper rifle, shotgun, spider web attacks, elite variants, endless mode)

**Ideas for next time:**
- Potions system (brewing stand, health/strength/speed potions)
- Lava blocks / lava buckets — great for Helm's Deep moat defense
- "TNT Trap" achievement when killing 3+ enemies with one explosion
- Sound: dedicated TNT fuse burning sound distinct from creeper hiss
- Gold tools (fast but low durability, between wood and stone)
- Fishing rod, cauldron, or other late-game Minecraft items
