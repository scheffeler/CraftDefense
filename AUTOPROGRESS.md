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
