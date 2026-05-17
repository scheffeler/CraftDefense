# CraftDefense Auto-Progress Log

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
