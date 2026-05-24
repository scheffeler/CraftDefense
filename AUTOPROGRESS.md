# CraftDefense Auto-Progress Log

## 2026-05-24 — Block Texture Atlas Expansion + Leaf Transparency

**What was done:**
- Expanded the procedural block texture atlas from 16→32 tiles (256→512px wide)
- Added distinct pixel-art textures for 14 previously untextured block types:
  `gravel`, `snow`, `obsidian`, `crafting_table` (side + top), `chest`,
  `farmland` (top), `cactus` (side), `bookshelf`, `enchanting_table` (top),
  `furnace` (top + front with fire glow), `iron_block`, `glass`
- All new textures are procedurally generated in `makeBlockTexture()` using
  the existing seeded RNG + canvas pixel-art approach
- Updated `getBlockTexIndex()` to route blocks to correct tile indices, with
  face-direction awareness (top/side/bottom variants) for crafting table, chest,
  furnace, farmland, bookshelf, cactus
- Updated UV formula to use `TEX_ATLAS_TILES` constant instead of hardcoded `16`
- Added `alphaTest: 0.5` to chunk `MeshLambertMaterial` — leaves now have
  punch-through transparency (gaps visible through leaf canopy)

**Verified:** atlas=512px, alphaTest=0.5 confirmed via Playwright + `__game` API.
TypeScript compiles cleanly (exit 0).

**Ideas for next run:**
- Water transparency: separate opaque vs transparent chunk mesh passes so water
  surfaces render with alpha-blend (currently still opaque blue)
- Animated water texture: subtle UV scroll on water faces each frame
- Better enemy models: zombies/skeletons are basic colored boxes; add head/body/
  arm geometry with skin-toned colors and proper proportions
- Improved first-person hand: add texture detail to the arm mesh (skin tone bands)
  and make sword/tool meshes look more distinct (sword cross-guard, pickaxe shape)
- Torch: currently a yellow vertex-colored block; should be a thin stick with
  flame particle effect at the top
- Particle effects: improve explosion/death particles with more variety
- Better clouds: make cloud shapes more organic (2-3 overlapping boxes per cloud)
  instead of single flat slabs
