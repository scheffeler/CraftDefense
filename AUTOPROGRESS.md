# CraftDefense Auto-Progress Log

## 2026-05-25 — Block Texture Atlas Expansion (32 tiles)
**What was done:**
- Expanded the block texture atlas from 16 to 32 tiles (256→512px wide)
- Added proper pixel-art textures for 11 block types that previously used a plain white fallback tile with only vertex-color for appearance:
  - **Water** (tile 16): blue with sinusoidal wave ripples and foam highlights
  - **Glass** (tile 17): pale cyan with window-pane grid lines and corner sparkle  
  - **Gravel** (tile 18): mid-gray with highlighted/shadowed pebble shapes
  - **Snow** (tile 19): white with pale-blue shadows and sparkle cross pixels
  - **Obsidian** (tile 20): very dark purple-black with purple gloss streaks
  - **Chest side/front** (tile 21): dark oak wood planks with centered gold latch
  - **Chest top** (tile 22): wood grain with two gold hinges on back edge
  - **Bookshelf** (tile 23): wooden frame with 6 colorful book spines each side
  - **Crafting table top** (tile 24): worn oak with dark cross-groove crafting grid
  - **Cactus side** (tile 25): vivid green with vertical ridge seams and spine tips
  - **Cactus top** (tile 26): green with radiating spoke pattern
  - **Farmland** (tile 27): dark moist soil with horizontal tilled furrows (split from dirt)
- Updated `getBlockTexIndex()` for all new block types; crafting_table now uses planks (8) on sides, wood-grain top (24) on top
- Updated UV generation from `/16` to `/32` to match the wider atlas

**Visual result:** Game renders correctly. Cobblestone fortress walls, snow biome, grass terrain, trees/leaves, and torches all look visually distinct and improved.

**Ideas for next runs:**
- Snow biome spawns right at the player's start position (32, 32) — consider shrinking the snow biome radius or repositioning it so grass is more prominent near spawn
- The water/glass/gravel/snow textures could benefit from larger atlases (32×32 tiles) with more detail
- Add animated water UV scrolling (could use a separate animated material for water blocks)
- The player arm visible in first-person could use better skin/sleeve texture instead of plain brown
- Enemies could have more varied skin patterns (stripe detail, armor highlights)
- Improve the sun/moon visual — sun could be a bright disc with rays instead of a plain sphere
- Trees could have varied leaf shapes — use multiple leaf block variations
- Add subtle parallax on the background sky / distant terrain fog layers
