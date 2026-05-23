# CraftDefense Auto-Iterate Progress

## 2026-05-23 — Improved arm mesh, sword viewmodel, and puffy clouds

**What was done:**
- Arm mesh: replaced the flat brown box with a pixel-art skin canvas texture (16×16, wave-noise
  grain + wrist crease + top highlight). Six per-face materials with different warm-skin tints
  simulate natural directional shading. Added a dark sleeve cuff element at the upper end of the
  arm that's visible whenever the player is in pointer-lock mode (i.e., always during gameplay).
- Sword viewmodel: wider + flatter blade geometry (0.11×0.32×0.022 vs 0.08×0.28×0.04 before),
  a proper crossguard bar, and a subtle bright edge-highlight strip along the blade spine for a
  shiny metallic feel. Tool head also slightly widened with a pick-tip protrusion.
- Clouds: each cloud rebuilt as a THREE.Group with a flat base slab + two overlapping upper puff
  boxes at different offsets/heights, giving recognizable cumulus silhouettes instead of flat slabs.

**Files changed:** `src/SceneManager.ts`

**Ideas for next run:**
- Torch mesh improvement: replace the current opaque cube torches with a cross-billboard flame
  quad (alpha-blended sprite) + a small PointLight at the flame tip for realistic warm glow
- Enemy face texture detail: procedural canvas textures for zombie (green mottled face,
  X-stitched mouth) and goblin (pointed ears via box protrusions, sharp tooth hints)
- Better held-item block: when holding a block, use a multi-material BoxGeometry that shows
  the block's actual atlas texture faces instead of flat vertex-color tint
- Ground-level fog: add a thin FogExp2-style volumetric layer at y=6–8 for atmosphere
- Biome boundary visual blend: noise-based fade at forest/desert/taiga transitions
- Star twinkle: animate PointsMaterial size with a slow sine wave for atmospheric shimmer

## 2026-05-23 — Animated water and lava surfaces

**What was done:**
- Added separate animated fluid meshes for water and lava block top faces.
  - Water: 32×32 tileable canvas texture with deep-blue base (#1a5fa8) and
    diagonal ripple lines; UV offset scrolls diagonally each frame for a
    flowing-water effect.
  - Lava: 32×32 tileable canvas with dark-red base, bright molten blob hotspots,
    and dark cracking veins; emissive glow (`emissive: 0xff3300`, intensity 0.55);
    UV offset scrolls slowly counter-diagonally.
- Water/lava top faces are redirected from the main chunk mesh to dedicated
  per-chunk `waterMesh`/`lavaMesh` objects using a shared animated material.
- `updateFluidAnimation(dt)` added to `VoxelWorld` and exposed via `GameMap`;
  called each frame from `Game.ts` — GPU-side UV scroll, essentially free.
- World-space UVs ensure seamless tiling across adjacent fluid blocks.

**Files changed:** `src/Map.ts`, `src/Game.ts`

**Ideas for next run:**
- Better arm/hand mesh: per-face UV on BoxGeometry with a hand skin texture
  (16×16 pixel-art skin with highlight/shadow bands, held item modeled on top)
- Enemy visual improvements: zombie face texture on the head mesh face, goblin
  ear geometry (two small box protrusions)
- Torch mesh: replace the current cube geometry with a billboard flame quad
  (alpha-blended sprite) + point light at the flame tip
- Cloud improvements: layered semi-transparent planes (3-4 stacked at different
  heights) instead of opaque solid boxes
- Water animation refinement: add a second pass with sine-wave vertex
  displacement on the fluid mesh for a 3D ripple feel (requires ShaderMaterial)
- Biome boundary visual blend: fade vertex colors between biomes using noise

## 2026-05-22 — Block texture atlas expansion + cobblestone improvement

**What was done:**
- Improved cobblestone texture (tile 1): replaced the old 6-blob approach with
  6 clearly defined stone blocks over a dark mortar fill (`#6e6658`), each with
  an inner highlight + shadow edge. Fortress walls now show distinct stone shapes.
- Improved grass top texture (tile 3): added 5 dark clump patches and 5 lighter
  highlight patches over the noise base for more visual variety underfoot.
- Expanded block texture atlas to a 2-row 256×32 canvas with unique tiles 16–31
  covering: furnace, chest, crafting table, obsidian, iron block, glass, water,
  bookshelf, snow, cactus, TNT, gravel, enchanting table, lava, dispenser, and bed.

**Files changed:** `src/Map.ts`

**Ideas for next run:**
- Improve stone (tile 0): add subtle crack lines for a more rocky look
- Improve leaves (tile 9): dithered, semi-transparent look
- Improve sand (tile 5): ripple/dune texture detail
- Better grass side (tile 4): wider 4px green strip, smoother dirt transition
- Animated water/lava: update texture UVs each frame via scroll offset
- Better arm/hand mesh: wider, slightly tapered geometry instead of a plain box
- Enemy and mob visual improvements (geometry, arm animations)
- Sky: volumetric-style layered clouds (semi-transparent stacked planes)

## 2026-05-22 — Stone cracks, grass-side, sand ripples, leaves palette

**What was done:**
- Stone (tile 0): added 3 seeded 2-segment crack lines with faint pixel
  highlights — looks more like natural rock instead of uniform gray noise.
- Grass-side (tile 4): widened green band to 4px, added alternating 1–2px
  grass blade highlights at the top edge, and a fading transition zone (y=4–6).
- Sand (tile 5): added horizontal dune ripple lines every 3px (dark shadow +
  light highlight pair) for subtle wave texture.
- Leaves (tile 9): replaced single brightness-varied green with a 5-color
  palette sampled per pixel — trees now show visible multi-shade variation.
  Added 3 soft highlight blobs for leaf cluster accents.

**Files changed:** `src/Map.ts`

**Ideas for next run:**
- Better arm/hand mesh: wider geometry with a pixel-art skin canvas texture
  (per-face UV on BoxGeometry, 16×16 skin with shading bands)
- Enemy visual improvements: zombie face markings, goblin details
- Animated water: separate water mesh layer with scrolling UV offset
- Dirt texture (tile 2): add subtle pebble/root specks for more ground detail
- Wood side (tile 6): slightly higher contrast grain, maybe a knot detail
- Better torch mesh: billboard flame quad with emissive orange glow particle

## 2026-05-22 — Fixed missing dirt texture + tsconfig moduleResolution

**What was done:**
- Merged atlas expansion changes from parallel run — remote had already done a
  comprehensive 2-row 256×32 atlas expansion.
- Added missing `case "dirt":` to `getBlockTexIndex()` — dirt blocks were
  falling through to the plain white generic tile (index 13) instead of the
  correct dirt texture (index 2). Now both `dirt` and `farmland` use tile 2.
- Fixed pre-existing TypeScript 6.0 build error: `moduleResolution: "Node"` →
  `"Bundler"` in `tsconfig.json` (Vite projects must use Bundler resolution).

**Files changed:** `src/Map.ts`, `tsconfig.json`, `AUTOPROGRESS.md`

**Ideas for next run:**
- Better arm/hand mesh: per-face UV on BoxGeometry with a hand skin texture
- Enemy visual improvements: face markings for zombies, goblin ear details
- Animated water/lava: scrolling UV offset in SceneManager each frame
- Torch mesh: replace box geometry with billboard flame + emissive point light
- Cloud improvements: layered semi-transparent planes instead of opaque boxes
- Biome boundary smoothing: noise blend at forest/desert/taiga borders
