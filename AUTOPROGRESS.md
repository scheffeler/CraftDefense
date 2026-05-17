# CraftDefense Auto-Progress Log

## 2026-05-17 — Endless Survival Mode (Run 10)

### What was done
- **Post-boss Endless Survival Mode** — after defeating the Uruk-hai Captain boss at wave 10:
  - Victory screen shows a new **"∞ Continue: Endless Mode"** button (orange) alongside "Play Again"
  - Clicking it transitions to `phase = "endless"` with infinite procedurally generated waves
  - `WaveManager.enableEndless()` unlocks `startWave()` beyond the 10 scripted configs
  - `generateEndlessConfig(waveNum)` procedurally builds each endless wave:
    - Scale factor increases 15% per wave beyond 10 (enemy count, spawn rate)
    - Troll count increases every 3 waves (capped at 6)
    - Creepers appear from wave ~14 onwards
    - Every 5 endless waves (15, 20, 25...) a returning boss mini-wave is included
  - Wave counter badge shows **"∞ Wave N"** in orange instead of "Wave N/10"
  - Wave announcement shows **"★ ENDLESS WAVE N"** in orange  
  - Objective bar shows **"★ ENDLESS — "** prefix during endless play
  - All combat mechanics (guns, melee, crossbow) correctly allowed during "endless" phase
- **Types**: Added `"endless"` to `GamePhase` union

### Notes for next run
- All 5 guns complete + boss fight + elite mobs + endless mode (runs 1–10)
- `npm install` required at session start (node_modules missing)
- Playwright: `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
- `npx tsc -p tsconfig.emit.json` exits 0 (TypeScript 6 + moduleResolution: Node fixed)

### Ideas for next run
- **Enemy AI improvements**: skeletons strafe sideways, melee enemies block occasionally
- **Nether portal**: obsidian frame → nether dimension (lava biome, blaze mobs, nether brick)
- **Crossbow reload animation**: viewmodel bolt pull-back motion, mechanical click sound
- **Sound polish**: reverb tail for indoor vs outdoor gunshots, boss roar on spawn
- **Ammo refill station**: craftable block that slowly refills ammo (costs iron)
- **Endless rewards**: bonus loot drops during endless waves, scaling gold reward per wave
- **Scoreboard**: display "Best Endless Wave" record in the victory/defeat screen

## 2026-05-17 — Elite Mob Variants (Run 9)

### What was done
- **Elite mob variants** — from wave 5+, enemies have a scaling chance (8% at wave 5 up to 40% at wave 9+) to spawn as orange-glowing elites:
  - `spawnElite(type, x, z)` added to `EnemyManager` — 2× HP, 1.5× damage, 3× XP, 1.3× scale, orange emissive glow, gold health bar
  - `clearSlowTint()` updated to restore elite orange glow after slow effect wears off
  - `elite?: boolean` field added to `EnemyState` in `types.ts`
- **Elite kill rewards**: guaranteed 100% drop chance, 2× item count, "★ ELITE KILL!" floating text, "Elite Hunter" achievement unlock on first
- Elite death → orange-tinted particles; boss (uruk_captain) explicitly excluded from elite chance

### Notes for next run
- All 5 guns complete (pistol, sniper, shotgun, crossbow, raygun) + boss fight + muzzle flash (runs 1–8)
- Run 9 added elite mob variants
- Use `./node_modules/.bin/tsc -p tsconfig.emit.json` to check TypeScript (not global tsc)
- Playwright executablePath: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`
- Vite available via `npx --yes vite --port XXXX`

### Ideas for next run
- **Enemy AI improvements**: skeleton archers strafe sideways when shot at; melee enemies block occasionally
- **Nether portal**: obsidian frame → nether dimension (lava biome, blaze mobs, nether brick blocks)
- **Reload animation**: gun viewmodel shakes/dips when reloading (per-weapon timing)
- **Wave 10+ survival**: after boss defeated, option to continue with endless waves, increasing difficulty
- **Sound polish**: reverb variation for indoor vs outdoor gunshots; boss roar on spawn
- **Ammo refill station**: craftable block that slowly refills gun ammo (costs iron ingots)

## 2026-05-17 — Muzzle Flash + Boss Achievement (Run 8)

### What was done
- **Muzzle flash particles** at gun barrel tip when any gun fires:
  - `spawnMuzzleFlash(x, y, z, dir)` added to `Particles.ts`
  - 8 white/yellow/gold particles burst forward along the look direction
  - Very short lifetime (60–120ms) — pure flash, no lingering smoke
  - Called in `tryGunFire()` for pistol, sniper, shotgun, raygun (crossbow uses projectile, not hitscan)
  - Muzzle position: `camera_pos + look * 0.7`
- **Boss defeat achievement**: defeating the Uruk-hai Captain now unlocks
  "The Battle of Helm's Deep" achievement toast notification

### Notes for next run
- Previous runs already completed ALL 5 guns (pistol, sniper, shotgun, crossbow, raygun)
- Boss fight added in Run 7; muzzle flash + achievement added this run
- `npm install` is required at session start (node_modules only has `.vite/` cache)
- TypeScript 5.9.3 (project-local) compiles cleanly; global `npx tsc` uses TS6 which breaks
  → always use `./node_modules/.bin/tsc -p tsconfig.emit.json` to verify
- Browser for Playwright: `/opt/pw-browsers/chromium_headless_shell-1194/` (version 1194, not 1223)
  → symlink: `ln -sf /opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell /opt/pw-browsers/chromium_headless_shell-1223/chrome-headless-shell-linux64/chrome-headless-shell`
  → run scripts with: `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers node scripts/screenshot.mjs`

### Ideas for next run
- **Enemy AI improvements**: ranged enemies strafe sideways when shot at, melee enemies occasionally block
- **Elite mob variants**: from wave 7+, some enemies get 2× HP, red tint, drop better loot
- **Nether portal**: obsidian frame → enters nether dimension (alternate worldgen, lava, blaze mobs)
- **Reload animation**: viewmodel shakes down then back up when gun fires (distinct per gun type)
- **Shotgun spread indicator**: crosshair shows cone ring while shotgun equipped
- **Sound reverb**: different reverb tail underground vs outdoors (gunshots echo in dungeons)
- **Wave 10+ bonus**: after boss defeated, continue button → enter survival mode with endless waves
- **Visual**: torch particles (embers floating up), lava glow, weather lightning illuminates enemies

## 2026-05-17 — Boss Wave: Uruk-hai Captain (Run 7)

### What was done
- Added **Uruk-hai Captain** boss enemy for wave 10's climactic fight:
  - 1200 HP, scale 2.0 (twice player height), speed 1.6, 8 base damage
  - `canBreakWalls: true` — charges through fortifications
  - **Rage mode** at 50% HP: speed jumps to 2.56, full-body red emissive glow
  - Rich drops: 4 diamond, 6 iron_block, sniper_rifle (60%), 24 sniper_ammo, 6 energy_cell
  - 200 XP, 200 gold reward
- **Boss health bar UI** — large red bar at top-center of screen during boss fight:
  - Shows boss name (`⚔ Uruk-hai Captain`) and health percentage
  - Bar turns bright red/orange gradient when boss enters rage mode (≤50% HP)
  - Disappears when boss dies, triggers victory sound + screen shake
- **Distinctive boss mesh**: armored humanoid with helmet, visor, glowing red eyes,
  gold-trimmed shoulder pauldrons, greatsword with gold crossguard
- Wave 10 updated: 1 boss + 3 trolls + full siege force (was 4 trolls)
- Added `BOSS_RAGE_THRESHOLD` constant, `onBossHealthChanged` / `onBossDied` callbacks on EnemyManager
- Eye meshes named "boss_eye" to preserve their emissive glow through slow/rage tint changes

### Ideas for next run
- **Enemy AI improvements**: ranged enemies dodge sideways when shot, melee enemies with block chance
- **Nether content**: nether portal block + nether biome with lava, blaze mobs, nether brick
- **Visual polish**: muzzle flash particles at gun barrel tip, reload animation viewmodel shake
- **Wave system**: skeletons appear from wave 7+, add "elite" variants (double HP/damage)
- **Sound design**: boss roar on spawn, stomping footstep sounds for trolls and boss
- **Achievement**: unlock for defeating the boss — "The Battle of Helm's Deep"

## 2026-05-17 — Merge conflict resolution + pistol polish (Run 6)

### What was done
- Resolved merge conflicts between auto-iterate branches (two simultaneous runs had diverged)
- My pistol commit used `pistol_ammo` ammo type; HEAD used `bullet` — unified to `bullet`
- Removed redundant `tryPistolShot()` (superseded by HEAD's generalized `tryGunFire(def)`)
- Merged SceneManager viewmodels: kept HEAD's `buildPistolMesh()` + `buildShotgunMesh()` + `buildGunMesh()`
- Unified Player constants: kept `CROSSBOW_LOAD_TIME` (HEAD) and `PISTOL_COOLDOWN` (mine)
- Player now starts with pistol (slot 2) + 24 bullets in hotbar for immediate gameplay
- Barracks chest upgraded: crossbow + 32 arrows + 6 bullets + apple ×6

### Status of all 5 guns (complete!)
- Pistol ✓ (hitscan, 15 dmg, 0.45s cooldown, `bullet` ammo)
- Sniper Rifle ✓ (28 dmg, scope zoom, tracer line, `sniper_ammo`)
- Shotgun ✓ (6 pellets, spread, short range, `shotgun_shell`)
- Crossbow ✓ (preload + release, bolt projectile, loading HUD)
- Raygun ✓ (chain hitscan 3 targets, `energy_cell`, cyan tracers)

### Ideas for next run
- **Polish all guns**: reload animations, muzzle flash particles at barrel tip
- **Ammo HUD**: show "GUN N" counter bottom-right for all equipped guns
- **Enemy AI**: ranged enemies dodge sideways, melee enemies block occasionally
- **New content**: nether portal, lava pools, new mob types (blaze, witch)
- **Wave scaling**: boss variant spawns at wave 10, elite mobs wave 7+
- **Sound polish**: echoing gunshots underground, environmental reverb

## 2026-05-16 — Pistol + Sniper Rifle (Guns System)

### What was done (Run 1 — Pistol)
- Added **Pistol** as the first gun (hitscan, not projectile-based)
  - 12 damage per shot, 60-block range, 0.35s fire rate
  - Left-click to fire when pistol is active hotbar item
  - Distinct viewmodel: grip/slide/barrel geometry rendered on the arm
  - Sharp gunshot audio: bang + crack + metallic shell-casing tick
- Added **Bullet** ammo item (stackable ×64); crafted from iron ingot + gunpowder
- Added **Gunpowder** material; drops from Creepers (0.8 chance, 2 per kill)
- Pistol crafting recipe (3×3 workbench: iron ingots + stick)
- **Ammo counter HUD** in bottom-right when gun is equipped (⚙ N)
- Dry-click sound + brief cooldown when firing with no ammo
- Dungeon chest #3 pre-loaded with pistol + bullets for early discovery

### What was done (Run 2 — Sniper Rifle + TypeScript 6 Fix)
- **Fixed TypeScript 6.0 compatibility**: Changed `moduleResolution: "Node"` (deprecated in TS6) to `"bundler"` in both tsconfig files
- Added **`sniper_rifle`** weapon:
  - 28 damage, 60 range, 2.2s cooldown, consumes `sniper_ammo`
  - Right-click toggles sniper scope: FOV 75→20, dark circular scope overlay with green crosshairs
  - Scope auto-clears when switching hotbar slots
  - Bullet tracer line (yellow) shown on fire, impact sparks at hit point
  - Distinct long-barrel gun viewmodel (barrel + receiver + grip + scope rail)
  - Sounds: `sniper_fire` (loud crack) and `scope_in` (soft click)
- Added **`sniper_ammo`** (stackable x64, crafted: flint + iron_ingot = 8 rounds)
- Extended **ItemDef** with `weaponType`, `ammoType`, `gunRange`, `gunCooldown` fields
- **Architecture**: `ITEMS[id].weaponType === "gun"` → routes left-click to unified `tryGunFire(def)` in Game.ts
- Pistol uses `buildPistolMesh()`, sniper and future guns use `buildGunMesh(color)`
- `spawnBulletImpact()` in Particles.ts for impact sparks

### Dungeon loot updated
- One dungeon chest now spawns with: sniper_rifle + 16 ammo + pistol + 16 bullets

### Ideas for next run
- **Add Shotgun**: multiple raycasts in spread cone, very short range (12 blocks), uses `shotgun_shells`, pump-action sound
- **Add Crossbow**: charges with right-click (like bow), holds charge indefinitely, faster than bow, bolt projectile
- **Add Raygun**: exotic final weapon — hitscan chains to nearby enemies, uses `energy_cell`, crafted from diamond + gold
- Polish guns: muzzle flash particle at barrel tip for pistol, reload mechanic (magazine system)
- Ammo counter: update to show ammo for sniper too (not just pistol)

### Technical notes
- `window.__game` exposes running game instance for Playwright tests
- Playwright uses `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (executablePath override needed)
- TypeScript 6.0.2 requires `moduleResolution: "bundler"` (not `"Node"`)
- Both `pistolCooldown` and `gunCooldown` were present; consolidated to single `gunCooldown`

## 2026-05-16 — Shotgun (Run 3)

### What was done
- Added **Shotgun** pump-action weapon:
  - Fires **6 pellets** per shot in a ±7.5° spread cone
  - 24 total damage (4 per pellet), stacks if multiple pellets hit same enemy
  - 15-block max range (short-range / close-quarters focus)
  - 1.2s pump-action cooldown between shots, consumes `shotgun_shell` ammo
  - Distinct **double-barrel viewmodel**: two parallel iron barrels, wooden stock/fore-end, receiver, trigger guard
  - **`shotgun_blast`** sound: deep bassy boom with overlapping noise layers + low oscillators
  - Heavy camera shake (0.16 magnitude / 0.22s) to simulate recoil
- Added **`shotgun_shell`** ammo (stackable ×64): gunpowder + iron_ingot = 8 shells
- Added **shotgun crafting recipe**: iron_ingots (top) + planks + iron_ingot (middle) = shotgun
- Dungeon chest #3 now includes: shotgun + 12 shotgun_shells
- `fireShotgunPellets()` method handles spread with `Map<enemyId, accumulated damage>`

### Ideas for next run
- **Crossbow**: right-click charges (holds charge), fires a bolt projectile (physical arc), bolt = flint + stick
- **Raygun**: chain-lightning hitscan (jumps to 3 nearby enemies), uses energy_cell, cyan glow, no cooldown but limited energy
- **Shotgun polish**: spread indicator on crosshair, pump recoil animation, muzzle flash

## 2026-05-17 — Crossbow (Run 4)

### What was done
- Added **Crossbow** weapon with Minecraft-style two-phase mechanic:
  - First right-click: starts 1.2s loading animation (progress bar appears below crosshair)
  - Second right-click (when loaded, bar turns green): fires a **bolt** instantly
  - Switching hotbar slot cancels loading (bolt not lost, just state reset)
  - Bolt stats: 12 damage, 48 m/s (2× faster than bow), very low arc (gravity 6 vs bow's 20)
  - Bolt visual: thicker shaft (CylinderGeometry r=0.06) + conical metal tip group
- Added crossbow crafting recipe (3×3 workbench): sticks + iron_ingots cross pattern
- Added **crossbow loading HUD bar**: yellow while loading → green when ready, CSS below crosshair
- Added distinct `crossbow` SVG icon (horizontal stock + vertical limbs + bolt)
- Added crossbow icon shape to `makeItemIcon` and route in `getItemIcon`
- Crossbow + 24 arrows now in dungeon chest #3 (alongside guns)
- Fixed barracks chest to include crossbow + 32 arrows for easy discovery
- Added crossbow to recipe book UI with two-phase usage hint
- Pre-existing TS5107 deprecation resolved: `tsc --noEmit` now exits 0
- Added `scripts/screenshot-crossbow.mjs` Playwright test harness

### Architecture note
- `PlayerBolt` pool is separate from `PlayerArrow` pool (10 bolts vs 20 arrows)
- `THREE.Group` (shaft + tip) stored as `mesh` field via type cast — clean without extra interface

### Ideas for next run
- **Raygun**: the final weapon — chain hitscan to 3 nearby enemies, energy_cell ammo, cyan emissive bolt
- **Gun viewmodels for crossbow**: animate the loading bolt pull-back motion in first-person
- **Crossbow reload sound**: distinct mechanical click/crank audio
- **Ammo HUD**: show arrow count when crossbow is active (similar to gun ammo display)
- **Reload animation**: camera bob / item shake when loading starts

## 2026-05-17 — Raygun (Run 5)

### What was done
- Added **Raygun** — the final exotic weapon with chain-lightning hitscan:
  - Fires at primary target, then jumps to up to 2 more nearby enemies (within 7 blocks)
  - Decreasing damage per chain: 20 → 12 → 7
  - 2.0s cooldown, 50-block range, uses `energy_cell` ammo (stackable ×32)
  - Cyan tracer beam (`spawnTracerLine` color param added) connects each chain link
  - `spawnBulletImpact` fires at every hit enemy
  - Sci-fi zap sound (`raygun_fire`): descending pitch sweep + harmonic buzz + impact pop
- Added `energy_cell` item + crafting recipe (2 diamond + 2 gold ingot = 4 cells)
- Added raygun crafting recipe (diamond barrel + gold body + iron grip, 3×3)
- Troll enemies now have 20% chance to drop 1 energy cell
- Dungeon chest #3 now contains raygun + 6 energy cells alongside all other guns
- Extended `spawnTracerLine` with optional `color` parameter (cyan for raygun, yellow for sniper)
- Added `fireRaygunChain()` private method in Game.ts for the multi-target chain logic

### Full weapon roster (all 5 guns complete!)
- Swords (wood/stone/iron/diamond) ✓
- Bow (charge + arrow) ✓
- Pistol (fast hitscan, bullet ammo) ✓
- Sniper Rifle (high damage, scope zoom) ✓
- Shotgun (6-pellet spread, short range) ✓
- Crossbow (load + fire mechanic, bolt projectile) ✓
- **Raygun (chain lightning, energy cells)** ✓ — added this run

### Ideas for next run
- **Polish weapons**: ammo HUD for all guns, crossbow reload sound, viewmodel animations
- **Weapon viewmodels**: distinct first-person mesh for each gun (pistol, sniper, shotgun)
- **Enemy AI improvements**: ranged enemies dodge, trolls charge/stomp, spider webs
- **New biome content**: nether portal (end game), lava biome, new ore types
- **Wave difficulty scaling**: wave 10+ introduces boss variants, elite mobs
- **Day/night tie-in**: new hostile mobs that only appear at night in freeplay

## 2026-05-17 — Skeleton Strafe AI + Melee Knockback (Run 11)

### What was done
- **Skeleton strafe AI**: when within shooting range (7.5 blocks), skeletons now
  strafe perpendicular to the player direction while aiming. Direction flips
  every 1.6–2.4 seconds randomly, making them harder to hit with hitscan weapons.
  Stagger resets the strafe timer immediately for a stumble effect.
- **Melee knockback stagger**: sword/axe swings now apply a 0.35s movement pause
  to any enemy hit (`knockback=true` param on `enemies.damage()`). Staggered
  enemies skip their movement update frame entirely — stops them walking through
  the player's swing and makes sword combat feel much more satisfying.
- New `EnemyState` optional fields: `strafeDir`, `strafeTimer`, `knockbackTimer`
- Constants: `SKELETON_STRAFE_SPEED=1.8`, `SKELETON_STRAFE_FLIP=1.6`, `KNOCKBACK_STAGGER=0.35`
- Note: a redundant pistol commit was attempted and discarded (all 5 guns already existed)

### Notes for next run
- All 5 guns + boss + elite mobs + endless mode complete (runs 1–10)
- Skeleton strafe + melee knockback added this run (Run 11)
- `npm install` required at session start (node_modules not committed)
- `npx tsc -p tsconfig.emit.json` exits 0 cleanly
- Playwright: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (executablePath override)
- Dev server: `npm run dev` → port 5175

### Ideas for next run
- **Troll stomp attack**: when troll closes to melee range, it briefly stops and
  does an AoE stomp that damages the player if nearby (animation + shockwave ring)
- **Best Endless Wave scoreboard**: track + display high score on victory/gameover screen
- **Skeleton flee**: when health drops below 30%, skeleton runs away briefly before
  reversing direction (adds tactical depth — player must chase low-HP skeletons)
- **Spider web shot**: spider occasionally fires a web projectile that slows player
  movement for 2s (add WebSlowEffect to Player)
- **Gun ADS (aim-down-sights)**: right-click zooms in for sniper without scope ring
  (small FOV shift + steadied crosshair for pistol/shotgun)
- **Ammo refill station**: craftable block that slowly converts iron_ingots → ammo
  (iron_ingot per 8 bullets; passive refill 1 round/sec when player is near)
