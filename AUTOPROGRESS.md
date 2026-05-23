# CraftDefense Auto-Iteration Progress

## 2026-05-23 — Expanded Block Texture Atlas (16 → 32 tiles)

**What was done:**
- Doubled the block texture atlas from 16 to 32 tiles (256px → 512px wide)
- Added 16 new procedural pixel-art textures for special/interactive blocks that previously showed as plain vertex-colored cubes:
  - **Furnace**: stone grill pattern (top), stone with orange fire-mouth opening (sides)
  - **Crafting table**: tan planks with 3×3 grid (top), planks with workbench marks (sides)
  - **Chest**: brown wood with iron straps + padlock (front), cross-strap pattern (top)
  - **Glass**: transparent center with light-blue window frame (all faces)
  - **Bookshelf**: two rows of colourful book spines on a planks background
  - **Enchanting table**: dark purple with golden rune circle (top), dark with red gem inlay (sides)
  - **Obsidian**: deep purple-black with diagonal prismatic shimmer streaks
  - **Gravel**: medium gray with rounded pebble highlight/shadow shapes
  - **Snow**: layered white with blue tint and sparkle pixels
  - **Cactus**: medium green with horizontal segment bands and edge spine marks
  - **Water**: blue with diagonal wave pattern and foam highlights
  - **Bed**: red with white pillow region
- Updated `getBlockTexIndex()` to route all these block types to their new tiles
- Updated UV generation from hardcoded `/ 16` to `/ ATLAS_TILES` (module-level constant)
- Added `alphaTest: 0.5` to chunk material → leaves now show actual holes, glass shows window-frame effect

**Files changed:** `src/Map.ts`

**Ideas for next run:**
- Add point lights from torch blocks (THREE.PointLight per torch in scene, orange glow)
- Improve enemy meshes — current enemies are plain box humanoids; add arms, weapon models, more distinct silhouettes
- Add animated water (scroll water texture UV over time in a shader or update every N frames)
- Add more distinct textures: iron_block (metallic grid), wheat stages (cross-shaped billboard), torch (small cylinder with flame particle)
- Add better tree variety: different leaf colors for biomes (snowy white leaves, jungle dark green)
- Particles: add ambient leaf particles floating down near trees
- Add a skybox with stars/moon texture instead of Points geometry
