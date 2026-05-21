# CraftDefense Auto-Progress Log

## 2026-05-21 — TNT Explosive Trap System

**What was done:**
- Added `tnt` as a new block type (bright red sides, white top — classic Minecraft TNT look)
- Added `gunpowder` material (drops from creepers at 80% chance, 2x)
- Added `flint_and_steel` tool (crafted: iron ingot + flint diagonal)
- Added TNT crafting recipe: 4 gunpowder + 5 sand in checkerboard (3×3)
- TNT primes when enemies walk over it (pressure-plate trigger)
- TNT also ignitable by right-clicking with flint_and_steel (4-second fuse + hiss audio)
- TNT explosion: damages nearby enemies (up to 20 HP falloff by distance), breaks blocks, chain-detonates adjacent primed TNT
- Refactored creeper explosion to share `triggerExplosion()` helper method (DRY)
- Updated recipe book UI with TNT and Flint & Steel entries
- TNT fuse timer ticks outside the pointer-lock guard so it works even in menus

**Files changed:** `src/types.ts`, `src/Map.ts`, `src/config/blocks.ts`, `src/config/items.ts`, `src/config/recipes.ts`, `src/config/enemies.ts`, `src/Game.ts`, `src/UI.ts`

**Ideas for next run:**
- Visual TNT fuse flash (blink block red/white while primed, like creeper) — use a scene overlay or point light pulse
- More boss-tier enemy: a "Berserker" troll that charges at walls and ignores slow effects
- Iron golem as a placeable defensive ally (crafted with iron blocks + carved pumpkin)
- Ranged tower blocks the player can craft and place (arrow dispenser block)
- More sound variety: TNT explosion should be louder/distinct from creeper
- Potion system: brewing stand + potions (health, speed, strength) using gathered ingredients
- Better end-game reward: wave 10 drop a special item or unlock a creative mode
- World persistence: save placed blocks so the fortress survives reloads

## 2026-05-21 — Night Vision + Haste potions

**What was done:**
- Added **Night Vision Potion** (glass bottle + gold ingot + torch → 30s effect): boosts ambient light to ≥0.85 intensity regardless of time of day, enabling clear vision at night or underground. Implemented via new `_nightVisionEffect` flag and `setNightVisionEffect()` on SceneManager; wired from `player.getNightVisionActive()` each update frame.
- Added **Haste Potion** (glass bottle + coal + iron ingot → 30s effect): multiplies mining speed by 1.8×. Applied via new `hasteMultiplier` field on BlockInteraction; updated each frame from `player.getHasteMult()`. Stacks multiplicatively with Efficiency enchantments.
- Both effects show in the active-effects HUD: Night Vision as "◉ Night Vision" in blue, Haste as "⛏ Haste" in orange.
- Recipe book updated with both entries.
- TypeScript: exit 0; all integration tests pass.

**Ideas for next time:**
- Water-lava interaction: water touching lava creates obsidian (multiple entries in notes suggest this)
- Pre-wave boss announcement: "☠ THE TROLL KING APPROACHES ☠" full-screen banner when wave 10 starts
- Fortune III enchantment: ×4 ore drops at cost 4 XP levels (already have Fortune I/II)
- Feather Falling II: fully negate fall damage when all 4 armor pieces have it
- Fall damage thud sound cue  
- Brewing stand block for more authentic potion UI
- Potions: fire resistance (15s), night vision II (60s extended)
- Endless Score leaderboard: best wave reached shown on main menu (already tracked in localStorage)

## 2026-05-20 — Fall damage, Thorns I, Feather Falling I, Fortune II, TNT Trap achievement

**What was done:**
- **Fall damage** system: player takes damage proportional to landing velocity above 10 m/s safe threshold. Formula: `floor((impact - 10) × 1.5)` HP. Tracked via `_wasOnGround` and `velYBefore` in Game.ts update loop.
- **Feather Falling I** enchantment now functional: halves all fall damage when any equipped armor piece has the enchantment. Uses new `inventory.hasEnchantment(id)` helper method in Inventory.ts.
- **Thorns I** enchantment now functional: when an enemy deals melee damage to the player, reflects 2 HP of damage back to the attacker (if any equipped armor has Thorns I). Orange particle burst on attacker shows the reflect.
- **Fortune II** enchantment added to enchant pool (cost 3 XP levels) and implemented: gives ×3 drops from ore blocks (iron, coal, gold, diamond). Fortune I still gives ×2. Floating "×3" indicator shown. Logic consolidated into single `fortuneMult` check.
- **TNT Trap achievement**: `_doExplosion()` now returns the kill count from `damageInRadius()`. When ≥3 enemies die in a single explosion, unlocks "TNT Trap!" achievement. `damageInRadius()` return type changed from `void` → `number` in Enemy.ts.
- New `Inventory.hasEnchantment(enchId)` method checks all 4 equipped armor slots for a given enchantment ID.

**Ideas for next time:**
- Feather Falling II: fully negate fall damage (cost 2 XP)
- Fall damage sound: distinct thud sound on hard landings
- Lava flow/spread mechanic (Minecraft-like lava physics with limited range)
- Brewing stand block for authentic Minecraft potion UI (currently at workbench)
- Endless Score leaderboard: show personal best on main menu (already tracked in localStorage)
- Haste potion: increases mining speed multiplier for 30s
- Night vision potion: increases ambient light level for 30s
- Fortune III enchantment: ×4 drops, very high XP cost

## 2026-05-20 — Wither DoT, Fortune, and Unbreaking enchantment effects

**What was done:**
- **Wither effect** from skeleton arrows: 1 HP every 0.5s for 5 seconds after being hit by a skeleton
  - Dark purple pulsing vignette overlay + "WITHER" center-screen text (5.2s fade)
  - Purple skull "☠" pill in the active-effects HUD with 5s countdown
  - `showWitherIndicator()` added to UI.ts (mirrors the webbed indicator pattern)
  - `_witherTickTimer` added to Game.ts; wither damage ticked in main update loop
- **Fortune I enchantment** now functional: Fortune-enchanted pickaxe gives ×2 drops for ore blocks (iron, coal, gold, diamond ore)
  - Floating "×2" bonus number displayed in green when Fortune triggers
  - Existing enchanting-table investment now rewarding for miners
- **Unbreaking I enchantment** now functional: 50% chance to skip durability loss on any Unbreaking-enchanted tool, weapon, or armor piece
  - Applied in `_damageHeldTool()` — covers all tool/weapon uses including flint & steel
- tsconfig.json was already at `moduleResolution: "bundler"` (fixed by prior run) — no change needed

**Ideas for next time:**
- Fortune II enchantment: 3× ore drops (add to ENCHANT_POOL at higher cost)
- "TNT Trap" achievement: kill 3+ enemies with a single explosion (track in _doExplosion)
- Brewing stand block for authentic Minecraft potion UI
- Lava flow/spread mechanic (Minecraft-like lava physics)
- Endless Score leaderboard: display best wave in win/death screen
- Spider web anchor line: thin mesh rope from spider to wall during climbing
- Haste potion: increases mining speed (could use speedMult on break timer)
- Night vision potion: increases ambient light for 30s

## 2026-05-19 — Spider/golem wave integration + richer endless mode generator

**What was done:**
- Added spiders (flanking units) to waves 3-6 from the south gate, increasing variety from the earliest waves
- Added golems (high-HP tanks) to waves 7-9, and 3 golems + 10 spiders to wave 10 alongside the uruk_captain boss
- Replaced the basic `generateEndlessConfig` in WaveManager with a richer `generateEndlessWave` exported from waves.ts: all 9 enemy types appear, spiders and skeletons from wave 2, golems from wave 2, Uruk-hai Captain boss every 5th endless wave (15, 20, 25…)
- Spawn intervals decay exponentially (0.93^n); enemy counts scale 1.18× per wave
- WaveManager.totalWaves returns Infinity in endless mode so the HUD shows "∞ Wave N" in orange
- Added `isEndlessMode` getter alias on WaveManager; cached current wave config to avoid recomputation

**Ideas for next time:**
- Spider wall-climbing special ability: spiders bypass fortress walls by scaling vertically, forcing different defensive strategy
- Brewing stand block for potion crafting UI (Minecraft-style fire aspect, speed, healing potions)
- Wither effect from skeleton arrows (lingering damage)
- "Endless Score" leaderboard in the victory screen showing best endless wave reached
- Nether portal (4×5 obsidian frame + flint & steel) for a second dimension with harder mobs

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

## 2026-05-20 — Spider wall-climbing special ability

**What was done:**
- Spiders now bypass fortress gates by scaling the walls vertically — a unique mechanic that forces players to defend the wall face, not just the gate chokepoints
- Each spider spawned outside the fortress is assigned a random wall column (x ∈ 19–44, excluding gate x=29–34) at the north or south wall face (z=18/45)
- 4-phase state machine in `EnemyState`: `approach → up → across → down`
  - **approach**: spider walks directly toward the assigned wall column (ignores flow field)
  - **up**: presses against the wall face and climbs vertically at 4.5 blocks/s, tilted forward (rotation.x = −π/2.2)
  - **across**: scurries along the wall top at SPIDER_WALL_TOP_Y = 13.5 until it crosses the inner wall edge (z=20 for north, z=43 for south)
  - **down**: descends back to ENEMY_Y = 7.5, rotation.x = +π/2.2, then resumes normal flow-field navigation inside the fortress
- `animateLegs()` walk-bob guard: Y bob only applies when `|group.position.y − ENEMY_Y| < 0.1`, preventing bob from overriding climb height
- Added `FORTRESS_WALL_*` and `FORTRESS_GATE_*` constants to `src/config/map.ts` for reusable fortress geometry

**Ideas for next time:**
- Spider "web anchor" visual: draw a thin line mesh from spider to wall while climbing (rope effect)
- Spider alert the player with a hissing sound when they start climbing (audio cue)
- `Wither` DoT effect from skeleton arrows (2 HP/s for 4s) — lingering darkness on screen
- "Endless Score" leaderboard in the victory screen showing best endless wave reached
- Brewing stand block for authentic Minecraft potion UI (currently crafted at workbench)
- Fortune enchantment: block drops give +1-2 extra materials
- Unbreaking enchantment: 50%/66% chance to not consume durability

## 2026-05-20 — Arrow Dispenser + TNT blocks (auto-iterate branch)

**What was done:**
- Added `dispenser` block: craftable auto-turret (7 cobblestone + 1 bow = 1 dispenser). When placed it auto-shoots homing arrow projectiles at the nearest enemy within 14 blocks every 2 seconds. Deals 5 damage per shot. Right-click shows status/range info. Tracked in `dispenserBlocks` Map in Game.ts, cleared on game reset.
- Added `tnt` block: craftable explosive (sand/coal checkerboard pattern = 1 TNT). When mined/left-clicked it starts a 3.5-second fuse (with red particle flashes and creeper hiss audio). Explodes for up to 14 damage in a 4.5-block radius, damaging enemies AND the player if nearby, and destroys blocks.
- Refactored explosion code: shared `triggerExplosion(x, y, z, radius, maxDamage, shakeAmt)` helper used by TNT. Creeper explosion kept separate (doesn't damage other enemies).
- Added achievements: "Tower Defense" for first dispenser placement.
- Added items, block defs, behaviors, and recipes for both blocks.

**What compiles:** Clean (only pre-existing TS5107 deprecation warning).

**Ideas for next runs:**
- Give dispensers a visible "barrel" model or glowing arrow icon on the front face (currently just a colored block)
- Add a shop/trade NPC between waves where gold can be spent on items (gold is currently earned but never spent)
- Add a scoreboard/statistics screen at wave end showing dispensers placed, TNT used, blocks broken, etc.
- Add more Helm's Deep themed structures: siege towers, battering rams (enemy siege equipment)
- Consider adding a Ballista upgrade to the dispenser: place iron block on top of dispenser to upgrade it to shoot longer range + more damage
- Passive mobs should drop leather → add leather armor tier
- World save/load doesn't save placed blocks — implementing block serialization would hugely improve the game
- Add a "flint and steel" item to activate TNT from range (more strategic use)

## 2026-05-20 — Troll King Boss Mob

**What was done:**
- Added `troll_king` enemy type — a massive final boss (2500 HP, scale 2.2, dark purple coloring)
- Custom `buildTrollKingMesh()`: broad torso, war-painted face, glowing red eyes, golden crown with 5 spikes, shoulder pads, war club weapon
- Berserker rage: at 50% HP, boss doubles speed and glows red
- Ground slam attack: every 5 seconds when within 7 units of player — deals 8 damage with screen shake + particle burst
- Boss health bar UI: centered at top of screen showing "☠ TROLL KING ☠" with red-to-orange animated bar, hides automatically when boss is dead
- "Kingslayer" achievement for slaying the Troll King
- Wave 10 now spawns the Troll King as the lead attacker alongside golems and spiders (bonus gold 500)
- Merged cleanly with upstream: both `uruk_captain` and `troll_king` boss types coexist

**Ideas for next run:**
- Add a pre-wave announcement banner ("THE TROLL KING APPROACHES") with dramatic fade-in
- Boss war cry ability: roar that temporarily boosts nearby enemy speeds
- Particle shockwave ring on ground slam (ring of sparks expanding outward)
- Better boss entrance: slow travel from off-map edge with accompanying horn sound
- Upgrade NPC merchants inside fortress walls (hire guards, buy siege cannons)
- Potions / brewing stand mechanic
- Add an "Ender-Dragon"-style death sequence for the Troll King (explodes into particles, shakes screen)
- Improve day/night cycle: darker nights, mob torches, glowing enemy eyes at night

## 2026-05-21 — Lava spread mechanic (source blocks flow into adjacent air)

**What was done:**
- Added `_spreadLava()` method: every 7 seconds, each player-placed lava "source" block tries to flow into one adjacent air block (horizontal first, then downward) — enabling lava waterfall/moat construction
- `lavaSourceBlocks` Set tracks player-placed sources (added in `onBlockPlaced`, cleared when iron_bucket picks up lava or on game reset)
- Spread lava inherits all existing behaviors: enemy damage 2 HP/s, fire ignition, ember particles, orange PointLight
- Capped at `MAX_LAVA_BLOCKS = 80` for performance safety
- New lava blocks from spreading also emit a burst of ember particles so the flow is visually obvious
- Verified: placing lava at y=8, triggering spread manually → 2 adjacent blocks become lava within one cycle

**Ideas for next time:**
- Water-lava interaction: water touching lava creates obsidian (or cobblestone at edges)
- Lava bucket tooltip showing "source block" vs "spread block" (or just "places lava")
- Brewing stand block for authentic potion crafting UI (potions currently made at workbench)
- Pre-wave boss announcement: "THE TROLL KING APPROACHES" banner when wave 10 starts
- Fortune III enchantment (×4 drops, 4 XP cost)
- Feather Falling II: fully negate fall damage (requires all 4 armor pieces)
- Fall damage sound: distinct "thud" audio cue on hard landing
- Night vision potion: increases ambient light for 30s
- Haste potion: increases mining speedMult for 30s
