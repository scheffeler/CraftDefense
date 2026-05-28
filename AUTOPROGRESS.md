# CraftDefense Auto-Iteration Progress

## 2026-05-28 — Block Texture Atlas Expansion (16→32 tiles)

**What was done:**
- Fixed TypeScript deprecation error (`moduleResolution=Node10`) by adding `"ignoreDeprecations": "5.0"` to tsconfig.json — this was blocking the dev server from starting.
- Expanded block texture atlas from 16 to 32 tiles (canvas grows from 256×16px to 512×16px).
- Updated UV calculation to use module-level `ATLAS_TILES = 32` constant (was hardcoded to `/16`).
- Added 9 new pixel-art block textures (indices 16–24) for blocks that previously rendered as plain vertex color:
  - **Gravel** (16): gray base with rounded pebble highlights
  - **Snow** (17): white with subtle sparkle dots
  - **Glass** (18): light blue with corner highlights and cross reflection
  - **Iron Block** (19): polished silver with 4-quadrant grid lines
  - **Crafting Table side** (20): planks with divider lines and tool silhouettes
  - **Crafting Table top** (21): 2×2 crafting slot grid
  - **Furnace side** (22): stone with glowing orange/yellow door opening
  - **Chest side** (23): warm oak with iron bands and golden latch
  - **Chest top** (24): oak with iron-band cross and knob

**Result:** Most player-facing and terrain blocks now have distinctive, readable pixel-art textures instead of flat color. Especially impactful: crafting table, furnace, and chest are now immediately recognizable.

**Ideas for next run:**
- Add textures for obsidian (glossy dark purple), bookshelf (book spines), enchanting table (red/dark)
- Water: add animated UV scrolling for a wave effect (requires per-frame texture update or shader)
- Improve grass: add seasonal tint or biome-specific saturation
- Consider upgrading chunk material from MeshLambertMaterial to MeshStandardMaterial for PBR reflections on iron/diamond blocks
- Add torch particle glow using PointLight near each torch position (currently just orange colored box)
- Improve cloud shapes: use rounded BoxGeometry or merged cubes instead of flat boxes
- The sky could have a gradient (horizon lighter than zenith) — currently solid color
- Consider adding a subtle vignette post-processing effect
