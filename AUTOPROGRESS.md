# CraftDefense Auto-Iteration Progress

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
