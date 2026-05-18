# CraftDefense Auto-Progress Log

## 2026-05-18 — Uruk-hai Captain War Cry Ability

**What was done:**
- Added war cry ability to the existing Uruk-hai Captain boss (wave 10)
- War cry fires every 14 seconds (first at ~8s after spawn)
- All enemies within 16 blocks get a 70% speed boost for 6 seconds
- Buffed enemies flash orange-gold; boss flashes bright gold during the cry
- "WAR CRY!" center-screen announcement with pulsing orange animation + screen shake
- `setBossWarCryGlow`/`clearBossWarCryGlow` helpers preserve rage-mode visuals after cry
- New `warCryTimer` and `warCryFlash` fields added to `EnemyState`
- `onBossWarCry` callback wired from EnemyManager → Game → UI

**Ideas for next time:**
- Fire blocks: lava sets adjacent wood/planks/leaves on fire; fire damages player/enemies
- Lava spread: lava source blocks flow 2–3 blocks into adjacent air (like Minecraft)
- Water+lava → obsidian generation (touch-interaction physics)
- Golden tools: fast but low durability (32 uses), smelted gold_ingot as material
- Second boss variant: a "Dark Shaman" who summons skeletons every 20s (for endless mode)
- Boss arena effect: when uruk_captain spawns in wave 10, darken sky + distant horn sound
- War cry visual: particle burst ring around the boss at cry moment

## 2026-05-18 — Lava Moat Defense System

**What was done:**
- Added `lava` BlockId + BlockDef (transparent orange, hardness 0)
- `iron_bucket` item crafted from 3 iron ingots in V-shape at workbench
- `lava_bucket` obtained by right-clicking lava with iron bucket; placing it gives back empty bucket
- Player takes 2 HP/s when standing in lava + orange fog overlay (in-lava SceneManager effect)
- Enemies take 2 damage/s when in/on lava blocks (continuous tick in updateCombat)
- Orange point light (radius 12) auto-added when lava block is placed/broken
- `spawnLavaEmbers()` particle method: orange/red sparks that rise periodically from nearby lava
- `setInLavaEffect()`/`setWeatherIntensity()` updated in SceneManager for lava fog
- Starter inventory includes 1 iron bucket so new players discover the mechanic
- tsconfig moduleResolution changed from `Node` to `Bundler` (fix TS 6.0 deprecation error)

**Ideas for next time:**
- Lava spread mechanic: lava flows downward/sideways into adjacent air (like Minecraft)
- Fire blocks: lava or flint&steel ignites flammable blocks (wood/planks/leaves)
- Water-lava interaction: water touching lava creates obsidian (cobblestone at edge)
- "Lava Trap" achievement: kill 3+ enemies with one lava pool placement
- Golden tools: faster than iron but low durability (drops from gold ore smelting)
- Cauldron block: fill with buckets of water/lava
- Nether portal: build obsidian frame, light with flint&steel → transport to nether dimension

## 2026-05-18 — Potions System (healing, speed, strength, splash slowness, regen)

**What was done:**
- `glass_bottle` crafted from 3 glass (V-shape); recipes for all potions at crafting table
- `healing_potion`: instant +8 HP, pink particle orb burst
- `speed_potion`: 30s × 1.5 movement speed multiplier
- `strength_potion`: 30s +4 melee damage bonus
- `regen_potion`: 20s accelerated health regen
- `splash_slowness`: thrown in arc (right-click), splashes on ground, slows all enemies in radius 4 for 8s (reuses existing enemy slowTimer)
- Player `activeEffects` Map — ticked each frame, applied to movement + damage
- Active effects HUD panel bottom-right: colored pills with icon/name/countdown
- `spawnHealEffect` (pink) and `spawnSplashEffect` (blue) particle methods
- "Alchemist" achievement on first potion drink
- Recipe book updated with all 6 potion entries
- Merge-resolved concurrent changes: guns, crossbow, boss bar CSS, troll shockwave

**Ideas for next time:**
- Lava blocks / lava bucket (craft from bucket + lava source)
- Fire spread mechanic — lava sets adjacent flammable blocks on fire
- More potion types: fire resistance, night vision, invisibility
- Brewing stand block UI (more authentic Minecraft brewing workflow)
- Potion color overlay on hotbar bottle icon

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
