# CraftDefense Auto-Iteration Progress

## 2026-05-29 — Rain ground splash particles

**What was done:**
- Added `spawnRainSplash(x, y, z)` to `ParticleSystem` in `Particles.ts`: spawns 4–6 tiny flat water-droplet particles per call. Each is a wide, thin box (aspect ~1.5×0.4×1.0) in rain-blue colors (`0xb8d8ff`, `0x88bbee`, `0xaaccff`), semi-transparent (opacity 0.75), ejected radially outward at low velocity with a small upward kick. Lifetime is 0.15–0.30 s; gravity curves them back down like real splash beads.
- Added `_rainSplashTimer` field to `Game` class (initially 0).
- In `Game.update()`, immediately after `this.weather.update(...)`, when `weather.intensity > 0.1`: decrements the timer each frame; when it fires (every ~0.08–0.14 s) samples `floor(intensity × 8)` random XZ positions within ±7 units of the player at feet level (`player.position.y − 1.7`) and calls `particles.spawnRainSplash()` for each. Splash density therefore scales naturally from drizzle to heavy downpour.

**Ideas for next time:**
- Screen-shake on heavy hits (orc, troll, troll_king): quick camera position jolt for impact feedback
- Animated lava texture: scrolling UV or noise-based warp on the lava block surface
- Torch/lava block glow: emissive sprite billboard halo ring with additive blending above placed torches
- Dawn/dusk zenith warm tones: change `topSky` at dawn to warm maroon for more dramatic sky transition
- Leaves translucency: make leaves slightly emissive at night or with slight glow around bright light sources

---

## 2026-05-29 — Atmospheric horizon haze band + arrow/bolt particle trails

**What was done:**
- **Horizon haze band**: Added a Gaussian atmospheric scattering glow at the exact horizon (vH=0) in the sky dome shader. Uses `exp(-abs(vH) * 18.0) * hazeOpacity` for a narrow warm band that peaks at dawn/dusk (golden #ffbb44) and fades to pale cream (#fff0cc) at noon, with zero haze at night and when underwater/in-lava.
- **Haze intensity computation** in `updateDayNight()`: combines ambient intensity (0.55× weight) with a dawn/dusk resonance function (`1 - |ambientInt - 0.5| * 4.5`) (0.45× weight) — ensures peak glow during golden hours and fade at night.
- **Arrow particle trails**: Added `spawnArrowTrail()` to `ParticleSystem` — sparse (45% chance per frame) tiny dust/feather flecks that spawn behind fired arrows (warm tan #ddcc88) and crossbow bolts (cool blue-grey #88aacc). Size 0.025–0.05 units, lifetime ~0.18–0.30s.
- **Trail wiring**: Added `onArrowTrail` callback to `ProjectileManager`, called each frame inside the player-arrow and player-bolt update loops. Wired to `particles.spawnArrowTrail()` in `Game.ts`.

**Ideas for next time:**
- Block break particles colored by block type (stone=grey, dirt=brown, grass=green) — currently uses block.color which is close but could be more specific
- Death burst particles by enemy type: goblin=green, orc=brown, skeleton=white bone shards
- Torch/lava block glow: placed torches already have a PointLight but could add a sprite billboard halo ring with additive blending
- Screen-shake on heavy hits (orc, troll, troll_king): quick camera position jolt for impact feedback
- Rain ground splash particles: when rain hits a flat surface, spawn tiny ring-splash particles periodically
- Animated lava texture: scrolling UV or noise-based warp on the lava block surface

---

## 2026-05-29 — Realistic dawn/dusk sky gradient + TS6 moduleResolution fix

**What was done:**
- Added `topSky` zenith color keyframes to `DayFrame` — separate from the horizon `sky` color. Previously both zenith and horizon turned orange at dawn/dusk; now the zenith stays dark blue (#1a2850) while the horizon turns orange (#ff8040), giving a true golden-hour gradient.
- `sampleDayCycle()` interpolates `topSky` through the full 9-keyframe day cycle.
- `updateDayNight()`: `skyZenith` now uses `frame.topSky`, `skyHorizon` uses `frame.sky` (was: both used `frame.sky`).
- `setWeatherIntensity()`: zenith uses `topSky` blend to dark stormy grey, horizon uses `sky` blend to rain grey — maintains proper two-tone sky even in rain.
- Sky dome shader transition widened from `smoothstep(-0.08, 0.38, vH)` to `smoothstep(-0.05, 0.70, vH)` with `t²` curve — keeps more of the horizon band and avoids the zenith color bleeding down too low.
- Fixed `tsconfig.json` `moduleResolution` from deprecated "Node" to "bundler" (TypeScript 6.0 compat), resolving exit code 2 on `tsc -p tsconfig.emit.json`.

**Ideas for next time:**
- Block break particles colored by block type (stone=grey, dirt=brown, grass=green, wood=brown) — currently generic reddish
- Arrow/crossbow particle trail: faint feather or smoke particles behind fired arrows
- Death burst particle color by enemy type: goblin=green, orc=brown, skeleton=white bone shards, troll=dark grey stone
- Torch/lava block glow: make placed torches emit a small emissive halo ring (additive blending plane) as a sprite above the block
- Hostile mob night-eye glow: at night, enemies have a faint red/green emissive pixel on their eyes (already emissive but could be more dramatic at night)
- Surface water reflection: a slight emissive tint on water surface faces when sky is bright (noon hours only)
- Sky haze band: a narrow additive-blended glow ring at vH≈0 to simulate atmospheric scattering at the exact horizon

---

## 2026-05-29 — Rain streaks, water splash particles, biome-specific fog

**What was done:**
- **Rain overhaul**: Replaced 2500 `PointsMaterial` dot-rain with 2000 `LineSegments` streaks. Each streak is a 0.55-unit tall tilted line (wind_x=4 m/s gives realistic angle). Both vertices travel together. Rain color is `b8d8ff` (light blue-white). The difference from dots is dramatic — rain now looks like actual falling rain instead of floating specks.
- **Water splash particles**: When the player enters water (falls or walks in), `spawnSplashEffect()` now fires 18 blue water-droplet particles at the surface level, supplementing the existing audio cue. Was audio-only before.
- **Biome-specific fog**: `SceneManager` gains `_fogFarBase` + `setFogFarBase()`. `WorldGen` exports `getBiomeAt()`. Each frame the game smoothly lerps fog-far toward 165 (desert = clearer air, can see farther), 115 (taiga = slightly dense misty forest), or 130 (forest = default). Weather and underwater fog overrides still work correctly.

**Ideas for next time:**
- Arrow/projectile particle trails — faint feather or smoke particles behind fired arrows
- Death burst particle color by enemy type (goblin=green, orc=brown, skeleton=white) — already uses `state.config.color` but could add specific spawn shapes
- Block break particles: currently uses block.color; could be improved to use the block's actual texture sample color
- TNT explosion: add a brief emissive flash / screen-white effect on detonation
- Face-specific textures for crafting table (workbench grid top) and furnace (glowing front face) — requires passing full face normal to getBlockTexIndex
- Screen-space fog vignette that intensifies at night (already have a static vignette but could animate it)
- Rain ground splash: when rain hits a flat surface, spawn tiny ring-splash particles periodically

---

## 2026-05-28 — Higher-resolution block texture atlas (32×32)

**What was done:**
- Expanded the block texture atlas from 16×16 pixels per tile to 32×32 pixels per tile (2× resolution)
- Expanded the atlas from 16 tiles to 32 tile slots (`ATLAS_TILES = 32`) and fixed the hardcoded `/ 16` UV constant to use the module-level `ATLAS_TILES`
- Completely rewrote all 16 existing block textures with more detailed pixel art:
  - **Stone**: crack lines rendered as wandering paths, highlight patches
  - **Cobblestone**: distinct individual stone shapes with mortar, highlight/shadow on each stone
  - **Dirt**: pebble marks and lighter flecks
  - **Grass top**: darker patches and lighter tufts for variation
  - **Grass side**: 5px green strip with transition zone and downward grass tendrils
  - **Sand**: subtle ripple/wave pattern
  - **Wood side**: vertical grain with column variance and knot marks
  - **Wood top**: realistic ring pattern with bark edge ring
  - **Planks**: 8px board seams with alternating offset and wood grain
  - **Leaves**: 13% transparent holes for dappled look
  - **Ores** (iron/coal/gold/diamond): larger, more distinct ore veins
  - **Bedrock**: more varied dark/light patches
  - **Diamond**: proper rhombus shape with bright center
- Added **6 new dedicated textures** for blocks that previously showed only flat vertex color:
  - Index 16: **Gravel** — mosaic of rounded pebbles with highlight/shadow
  - Index 17: **Obsidian** — deep purple-black with subtle glassy streaks
  - Index 18: **Iron block** — brushed metal with panel dividers and rivets
  - Index 19: **Snow** — pale blue-white with crystalline sparkle
  - Index 20: **Cactus side** — ribbed green with thorn tips
  - Index 21: **Cactus top** — 8-pointed radial star pattern
- Updated `getBlockTexIndex()` to dispatch the new block types

**Result:** Visually richer world — cobblestone fortress walls look solid with distinct stone shapes, trees have natural-looking varied leaves, terrain surfaces have clear character.

**Ideas for next time:**
- Add **animated water texture** (scrolling UV or shader-based waves)
- Add **face-specific textures** for crafting table (workbench top) and furnace (glowing front face) — requires adding block orientation/state data
- Improve **enemy visuals**: bigger goblin, troll with proper proportions, skeleton with visible bow
- Add **particle trails** to sword swings and projectiles
- Add **ambient occlusion** in corners and under overhangs (currently present but could be more dramatic)
- Add **fog of war** / vignette post-processing
- Better **torch/light halos** — pointlight emissive around placed torches

---

## 2026-05-28 — Cobblestone 9-stone redesign + TypeScript build fix

**What was done:**
- Upgraded cobblestone texture (tile 1) from 6 large unequal stone shapes to 9 stones arranged in a proper 3×3 grid with consistent mortar gaps, each with full 4-way bevel (top+left highlight, bottom+right shadow) for a more 3D Minecraft-like appearance. Also darkened the mortar background from #60605a to #3e3b35 for sharper contrast.
- Fixed `tsc -p tsconfig.emit.json` exit code: added `"types": ["vite/client"]` to tsconfig.emit.json so the CSS side-effect import in main.ts resolves cleanly (TS2882 was causing exit 2). Build now exits 0.
- Added `src/vite-env.d.ts` with `/// <reference types="vite/client" />` for IDE support.

**Ideas for next time:**
- Animated water: scrolling UV or ripple normal map for the water block material
- Torch light halos: spawn a PointLight near each placed torch
- Block break particles colored by block type (stone=grey, dirt=brown, grass=green)
- Screen-shake on heavy hits (orc, troll, troll_king)
- Death burst particles colored by enemy type

---

## Session 2026-05-28 — Combat Impact Particles

**Goal:** Add visual particle feedback for melee and ranged combat hits.

**Changes made:**
- Added `spawnMeleeHit(x, y, z, color?)` to `Particles.ts`: 5–8 rectangular red splat particles exploding outward on sword/axe connect, each with slight random color variance between `0xcc2222` and `0xff3333`
- Added `spawnArrowHit(x, y, z)` to `Particles.ts`: 4–6 slim white/gray shard particles on arrow or bolt impact, oriented like wood splinters
- Added `onPlayerArrowHitEnemy` callback to `ProjectileManager` in `Projectile.ts`, fired on both arrow and crossbow bolt enemy hits; both arrow pool and bolt pool now call it
- Wired `spawnMeleeHit` into `tryMeleeAttack()` in `Game.ts` at the hit confirmation point
- Wired `spawnArrowHit` into `onSkeletonArrowHit` (skeleton arrows hitting player) and `onPlayerArrowHitEnemy` callback (player arrows/bolts hitting enemies)

**Result:** Sword hits now spray red particle splats; arrows and crossbow bolts emit shard bursts on impact — much more satisfying combat feel.

**Ideas for next time:**
- Add particle trails to fired projectiles (faint smoke/motion trail)
- Add screen-shake on heavy hits (orc, troll, troll_king) via camera position offset
- ~~Sword swing arc: brief translucent blade trail mesh~~ ✓ done
- Death burst particles when enemy HP reaches 0 (already some particle logic, extend it)
- Block break particle color matches block type (currently generic)

---

## Session 2026-05-28 — Sword Swing Arc

**Goal:** Add a translucent blade-trail plane to the first-person arm scene that flashes during melee weapon swings.

**Changes made:**
- Added `_swingArcMesh: THREE.Mesh` to `SceneManager` — a `PlaneGeometry(0.35, 0.55)` with `MeshBasicMaterial` using `AdditiveBlending`, `transparent: true`, `DoubleSide`, added directly to `armScene`
- Added `_swingWeaponEquipped: boolean` field, set to `true` in `updateArmItem()` when a sword/melee weapon or axe is equipped (not bows, not guns)
- In `renderArm()`, positions the arc mesh in camera-local space (slightly right and forward of center, aligned to blade area) and drives opacity via `sin(swingPct * π) * 0.45` — peaks at 45% opacity mid-swing, fully transparent at start/end
- Arc color is pale blue-white (`0xaaddff`) with additive blending for a luminous trail effect

**Result:** Sword and axe swings now show a brief ghost-plane trail at the blade tip, giving clear visual feedback that a swing is in progress. Bow, guns, tools, and empty hand produce no arc.

**Ideas for next time:**
- Add **particle trails** to fired projectiles (faint smoke/motion trail behind arrows and bolts)
- Add **death burst** particles when enemy HP reaches 0 (colored by enemy type)
- **Block break particle color** matches block type (stone = grey, dirt = brown, etc.)
- **Torch light halo** — emissive pointlight glow ring around placed torches
- **Screen-shake** on heavy hits (orc, troll, troll_king) — a quick camera offset jolt

---

## 2026-05-28 — Additional block texture/water session (this run merged into previous)

*Note: This session's Map.ts changes were superseded by the already-merged upstream version which had the same improvements in a 2D atlas format.*

**Ideas for next time:**
- Torch point lights: add THREE.PointLight near torch blocks for warm glow
- Leaves translucency: make leaves slightly emissive at night or after rain
- Enemy mesh upgrades: troll/orc with more detailed geometry
- Particle improvements: splashing water when falling into water
- Better cloud shapes: rounded puff cloud geometry instead of flat boxes
- Sky gradient dome: replace solid sky color with gradient mesh (horizon glow)
- Fog distance variants per biome (desert=clearer, ocean=misty)
