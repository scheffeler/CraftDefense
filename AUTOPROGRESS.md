# CraftDefense Auto-Iteration Progress

## 2026-05-30 — Passive mob visual overhaul (distinctive props + diagonal gait)

**What was done:**
- Replaced simple Y-bob leg animation with **pivot-based diagonal gait**: front-left/back-right leg pivots swing together (opposite phase from front-right/back-left), replicating how real quadrupeds walk. Leg pivot objects sit at body-attachment height; leg mesh is a child offset downward so rotation naturally swings forward/back.
- Added **per-species detail props** in `PassiveMob.ts`:
  - **Chicken**: yellow beak (already had), red comb on top of head, red wattle below beak, white wing panels on body sides. Wings flap up/down at 1.6× walk frequency during movement.
  - **Pig**: pink protruding snout box with two dark nostril dots, two angled ear flaps, curly pink tail angled backward.
  - **Cow**: two beige angled horns on head, pink udder box under rear body, four teat nubs hanging below udder.
  - **Sheep**: enlarged wool puff covering head as well as body, dark face strip visible through wool at front of head, two wool-colored ear flaps on head sides.

**Notes on this session:**
- Previous sessions had already done: sky dome, biome tinting, animated water/lava, torch flames+lights, enemy face textures (zombie/goblin/orc/troll/skeleton/creeper/golem), pixel-art item sprites, crossbow viewmodel, leaf light-scattering, type-specific particles.
- The remote auto-iterate branch was already at a very high-quality state; this run adds refinement to the passive mob world population.

**Ideas for next time:**
- Enemy mesh upgrade: orc and zombie arms swing during walk — currently arms are static. Add arm pivot animation synchronized with leg gait (opposite phase from legs on same side).
- Troll and uruk_captain raised-weapon arm pose: instead of arms hanging, rotate the weapon-holding arm ~40° forward to look more threatening.
- Sheep color variety: randomly pick one of 8 wool colors (white, tan, gray, brown, black, red, blue, yellow) at spawn to give herds visual variety.
- Chicken could have a brief "pecking" animation when idle: bob head forward/back every few seconds.
- Passive mob shadow: currently castShadow=true on body but not all parts. Make sure each prop also casts shadow.
- Rain puddle darkening on wet ground: when weather is rainy, gradually darken dirt/stone top-face vertex colors to simulate wet ground (needs chunk re-dirty on weather change).
- Animated lava hotspot: randomly update bright pixel positions in the lava canvas each second for a bubbling effect.

## 2026-05-30 — 3-D crossbow viewmodel (first-person)

**What was done:**
- Added `buildCrossbowMesh()` private method to `SceneManager`: a forward-pointing T-frame crossbow constructed from 11 BoxGeometry pieces (tiller, limb, bolt-rail, two limb-tip metal caps, two angled string segments in a V-shape, pistol grip, trigger guard, trigger blade, butt stock). Materials: warm brown wood, dark brown wood, dark metal, off-white string.
- Wired it into `buildItemMesh()` dispatch so crossbow no longer falls through to `buildSwordMesh()`.
- Excluded crossbow from the sword-swing animation arc in `_swingWeaponEquipped` (ranged weapons shouldn't melee-swipe).
- Verified with Playwright screenshot at 1920×1080 in freeplay mode: crossbow viewmodel renders in lower-right corner.

**Ideas for next time:**
- Crossbow bolt nocked in the rail: add a thin dark cylinder along the rail when crossbow is the held item
- Bow draw animation: lerp the bow-string segment offset when the player is "charging" a ranged shot
- Arrow/bolt flight trail: add a small white LineSegments particle trail to projectile meshes
- Animated lava hotspot: per-frame brighten/darken bright pixels in the lava canvas for a bubbling effect
- Troll / orc enemy with raised weapon arm, Uruk Captain with a banner-pole prop
- Rain puddle darkening: gradually darken top-face vertex colors of dirt/stone when rain is active

## 2026-05-30 — Leaf light-scattering + distinct leaf-cluster texture

**What was done:**
- Redesigned atlas tile 9 (leaves, 32×32px): replaced simple mottled noise with 24 distinct elliptical leaf clusters (4×3 px each) in 8 green tones, each with a central vein highlight. Dark green base fill creates canopy depth without black holes. 7 sunlit-tip bright highlights for filtered-light feel.
- Added `leafSSS=1.48` shade multiplier in `rebuildChunkMesh` for leaf blocks: bottom face 0.45→0.67, sides 0.60–0.80→0.89–1.0. Forests now look uniformly bright — undersides of canopies no longer artificially dark.
- This run first merged origin/auto-iterate (which had the 2-row 32×32px atlas + biome tinting, torch lights, sky dome, etc.) before adding the leaf improvements on top.

**Ideas for next time:**
- Animated lava hotspot: per-frame brighten/darken bright pixels in the lava canvas at runtime for a bubbling effect
- Leaves emissive night glow: add a very faint green tint to leaf blocks at night to simulate bioluminescence or moonlit leaves
- Tree shape variety: some trees could be taller/narrower (jungle), some rounder (oak), right now all trees look similar
- Enemy mesh upgrades: troll/orc with a raised weapon arm, Uruk Captain with flagpole banner prop
- Passive mob improvements: chicken with flapping wing animation, pig with wider snout geometry
- Goblin miner: add a small hard-hat prop on its head
- Rain puddle darkening: when rain is active, gradually darken top-face vertex colors of dirt/stone by ~15% to simulate wet ground (requires marking dirty chunks on weather change)
- Vignette on near-death: semi-transparent red border overlay in UI when HP < 20%

## 2026-05-30 — Pixel-art item sprites for held food/material/armor items

**What was done:**
- Replaced the plain flat colored quad for food/material/armor held items with per-item 16×16 canvas-based pixel-art sprites rendered via `MeshBasicMaterial` (no lighting dependency, `depthWrite:false`)
- Added `buildItemSprite(itemId, color)` and `drawItemPixelArt(ctx, itemId, _S)` as private methods on `SceneManager`
- Custom pixel art for 18+ items: apple (red with green leaf+stem), bread (golden loaf), raw/cooked meats (beef/pork/chicken with char marks), iron ingot (silver trapezoid), gold ingot (golden bar), diamond (cyan gem with facets), coal ore (dark chunk), iron/gold/diamond ore (stone with colored flecks), wheat stalk, wheat seeds, flint chip, stick (diagonal), arrow (shaft+head+feathers), paper, book
- Items without custom art fall back to a colored square with a highlight strip
- Sprites use `NearestFilter` for crisp pixelated appearance; positioned as a slight forward-facing tilt (like a held card) rather than 3D rotation

**Notes on this session:**
- The remote `auto-iterate` branch was 9+ commits ahead; I reset --hard to origin/auto-iterate before making changes
- Previous sessions have already done: sky gradient dome, rain streaks, water/lava animated meshes, expanded 32px block atlas, torch point lights, enemy face/body textures, puff clouds, sword arc, moon phases, rain ground splash, type-specific particles, atmospheric haze

**Ideas for next time:**
- Uruk Captain banner prop on its back (flagpole + cloth banner — dramatic boss visual)
- Leaves light-scattering: make leaf block faces slightly brighter (boost shade multiplier in chunk builder for leaf block faces to simulate diffuse transmission)
- Animated lava per-frame hotspot update: randomly brighten/darken bright pixels in the lava canvas at runtime
- Night-vision vignette: green overlay + gamma-lift in armScene when night-vision potion is active
- Passive mob improvements: chicken could have better wing geometry, pig could have a snout
- Goblin miner: add a helmet/hard-hat prop to distinguish from regular goblin

## 2026-05-29 — Type-specific enemy death particles + block-accurate break particles

**What was done:**
- Extended `spawnEnemyDeath(x, y, z, color, enemyType?)` in `Particles.ts` with 5 new type-specific burst patterns:
  - **Skeleton**: 10 thin elongated bone shards (0.03×0.13–0.20×0.03 BoxGeometry, white/light-gray)
  - **Creeper**: 14 bright green sparks (MeshBasicMaterial, fast 0.3–0.55 s fade, sulfurous greens)
  - **Spider**: 10 flat dark ichor drops (s×0.3s×s disc shape, near-black)
  - **Golem/Troll/Troll King**: 10 large stone chunks (0.10–0.22 unit cubes, slow heavy arc, 4 stone grays)
  - **Zombie**: 12 green/flesh cubes (four zombie-appropriate colors)
  - **Default**: same-color cubes with ±28 per-channel hue jitter per particle
- Added `enemyType` to the `spawnEnemyDeath` call in `Game.ts` (`state.config.type`; elites stay undefined for golden burst)
- Upgraded `spawnBlockBreak(wx, wy, wz, color, blockId?)` with a 14-case color palette switch:
  - Grass: green top-soil + brown dirt tones; Stone/cobblestone: 4 gray shades; Wood: brown-tan chips; Leaves: multi-green confetti; Sand: tan/gold dust; Ores (iron/coal/gold/diamond): stone base + ore-accent; Obsidian: deep purple-black; Snow/glass: icy blue-white; Gravel: warm gray
- Updated `onBlockBroken` callback in `Game.ts` to pass `id` as `blockId` to `spawnBlockBreak`

**Ideas for next time:**
- Animated lava: the lava texture already scrolls, but could add per-frame hotspot ripple by updating the canvas pixels near bright spots
- Leaves light-scattering: add a subtle emissive green tint to leaf blocks during daytime (vertex color override or second material on the leaf geometry)
- Enemy mob upgrades: troll/uruk-hai could have a raised weapon arm, Uruk Captain needs a banner prop on its back
- Hotbar item texture: currently block items show a textured cube — food/material items could show a flat canvas sprite with actual art
- Night-vision potion: already in code; could add a green vignette + luminance boost post-effect via a full-screen quad in armScene
- Moon phase cycle that visually changes the shadow disc offset each game-day (currently static unless days tracked)
- Particle pooling: current approach creates new Mesh+Material per particle (GC pressure); a shared material pool per color would reduce churn during large battles

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

## 2026-05-30 — Potion visibility fix + armor/material pixel-art sprites

**What was done:**
- **Bug fix**: Potions (category="potion") were completely invisible when held — `buildItemMesh` had no branch for "potion" so it returned `null`. Added "potion" to the sprite-render path so they now show up.
- Added `drawItemPixelArt` 4th parameter `color` (default `0xffffff`) so sprites that need the item's runtime colour (potions, armour) can shade themselves correctly. Updated the single call-site in `buildItemSprite` to pass `color`.
- **New pixel-art sprites for 30+ items** that previously showed a plain coloured square:
  - *Potions* (8 variants): classic potion bottle shape — cork, neck, rounded body, highlight shine — tinted by potion colour (red/pink/blue/orange/etc.)
  - *Armour helmets*: crown + cheek guards + visor slit
  - *Armour chestplates*: shoulder pads + riveted torso + centre seam
  - *Armour leggings*: waist band + split leg panels
  - *Armour boots*: ankle cuff + toe cap + sole
  - *Wool*: white fluffy square with sine-wave texture lines
  - *Gunpowder*: dark heap with grain dots and a top-spark highlight
  - *Bullet*: silver cylinder with tip, casing seam, and body highlight
  - *Glass bottle*: pale-blue transparent bottle with glass-shine patch
  - *Nether wart*: bumpy red fungus clusters with stem

**Ideas for next time:**
- Animated lava hotspot: per-frame brighten/darken bright pixels in the lava canvas (store canvas context in VoxelWorld, update in `tickFluidAnimation`)
- Crossbow viewmodel: currently uses `buildSwordMesh` since it's category="weapon" but not "bow" — should have its own geometry (T-shape stock + rail + string)
- Enemy mesh upgrades: Uruk Captain with a flagpole banner prop on its back, Troll King with crown
- Passive mob improvements: chicken flapping wing animation, pig wider snout
- Moon phase visual: change the shadow disc offset each game-day for visual night variety
- Rain puddle darkening: when rain is active, gradually darken top-face vertex colors of dirt/stone by ~12%
