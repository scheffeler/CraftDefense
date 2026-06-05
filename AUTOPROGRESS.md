# CraftDefense Auto-Iteration Progress

## 2026-06-05 — Leaf night glow + torch ground halo disc

**What was done:**
- **Leaf canopy emissive at night** (`src/Map.ts`): Leaf block faces are now separated into a dedicated per-chunk `leafMesh` (alongside the existing water/lava/wheat/flora meshes). A shared `leafMat` (`THREE.MeshLambertMaterial`, `DoubleSide`, same block texture atlas, emissive `0x003300`) is used for all leaf meshes. `setLeafEmissive(nightness)` updates `emissiveIntensity` to `nightness × 0.10` each frame — 0 at noon, 0.10 at midnight. Called from `Game.ts` alongside the water-sky-tint update: `Math.max(0, 1 - daylight * 4)`. The separation required: adding `leafMesh` to the `Chunk` class, a `makeLeafMaterial()` static factory, cleanup in `rebuildChunkMesh()`, a `addLeafFace()` closure parallel to `addFace()`, and the mesh-build block at the end of `rebuildChunkMesh`.
- **Torch ground halo disc** (`src/Game.ts`): Added `_torchHaloGeo` (`CircleGeometry(0.88, 20)`) and `_torchHaloMat` (64×64 canvas radial gradient: warm orange-yellow core → golden mid → transparent rim, `AdditiveBlending`) as shared fields. Each `addTorchLight()` call now attaches a flat halo `Mesh` (rotation.x = -π/2, y = 0.02, renderOrder = 1) to the torch group, creating a warm pool-of-light on the ground beneath every torch.
- Verified: 73 halo meshes detected (72 torches + player shadow), 12 leaf meshes detected. Night screenshots show warm orange pools under torches and faint green leaf canopy glow. TypeScript compiles clean.

**Notes:**
- Oriented fresh session: remote `auto-iterate` was at f87276e (firefly sprites). Node_modules was absent; `npm install` required before tsc.
- `makeLeafMaterial` uses `side: THREE.DoubleSide` so leaves are visible from both sides (interior and exterior of canopy). `alphaTest: 0.1` keeps the same texture transparency behavior as the main chunk mesh.
- The leaf separation means the main `chunk.mesh` (opaque) no longer contains leaf faces. This is correct since leaves are transparent anyway.

**Ideas for next time:**
- **Passive mob animations**: chicken wing-flap oscillation (±0.5 rad, 0.15 s period via `flapTimer` per mob), pig snout twitch — mentioned 5+ sessions, high priority
- **Arrow trail density**: bump `if (Math.random() > 0.45)` to `> 0.65` in `spawnArrowTrail` — one-liner, very low risk
- **Smoke column above campfire**: slow upward grey particle stream from campfire mesh position (~3 particles/s, slow upward velocity 0.5 m/s, opacity 0.15–0.30) — mentioned 3 sessions
- **Block break particle color**: match particle color to block type in `spawnBreakParticles` (stone=grey, dirt=brown, wood=brown, leaves=green, etc.)
- **Enchanting table aura**: slow-rotating rune sprites around the enchanting table, faint purple emissive glow, similar to campfire treatment

## 2026-06-05 — Firefly glow sprites at night

**What was done:**
- Added a `Firefly` interface (sprite, velocity, bob direction, blink phase + frequency) to `src/SceneManager.ts`.
- Added `_fireflies: Firefly[]` and `_fireflyTime: number` fields to `SceneManager`.
- `buildFireflies()`: creates a shared soft radial-gradient canvas texture (24×24, chartreuse core → transparent edge) and 14 `THREE.Sprite` instances scattered across the clearing interior (x: 19–45, y: 8–11, z: 19–45). Each sprite gets its own `SpriteMaterial` (shared texture, individual opacity). `AdditiveBlending + fog: false` ensures they glow against the dark sky without being fogged out.
- Update loop inside `updateDayNight()`: each frame, fireflies drift horizontally (0.25–0.70 m/s) and gently bob vertically (0.28 m/s), bouncing off clearing bounds. Blink is driven by `max(0, sin(t × blinkFreq × 2π + phase))²` — the squared half-sine gives a sharp insect-like pulse. Opacity = `nightness × 0.9 × glow²`, scale = 0.15–0.25 depending on glow. When nightness < 0.01 (day), all sprites are silently set to opacity 0.
- Verified: 14 fireflies spawned at correct positions, varying opacities (0.0–0.61) at midnight matching staggered blink cycles. TypeScript compiles clean.

**Notes:**
- Oriented fresh from remote `auto-iterate` (already had campfire, shockwave rings, Milky Way, star fog fix, hit flash tinting, arm bob, wave pulse, etc.).
- `npm install` was needed before `npx tsc -p tsconfig.emit.json` could pass — node_modules were absent in this session.
- Firefly blink frequency is 0.7–2.0 Hz, each firefly asynchronous — gives a natural scattered-blink field effect.

**Ideas for next time:**
- **Leaves emissive at night**: traverse chunk leaf meshes near player, set soft `emissiveIntensity` ~0.08 at midnight. Mentioned in 5 previous sessions — high priority.
- **Torch halo disc**: flat `PlaneGeometry(1.2, 1.2)` with radial gradient texture at base of torch, `AdditiveBlending` — warm pool-of-light on ground.
- **Moon texture phases**: build 8 distinct canvas textures (full → new moon) and swap as `_totalDays` advances mod 8, rather than the shadow-disc trick.
- **Passive mob animations**: chicken wing-flap oscillation (±0.5 rad, 0.15 s period), pig snout twitch.
- **Arrow trail density**: bump `if (Math.random() > 0.45)` to `> 0.65` — very low risk, one-line change.
- **Smoke column above campfire**: slow upward grey particle stream from campfire mesh position.

## 2026-06-04 — Milky Way nebula band + star fog fix

**What was done:**
- Added `buildMilkyWay()` to `src/SceneManager.ts`: 800 points distributed along a tilted galactic arc. Uses a sinusoidal-latitude formula (`phi_center = π/3 + π/4 * cos(θ)`) which is the spherical-coordinates projection of a tilted great circle. The band sweeps from near-zenith on one side to near-horizon on the other, just like the real Milky Way.
- Vertex colours shade points from warm yellow-white (near the high-overhead galactic-centre arc) to cool blue-white (rim), with per-point random brightness variance. `AdditiveBlending` + `fog: false` give a soft diffuse nebula glow.
- Opacity tracks `nightness × 0.38` so the band fades in smoothly at dusk and disappears by dawn.
- **Critical bug fix**: Regular star `PointsMaterial` was missing `fog: false`. Stars are at r=160 but `fog.far ≈ 130`, so all 800 stars were completely fogged out (invisible). Stars now properly visible at night. Also added `depthWrite: false` to prevent z-buffer artefacts. The same `fog: false` is applied to the Milky Way material.
- Verified via Playwright debug screenshot that the band appears in upper sky and forms a distinct arc. Regular star field confirmed visible after fog fix.

**Notes:**
- Fresh session from remote `auto-iterate` (already had: campfire, moon phases, screen shake, war cry shockwave, death flash, arm bob, wave pulse, TNT sprites, footprint decals, biome sky tint, night fog, torch flicker, emissive eye glow, combat particles, block-type break particles, crossbow viewmodel, all pixel-art item sprites, wheat wind shader, water UV scroll, lava pulse, shadow blobs, per-enemy hue variation).
- Both campfire and moon phase were already implemented; war cry shockwave was also already done.
- The star fog bug was a pre-existing issue — stars were never visible. The Milky Way addition simultaneously fixed the underlying bug.

**Ideas for next time:**
- Leaves emissive at night: building a separate leaf mesh chunk (similar to water/lava fluid meshes) to allow per-material emissive updates — faint green glow at night
- Fireflies: 10–15 small `PointLight` + emissive `Sprite` pairs drifting around the clearing at night, fading in at dusk
- Better cloud variety: occasionally spawn a dark storm-cloud variant with slightly blue-grey tint when rain begins
- Passive mob animations: chicken wing-flap animation, pig snout twitch
- Day number HUD improvement: show moon phase icon next to "Day N" in the corner

## 2026-06-04 — Uruk Captain war-cry shockwave ring

**What was done:**
- Added `ShockwaveRing` interface and `_rings: ShockwaveRing[]` to `ParticleSystem` (`src/Particles.ts`). Rings use a staggered-delay approach: `life` starts at `-delay` and becomes active when it reaches 0, avoiding any separate "pending" queue.
- `spawnWarCryShockwave(x, y, z)` creates three flat `RingGeometry` meshes (r=8.5, 6.5, 5.0 units) with `AdditiveBlending` in red/orange/yellow, staggered 0.13 s apart. Each ring expands from scale ~0 to its max radius while fading opacity 0.55→0 over 0.6–0.75 s.
- Also spawns 18 ember `BoxGeometry` particles radiating outward at 4.5–9 m/s matching the ring palette, for a ground-level blast feeling.
- Ring update loop in `update()` handles both delay phase (skip if `life < 0`) and expansion phase; `clear()` disposes all active rings on wave reset.
- Wired to `onBossWarCry` in `Game.ts` — now fires alongside the existing UI banner, screen shake, and explosion audio.
- TypeScript compiles clean, game loads without JS errors. Ring geometry verified (3 rings with correct positions and staggered life values).

**Ideas for next time:**
- **Leaves emissive at night**: When `nightness > 0.5`, traverse leaf chunk meshes near the player and set a soft green `emissiveIntensity` (~0.08–0.12) so the canopy glows faintly. Reset emissive to 0 at dawn.
- **Torch halo disc**: Add a `PlaneGeometry(1.2, 1.2)` with soft radial gradient texture (`AdditiveBlending`) as a third child of the torch group, lying flat at the torch base. Would give torches a warm pool-of-light visual on the ground.
- **Arrow trail density**: In `spawnArrowTrail`, change `if (Math.random() > 0.45)` to `> 0.65` for noticeably denser trails — very low risk, one-line change.
- **Projectile smoke trail**: Spawning tiny semi-transparent grey cubes behind fired arrows/bolts for a "flight smoke" trail (distinct from the current arrow-feather trail).
- **Moon texture variation**: Build 8 distinct canvas textures for the moon (full, gibbous, half, crescent, new) and swap the sprite texture as `_totalDays` advances, rather than relying on the shadow-disc offset trick.

## 2026-06-04 — Hit flash colour tinting

**What was done:**
- Added optional `flashColor = 0xffffff` parameter to `EnemyManager.damage()` and `flashHit()` in `src/Enemy.ts`. Non-lethal hits set the emissive to the specified colour at intensity 1.1 (vs 0.8 for white), then reset after 110 ms. The killing-blow `flashDeath()` path is unchanged (always white burst).
- Updated all weapon-damage callers in `src/Game.ts` to pass appropriate colours:
  - Melee swing: `0xff1a1a` red (or `0xff6600` orange when fire aspect is active)
  - Burning status tick: `0xff5500` orange
  - Lava contact: `0xff4400` deep orange
  - Fire block contact: `0xff7722` warm orange
  - Thorns reflect: `0xdd44ff` purple
  - TNT/cannon explosion: `0xff8844` warm orange
  - Projectile hit: `0x44aaff` cyan for ice-bolt (slow factor < 1.0), `0xff8800` orange for cannonball (damage ≥ 20), white default for standard arrows
- Pistol/shotgun/raygun callers retain the white default — visually neutral for ranged shots which already have their own hit-spark particles.

**Notes:**
- Oriented from git log + AUTOPROGRESS. Remote `auto-iterate` was at cb5044b (campfire). Hit flash tinting was listed in previous session's ideas and is a focused, shippable improvement with zero risk of breakage (optional parameter, all existing callers still valid).
- TypeScript compiles clean (`npx tsc -p tsconfig.emit.json` zero output).
- Game loads without JS errors (Playwright screenshot verified).

**Ideas for next time:**
- Moon phase visual: update moon canvas texture each game-day to show crescent/half/full cycle
- Leaves emissive at night: traverse leaf blocks near player, add tiny emissive so the canopy glows faintly after dark
- Boss war-cry shockwave ring: expand + fade `RingGeometry` particle when uruk_captain activates war cry
- Biome ambient sound: distinct ambient audio per biome (desert wind, taiga crickets, forest birds)
- Campfire cook mechanic: right-click campfire with raw food to cook it (alternative to furnace)
- Smoke particle column above campfire: slower grey upward particle stream above the flames

---

## 2026-06-03 — Campfire decorative block

**What was done:**
- Added `"campfire"` to `BlockId` in `src/types.ts` and added block definition (name, color, hardness, transparent, non-placeable) in `src/Map.ts`.
- Added `campfire` to `BLOCK_BEHAVIORS` in `src/config/blocks.ts` (axe tool, drops wood).
- Excluded campfire from chunk geometry meshing in `Map.ts` (same as torch) — rendered as dedicated 3D mesh.
- Added campfire to passthrough block list in `Projectile.ts` so arrows/bolts fly through the fire planes.
- Built full campfire mesh+light system in `Game.ts`:
  - **Fields**: `campfireLights` (Map), `campfireGroups` (Map), `_campfireFlames` (array), `_campfireEmberTimer`, shared log geometry/materials (`_campfireLogGeo`, `_campfireLogMat`, `_campfireAshesMat`).
  - **`addCampfireLight(wx, wy, wz)`**: creates a `PointLight(0xff5500, 2.5, 14)`, a flat ash-bed `CylinderGeometry` (dark disc), four crossed log `BoxGeometry` meshes at ±35° and ±80° rotations, and a crossed-quad fire plane mesh (two Minecraft-style quad pairs with `AdditiveBlending`). All grouped together with per-campfire random flicker phase.
  - **`removeCampfireLight`**: disposes geometry + material, removes from scene.
  - **`initCampfireLights()`**: scans the world at startup (like `initTorchLights`), called from `start()`.
  - **Block event handlers**: remove/add campfire on block break/place.
  - **Per-frame update**: campfire light flicker (three sine harmonics, wider range than torch), fire plane scale/rotation wobble, and ember spark bursts every ~0.22 s via `spawnLavaEmbers`.
- Placed 2 campfires in `WorldGen.ts` in the open clearing flanking the central well — `(26, G+1, 38)` southwest and `(38, G+1, 26)` northeast.
- Verified: `npx tsc -p tsconfig.emit.json` exits cleanly. Browser loads with `window.__game` live, campfireLights.size=2, campfireGroups.size=2, _campfireFlames.length=2. No JS errors.

**Ideas for next time:**
- Moon phase visual: change the shadow-disc offset each game-day for crescent/half/full visual variety
- Leaves emissive at night: traverse leaf blocks near player, add tiny emissive so the canopy glows faintly after dark
- Boss war-cry shockwave ring: expand + fade `RingGeometry` particle when uruk_captain activates war cry
- Hit flash colour tint: change non-lethal hit flash from white to the weapon's colour (sword=red, magic=purple)
- Campfire cook mechanic: right-click campfire with raw food to cook it (campfire as an alternative to furnace)
- Smoke particle column above campfire: a slower, grey upward particle stream above the flames

## 2026-06-03 — TNT countdown floating sprite

**What was done:**
- Added `_tntCountdownSprites: Map<string, THREE.Sprite>` to `Game.ts` and added `displayN: number` field to the `tntFuses` value type.
- `spawnTNTSprite(key, wx, wy, wz)` creates a `THREE.Sprite` with a 64×64 canvas texture showing the starting digit "3" (dark orange ring + bright yellow numeral with shadow glow), positioned 1.6 units above the TNT block center. Sprite scales up slightly as the countdown decreases (0.80 at "3" → 0.94 at "1") for urgency.
- `updateTNTSprite(key, n)` generates a fresh canvas (color shifts: yellow ring for "3", orange for "2", red for "1") and swaps the sprite material texture. Called at most 3 times per fuse — only when `Math.max(1, Math.min(3, Math.ceil(timer)))` changes.
- `removeTNTSprite(key)` disposes texture + material and removes the sprite from the scene. Called on explosion and on wave reset.
- Both ignition paths (flint_and_steel right-click, and block-break-relight) call `spawnTNTSprite`. Reset code calls `removeTNTSprite` for all live TNT sprites.
- TypeScript compiles clean. Sprite creation verified in browser via console inspection.

**Notes:**
- Oriented fresh session: remote `auto-iterate` already had 32-tile atlas, rain streaks, shadow blobs, enemy eye glow, footprint decals, biome sky tint, night fog, etc.
- Dev workflow note: `npx tsc -p tsconfig.emit.json` now exits cleanly (tsconfig.emit.json uses `moduleResolution: bundler`). Run tsc first, then `node scripts/dev.mjs` to start Vite.

**Ideas for next time:**
- Campfire decorative block: pre-placed in fortress interior; 2D cross-pane fire Sprite + `PointLight(0xff4400, 1.5, 3)`
- Chicken wing-flap: animate wing groups in `PassiveMob.ts` — store a `flapTimer` per mob, oscillate wing pivot ±0.5 rad over 0.15 s
- Projectile trail spark density for crossbow bolts: bump spawn probability in `spawnArrowTrail` from 0.55 to 0.75
- Wave-start color grade: on wave begin, briefly desaturate (three.js `renderer.toneMappingExposure` pulse) then snap back to normal for dramatic effect
- Enemy death color: brief bright flash (white emissive 1.0 → 0 over 0.15s) exactly at the moment `hp ≤ 0` before death particles spawn
- Boss war-cry visual: currently spawns a golden flash ring — could add a shockwave ring particle (expand + fade `RingGeometry`)

---

## 2026-06-02 — Enemy footprint decals

**What was done:**
- Added a `Decal` subsystem to `src/Particles.ts`: a separate array `decals: Decal[]` alongside `particles`. Decals are flat `CircleGeometry(0.22, 8)` meshes that lay on the ground (`rotation.x = -π/2`), with no gravity and no rotation — they simply fade from 22% opacity to 0 over 0.5 seconds.
- Added `spawnFootprint(x, y, z)` method to `ParticleSystem` that creates a dark (`0x111111`) transparent circle and registers it in the decal array.
- Updated `update(dt)` to process decals separately from regular particles (no gravity, no rotation), and updated `clear()` to also dispose decals on wave reset.
- Added `_footprintTimer` field to `Game.ts`. In `updateCombat`, every 0.35 seconds, all alive non-dying enemies emit a footprint at `pos.y - 0.9` (ground level relative to enemy center). This creates brief dark circles under enemies as they advance — the "grounding" effect that makes enemy movement feel more physical.
- TypeScript compiles clean. Dev server verified working.

**Notes:**
- Reset from fresh session to remote `auto-iterate` (already had gradient sky dome, animated water/lava, biome tints, shadow blobs, emissive eyes, etc.)
- Picked footprint decals since it was mentioned 2× in recent AUTOPROGRESS and directly affects combat visuals (the most-played part of the game).
- The footprint interval (0.35s) and opacity (0.22) are tuned to be subtle — visible close-up but not distracting.

**Ideas for next time:**
- TNT countdown display: floating canvas-texture Sprite above primed TNT showing seconds (e.g., "3") — already has `primedTNT` map with `timer` field, just needs a sprite child on the mesh
- Campfire decorative block: cross-pane fire Sprite + PointLight(0xff4400, 1.5, 3), pre-built in fortress interior or as a new placeable
- Skeleton arrow trail density: bump `if (Math.random() > 0.45)` to `if (Math.random() > 0.60)` in `spawnArrowTrail` for denser trails
- Weapon impact flash: brief white/orange emissive flash on enemy mesh when hit, matching screen shake
- Rain streaks: thin vertical `BoxGeometry(0.01, 0.3, 0.01)` translucent meshes spawned in a radius around player during rain — more atmospheric than sound alone
- Wave-start color grade: brief desaturated → saturated (or foggy → clear) transition when a wave begins

---

## 2026-06-02 — Shadow blob soft-edge + biome sky tint

**What was done:**
- **Shadow blob soft-edge** (`src/SceneManager.ts`): Replaced the flat black `CircleGeometry` player-shadow with a soft penumbra version. A 64×64 canvas is created with a radial gradient (`white → 75% at r=0.5 → 25% at r=0.82 → transparent at edge`) and used as the `alphaMap` on the `MeshBasicMaterial`. The result is a shadow that is dark and solid directly under the player, fading organically to nothing at the rim — far more realistic than the hard-edged disc. Also bumped circle segments from 20 to 24 for smoother silhouette.
- **Biome sky tint** (`src/SceneManager.ts` + `src/Game.ts`): Added `_biome` field and `setBiome(biome: string)` method to `SceneManager`. In `updateDayNight`, after the sky zenith/horizon colours are set from the day-cycle frame, a biome tint is applied: desert boosts red ×1.06/×1.10 and green ×1.02/×1.04 while cutting blue ×0.88/×0.80 (warm sandy haze); taiga cuts red ×0.94/×0.95 and boosts blue ×1.05/×1.04 (cool pine-forest feel). Wired up from `Game.ts` by adding `this.scene.setBiome(biome)` in the biome-tracking block already present there.

**Notes:**
- Reset to remote `auto-iterate` which already had the 2-row 32×32 atlas, clouds, fog, emissive eyes, etc.
- Picked shadow blob and sky tint as the two AUTOPROGRESS suggestions most likely to have immediate visual impact.
- TypeScript compiles clean. Game loads and renders correctly in Chromium screenshot test.

**Ideas for next time:**
- Projectile trails: faint smoke/sparks behind flying arrows and bolts (`Particles.ts`)
- Chicken wing flap: `userData.flapTimer` in `PassiveMob`; rotate wing pivot ±0.5 rad over 0.15 s
- Enemy footprint decals: brief dark quad at enemy step position, fades over ~0.5 s
- Rain puddle darkening: multiply top-face vertex colours of dirt/stone by ~0.85 when weather > 0.5
- Campfire block: 2D cross-pane `Sprite` with animated fire texture + `PointLight(0xff4400, 1.5, 3)`
- TNT countdown: floating canvas-texture sprite showing fuse seconds remaining above primed TNT

---

## 2026-06-02 — Player ground-shadow blob + shadow normalBias

**What was done:**
- **Player shadow blob** (`src/SceneManager.ts` + `src/Game.ts`): Added a flat dark transparent
  circle (`CircleGeometry(0.52, 20)`, `MeshBasicMaterial`, `depthWrite:false`, `renderOrder:1`)
  that projects directly below the player in world space. Every frame, Game.ts scans downward from
  the player's feet position to find the highest solid non-transparent block, places the disc 0.03
  units above that surface, and calls `scene.updatePlayerShadow()`. The blob scales from 1.0 at
  ground level to 0.65 at 5.5 m altitude, and fades from opacity 0.30 → 0 over the same range.
  Hidden during title screen orbit via `hidePlayerShadow()`.
- **Shadow normalBias** (`src/SceneManager.ts`, `setupLighting`): Added
  `sunLight.shadow.normalBias = 0.02` alongside the existing `bias = -0.001`. Reduces
  peter-panning (floating shadows) on angled surfaces like cobblestone walls without introducing
  shadow acne on flat terrain.

**Notes:**
- Started from a fresh session, oriented on git log. Remote `auto-iterate` was 195 commits ahead;
  reset hard to it. Attempted atlas expansion (16→32 single-row) but remote already had a 2-row
  32-tile atlas. Picked shadow blob + normalBias as genuinely-new improvements.
- TypeScript compiles clean. Shadow method is callable and responds to height parameter.
- The blob provides the "player grounding" effect that first-person voxel games typically rely on
  the sun shadow map to supply — but in this game the player has no mesh and casts no shadow.

**Ideas for next time:**
- Skeleton arrow trail: bump `isBolt=true` spawn rate in `spawnArrowTrail` from ~45% to ~70%
- Campfire/bonfire block: small 2D cross-pane fire Sprite + PointLight(0xff4400, 1.5, 3) placed
  on top of a stone base block — could be pre-built in the fortress walls
- TNT countdown: render remaining fuse seconds as a floating `CanvasTexture` sprite above TNT
- Enemy footprint decals: brief dark quad left on ground after enemy steps (fades over ~0.5 s)
- Biome sky tint: desert sky slightly yellower/hazier (`scene.fog.color` tint per player biome)
- Shadow blob soft-edge: replace flat circle with a radial-gradient canvas texture so blob fades
  at edges for more realistic penumbra look

---

## 2026-06-02 — Night atmospheric fog + per-torch independent flicker

**What was done:**
- **Night atmospheric fog** (`src/SceneManager.ts`): Added `_nightFarReduction` field. In
  `updateDayNight`, when `ambientInt` < 0.18, the fog far distance reduces from the biome base
  (~130) down to ~75 at full midnight, and fog near reduces from 48 to 38. At dawn/dusk the
  reduction is zero. `setWeatherIntensity` also subtracts `_nightFarReduction` so rain + night
  combine correctly (rainy night = tightest possible fog). This creates the "torch as beacon"
  atmospheric effect seen in the screenshots: fortress glows warmly while darkness crowds in.
- **Per-torch independent flicker** (`src/Game.ts`): Each torch light and flame sprite now gets
  a unique `flickerPhase = Math.random() * PI*2` stored in `userData` at creation. The flicker
  loop uses this phase offset for both the `PointLight` intensity and the `Sprite` scale, adding
  a third harmonic (19.7 Hz) for organic crackle. Previously all torches pulsed in perfect
  unison; now each one has its own rhythm.

**Notes:**
- Started session fresh (no AUTOPROGRESS). Reset to remote `auto-iterate` (many prior sessions
  already done). First attempt at atlas upgrade was redundant — remote already had 32×32 2-row.
- Switched to night fog + torch flicker as focused, genuinely-new improvements.
- TypeScript compile clean. Screenshots verify atmospheric night effect working.

**Ideas for next time:**
- Chicken wing flap: `userData.flapTimer` countdown in `PassiveMob` — WAIT, already done
- Skeleton arrow trail density: bump `isBolt=true` spawn rate from 45% to 70% in
  `spawnArrowTrail` for heavier crossbow feel
- Goblin death shriek: short high-pitched audio cue on goblin despawn
- Shadow normalBias: add `sunLight.shadow.normalBias = 0.02` to reduce peter-panning on cobble
- Campfire/bonfire block: decorative block with animated fire sprite and warm PointLight
- Player shadow blob: flat CircleGeometry under player feet that scales/fades with jump height
- TNT countdown display: show remaining seconds as floating text above primed TNT

---

## 2026-06-02 — Emissive eye glow on zombie, orc, and troll enemies

**What was done:**
- **Zombie emissive eyes** (`src/Enemy.ts`): Added two `BoxGeometry(0.09, 0.05, 0.01)` eye
  patches at `(±0.11, 1.30, 0.22)` group-local with `MeshLambertMaterial(emissive: 0x55aa10,
  emissiveIntensity: 0.35)` — sickly yellow-green matching undead look.
- **Orc emissive eyes** (`src/Enemy.ts`): Added two `BoxGeometry(0.10, 0.04, 0.01)` narrow
  slits at `(±0.10, 1.29, 0.22)` with `emissive: 0xff3300, emissiveIntensity: 0.6` — burning
  orange-red anger, matching existing red pupils in the orc face texture.
- **Troll emissive eyes** (`src/Enemy.ts`): Added two `BoxGeometry(0.09, 0.07, 0.01)` patches
  at `(±0.11, 1.26, 0.22)` with `emissive: 0xffaa00, emissiveIntensity: 0.55` — amber beast
  eyes, matching existing yellow eyes in the troll face texture.
- Verified at night: pairs of glowing dots visible at distance — "eyes in the dark" effect
  confirmed working via screenshots. Matches pattern of existing golem and troll-king eyes.
- TypeScript compile clean. Dev server ran on port 5175.

**Notes:**
- Session started by orienting on git log + AUTOPROGRESS.md. Remote `auto-iterate` branch was
  1 commit ahead (lava light pulse session). Reset hard to remote, then built on top of it.
- The atlas expansion I drafted from scratch was made redundant by the remote branch (which
  already had a 32-tile 2-row 32×32 atlas). Switched focus to the enemy eye glow suggestion
  from the previous session's ideas list.

**Ideas for next time:**
- Chicken wing flap: `userData.flapTimer` countdown in `PassiveMob`; rotate wing pivots ±0.5
  rad over 0.15 s when flapTimer > 0; retrigger on random 2–4 s interval
- Skeleton arrow trail density: bump `isBolt=true` spawn rate from 45% to 70% in
  `spawnArrowTrail` for heavier crossbow feel
- Night torch fog: when `ambientInt < 0.2`, tighten `fog.far` from 130 to ~80 to make dark
  areas away from torches feel more threatening
- Shadow bias tuning: `shadow.bias = -0.0008` on ground surfaces to reduce peter-panning
- Goblin death shriek: short high-pitched audio cue on goblin despawn (complement existing
  `skeleton_death` sound already in the AudioManager)

---

## 2026-06-02 — Lava light pulse + water sky reflection + goblin miner hard hat

**What was done:**
- **Lava PointLight pulse** (`src/Game.ts`, `src/Map.ts`): Added `_lavaGlow` private field to
  `VoxelWorld` — stored during `updateFluidAnimation` at the moment `lavaMat.emissiveIntensity`
  is written. Exposed as a `lavaGlow` getter (also forwarded through `GameMap`). In `Game.ts`,
  after the torch-flicker block, sync all `lavaLights` intensity to `1.8 + glow * 1.4`
  (range ~2.2–2.9) so the pool of orange light around each lava block breathes with the
  bubbling emissive — no extra computation needed since the formula already runs.
- **Water surface sky reflection** (`src/Map.ts`, `src/Game.ts`): Added `setWaterSkyTint(r,g,b,
  ambientInt)` on `VoxelWorld` (and forwarded on `GameMap`). Blend factor scales 0→0.4 as
  `ambientInt` rises above 0.35 — fully zero at night. Called from `Game.ts` every frame with
  `scene.scene.background` RGB and `scene.daylight`. Dawn ponds glow orange-pink; noon water
  is deep sky-blue; night returns to dark base hue.
- **Goblin miner hard hat** (`src/Enemy.ts`): In the `type === "goblin_miner"` block of
  `buildHumanoidMesh`, added three `BoxGeometry` pieces — wide brim (0.54×0.05×0.54 at y=1.475),
  dome (0.40×0.17×0.40 at y=1.565), and front visor extension (0.54×0.04×0.12 at y=1.468,
  z=−0.33) — all in `0xffcc00` yellow with subtle emissive. Makes goblin miners immediately
  recognisable as the wall-digging threat at a glance.

**Notes on this session:**
- Found `auto-iterate` branch had 8 commits ahead of `main` with many prior improvements already
  done: 32-tile 2-row atlas, lava hotspot animation, rain wetness shader, flora/wheat wind sway,
  moon phases, torch PointLights, war banner, per-enemy hue, biome flora filtering.
- TypeScript compile clean. Dev server ran on port 5175; screenshots verified rendering.

**Ideas for next time:**
- Chicken wing flap: `userData.flapTimer` countdown in PassiveMob; rotate wing pivots ±0.5 rad
  over 0.15 s when flapTimer > 0; retrigger on random 2–4 s interval
- Skeleton arrow trail: bump bolt `spawnArrowTrail` spawn rate from 45% to 70% for heavier feel
- Night torch fog: at night when `ambientInt < 0.2`, tighten fog `far` from 130 to 80 outside
  torch radius — areas away from light feel darker and more threatening
- Orc/zombie emissive eyes: small red emissive eye meshes on zombie and orc (copy from golem)
- Shadow bias tuning: current `shadow.bias` may cause peter-panning on cobblestone walls —
  experiment with `bias = -0.0008` for ground and `0.0` for walls

---

## 2026-06-01 — Farmland moist-soil tint + crossbow nocked bolt

**What was done:**
- **Farmland vertex tint** (`src/Map.ts`): After the lava/fire emissive boost line in
  `rebuildChunkMesh`, added a vertex-color multiplier for `id === "farmland"` top faces
  (`f.n[1] > 0`): `fr *= 0.60; fg *= 0.54; fb *= 0.58`. This darkens tilled soil by ~40%
  with a slightly cool, earthy tone — making farmland clearly distinguishable from adjacent
  dirt blocks without requiring a new atlas tile slot. All 32 existing tile slots are occupied
  so atlas expansion was not an option.
- **Crossbow nocked bolt** (`src/SceneManager.ts`): Added 4 BoxGeometry pieces to
  `buildCrossbowMesh()` just before the final `g.position.set` call — a dark wooden shaft
  (0.012×0.012×0.190, `0x2a1a08`) centered on the rail at y=0.317, a grey metal tip
  (0.016×0.016×0.022, `0x666666`) at the forward end, and two perpendicular red-orange
  fletching fins (0.030×0.007×0.038 horizontal + 0.007×0.030×0.038 vertical, `0xcc4422`)
  at the rear end. The bolt sits exactly on the existing rail geometry (y=0.317 matches rail
  y-center) so it looks nocked and ready to fire.

**Notes on this session:**
- TypeScript compile clean (`npx tsc -p tsconfig.emit.json` zero errors).
- Farmland tinting uses the existing biome-tint infrastructure; the multiplier runs after
  `blockBiomeTint` so biome variation is preserved and further darkened for farmland.

**Ideas for next time:**
- Skeleton arrow trail density: `isBolt=true` particles in `spawnArrowTrail` currently spawn
  at 45% chance — could bump to 70% for bolts to make the crossbow feel heavier
- Lava ambient light pulse: add a `PointLight` above each lava-containing chunk that syncs
  its intensity to the existing `_lavaEmissivePulse` value in `updateFluidAnimation`
- Depth-of-field vignette: `armScene` camera renders the held-item; could overlay a radial
  blur at screen edges by rendering a second fullscreen quad in `renderArm` using canvas 2D
  `radialGradient` with a low-opacity dark ring
- Water surface reflection tint: during midday (ambient > 0.8), multiply water top-face
  vertex colors by a sky-blue tint to simulate reflected sky light
- Goblin miner hard-hat: add a yellow `BoxGeometry` helmet prop on the miner goblin's head
  in `buildGoblinMesh` (check the type name when building to conditionally add the hat)

---

## 2026-06-01 — Moon corona glow + animated lava canvas hotspots

**What was done:**
- **Moon corona glow** (`src/SceneManager.ts`): Added a `RingGeometry(7.5, 22, 32)`
  `MeshBasicMaterial` with `AdditiveBlending` and cool blue-white (#aaccff) as a third
  element returned by `buildMoon()`. In `updateDayNight()` its opacity is driven by
  `nightness * moonFullness * 0.28` where `moonFullness = |1 - moonPhase * 2|` — full moon
  gets the brightest ring, new moon has no ring at all. Billboards toward the camera every
  frame, positioned 0.3 units in front of the moon disc to avoid z-fighting.
- **Animated lava hotspots** (`src/Map.ts`): Added `_lavaHotTimer` and `_lavaOrigData`
  (ImageData snapshot taken at VoxelWorld construction time). Every 0.13 s inside
  `updateFluidAnimation()`: restores original lava canvas pixels via `ctx.putImageData`,
  then splats 4 random 2×2 yellow-white hotspot blobs with a 1×1 bright center. Sets
  `lavaMat.map!.needsUpdate = true` to upload the updated canvas to the GPU each tick.
  Complements the existing UV scroll and emissive pulse with pixel-level "rising bubble"
  animation visible on the lava surface top faces.

**Notes on this session:**
- Remote `auto-iterate` branch was 10 commits ahead; reset `--hard` to origin before
  making changes. The existing codebase already had: moon phases, sun glow, sky dome
  gradient, GPU wind sway, biome tinting, torch PointLights, rain puddles, war banners,
  per-enemy hue variation, and many more visual features.
- TypeScript compile clean.

**Ideas for next time:**
- Chicken wing flap: add `userData.flapTimer` countdown in PassiveMob; rotate wing pivots
  ±0.5 rad over 0.15 s when flapTimer > 0; retrigger on random 2–4 s interval
- Troll King crown: gold box-geometry crown (5 rectangular spike boxes in a ring) on head
- Crossbow bolt nocked in rail: thin dark box along rail when crossbow is active item
- Lava ambient light: small orange PointLight above each lava chunk that pulses with the
  emissive to cast warm light on nearby blocks
- Depth-of-field vignette: subtle radial blur effect in armScene at screen edges

---

## 2026-06-01 — Rain puddle darkening via GPU wetness shader

**What was done:**
- Refactored `VoxelWorld` chunk material from per-chunk allocations to a single shared
  `_chunkMat` (`MeshLambertMaterial`) with an `onBeforeCompile` GLSL injection.
- The injected vertex-shader snippet reads a `uWetness` uniform (0→1) and — for
  top-facing geometry (`normal.y > 0`) — darkens vertex colours by up to 28% and blends
  them toward a cool blue-gray `vec3(0.34, 0.39, 0.46)` by up to 10%.
- Added `VoxelWorld.setWetness(t)` public method; `Game.ts` calls it every frame after
  the existing `setWeatherIntensity` call, passing `weather.intensity` directly.
- Sharing the material also removes ~4 KB of per-chunk `MeshLambertMaterial` allocations
  and their subsequent `dispose()` calls during chunk rebuilds — minor GC win.
- Visually: during rain, all top-facing block surfaces (cobblestone floor, grass, sand,
  stone roofs) become noticeably darker and slightly cool-toned. No chunk rebuilds needed —
  the uniform is updated once per frame.

**Ideas for next time:**
- Animated lava hotspot: per-frame shift random pixels in the lava CanvasTexture slightly
  brighter/darker (±20%) to simulate bubbling. Only update the subset near the camera.
- Particle trail on skeleton/player arrows already has `spawnArrowTrail` called; consider
  increasing trail density for bolts (isBolt=true) to make crossbow feel heavier.
- Fog of war / shadow volumes: at night, areas far from torches get extra fog darkening
  (multiply fog `near`/`far` by 0.6 in torch-free radius). Already have torch positions.
- Depth-of-field post effect: blur via MRT + convolution when looking far (scoped rifle view).
- Moon phase glow: add an emissive corona sphere around the moon that scales with moon phase
  (full moon = large soft bloom, new moon = no corona).

---

## 2026-06-01 — Uruk Captain animated war banner

**What was done:**
- Added an animated war banner to the Uruk Captain (`src/Enemy.ts`): wooden pole (1.55 units
  tall) with a crossbar and gold finial cap on its back, plus a `bannerpivot` Object3D holding
  dark red cloth (0.32×0.46, `DoubleSide`) with a gold eye-rune emblem (two overlapping BoxGeometry
  quads) and dark border strips at top/bottom.
- `animateLegs()` traverse now handles `c.name === "bannerpivot"`: dual-frequency sinusoid
  rotation in Z (0.9 Hz + 1.7 Hz) and single in Y (0.5 Hz) makes the cloth ripple like wind.
- The banner makes the Uruk Captain visually distinct at range — players identify the dangerous
  unit before it reaches the wall.

**Ideas for next time:**
- Rain puddle darkening: when weather intensity > 0.5, rebuild nearby chunk top-face vertex
  colors with -12% brightness for stone/cobblestone/dirt blocks
- Troll King crown: gold box-geometry crown (5 rectangular spikes in a ring) on `buildTrollKingMesh`
- Torch point lights: add THREE.PointLight near placed torch blocks for warm radius glow
- Animated lava hotspot: per-frame randomly brighten/darken bright pixels in the lava CanvasTexture

---

## 2026-06-01 — Per-enemy hue variation + biome-filtered flora

**What was done:**
- **Enemy hue variation** (`src/Enemy.ts`): goblin, goblin_miner, orc, and zombie meshes now
  receive a deterministic ±10% HSL hue shift seeded by their unique enemy ID. Every wave the
  goblins range from yellow-green to teal-green with no two individuals identical. Zombies
  additionally get ±5% lightness variation (fresh vs decomposed). Canvas face/body textures
  are skipped via `mat.map` check so painted features stay crisp.
- **Biome-filtered flora** (`src/Map.ts`): taiga-biome grass blocks now only spawn flora types
  0 (tall grass) and 1 (fern/shrub) — no dandelions or poppies. Forest biome is unchanged
  (all 4 types). Desert already produces no grass flora since surfaces are sand.

**Ideas for next time:**
- Moon phases: cycle moon texture through 8 phases over 8 game-days using dayNumber % 8 to
  pick one of 8 pre-rendered crescent silhouettes drawn on the moon CanvasTexture
- Rain puddle darkening: when weather intensity > 0.5, rebuild nearby chunk top-face vertex
  colors with -12% brightness for stone/cobblestone/dirt blocks
- Chicken wing flap: `userData.flapTimer` countdown in PassiveMob, rotate wing pivots ±0.5 rad
  over 0.15 s when flapTimer > 0; retrigger on random 2–4 s interval
- Troll/uruk_captain emissive eyes: add small emissive red eye meshes in buildUrukCaptainMesh
  and buildTrollKingMesh (already have a golem eye pattern to copy from)
- Particle trail on arrows: in Projectile.ts update loop, spawn 1-2 tiny smoke/dust quads
  behind the arrow position each frame while it's airborne

---

## 2026-06-01 — Wheat wind sway (GPU-side vertex displacement for crops)

**What was done:**
- Extended the `onBeforeCompile` wind-sway technique (already applied to flora) to wheat crops.
- All four wheat growth stages (sprout → ready) now bend gently in the wind on the GPU.
- Parameters tuned to feel distinct from nearby flora: slower base speed (0.85× vs 1.1×), lower
  tip amplitude (0.038 vs 0.055), different spatial phase (1.91×x + 2.63×z vs 1.73/2.31) so
  crops sway out-of-sync with surrounding grass — natural-looking variation across the field.
- `makeWheatMaterial()` now returns `{mat, uniforms}` matching `makeFloraMaterial()`. The
  `_wheatWindUniforms.uTime` is advanced inside `updateFluidAnimation` alongside flora — zero
  additional call sites needed.
- Confirmed via dev-server screenshots: water animations, torch glow, puffy clouds, farmland
  wheat sprites, wood-grain textures all render correctly with no regressions.

**Ideas for next time:**
- Moon phases: cycle the moon through 8 shapes over 8 game-days by updating a shader uniform
  that masks a disc on a fullscreen quad, giving each night a distinct moon silhouette.
- Rain puddle darkening: in `setWeatherIntensity`, loop over the 4 closest chunks to the player
  and reduce top-face vertex-color brightness by 12% for dirt/stone when rain is heavy.
- Biome-filtered flora: pass `biome` to `addFloraQuad` and for desert use only type-2 (dead
  grass) + skip flowers; for taiga use fern (type-1) and fewer sprites per chunk.
- Chicken flap: add `userData.flapTimer` to each chicken group in PassiveMob; on countdown,
  rotate the wing pivots ±0.5 rad over 0.15 s using a lerp in `updateMobs`.
- Enemy visual variety: randomise a ±10% hue shift on goblin body color using HSL, so no two
  goblins look identical; apply the same trick to zombie skin tone.
- Crossbow viewmodel: give the crossbow its own T-shaped geometry in `SceneManager` (separate
  branch in `buildItemMesh`) with a dark stock, lighter rail, and thin string line.

## 2026-05-31 — Flora wind sway (GPU-side vertex displacement for grass/flowers)

**What was done:**
- Added GPU-side wind sway to all terrain flora (grass blades, ferns, dandelions, poppies).
- Uses `MeshLambertMaterial.onBeforeCompile` to inject a custom GLSL snippet into Three.js's
  `begin_vertex` hook — no JS per-frame vertex updates, runs entirely on GPU.
- Wind displacement scales with `uv.y` (0 at root, 1 at tip) so plants bend from their tops
  while remaining rooted at the base — physically correct "flagpole" sway.
- Phase = `worldX * 1.73 + worldZ * 2.31 + time * 1.1`, giving each plant a slightly different
  oscillation so nearby flora sways out of sync rather than in lockstep.
- Primary sway is in X (sin), secondary sway in Z at 0.71× frequency for natural-looking motion.
- Max tip displacement ≈ ±5.5cm in X, ±3cm in Z — subtle and wind-speed realistic.
- `_floraWindUniforms.uTime` is advanced each frame by piggybacking on the existing
  `updateFluidAnimation(dt)` call — zero additional call sites required.

**Ideas for next time:**
- Wheat sway: apply the same `onBeforeCompile` wind trick to `wheatMat` so growing crops also
  sway in the wind (possibly at a slightly lower amplitude than tall grass).
- Biome-filtered flora types: taiga chunks spawn fewer flowers and more fern types; desert gets
  sparse flora only in transition zones. Currently all biomes use the same 4-type pool.
- Chicken idle peck: `group.userData.idleTimer` countdown; on expiry rotate `headGroup` forward
  −0.4 rad then spring back over 0.3s — piggyback on `updateMobs()` dt loop in PassiveMob.ts.
- Moon phase: each new game-day offset the shadow disc (`moonShadow.position.x += 0.5`) to cycle
  through 8 phases over 8 days; reset at day 9.
- Rain puddle darkening: in `rebuildChunkMesh` read `WeatherSystem.intensity` and slightly reduce
  grass/dirt face brightness for wet-ground appearance during rain.

## 2026-05-31 — Terrain flora system (cross-plane grass/flower sprites)

**What was done:**
- Added `floraMesh: THREE.Mesh | null` to the `Chunk` class alongside existing `wheatMesh`.
- Added `floraMat: THREE.MeshLambertMaterial` to `VoxelWorld` — created once via new `makeFloraMaterial()`.
- `makeFloraMaterial()` generates a 4-column × 32px tall canvas sprite sheet with pixel-art sprites:
  - **Type 0**: Tall grass — three overlapping blades with natural bend at the tips
  - **Type 1**: Short fern/bush — radial fronds spreading from centre stem, 5 layers
  - **Type 2**: Dandelion — round yellow flower head on green stem with side leaves
  - **Type 3**: Red poppy — red petals with dark centre on green stem with leaves
- In `rebuildChunkMesh`, after the main block scan loop: grass blocks with air above are checked with a deterministic hash — ~33% get flora, hash selects which of the 4 types.
- Flora is rendered as cross-plane cross geometry (two quads at 90°, same approach as wheat).
- Material uses `alphaTest: 0.4` and `DoubleSide` for crisp sprite cutout visible from all angles.
- Flora is purely decorative (not a BlockId, no interaction), so block breaking isn't affected.
- Note: This session initially generated a local commit expanding the block atlas from 16→32 tiles, but the remote `auto-iterate` already had a more advanced 2-row 32×32 atlas — local commit was discarded and the remote state was adopted instead.

**Ideas for next time:**
- Chicken pecking animation: bob head forward/back every 3–5s when idle (needs headGroup pivot refactor in PassiveMob.ts)
- Snow biome flora: replace flowers with snow/ice sprites for snowy areas; desert biome gets cactus flower sprites
- Biome-filtered flora: check biome type at spawn position and pick appropriate flora types (green plains → current; taiga → ferns; meadow → more flowers)
- Wind sway animation: update flora geometry UV offset each frame (or jitter vertex Y) for grass sway effect
- Idle mob head turn: add headGroup pivot to passive mob buildMesh so the head can rotate independently
- Animated lava canvas hotspot: store lava ctx, every 0.15s putImageData blob updates for pixel-level bubbling

## 2026-05-31 — Near-death vignette (pulsing red screen edge at low HP)

**What was done:**
- Added a `near-death-vignette` element permanently in the DOM (`z-index: 55`, below damage flash at 60).
- Element uses `radial-gradient(ellipse at center, transparent 50%, rgba(200,0,0,0.88) 100%)` — a red ring that darkens screen edges without obscuring the crosshair or center gameplay.
- `updatePlayerHealth()` (called every frame) drives opacity via `performance.now()`: when HP ≤ 30%, a cosine-wave pulse powers up. Rate increases linearly from 0.8 Hz (at exactly 30%) to 2.8 Hz (at 10% or below), giving an escalating "heartbeat" urgency. Max opacity scales from 0.30 at threshold to 0.85 near death.
- Above 30% HP the element stays at `opacity: 0` — zero overhead, no flicker.

**Ideas for next time:**
- Chicken pecking animation: bob head forward/back every 3–5s when idle
- Crossbow bolt nocked in the rail: add thin dark mesh along rail when crossbow is active item
- Moon phase visual: shift shadow-disc offset on moon mesh each game-day
- Rain puddle darkening: darken dirt/stone top-face vertex colors in rain chunks
- Animated lava hotspot (pixel-level): every 0.15s `putImageData` 3–4 glowing blobs on lava canvas tile

## 2026-05-31 — Sheep wool color variety + animated lava pulsing glow

**What was done:**
- **Sheep color variety**: Added `SHEEP_WOOL_COLORS` const array of 8 colors (white, tan, gray, brown, black, red, blue, yellow) to `PassiveMob.ts`. `spawn()` picks a random color for each sheep; `buildMesh()` gained a `woolColor` parameter wired to both the body wool mesh AND the ear flap material so ears match the fleece. Herds now look naturally varied.
- **Animated lava**: Added UV micro-wobble to lava scroll (two overlapping sin waves at 0.38/0.29 Hz) so the surface shifts irregularly instead of linearly. Added three-frequency pulsing emissive (2.10/1.30/0.71 Hz) that ranges from intensity 0.28–0.78 for an irregular "bubbling breathing" look. Added 1.73 Hz color cycle shifting between deep orange and yellow-orange at peaks.
- Note: the session also initially attempted a block texture atlas expansion, but the remote `auto-iterate` branch had already done this (commits `cefb020` and `5815121`) in a more complete 2-row 32×32 format — the local commit was rebased away.

**Ideas for next time:**
- Chicken pecking animation: bob head forward/back every 3–5s when idle (use `group.userData.idleTimer`, trigger a brief `headPivot` rotation)
- Animated lava canvas hotspot: store lava canvas context, every 0.15s `putImageData` the base + redraw 3–4 glowing blobs at random positions for pixel-level bubbling (complements the emissive pulse)
- Crossbow bolt nocked in the rail: add a thin dark box along the rail when crossbow is the active item
- Moon phase visual: change the shadow-disc offset on the moon mesh each game-day for night variety
- Sheep drop wool with matching color (currently always drops default "wool" item regardless of color — could set a colored wool drop matching the spawn color)
- Rain puddle darkening: set dirty flag on affected chunks and slightly darken dirt/stone top-face vertex colors when rain is active

## 2026-05-31 — Enemy weapon-arm parenting (weapons swing with arm animation)

**What was done:**
- Reparented all enemy weapons from the group root to their respective right-arm pivot objects so weapons swing naturally with the walking animation:
  - **Uruk Captain**: greatsword (grip + crossguard + blade + tip) moved from `group` to `armpivot_1` (right arm) with pivot-local offsets recalculated from world positions
  - **Troll King**: war club + club head moved from `group` to `armpivot_1` with pivot-local offsets
  - **Orc / Zombie**: wooden club moved from `group` to `armpivot_1` (saved `humanoidRightArmPivot` reference in the arm construction loop)
- Updated `animateLegs()` to look up the enemy type and apply a base forward rotation to weapon-holding arms:
  - Boss right arms (uruk_captain, troll_king): −0.55 rad base (arm raised forward in combat pose)
  - Orc/zombie right arm: −0.28 rad base (slight raised threat pose)
  - All arms then swing ±0.45 rad on top of the base angle

**Notes on this session:**
- TypeScript compile clean (`npx tsc -p tsconfig.emit.json` zero errors)
- All weapon mesh positions recalculated as pivot-local offsets (world_pos − pivot_pos)

**Ideas for next time:**
- Sheep color variety: randomly pick one of 8 wool colors (white, tan, gray, brown, black, red, blue, yellow) at spawn
- Animated lava hotspot: randomly update bright pixel positions in the lava canvas each second for a bubbling effect
- Rain puddle darkening: gradually darken dirt/stone top-face vertex colors when weather is rainy
- Chicken pecking animation: bob head forward/back every few seconds when idle
- Crossbow bolt nocked in the rail: thin dark box along the rail when crossbow is held

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

---

## 2026-06-03 — Arm walk-bob + wave-start exposure pulse

**What was done:**
- **Arm walk-bob** (`src/SceneManager.ts`): The first-person arm was previously completely static between swings. Added `_armBobTime`, `_armBobSpeed`, and `_armBobLastPos` fields. Each frame `renderArm()` measures camera XZ displacement to derive movement speed, then smoothly ramps a bob intensity (0→1) with a 12×dt lerp. The bob applies: Y = sin(bobTime) × 0.022, X-sway = cos(bobTime×0.5) × 0.009, and a subtle roll tilt of cos(bobTime×0.5) × 0.04 rad — all scaled by movement intensity. Bob is also suppressed during weapon swings so animations don't compete. This makes the first-person view feel dramatically more alive during normal play.
- **Wave-start exposure pulse** (`src/SceneManager.ts` + `src/Game.ts`): Added `triggerWavePulse()` to SceneManager. It fires a 550 ms tone-mapping exposure envelope: 0–25 % ramps from ×1.0 to ×1.5 (bright flash), 25–45 % drops to ×0.7 (dark dip), 45–100 % recovers to ×1.0. `startNextWave()` in Game.ts calls `scene.triggerWavePulse()` alongside the wave_start audio, giving each wave a cinematic "lens-adjust" beat.
- **tsconfig fix**: Changed `moduleResolution` from deprecated `"Node"` to `"bundler"` so `npm run dev` (which runs `tsc && node scripts/dev.mjs`) exits cleanly on TypeScript 6.

**Notes:**
- Started fresh from remote `auto-iterate` which already had 32-tile atlas, torch point lights, rain streaks, shadow blobs, lava/water animations, wind sway, biome tints, sky dome, enemy eye glow, footprint decals, TNT countdown sprites, and pixel-art item sprites.
- TypeScript compiles clean. Game loads without JS errors (verified via Playwright page inspect).

**Ideas for next time:**
- Enemy death flash: at the moment `hp ≤ 0`, do a more dramatic white emissive (1.0 → 0 over 0.2 s) separate from the per-hit `flashHit` — currently the dying tumble animation starts immediately, a flash burst would punctuate it
- Campfire decorative block: cross-pane fire Sprite + `PointLight(0xff4400, 1.5, 3)`, could be pre-built in the fortress interior or craftable
- Moon phase visual: update moon canvas texture each game-day to show crescent/half/full cycle
- Leaves emissive at night: traverse leaf blocks near player, add tiny emissive so the canopy glows faintly after dark
- Boss war-cry shockwave ring: expand + fade `RingGeometry` particle at the moment the boss activates war cry
- Biome ambient sound: different ambient drone/chirp audio per biome (desert wind vs taiga crickets vs forest birds)

---

## 2026-06-03 — Enemy death flash (killing-blow emissive burst)

**What was done:**
- Added `deathFlashTimer?: number` to `EnemyState` in `src/types.ts`.
- Split the damage response in `Enemy.ts` into two paths:
  - **Non-lethal hits** (`state.health > 0` after damage): existing `flashHit()` path — 100ms white emissive via setTimeout, unchanged.
  - **Killing blow** (`state.health <= 0`): new `flashDeath()` path — immediately sets all mesh materials to `emissive: 0xffffff, emissiveIntensity: 1.3` without a setTimeout, so it persists until the dying-update clears it.
- Added `flashDeath(id)` private method: traverses the enemy group and sets max-intensity white emissive.
- In the dying-update block, a new sub-tick fades the death flash: `deathFlashTimer` counts down from 0.22s, and each frame `emissiveIntensity = (t / 0.22) × 1.3` — producing a smooth white-to-dark fade as the enemy tumbles and shrinks.
- The result: every enemy killed produces a bright white flash that takes ~0.22s to fade out, timed so it coincides with the first half of the 0.5s tumble animation. Much more visceral than just the spin+shrink.

**Notes:**
- Oriented fresh session: remote `auto-iterate` was ahead. Reset to it. Atlas expansion was already done (32 tiles, 2-row, 32×32 px each). Picked death flash since it was listed #1 in the most recent session's "Ideas for next time."
- `tsconfig.emit.json` already uses `moduleResolution: bundler` — `npm run dev` exits cleanly.
- TypeScript compiles clean. No JS errors in browser (verified via Playwright headless).

**Ideas for next time:**
- Campfire decorative block: cross-pane fire Sprite + `PointLight(0xff4400, 1.5, 3)`, could be pre-built in the fortress interior (mentioned in 3 previous sessions — high priority)
- Moon phase visual: change the shadow-disc offset each game-day for crescent/half/full visual variety
- Leaves emissive at night: traverse leaf blocks near player, add tiny emissive so the canopy glows faintly after dark
- Boss war-cry shockwave ring: expand + fade `RingGeometry` particle when uruk_captain activates war cry
- Biome ambient sound: distinct ambient audio per biome (desert wind, taiga crickets, forest birds)
- Hit flash colour tint: change non-lethal hit flash from white to the weapon's colour (sword=red, magic=purple) for feedback differentiation
