# CraftDefense Auto-Iteration Progress

## 2026-05-18 — Craftable Potions with Status Effects

**What was done:**
- Added 4 craftable potion types: Healing (+8 HP instant), Speed (1.5× movement for 30s), Strength (+3 melee damage for 30s), Regeneration (+1 HP per 2s for 45s)
- Added crafting ingredients: `glass_bottle` (3 glass in V-shape → 3 bottles), `sugar` (1 wheat → 2 sugar)
- All potions craftable at 2×2 personal grid or 3×3 workbench
- Status effects tracked in `Player.activeEffects` Map; speed multiplier applied to movement; strength added to melee damage
- Particle aura: colored floating sparkles orbit player while effects are active
- HUD: top-left displays active effect badges with colored borders and countdown timers
- Potions added to dungeon loot chests; orcs drop glass bottles (20% chance)
- Recipe book updated with potion guide

**Tech notes:**
- `Player.applyEffect(name, duration)` stacks duration if effect already active
- `Player.updateEffects(dt)` called in `Player.update()` — no Game.ts loop coupling needed
- Particles use `noGravity: true` flag to float upward without gravity
- UI `updateStatusEffects()` called on drink and periodically in game loop

**Ideas for next run:**
- **Splash potions** — throwable, damages/debuffs enemies (e.g. slowness potion on trolls)
- **Brew from enemies** — spider drops spider eye (brew into poison splash), creeper drops gunpowder (splash potion base)
- **Nether portal** — requires obsidian + flint_and_steel, opens a portal to a nether dimension room with loot and unique mobs (Zombie Pigmen)
- **Tipped arrows** — combine arrow + potion in crafting to make arrows that apply effects on hit
- **Villager trading** — villages exist on the map but NPCs don't trade; add trade UI for exchanging items
- **End-game wave scaling** — after wave 10, generate infinite procedural waves with escalating difficulty
- **Better lighting** — dynamic shadows from torch lights using shadow maps, improve dungeon/cave atmosphere
