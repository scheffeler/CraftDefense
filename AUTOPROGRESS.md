# CraftDefense Auto-Progress Log

## 2026-05-27
**Expanded block texture atlas from 16 to 38 tiles**

Added distinct pixel-art textures for 22 previously-generic blocks (water, glass, gravel, obsidian, furnace top/side, chest top/front, crafting table top/side, torch, bookshelf, snow, cactus top/side, iron block, enchanting table top/side, wheat stages 0-3). Previously these all fell through to a plain white tile and relied solely on vertex color.

Key details:
- `getBlockTexIndex()` extended with per-block and per-face mappings (e.g. furnace/chest/crafting_table show different textures on top vs sides)
- Atlas width: 16 tiles → 38 tiles (256px → 608px wide)
- UV formula updated from `texIdx/16` to `texIdx/ATLAS_TILES` using a module-level constant
- `tsconfig.json` was clean (no structural changes needed)
- TypeScript compiles with exit 0

**Ideas for next run:**
- Add animated water (update UV offset each frame via a per-tick water material)
- Improve torch rendering: torches should be small billboard sprites or sub-block geometry, not full cube faces
- Add ambient occlusion tinting that respects biome colors (warmer shadows in desert, cooler in taiga)
- Improve sky: add more cloud detail with procedural noise shapes instead of plain boxes
- Enemy visual polish: skeleton and creeper get more detailed procedural skin textures
- Player item rendering in hand: food items, armor pieces, bow
