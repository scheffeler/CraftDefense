# CraftDefense Auto-Iterate Progress

## 2026-05-22 — Block texture atlas expansion + cobblestone improvement

**What was done:**
- Improved cobblestone texture (tile 1): replaced the old 6-blob approach with
  6 clearly defined stone blocks over a dark mortar fill (`#6e6658`), each with
  an inner highlight + shadow edge. Fortress walls now show distinct stone shapes.
- Improved grass top texture (tile 3): added 5 dark clump patches and 5 lighter
  highlight patches over the noise base for more visual variety underfoot.
- The remote auto-iterate branch already had (from a prior run) a full 2-row
  atlas expansion (256×32 canvas) with unique tiles 16–31 covering: furnace,
  chest, crafting table, obsidian, iron block, glass, water, bookshelf, snow,
  cactus, TNT, gravel, enchanting table, lava, dispenser, and bed.

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
