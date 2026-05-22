# CraftDefense Auto-Iteration Progress

## 2026-05-22 — Block Texture Atlas Expansion (2-Row, 32 Tiles)

**What was done:**
- Expanded the block texture atlas from a single row of 16 tiles (256×16 px) to 2 rows of 16 tiles (256×32 px), adding 16 new tile slots.
- Added hand-crafted 16×16 pixel-art textures for 10 blocks that previously showed as flat vertex-colored generic tiles:
  - **Furnace** (tile 16): Stone base with orange fire grate opening
  - **Chest** (tile 17): Dark wood grain with gold metal trim, lid seam, and clasp
  - **Crafting Table top** (tile 18): Plank base with 3×3 engraved grid
  - **Obsidian** (tile 19): Deep purple-black with faint crystal shimmer inclusions
  - **Iron Block** (tile 20): Smooth silver with subtle grid seams and corner highlights
  - **Glass** (tile 21): Light blue with white frosted border frame and corner glints
  - **Water top** (tile 22): Blue with sine-wave ripple pattern and foam streaks
  - **Bookshelf side** (tile 23): Two rows of 8 colored book spines on a wood frame
  - **Snow** (tile 24): White with subtle cold blue-white noise and sparkle pixels
  - **Cactus** (tile 25): Green with lighter central rib stripe and edge spine dots
  - **TNT** (tile 26): Red with dark cross pattern (preserving previous run's TNT block)
- Updated UV generation in rebuildChunkMesh for proper 2-row atlas sampling.
- Merged with previous run's TNT block addition (was tile 16 in single-row 17-tile atlas).

**Ideas for next time:**
- Animated water: ping-pong between two water frame textures, or animate UV offset per frame.
- Transparent water/glass: separate transparent block meshes into a second draw pass.
- Torch rendering: cross-shaped billboard sprite with a dynamic point light.
- Sky dome: replace flat background Color with a sphere-gradient shader for dramatic sunrises.
- Mob face textures: canvas-drawn face details per mob type (zombie, orc, goblin) rather than plain vertex colors.
- Chunk shadow casting: enable castShadow on chunk meshes for real terrain shadows.
- Lava self-emission: vertex color override so lava glows brighter independent of scene lighting.

---

## 2026-05-22 — Fill remaining generic block textures (tiles 27-31)

**What was done:**
- Added 5 new pixel-art textures in row 1 of the block atlas (tiles 27–31) for blocks that still used the flat generic white tile:
  - **Gravel** (tile 27): 9 rounded gray pebbles with shadow/highlight contrast
  - **Enchanting Table top** (tile 28): dark purple base with glowing red & cyan rune marks
  - **Lava top** (tile 29): molten orange-red sine-wave heat pattern with yellow/white hotspots
  - **Dispenser front** (tile 30): stone with dark arrow-slot opening and arrow head hint
  - **Bed top** (tile 31): tan pillow top + red blanket bottom with visible seam
- Updated `getBlockTexIndex()` for all five: gravel→27, enchanting_table→28 (top) / obsidian-style sides, lava→29, dispenser front→30, bed top→31 / planks sides

**Ideas for next time:**
- Animated water / lava: advance a frame counter in Game.ts and call `blockTex.needsUpdate` to cycle animated tiles.
- Lava glow: in rebuildChunkMesh, emit a vertex color boost (>1.0 with HDR) for lava faces so they glow independently of day/night lighting.
- Torch billboard: instead of a full cube face, render torch as a tiny cross of two quads (X shape) for the 3D torch look.
- Biome-tinted grass/leaves: pass biome info into getBlockTexIndex and return alternate palette tiles.
- Mob face canvas textures: draw zombie/orc/skeleton faces onto a canvas, use as material map on mob head meshes.
