# CraftDefense Auto-Progress Log

## 2026-05-30 — Block Texture Atlas Expansion (32 tiles)

**What was done:**  
Expanded the voxel block texture atlas from 16 tiles to 32 tiles in `src/Map.ts`. Previously, 16 blocks (glass, obsidian, water, torch, chest, gravel, iron_block, crafting_table, furnace, snow, cactus, bookshelf, enchanting_table, farmland) all fell through to the generic white tile (#13) and relied purely on vertex colors — meaning they all looked like solid flat-colored boxes.

Added dedicated 16×16 pixel-art textures for each:
- **Glass** (16): pale blue-gray with darker border frame + pane dividers
- **Obsidian** (17): very dark purple-black with scattered shimmer flecks
- **Water** (18): deep blue with lighter ripple wave pattern
- **Torch** (19): dark background, orange/yellow flame over brown stick
- **Chest top** (20): warm oak grain with gold latch band
- **Chest side** (21): warm oak with visible gold clasp/lock detail
- **Gravel** (22): gray-brown with rounded pebble shapes
- **Iron block** (23): silver with crosshatch grid lines
- **Crafting table top** (24): oak with 3×3 slot grid
- **Crafting table side** (25): planks with "C" mark
- **Furnace front** (26): stone with dark opening + orange glow
- **Snow** (27): white-blue with subtle depth and sparkle dots
- **Cactus** (28): green with center highlight + white spine dots on edges
- **Bookshelf side** (29): oak base with two rows of colorful book spines
- **Enchanting table top** (30): dark purple with glowing rune glyph
- **Farmland** (31): moist brown with horizontal furrow lines

Also updated `getBlockTexIndex` with per-face variants: chest uses top/side textures, crafting table uses top (grid) vs side (plank), furnace uses stone on top and fire-opening on sides, bookshelf uses planks on top and books on sides.

UV calculation updated from hardcoded `/16` to `/ATLAS_TILES` module constant.

**Ideas for next run:**
- Improve enemy visuals: add proper Minecraft-style pixel-art skin textures to goblin/orc/zombie/troll/golem via canvas textures (like the block atlas but for entity UVs)
- Add animated water: update water UV offset each frame for subtle shimmer
- Improve the held-item arm rendering: better sword shape with cross-guard, pickaxe/axe shapes, show block texture on held blocks
- Add more biome-specific block textures: tundra ice block, jungle-specific leaves (darker green)
- Improve particle visuals: use sprite-sheet for more varied particle shapes
- Add ambient occlusion tinting improvement: slightly increase the contrast between lit/shadow faces for more depth
- Consider adding a second atlas row (16 tiles × 16px tall) to support animated tiles (water/lava)
