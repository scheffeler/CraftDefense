# CraftDefense Auto-Progress Log

## 2026-05-19 — Fire spread system (flint & steel, lava auto-ignition, Three.js overlay)

**What was done:**
- Added fire spread: right-clicking flammable blocks (wood, planks, leaves) with flint_steel ignites fire above them
- Fire uses Three.js crossed-plane meshes (Minecraft-style) + PointLight — bypasses voxel block system entirely (lava/fire BlockId had a Vite module caching issue that prevented setBlock from working)
- Each fire has random burn duration 18–35s; spreads to adjacent flammable blocks every ~4.5s (30% chance per neighbor)
- When fire burns out it consumes the flammable block beneath (wood → air)
- Fire damages player (1 HP/s if standing within 1 block) and enemies (1 HP/s if adjacent)
- Lava blocks auto-ignite adjacent flammable blocks at a low rate (1.5% chance per tick) to make lava moats hazardous
- Fire lights flicker via PointLight intensity animation; mesh wobbles with y-scale and rotation animation
- Max 40 simultaneous fire blocks to keep performance
- Unlocks "Playing with Fire" achievement on first flint_steel ignition

**Ideas for next time:**
- Potion throwing arc visualization (show landing point for splash potions)
- Lava flow/spread mechanic (lava spreads into adjacent air blocks)
- "TNT Trap" achievement: kill 3+ enemies with one explosion
- Crossbow auto-load indicator in HUD when crossbow is selected
- Brewing stand block (more authentic potion crafting UI)

## 2026-05-19 — TNT arrow-detonation, fuse system, chain explosions

**What was done:**
- Added player-arrow block-hit detection to `ProjectileManager`: new `onPlayerArrowHitBlock` callback and `getBlockAt` parameter in `update()`, checking block at arrow position each frame
- TNT blocks detonate instantly when hit by a player arrow: block removed, `_doExplosion()` called
- Arrow-detonated TNT chains: `_doExplosion()` primes any adjacent TNT in blast radius with 0.5s fuse
- Creeper explosions call `_doExplosion()` (shared), which also chain-primes TNT in range
- Player starts with 10 gunpowder + 8 sand for immediate TNT crafting (5 gunpowder + 4 sand)
- Creeper drop updated: 90% gunpowder ×2 + flint + coal (was just coal/flint)
- Merged cleanly with upstream's `_primeTNT` (blinking mesh + red PointLight), lava, potions, guns, crossbow — kept upstream's superior TNT animation and `_doExplosion` helper

**Ideas for next time:**
- Potion throwing arc visualization (show landing point for splash potions)
- Fire spread: flint_steel on wood/planks/leaves creates a fire block that spreads
- Lava bucket placement gives a lava source that damages enemies walking through it
- "TNT Trap" achievement: kill 3+ enemies with one explosion
- Crossbow auto-load indicator in HUD when crossbow is selected
- Nether portal: build obsidian frame 4×5, light with flint_steel → different biome music

## 2026-05-19 — Golden tools + enchantment effects (Fire Aspect, Looting, Efficiency, Protection)

**What was done:**
- Added `gold` tool tier (speedMult 12.0 — fastest in game, even faster than diamond) with durability 32
- Added gold_sword, gold_pickaxe, gold_axe, gold_shovel (crafted from gold_ingot + sticks)
- Added gold_helmet, gold_chestplate, gold_leggings, gold_boots (armor values 2/5/3/1)
- Recipes: all gold tools and armor added to 3×3 workbench pattern
- **Fire Aspect I** enchantment now actually burns enemies: sets on fire for 4s (2 HP/s DoT) with orange flame particles. Tracked via `burningEnemies` Map in Game.ts, ticked in `updateBurningEnemies()`.
- **Looting I** enchantment now doubles drop count from killed enemies (added to ENCHANT_POOL, applied in onEnemyDied drop loop)
- **Protection I/II** enchantments now add +1/+2 armor to the equipped piece via `getArmorValue()` in Inventory.ts
- **Efficiency I/II** enchantments now multiply mining speedMult by 1.5×/2.0× in `computeBreakHardness()` in BlockInteraction.ts
- All enchantments now functional — enchanting table investment has real payoff

**Ideas for next time:**
- Lava flow/spread mechanic (lava spreads into adjacent air blocks, like Minecraft)
- Fire spread (flint & steel ignites wood/planks/leaves, fire spreads)
- Brewing stand block (more authentic potion crafting UI — currently potions are crafted at workbench)
- Thorns enchantment effect (reflect melee damage back to attacker)
- Feather Falling effect (reduce fall damage)
- Fortune enchantment effect (block drops give more materials)
- Unbreaking enchantment effect (reduce durability loss chance)

## 2026-05-19 — TNT block texture + tsconfig fix + conflict resolution

**What was done:**
- Fixed TypeScript 6 deprecation: changed `moduleResolution: "Node"` → `"bundler"` in tsconfig.json (was causing `exit code 2` on every build)
- Added TNT block texture (tile 16, red with dark cross pattern) to the texture atlas; expanded atlas from 16 → 17 tiles and fixed UV divisor from `/16` → `/17`
- Added `spawnFuseSpark` particle method (rising white/orange sparks, reusable)
- Conflict resolution: upstream had already implemented `_primeTNT` (blinking mesh + red PointLight), `_doExplosion`, `primedTNT` map, crossbow, sniper_rifle, lava, potions, guns — kept upstream's superior TNT animation, removed my simpler duplicate `activeTnt`/`updateTnt`/`triggerExplosion`
- Cleaned up: removed duplicate `gunpowder`/`tnt`/`flint_steel` entries from items.ts
- Final compile: exit 0, pushed cleanly to auto-iterate

**Ideas for next time:**
- Potion brewing stand block (more authentic UI — upstream has potions but no brewing stand)
- Lava flow: lava source blocks should spread to adjacent air blocks (Minecraft-like physics)
- Water-lava interaction: water touching lava → obsidian or cobblestone
- Golden tools: fast but fragile (between wood and stone tier)
- Enchanting improvements: more enchant types (fire aspect, looting, protection)
- Boss arena effect: dramatic sky darkening + horn sound when wave 10 starts
- "TNT Trap" achievement: kill 3+ enemies with one explosion

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
