# CraftDefense Auto-Iteration Progress

## 2026-05-24 — Block Texture Atlas Expansion

**What was done:** Expanded the procedural block texture atlas from 16 tiles to 32 tiles in `src/Map.ts`. Added 12 hand-crafted 16×16 pixel-art textures for blocks that previously rendered as plain vertex-colored flat quads:

- **gravel**: brownish gray with elliptical pebble shapes + edge highlights
- **snow**: icy white with subtle blue shimmer and sparkle flecks
- **water**: deep blue with diagonal sine-wave ripple highlights and glint streaks
- **obsidian**: very dark purple with vertical veins and sparkle
- **iron_block**: silver metallic with offset cross-hatch seam pattern
- **bookshelf sides**: colorful book spines (7 colors) between wooden strips
- **crafting_table top**: dark wood surface with 3×3 grid lines marking craft slots
- **furnace sides/front**: stone background with glowing fire opening (dark → orange → yellow → white)
- **farmland**: tilled dark dirt with horizontal furrow lines
- **chest front/side**: oak wood with prominent golden latch band + clasp
- **chest top**: oak wood with golden corner trim and central latch
- **enchanting_table top**: dark obsidian with red rune cross and corner glow dots

Also updated `getBlockTexIndex()` with face-aware mapping (top/side/bottom use different tiles for bookshelf, crafting_table, furnace, chest) and fixed the UV divisor to use the `BLOCK_ATLAS_TILES` constant.

**Branch:** `claude/dreamy-cerf-jVUqu`

---

## Ideas for Next Run

- **Animated water**: cycle through 2-3 water tiles on a timer for wave animation
- **Better torch rendering**: currently a full cube — render as a small cross-plane sprite like Minecraft's torch
- **Wheat crop cross-planes**: render transparent crop blocks as X-cross quads rather than full cubes
- **Cactus texture**: add a dedicated tile with spine dots and lighter vertical ridges (currently uses vertex color)
- **Glass texture**: add a framed glass tile with subtle transparency hints
- **Enemy visual polish**: zombie/orc meshes are basic boxes — add more geometric detail (arms, head, limb segmentation)
- **Item drop sprites**: item entities on the ground could rotate/bob more visually
- **Better particle effects**: break particles could sample the broken block's texture color
- **Night sky improvement**: increase star count and vary star sizes for depth
- **Improved torch light**: torches generate a point light but it could flicker more dramatically
- **Village building improvements**: village structures could have better block composition (chimneys, windows with glass)
