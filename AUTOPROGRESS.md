# CraftDefense Auto-Iteration Progress

## 2026-05-16 — Pistol Weapon (first gun)

**What was done:**
- Added **Pistol** as the first modern ranged weapon (hitscan, not projectile-based)
  - 12 damage per shot, 60-block range, 0.35s fire rate, 250 durability
  - Left-click to fire (replaces melee when pistol is active hotbar item)
  - Distinct viewmodel: grip/slide/barrel geometry rendered on the arm
  - Sharp gunshot audio: bang + crack + metallic shell-casing tick
- Added **Bullet** ammo item (stackable ×64); crafted from iron ingot + gunpowder
- Added **Gunpowder** material; drops from Creepers (0.8 chance, 2 per kill)
- Pistol crafting recipe (3×3 workbench: iron ingots + stick)
- **Ammo counter HUD** in bottom-right when gun is equipped (⚙ N)
- Dry-click sound + brief cooldown when firing with no ammo
- Dungeon chest #3 pre-loaded with pistol + bullets for early discovery
- Fixed TypeScript deprecation warning (`moduleResolution=Node`) via `ignoreDeprecations: "5.0"`

**Ideas for next run:**
- Add **Sniper Rifle**: slow fire rate (2s), very high damage (40), extreme range (120 blocks), 3× scope zoom on right-click, bolt-action reload animation
- Add **Shotgun**: fires 6 pellets in spread cone, close-range devastation, pump-reload sound
- Add **Crossbow**: draws like bow but fires faster bolt with no gravity drop, enchantable with multishot
- Add **Raygun**: late-game sci-fi weapon, fast beam, no ammo but overheat mechanic
- Polish pistol: add muzzle flash particle at barrel tip, tracers showing shot path
- Add reload mechanic: magazine system so player must hold R to reload after N shots
- Consider giving the player a pistol in starting inventory or letting them buy one from a chest
