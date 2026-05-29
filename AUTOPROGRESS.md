# CraftDefense Auto-Progress Log

## 2026-05-29 — Block Texture Atlas Expansion

**What was done:**
- Fixed pre-existing TS5107 deprecation error (`moduleResolution: "Node"` → `"bundler"`) that was blocking the dev server
- Expanded the block texture atlas from 16 to 32 tiles (256px → 512px wide, same 16px height)
- Improved cobblestone texture: clearer stone cell layout with offset mortar rows, top/left highlights, and bottom/right shadows
- Added 15 new dedicated pixel-art block textures for blocks that previously showed only flat vertex color:
  - **gravel** (idx 16): rounded pebble clusters with individual highlights/shadows
  - **snow** (idx 17): bright white with blue-grey pixel sheen
  - **iron_block** (idx 18): 4×4 metallic panel grid with seam shadows and highlights
  - **glass** (idx 19): pale blue with corner ornaments and inner highlight cross
  - **water** (idx 20): diagonal wave ripples with sparkle highlights
  - **farmland top** (idx 21): dark moist soil with crack lines
  - **cactus top** (idx 22): circular green cross pattern
  - **cactus side** (idx 23): vertical ribs with spine attachment nubs
  - **bookshelf side** (idx 24): colorful book spines between wood frame strips
  - **furnace front** (idx 25): stone base with glowing orange furnace opening
  - **chest top** (idx 26): wood grain with iron lock detail
  - **chest side** (idx 27): oak planks with iron clasp and corner trim
  - **obsidian** (idx 28): very dark purple with bright crystal sparkle flecks
  - **enchanting table top** (idx 29): dark book with arcane rune design
  - **enchanting table side** (idx 30): obsidian base with red gemstone

**Ideas for next run:**
- Add torch point lights: place `THREE.PointLight` near each torch block in the chunk mesh (or a dynamic set of the closest N torches to the player) — this would dramatically improve night atmosphere
- Improve the first-person arm: make it look less like a plain brown box (slight skin-color variation, maybe minimal hand finger geometry)
- Better item-in-hand visuals: swords could have a proper cross-guard, tools could look more distinctive
- Animated water: update water face UV offset each frame for a flowing appearance
- Screen-space ambient occlusion or fog that responds more dramatically to caves/underground
- Particle improvements: torch flame particles, rain splash particles on ground
- Entity textures: add canvas-generated textures to enemy and passive mob meshes (zombie skin pattern, creeper spots, etc.)
- Improve grass: add some variation so flat plains don't look monotonous (scattered taller grass sprites as billboard geometry)
