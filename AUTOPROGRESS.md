# CraftDefense Auto-Progress Log

## 2026-06-03 — Block Texture Atlas Upgrade (32×32 tiles)

**What was done:**
- Upgraded the procedural block texture atlas from 16×16 → 32×32 pixels per tile (4× more pixels per block face)
- Rewrote `makeBlockTexture()` in `src/Map.ts` with significantly more detailed pixel art:
  - **Stone**: crack lines with light-side highlight edges
  - **Cobblestone**: proper brick-and-mortar layout with 6 distinct stones per tile, per-brick noise, corner highlights/shadows
  - **Dirt**: dark organic specks and light pebble accents
  - **Grass top**: vibrant green base (98,165,56) with darker patch overlays and bright accent pixels
  - **Grass side**: 5px green strip with individual grass blade pixels dipping into dirt zone
  - **Sand**: subtle horizontal banding simulating layered deposits
  - **Wood side**: sinusoidal grain lines, bark edge darks, realistic knot (oval dark spot)
  - **Wood top**: concentric ring cross-section with outer bark ring and dark center pith
  - **Planks**: grain noise, plank seams every 8px, alternating vertical half-seams
  - **Leaves**: mottled two-tone green (warm-yellow vs cool-blue-green) for natural look
  - **Iron/Coal/Gold ores**: 8 rounded ore blobs with inner/outer face shading and highlight pixel
  - **Diamond ore**: 6 proper diamond shapes (axis-aligned rotated squares) with cyan edge + sparkle
  - **Bedrock**: 4-value grayscale chaotic noise
  - `oreBlobs()` shared helper extracted for iron/coal/gold to reduce code duplication
- Fixed `tsconfig.json` `ignoreDeprecations: "5.0"` to silence node10 moduleResolution deprecation warning in TS 5.9

**Next run ideas (priority order):**
1. **Torch point lights**: Add `THREE.PointLight` objects near torch blocks for warm orange glow in fortress corridors and underground. Track torch world positions during chunk building and update lights on chunk rebuild.
2. **Better water**: Animate water surface with a scrolling UV or sine-wave vertex displacement. Currently just a static transparent plane.
3. **Improved generic-tile blocks**: Furnace, chest, crafting_table currently use white tile 13 (vertex color only). Add dedicated texture tiles for these high-use blocks (expand atlas or reuse tiles with different vertex colors).
4. **MeshStandardMaterial upgrade**: Switch chunk mesh from `MeshLambertMaterial` to `MeshStandardMaterial` for proper PBR roughness/metalness — would give cobblestone a matte look vs stone a slightly shinier look.
5. **Better sky**: Replace solid color background with a sky gradient shader or `THREE.Sky` from Three.js addons for a more immersive horizon.
6. **Enemy texture**: Give mob faces actual pixel textures (zombie green face, skeleton bone details) instead of flat color boxes.
