# CraftDefense Auto-Iteration Progress

## 2026-05-31 — Enhanced block textures (32×32) + torch lights for world-gen torches

**What was done:**
- Upgraded the block texture atlas from 16×16 to 32×32 pixels per tile (4× more pixels), giving much sharper and more detailed procedural textures. The atlas is now 512×32 px (was 256×16).
- Completely rewrote all 16 tile textures with higher-quality algorithms:
  - **Cobblestone**: Now has 7 distinct stone shapes set in mortar, each with per-pixel grain noise and bevel highlighting — looks like real Minecraft cobblestone
  - **Stone**: Subtle crack lines drawn pixel-by-pixel plus lighter speckles
  - **Grass top**: Blade highlights as thin vertical strokes
  - **Grass side**: 6px green cap + blade fringe with fade-out alpha, much more detailed than the old 3px strip
  - **Sand**: Wave ripple lines with per-line sin wave offset
  - **Wood side**: Column-based vertical grain + circular knot detail
  - **Wood top**: Log ring pattern with center dark spot and jitter noise
  - **Planks**: 4 distinct boards (8px each), per-board color variation, vertical join offsets
  - **Leaves**: Density and color variety improved, 10% transparent holes
  - **Ore blocks** (iron, coal, gold, diamond): Larger ore clusters (3-8px each) with dark outlines for clear legibility; diamond uses proper rotated-square diamond shapes
- Fixed a gap in the existing torch-light system: pre-placed torches from world generation (fortress walls, village, ruins) now get point lights at startup. Previously only player-placed torches had lights.

**Files changed:** `src/Map.ts` (texture atlas), `src/Game.ts` (torch init + import)

**Ideas for next time:**
- Better first-person arm/hand: show textured block/sword geometry (not just flat colored boxes)
- Improve the generic/fallback block textures: snow, gravel, chest, furnace, enchanting table, bookshelf — these all currently use the vertex color fallback (white tile) and could have their own atlas tiles
- Consider adding a second atlas or widening the current one from 16 to 32 tiles to add more tile varieties
- Night-time sky improvement: add a gradient from deep navy at horizon to almost black at zenith
- Rain particle rendering: make rain look more like actual rain streaks
- Better water: animated UV scrolling or wave shader
- Torch light radius tweak: the current `distance: 10` might need tuning per biome/area
- Consider MeshStandardMaterial for enemies (roughness/metalness) for better shading
