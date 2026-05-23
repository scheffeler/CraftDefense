# CraftDefense Auto-Progress Log

## 2026-05-23 — Block texture atlas expansion (16 → 32 tiles)

**What was done:**
- Expanded the procedural pixel-art block texture atlas from 16 to 32 tiles (256px → 512px wide).
- Added dedicated 16×16 pixel-art textures for 11 block types that previously rendered as flat vertex-colored cubes:
  - **water** — rippled blue wave pattern (sine-based)
  - **gravel** — gray base with scattered oval pebble shapes
  - **glass** — pale blue frame with bright reflective interior + corner highlights
  - **obsidian** — near-black with scattered purple crystalline flecks
  - **iron_block** — light gray with square panel grid seams (Minecraft-style)
  - **crafting_table** — crafting-grid top (2×2 recessed slots) + plank side
  - **furnace** — stone base on top, lit fire-mouth front (orange glow) on sides
  - **chest** — oak wood with gold latch band across middle
  - **snow** — off-white with icy blue tinge
  - **cactus** — vivid green with vertical ridge stripes + spine dots
- Extracted `ATLAS_TILES = 32` as a module constant (was hardcoded `16` in both `makeBlockTexture` and the UV calculation in `addFace`) so they stay in sync.
- Updated `getBlockTexIndex()` to route all new block types to their tile indices, including direction-aware variants (crafting_table top vs. side, furnace stone top vs. lit front).

**Notes / ideas for next run:**
- **Arm/item meshes** in SceneManager are very basic (colored boxes). Could add sword blade shape, pickaxe geometry, bow shape — making held items more recognizable.
- **Torch** is rendered as a full 1×1×1 cube. Could add a special thin-post geometry for it (requires a separate mesh pass outside the chunk mesher, similar to how wheat would work).
- **Enemy appearance** — enemies are colored boxes. Could add distinct head/body shapes per mob type (zombie vs. skeleton vs. creeper).
- **Sky/cloud improvements** — clouds are flat boxes, could make them multi-part (layered boxes) for a more volumetric look.
- **Animated water** — currently static texture. Could update the UV offset per frame to scroll the water texture, giving the appearance of flowing water.
- **Biome-specific foliage tinting** — grass/leaves could have a different tint per biome (desert: yellow-green, snow: blue-tinted, jungle: vivid green) using vertex colors.
- **Atlas resolution** — currently 16×16 per tile. Could bump to 32×32 for more detail on key blocks.
