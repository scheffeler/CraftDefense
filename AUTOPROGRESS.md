# CraftDefense Auto-Progress Log

## 2026-05-18 — TNT, Gunpowder & Flint and Steel
**Implemented:** Full TNT system — a core Minecraft defensive mechanic ideal for wave defense.

- **New items:** `gunpowder` (drops from Creepers at 80% chance), `flint_steel` (iron ingot + flint, 64 uses), `tnt` (placeable block)
- **New recipes:** Flint & Steel (iron ingot + flint diagonal), TNT (5 gunpowder + 4 sand in checkerboard 3×3 pattern)  
- **New block:** `tnt` — red with white top, hardness 0, drops itself when mined
- **Ignition mechanic:** Right-click TNT block while holding Flint & Steel → primes it; tool loses 1 durability
- **Countdown:** 4-second countdown with pulsing red point light (pulses faster as timer shortens)
- **Explosion:** 4.5-block radius, destroys 65% of blocks, damages nearby enemies (up to 12 dmg) and player (up to 8 dmg), triggers screen shake + particles + "BOOM!" achievement
- **Chain reactions:** Nearby primed TNT has its timer set to 0.5s when caught in blast radius
- **Recipe book:** TNT and Flint & Steel entries added
- **Bug fix:** TNT tick placed before the pointer-lock early-return so it works even when inventory is open

**Ideas for next run:**
- Potions & brewing stand — a natural complement to the combat system
- Enderman mob — iconic Minecraft mob, teleports and picks up blocks
- Nether portal — a harder dimension with special resources
- Fishing rod & fishing mechanic — relaxing gameplay
- Iron Golem as a friendly defender mob (placeable by player?)
- Better night-time events — raids, phantom attacks
- TNT cannon — using pistons or water mechanics to launch TNT at enemies
