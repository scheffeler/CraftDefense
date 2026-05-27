# CraftDefense Auto-Iterate Progress

## 2026-05-27 — Extended biome tinting + moon phase shadow disc

### What was done
- **Extended biome vertex-color tinting** (`src/Map.ts`): renamed `grassBiomeTint` →
  `blockBiomeTint` and extended per-block per-biome multipliers beyond grass:
  - *Dirt/farmland*: desert=warm ochre (+12% R, −24% B), taiga=cool grey-blue
  - *Stone*: desert=warm limestone (+8% R, −10% B), taiga=cold blue-grey (+8% B)
  - *Leaves*: desert=dusty olive (−8% G, −34% B), taiga=deep cool green (−24% R, +8% B)
  - Fortress clearing (x=13–50, z=13–50) stays neutral to keep walls consistent
  - All other textured blocks default to neutral [1,1,1]
  - This makes desert biomes feel warm and dry across all block types (not just grass),
    and taiga biomes feel cold and icy
- **Moon phase shadow disc** (`src/SceneManager.ts`): added `moonShadow: THREE.Mesh`
  (dark CircleGeometry(7.3, 32)), positioned in front of the moon billboard. Each frame
  its x-offset in local billboard space cycles from +moonR×1.85 (full moon, shadow off
  to right) to 0 (new moon, centered) over 8 game days. Shadow opacity matches moon
  opacity so it only appears at night.

**Files changed:** `src/Map.ts`, `src/SceneManager.ts`

### Ideas for next time
- **Torch point lights**: add THREE.PointLight at each torch block with `castShadow=false`
  and short decay radius (~4 units). Limit to nearest 8 torches to the camera to keep
  performance sane. Store positions on world load.
- **Block breaking particles tinted by block**: pass the broken block's ID to
  `ParticleSystem.spawn()` and look up a representative color from BLOCK_DEFS to tint
  the particle burst (cobblestone=gray, dirt=brown, leaves=green, etc.)
- **Mob clothing detail**: zombie torso canvas — ragged shirt (torn linen with stain
  patches), belt with buckle; skeleton torso — rib cage detail with dark gaps between
  each bone bar.
- **Water/lava animated scroll**: scroll UV offset each frame in the fluid mesh shader
  (or just move geometry UVs) for a flowing water/lava surface effect.
- **Goblin/orc body canvas textures**: ratty tunic on goblin torso, leather straps and
  war-paint stripes on orc body.

---

## 2026-05-27 — Textured crescent moon billboard

### What was done
- **Moon texture overhaul**: Replaced the plain white `SphereGeometry(4)` moon with a
  `PlaneGeometry(14, 14)` billboard using a hand-crafted 64×64 `CanvasTexture`.
  The texture features: radial gradient base (bright center → dark limb), four semi-
  transparent elliptical maria (dark lunar seas), per-pixel surface noise, 12 craters
  with dark pits and bright upper-left rim highlights, a limb-darkening radial gradient,
  and a linear shadow gradient over the right 20–38% of the disc for a crescent/gibbous
  appearance.
- **Billboard facing**: Added `this.moon.quaternion.copy(this.camera.quaternion)` in
  `updateDayNight()`, matching the sun's billboard technique so the disc always faces
  the player.
- **Moon orbit phase fix**: Changed the moonAngle offset from `Math.PI` to `Math.PI/2`
  so the moon is at maximum sky height (y=130) at midnight (t=0) instead of at the
  horizon. Previously the moon was always near the horizon when it was visible at night.

**Files changed:** `src/SceneManager.ts`

### Ideas for next time
- **Moon phase variation**: Use `_totalDays % 8` to shift the shadow gradient left/right
  over 8 days, giving a full lunar cycle (new → crescent → half → gibbous → full → back).
  Store a `moonPhase` field on SceneManager updated in `updateDayNight`.
- **Enemy body textures**: Zombie torso with ragged cloth pattern (dark streaks on green-
  gray base), skeleton with chainmail texture, orc with crude leather straps. Each uses a
  16×16 `CanvasTexture` on the torso Mesh via a per-face multi-material array.
- **Particle variety**: Different colors/sizes per damage type — fire=large orange, 
  arrow=small white/gray, sword=medium red, poison=small green. Pass a `damageType`
  enum to `ParticleSystem.spawn()`.
- **Biome vertex-color tinting**: In `rebuildChunkMesh`, query biome at (wx, wz) and
  multiply dirt/stone vertex colors by a warm-sand tint in desert and blue-white tint
  in taiga for more visual biome distinction (grass already has this).
- **Star density bands**: Add a Milky Way arc — a band of denser stars at a fixed
  inclination that rotates with `_dayTime`. Implemented as a 4th `THREE.Points` group
  with more points concentrated along a great-circle arc.

## 2026-05-26 — Creeper canvas face texture + priming flash fix

### What was done
- **Creeper canvas face**: Replaced the 5 separate box-mesh face parts (2 eyes, 1 nose,
  2 mouth corner pieces) with a single 16×16 canvas texture on the head's +Z face,
  matching the approach used by every other enemy (zombie, goblin, orc, troll, skeleton,
  iron golem). The texture features: noisy dark-green skin base, edge vignette, two
  3×3 black square eyes, a subtle inner highlight pixel per eye, and the iconic
  downward bracket mouth — top bar + descending sides that flare outward, giving the
  classic "sad" Creeper expression. The face material has `name = "face"` so it is
  correctly excluded from the priming flash effect.
- **Priming flash fix**: Updated both traverse callbacks in the creeper priming logic
  to handle 6-material head meshes (array materials). Previously `m.material as
  MeshLambertMaterial` would silently break on a mesh with an array of materials;
  now both the flash and reset traversals iterate the material array properly so the
  head flashes along with the body when priming.

**Files changed:** `src/Enemy.ts`

### Ideas for next time
- **Better arm/hand mesh**: per-face UV BoxGeometry with a hand skin canvas texture
  (16×16 skin with highlight/shadow bands — currently the arm is a plain box with
  flat vertex color)
- **Animated water/lava**: scroll UV offset each frame in SceneManager so water and
  lava surfaces appear to flow (store a `_waterTime` uniform updated in render())
- **Moon crescent phase**: replace the plain white sphere with a canvas texture showing
  a crescent or full-moon detail based on day number
- **Mob torso detail**: ragged shirt canvas texture for zombie torso (currently just a
  flat colored box), chainmail for skeleton, leather armor straps for orc
- **Particle variety**: distinct sizes/colors per damage type (fire=large orange,
  arrow=small white elongated, sword=medium red splatter shapes)
- **Uruk Captain canvas face**: the boss currently has separate eye boxes; upgrade to
  a canvas face (dark helm visor with glowing red eyes) for consistency

---

## 2026-05-26 — Skeleton skull face + Iron Golem canvas face

### What was done
- **Skeleton**: Replaced separate eye/nose box meshes with a 16×16 canvas skull texture on the +Z front face (matching the zombie/goblin/orc/troll technique). Texture shows: bone-white with radial edge darkening, heavy top cranium shadow, two wide dark eye sockets with eerie red inner glow, inverted-T nasal cavity, jaw crease, and four visible teeth with dark gaps.
- **Iron Golem**: Replaced flat headColor head + orange eye boxes with a 16×16 iron face canvas. Features: cold dark iron noise, 4px heavy brow ridge, narrow orange cracked eye slits with inner glow, crack lines emanating from eyes, angular nose bridge, grim jaw shadow, corner rivets.
- Both follow the same 6-material BoxGeometry pattern: all non-front faces use the flat headColor material; only the +Z face gets the canvas texture.

**Files changed:** `src/Enemy.ts`

### Ideas for next time
- **Transparent mesh pass for water/glass**: split chunk rendering into opaque + transparent sub-meshes so water/glass blocks render with real alpha blending
- **Water surface animation**: ShaderMaterial with time-based sine-wave vertex Y-displacement on water-block top faces for 3D ripple effect
- **Particle visual variety**: different sizes/colors per damage type (fire=large orange, arrow=small white elongated cylinder, sword=medium red splatter)
- **Mob clothing/body detail**: torso canvas textures — ragged shirt for zombie, chainmail for skeleton, war-paint stripes on orc body
- **Enchanting table animated book**: floating open book mesh above table that slowly rotates on Y axis
- **Creeper canvas face**: replace separate box-mesh eyes/nose/mouth with a single canvas face on +Z face (consistency with other mobs)
- **Night sky improvements**: moon crescent phase texture, occasional shooting star (fast moving sprite)

---

## 2026-05-26 — Canvas face textures for orc and troll enemies + orc leather belt

### What was done
**Orc and Troll now have distinct 16×16 canvas face textures** (same technique as zombie/goblin):

- **Orc face**: warm brown-red mottled skin, heavy brow with shadow line, narrow red-glowing squinting eyes, dark warpaint scar stripe on left cheek, flat nose with nostrils, wide mouth with tusk stubs
- **Troll face**: gray-green lumpy skin, massive brow ridge dominating top 40% with heavy shadow, tiny beady yellow-slit eyes, wide double-nostril nose, wide mouth with 3 stubby square teeth
- **Orc body**: leather belt strip across waist + gold-tinted metal buckle — makes orc instantly recognizable from across the battlefield
- Both use the existing 6-material BoxGeometry pattern so only the `+Z` front face shows the canvas texture; sides use flat vertex color

**Files changed:** `src/Enemy.ts`

### Ideas for next time
- **Transparent mesh pass for water/glass**: split chunk into opaque + transparent sub-meshes so water/glass render with real alpha blending
- **Water surface animation**: ShaderMaterial with sine-wave vertex Y-displacement on water-block top faces for 3D ripple
- **Skeleton canvas face**: skull texture with proper cranium shade, dark nasal cavity, classic Minecraft skeleton eye sockets
- **Grass biome tinting**: lerp grass `topColor` between biomes — taiga gets blue-green, desert fringe gets yellow-green
- **Particle visual variety**: fire=orange/red, arrow=white elongated, bleed=dark red splatter dots
- **Mob clothing detail**: torso canvas textures (ragged shirt for zombie, chainmail pattern for skeleton, war-paint body for orc)
- **Enchanting table animated book**: floating open book mesh above table, slowly rotating

---

## 2026-05-26 — Block texture atlas expansion + first-person weapon improvements

### What was done
**Block texture atlas expanded from 16 → 32 tiles** (512px wide atlas):
- Added distinct texture tile for **water** (blue with horizontal wave highlight lines)
- **Chest** now shows brown oak wood grain + dark metal trim + golden latch in center
- **Chest top** shows lighter oak + round metallic medallion
- **Crafting table top** shows oak planks + blue 3×3 grid lines
- **Crafting table side** shows oak planks + dark top trim band
- **Furnace front** shows stone + glowing dark fire-arch opening with orange/gold flame inside
- **Obsidian** shows near-black with purple crystalline vein highlights
- **Snow** shows bright white-blue with subtle sparkle dots
- **Cactus** shows green with darker vertical ridge lines
- **Glass** shows light blue with darker frame border
- **Torch** shows dark background + centered brown stick + orange-yellow flame crown
- **Bookshelf side** shows oak planks + colorful book spine strips (7 books)
- **Enchanting table top** shows deep dark + red cloth border + purple rune marks
- `getBlockTexIndex()` extended with all new block cases

**First-person held-item rendering overhauled** (`buildItemMesh` in SceneManager.ts):
- **Sword**: brown grip + pommel + prominent crossguard + wide flat blade + tapered tip (5-piece model)
- **Bow**: central grip + upper/lower angled limbs + thin string bar (4-piece model)
- **Pickaxe**: handle + horizontal head + angled pick-point
- **Axe**: handle + rectangular head + wider blade edge
- **Shovel**: long handle + flat wide head
- **Hoe/generic**: handle + small horizontal blade
- **Food/material/armor**: small flat tile displayed at angle in palm

**Files changed:** `src/Map.ts`, `src/SceneManager.ts`

### Ideas for next time
- **Proper transparent mesh pass**: split chunk into two meshes (opaque + transparent) so water/glass actually render with alpha blending
- **Torch point lights**: add THREE.PointLight at each torch block position (bake positions on world load, limit to nearest 8 within view)
- **Improved cloud shapes**: replace single BoxGeometry with 3-5 overlapping boxes per cloud for puffier silhouettes
- **Mob texture improvements**: add more detail to zombie/skeleton/goblin — striped clothing, belt, textured skin using emissive face maps
- **Grass biome tint**: lerp grass top color between biomes (taiga = blue-green, desert fringe = yellow-green)
- **Night sky improvements**: stars twinkle via opacity sine, moon has crescent shape
- **Enchanting table animated book**: floating open book above table using a rotating mesh

## 2026-05-26 — Held-block atlas UV on first-person cube viewmodel

**What was done:**
- Exported `blockFaceUV(blockId, normalY)` from `Map.ts` — returns `{u0,u1,v0,v1}` in atlas
  UV space using the same convention as `rebuildChunkMesh`, so faces match the world exactly.
- Added `VoxelWorld.getBlockTexture()` getter to share the canvas texture atlas.
- Added `SceneManager.setBlockTexture()` + `_blockTex` field; called from `Game.buildSystems()`
  right after GameMap creation.
- Added `SceneManager.buildBlockCubeMesh(blockId)`: creates a `BoxGeometry(0.22, 0.22, 0.22)`,
  rewrites the UV buffer per face using `blockFaceUV` (face order +x,-x,+y,-y,+z,-z; normalY
  is 1 for top, -1 for bottom, 0 for sides), and applies the atlas as the material map.
- `buildItemMesh()` for `category === "block"` now calls `buildBlockCubeMesh` when the atlas
  texture is available and the item has a `placesBlock` id; falls back to flat vertex color cube.
- Result: holding cobblestone/stone/wood/sand/etc. shows the actual pixel-art block face texture
  on the rotated cube in the first-person arm view.

**Files changed:** `src/Map.ts`, `src/SceneManager.ts`, `src/Game.ts`

**Ideas for next run:**
- Orc/troll face canvas texture: war-paint markings, heavier brow ridge, tusks
- Dirt/sand biome tinting: apply warm tan tint to dirt/sand blocks in desert areas
- Water surface normal animation: ShaderMaterial with sine-wave vertex Y-displacement
  on water tops for a 3D ripple feel
- Particle visual variety: different sizes/colors per damage type (fire=orange, arrow=white)
- Merge cloud sub-meshes with `mergeGeometries` from `BufferGeometryUtils` for fewer draw calls

## 2026-05-25 — Twinkling stars: 3-group staggered phase animation

**What was done:**
- Split the single 800-star `THREE.Points` into 3 independent groups (~267 stars each),
  each with its own `PointsMaterial` so their sizes can be animated independently.
- Each group gets a different base point size (0.38, 0.46, 0.54) so night sky shows
  varied star "magnitudes" — some dim, some bright.
- Added `_starTime` accumulator (advances each frame via `updateDayNight`).
- In `updateDayNight`, each group's `size` is set to a composite of two sine waves at
  different frequencies (`1.1 Hz` slow envelope + `2.9 Hz` fast shimmer), with phases
  spaced 120° apart (0, 2π/3, 4π/3). Result: different stars appear to brighten/dim
  at different times, giving a natural twinkling sky feel.
- Total star density unchanged (801 stars), just split across 3 draw calls instead of 1.

**Files changed:** `src/SceneManager.ts`

**Ideas for next run:**
- Held-block atlas texture: when holding a block item, show actual block atlas UV on the
  mini-cube faces (replace flat vertex color with per-face UV mapping via 6 materials)
- Orc/troll face canvas texture: war-paint markings, heavier brow ridge, tusks
- Dirt/sand biome tinting: apply warm tan tint to dirt/sand blocks in desert areas
- Water surface normal animation: ShaderMaterial with sine-wave vertex Y-displacement
  on water tops for a 3D ripple feel
- Particle visual variety: different sizes/colors per damage type (fire=orange, arrow=white)
- Merge cloud sub-meshes with `mergeGeometries` from `BufferGeometryUtils` for fewer draw calls

## 2026-05-25 — Block texture atlas resolution upgrade (16px → 32px per tile)

**What was done:**
- Increased texture resolution in `makeBlockTexture()` from 16×16 to 32×32 pixels per tile
- Canvas changes from 256×32 → 512×64 (same 2-row, 16-tiles-per-row structure; UV math unchanged)
- All 32 block tiles rewritten with improved pixel-level detail:
  - Stone: 4 crack networks, each 12px long with highlight pixels
  - Cobblestone: 6 distinct stone chunks with mortar gaps
  - Dirt: 9 pebble inclusions at seeded-random positions
  - Grass top: 10 dark tufts + 10 light highlights at 24px spread
  - Grass side: 8px green band (doubled), transition zone y=8..14
  - Wood side: sine-wave grain stripes + knothole detail
  - Wood top: concentric rings centered properly at (16,16)
  - Planks: 8px strips with alternating x-offset seams
  - Ores (coal/iron/gold/diamond): blob clusters spread across 22px range
  - Furnace: fire opening 16×16px with ember flecks
  - Chest: seam at y=12, clasp at proportional position
  - Bookshelf: 8 books per row at 4px each, two shelves
  - Gravel: 12 pebbles with 3-layer rendering for depth
  - Lava: 8 hotspots + bubble outline geometry
  - All Row 1 tiles scaled proportionally from original 16px coordinates

**Files changed:** `src/Map.ts`

**Ideas for next run:**
- Block texture atlas: add normal-map-style shading to cobblestone/stone for 3D feel
- Held-block atlas texture: apply the actual block atlas UV to each face of the mini-cube
- Star twinkle: animate `PointsMaterial.size` with a per-frame sine wave
- Enemy face detail: improve orc/zombie face textures with war-paint, pupils, teeth

## 2026-05-25 — Distinct 3D tool shapes in hand + sun glow halo

**What was done:**
- Replaced the generic "stick + rectangle" with purpose-built 3D meshes per tool type:
  - **Sword**: grip + pommel + cross-guard + flat blade + subtle edge highlight
  - **Pickaxe**: shaft + horizontal head bar + two angled prongs
  - **Axe**: shaft + wedge-shaped blade with back piece
  - **Shovel**: long shaft + wide flat blade
  - **Hoe**: shaft + horizontal head + downward tooth
  - **Bow**: three curved limb segments + thin bowstring (separate from sword)
  - **Food/material**: small flat item held in palm (was invisible before)
- Sun upgraded: flat `CircleGeometry` billboard (always faces camera) instead of sphere; added
  `RingGeometry` glow corona with `AdditiveBlending` for atmospheric dawn/dusk look
- Both new tool builders and sun glow applied cleanly on top of prior remote changes (sky dome,
  night vision, lava effects, gun models, wheat cross-geometry, biome tinting, torch lights)

**Ideas for next run:**
- Billboard flame torch: replace the ember sphere with a canvas-drawn flame sprite on a
  `PlaneGeometry` quad that faces the camera — more organic fire look
- Star twinkle: animate `PointsMaterial.size` with a per-frame sine wave for night atmosphere
- Held-block atlas texture: apply the actual block atlas UV to each face of the mini-cube
- Enemy body canvas textures: troll/orc torso cloths, spider leg color variation
- Water surface animation: animated UV-scroll sine wave on top faces of water blocks

## 2026-05-25 — World-gen torch point lights on startup

**What was done:**
- Added `scanWorldTorches()` to `Game.ts`: on world load, walks every voxel
  in the 64×64×32 world and calls `addTorchLight()` for each pre-generated
  torch block. Finds ~72 torches total.
- Previously only player-placed torches emitted `THREE.PointLight(0xffaa44, 1.8, 10, 2)`;
  the fortress-wall torches, village torches, dungeon torches, and mine-shaft torches
  were dark even though torch blocks were placed by WorldGen.
- Result: the fortress now glows warmly at night with dozens of orange point lights
  illuminating walls and interiors — visually confirmed. Night gameplay atmosphere
  is dramatically improved.

**Files changed:** `src/Game.ts`

**Ideas for next run:**
- Billboard flame torch: replace the torch voxel cube with a thin stick + alpha-blended
  PlaneGeometry flame sprite (yellow/orange gradient, rotating to face camera) + smaller
  PointLight (currently 10-unit radius — a billboard flame would let us tighten to 6 and
  look more realistic)
- Star twinkle: animate PointsMaterial.size per-frame with a slow sine wave
- Sun disk: replace the sphere with a camera-facing PlaneGeometry + glow halo ring
- Orc/troll face canvas texture: war-paint markings, tusks, heavy brow ridge
- Held-block item: show actual atlas tile faces on the mini-cube (per-face UV mapping)
- Dirt/sand biome tinting: warm tan tint on desert dirt blocks (taiga tinting already done
  for grass; apply same multiplier to dirt/sand faces in desert biomes)

## 2026-05-24 — Wheat cross geometry (X-shaped plant sprites)

**What was done:**
- Wheat blocks (`wheat_0`..`wheat_3`) are now excluded from the solid chunk mesh
  and rendered as two crossed PlaneGeometry-like quads (X-shape) per wheat block.
- A 64×16 pixel-art sprite sheet with 4 growth stages drives UV mapping:
  stage 0 = short green sprout, stage 1 = taller stem with side leaves,
  stage 2 = fuller green plant, stage 3 = golden ripe grain heads.
- `Chunk.wheatMesh` stores the per-chunk mesh; `VoxelWorld.wheatMat` is shared.
- Material uses `transparent: true, alphaTest: 0.4, side: THREE.DoubleSide` for
  correct back-face rendering and alpha cutout.
- Village farms now look like actual Minecraft-style wheat plants instead of
  solid green/yellow cubes — visually confirmed via Playwright screenshots.

**Files changed:** `src/Map.ts`

**Ideas for next run:**
- Billboard flame torch: replace ember sphere with camera-facing PlaneGeometry quad
  using a canvas-drawn flame sprite (yellow core → orange → red → transparent edge)
- Wheat sprite detail: add more pixel art detail to the stage-3 ripe grain heads
  (drooping seed heads, darker stem at base)
- Star twinkle: animate PointsMaterial.size with per-frame sine wave for atmospheric shimmer
- Particle visual variety: different particle sizes/colors by damage type (fire=orange,
  arrow=white, sword=red)
- Held-block atlas texture: when holding a block item, apply the actual atlas UV to
  each face of the held mini-cube (currently just flat vertex-color)
- Enemy body canvas textures: troll/orc torso cloths, spider segments color variation
- Dirt/sand biome tinting: apply warm tint to dirt blocks in desert areas for consistency

## 2026-05-24 — Biome-tinted grass + alphaTest leaf transparency

**What was done:**
- Added `grassBiomeTint(wx, wz)` function to Map.ts that mirrors WorldGen's biome
  detection logic: desert regions get a warm dry tan-green tint (×1.04, ×0.84, ×0.62),
  taiga gets cool blue-green (×0.80, ×0.96, ×0.88), forest stays white (unchanged).
- In chunk mesh builder, grass faces now apply the biome tint as vertex color
  multiplier on the atlas texture, making biome regions visually distinct at a glance.
- Added `alphaTest: 0.1` to the main chunk MeshLambertMaterial so the ~12% transparent
  holes in leaves tile (tile 9) are discarded — trees render with canopy gaps instead
  of as solid green cubes. A significant visual win for forests.
- Fixed tsconfig.emit.json (from earlier attempt, already present in HEAD).

**Ideas for next run:**
- Wheat cross geometry: render wheat_0..wheat_3 as two crossed PlaneGeometry quads
  (X-shape) instead of full cubes — requires a wheat sprite tile (would need atlas
  expansion to 3 rows or adding a 64×32 secondary atlas)
- Snow/taiga tinting: apply the cool biome tint to snow block tops too (currently snow
  is white without tinting)
- Dirt/sand biome tinting: apply warm tint to dirt blocks in desert areas for consistency
- Billboard flame torch: replace ember sphere with camera-facing PlaneGeometry quad
  using a canvas-drawn flame sprite (yellow core → orange → red → transparent edge)
- Enemy body canvas textures: troll/orc torso cloths, spider segments color variation
- Held-block atlas texture: when holding a block item, apply the actual atlas UV to
  each face of the held mini-cube (currently just flat vertex-color)
- Star twinkle: animate PointsMaterial.size with per-frame sine wave for atmospheric shimmer
- Particle visual variety: different particle sizes/colors by damage type (fire=orange,
  arrow=white, sword=red)

## 2026-05-24 — Expanded block texture atlas (16→32 tiles, single-row approach)

**What was done:**
- This run attempted to expand the texture atlas using a 32-wide single-row approach
  (512px wide × 16px tall) with 16 new block textures: snow, cactus (side+top),
  bookshelf, chest (side+top), water ripples, gravel pebbles, enchanting table,
  farmland furrows, obsidian veins, crafting table 3×3 grid, furnace glow, wheat stages.
- NOTE: The HEAD version already had a more complete 2-row atlas (256×32) with animated
  water and more block types. This run's Map.ts was superseded by HEAD's version.
- Visual confirmation: water ripple texture, bookshelf spines, cobblestone patterns
  all looking great; game renders cleanly at 60fps.

**Ideas for next run:**
- Wheat cross geometry: render wheat stages as two crossed PlaneGeometry quads
  instead of full-block cube for correct plant appearance
- Farmland distinct tile: tilled soil look (dark brown with furrow lines) instead
  of sharing the dirt tile
- Biome grass tinting: vertex-color grass blocks with biome-specific hue
  (desert = dry tan, taiga = darker blue-green, forest = bright green)
- Enemy HP bars: small world-space billboard above enemy heads showing health
- Block ambient occlusion: improve the AO calculation to consider more neighbor offsets


## 2026-05-24 — Torch visual overhaul: dedicated 3D mesh + world-gen lighting

**What was done:**
- Torch blocks are now excluded from the chunk mesh (no more ugly orange cubes)
- Each torch is replaced by a dedicated THREE.Group: brown wooden stick
  (0.09×0.65×0.09 box) + orange ember sphere at the tip (radius 0.065)
- `VoxelWorld.scanForBlock(id)` added — scans all chunks and returns world-space
  positions for any block type
- `initTorchLights()` called at game start scans the entire world for torches;
  fortress-wall torches, mineshaft torches, and dungeon torches now ALL emit
  warm PointLights (previously only player-placed torches had lights)
- Existing torch flicker code extended to also pulse the flame sphere scale
  in sync with the light intensity for a subtle organic feel

**Files changed:** `src/Map.ts`, `src/Game.ts`

**Ideas for next run:**
- Billboard flame quad: replace the ember sphere with an alpha-blended
  PlaneGeometry (facing camera) using a canvas-drawn flame sprite texture
  (yellow core → orange → red → transparent) for more realistic fire look
- Biome boundary blend: noise-dither vertex colors at forest/desert/taiga
  transitions for smoother visual seams
- Star twinkle: animate PointsMaterial.size with a slow per-frame sine wave
- Sun disk improvement: replace sphere with PlaneGeometry facing camera + a
  glow halo ring (larger transparent plane behind) for a cinematic sun
- Orc face canvas texture: add war-paint stripe, heavy brow ridge, tusks
- Held-block item: show actual atlas tile faces on the mini-cube when holding
  a block item (requires per-face UV mapping in buildItemMesh)
- Wheat cross geometry: render wheat stages as two crossed PlaneGeometry
  quads instead of full-block cube for correct plant appearance

## 2026-05-23 — Gradient sky dome via ShaderMaterial

**What was done:**
- Added a large inverted sphere (radius 185, BackSide, depthWrite=false, renderOrder=-1)
  as the sky background, replacing the flat scene.background solid color.
- ShaderMaterial with two uniforms: `zenith` (sky-blue at top) and `horizon` (haze/fog
  color at the horizon line). smoothstep(-0.08, 0.38, vH) creates a natural gradient.
- The dome follows the camera every frame; scene.background set to null.
- All sky state branches (normal day/night cycle, underwater, lava, rain weather) update
  the zenith/horizon uniforms so the gradient transitions correctly through all conditions.

**Files changed:** `src/SceneManager.ts`

**Ideas for next run:**
- Block texture atlas resolution upgrade: increase S from 16 to 32 in makeBlockTexture()
  BUT also scale all hardcoded pixel art coordinates × 2. Key tiles: cobblestone stones
  (fill larger area), stone cracks (extend length), wood top (center at S/2=16 not 8),
  planks seams (already auto-scales), ore flecks (larger clusters). Row-1 tiles need
  similar coordinate scaling.
- Torch mesh overhaul: instead of a cube, use a thin box stick + a billboard
  flame quad (PlaneGeometry facing camera) with alpha-blended animated texture
  and a small warm PointLight at the flame tip for localized glow.
- Stars twinkle: animate PointsMaterial.size each frame with a slow per-star sine wave.
- Biome boundary smoothing: noise-dither vertex colors at forest/desert/taiga edges.
- Sun disk improvement: replace the sphere with a flat PlaneGeometry facing the camera
  (like the moon) with a glow halo ring for a more cinematic sunrise/sunset.

## 2026-05-23 — Zombie/goblin canvas face textures + goblin ear protrusions

**What was done:**
- Zombie head: replaced plain-color single-material box with a per-face multi-material
  array. +Z (front) face gets a 16×16 CanvasTexture with: sine-noise mottled green-gray
  skin, dark rectangular Minecraft-style eye sockets with white pupils, a downturned
  grimacing mouth with corner upticks, and a dark chin crease.
- Goblin head: same per-face approach with a lime-green sine-noise base, glowing orange
  eyes with dark pupil dots, a wide jagged 10px grin (alternating tooth/gap pattern),
  and a small nose shadow between eyes and mouth.
- Goblin ear protrusions: two `0.07×0.17×0.06` box meshes angled outward (±0.45 rad) at
  the sides of the head for both `goblin` and `goblin_miner` types.
- All other humanoid types (orc, golem, troll, etc.) keep existing plain-color head with
  separate eye-box overlays — no regression there.

**Files changed:** `src/Enemy.ts`

**Ideas for next run:**
- Torch visual overhaul: skip rendering torch blocks in the chunk mesh entirely; replace
  with a dedicated THREE.Group per torch (thin stick box + alpha-blended PlaneGeometry
  flame sprite + existing PointLight). Requires `getTorchPositions()` on VoxelWorld and
  torch mesh management in Game.ts on place/break.
- Orc face canvas texture: similar to zombie/goblin, add tusks (small white boxes below
  the mouth), heavy brow ridge (dark rectangle above eyes), war-paint stripe
- Add zombie and goblin body textures: use MeshLambertMaterial with a CanvasTexture for
  the torso as well (ragged cloth pattern for zombie, crude vest for goblin)
- Held-block atlas texture: when holding a block item, build a 6-material BoxGeometry
  referencing the actual atlas tile UVs per face (top, bottom, sides) instead of a
  flat vertex-colored cube
- Stars twinkle: animate PointsMaterial.size with a slow sine wave per frame
- Minimap: add a pixel-icon for enemy positions (red dot) so players can track waves
- Biome boundary blend: noise-dither vertex colors at the forest↔desert and forest↔taiga
  transition zones for smoother visual seams

## 2026-05-23 — Improved arm mesh, sword viewmodel, and puffy clouds

**What was done:**
- Arm mesh: replaced the flat brown box with a pixel-art skin canvas texture (16×16, wave-noise
  grain + wrist crease + top highlight). Six per-face materials with different warm-skin tints
  simulate natural directional shading. Added a dark sleeve cuff element at the upper end of the
  arm that's visible whenever the player is in pointer-lock mode (i.e., always during gameplay).
- Sword viewmodel: wider + flatter blade geometry (0.11×0.32×0.022 vs 0.08×0.28×0.04 before),
  a proper crossguard bar, and a subtle bright edge-highlight strip along the blade spine for a
  shiny metallic feel. Tool head also slightly widened with a pick-tip protrusion.
- Clouds: each cloud rebuilt as a THREE.Group with a flat base slab + two overlapping upper puff
  boxes at different offsets/heights, giving recognizable cumulus silhouettes instead of flat slabs.

**Files changed:** `src/SceneManager.ts`

**Ideas for next run:**
- Torch mesh improvement: replace the current opaque cube torches with a cross-billboard flame
  quad (alpha-blended sprite) + a small PointLight at the flame tip for realistic warm glow
- Enemy face texture detail: procedural canvas textures for zombie (green mottled face,
  X-stitched mouth) and goblin (pointed ears via box protrusions, sharp tooth hints)
- Better held-item block: when holding a block, use a multi-material BoxGeometry that shows
  the block's actual atlas texture faces instead of flat vertex-color tint
- Ground-level fog: add a thin FogExp2-style volumetric layer at y=6–8 for atmosphere
- Biome boundary visual blend: noise-based fade at forest/desert/taiga transitions
- Star twinkle: animate PointsMaterial size with a slow sine wave for atmospheric shimmer

## 2026-05-23 — Animated water and lava surfaces

**What was done:**
- Added separate animated fluid meshes for water and lava block top faces.
  - Water: 32×32 tileable canvas texture with deep-blue base (#1a5fa8) and
    diagonal ripple lines; UV offset scrolls diagonally each frame for a
    flowing-water effect.
  - Lava: 32×32 tileable canvas with dark-red base, bright molten blob hotspots,
    and dark cracking veins; emissive glow (`emissive: 0xff3300`, intensity 0.55);
    UV offset scrolls slowly counter-diagonally.
- Water/lava top faces are redirected from the main chunk mesh to dedicated
  per-chunk `waterMesh`/`lavaMesh` objects using a shared animated material.
- `updateFluidAnimation(dt)` added to `VoxelWorld` and exposed via `GameMap`;
  called each frame from `Game.ts` — GPU-side UV scroll, essentially free.
- World-space UVs ensure seamless tiling across adjacent fluid blocks.

**Files changed:** `src/Map.ts`, `src/Game.ts`

**Ideas for next run:**
- Better arm/hand mesh: per-face UV on BoxGeometry with a hand skin texture
  (16×16 pixel-art skin with highlight/shadow bands, held item modeled on top)
- Enemy visual improvements: zombie face texture on the head mesh face, goblin
  ear geometry (two small box protrusions)
- Torch mesh: replace the current cube geometry with a billboard flame quad
  (alpha-blended sprite) + point light at the flame tip
- Cloud improvements: layered semi-transparent planes (3-4 stacked at different
  heights) instead of opaque solid boxes
- Water animation refinement: add a second pass with sine-wave vertex
  displacement on the fluid mesh for a 3D ripple feel (requires ShaderMaterial)
- Biome boundary visual blend: fade vertex colors between biomes using noise

## 2026-05-22 — Block texture atlas expansion + cobblestone improvement

**What was done:**
- Improved cobblestone texture (tile 1): replaced the old 6-blob approach with
  6 clearly defined stone blocks over a dark mortar fill (`#6e6658`), each with
  an inner highlight + shadow edge. Fortress walls now show distinct stone shapes.
- Improved grass top texture (tile 3): added 5 dark clump patches and 5 lighter
  highlight patches over the noise base for more visual variety underfoot.
- Expanded block texture atlas to a 2-row 256×32 canvas with unique tiles 16–31
  covering: furnace, chest, crafting table, obsidian, iron block, glass, water,
  bookshelf, snow, cactus, TNT, gravel, enchanting table, lava, dispenser, and bed.

**Files changed:** `src/Map.ts`

**Ideas for next run:**
- Improve stone (tile 0): add subtle crack lines for a more rocky look
- Improve leaves (tile 9): dithered, semi-transparent look
- Improve sand (tile 5): ripple/dune texture detail
- Better grass side (tile 4): wider 4px green strip, smoother dirt transition
- Animated water/lava: update texture UVs each frame via scroll offset
- Better arm/hand mesh: wider, slightly tapered geometry instead of a plain box
- Enemy and mob visual improvements (geometry, arm animations)
- Sky: volumetric-style layered clouds (semi-transparent stacked planes)

## 2026-05-22 — Stone cracks, grass-side, sand ripples, leaves palette

**What was done:**
- Stone (tile 0): added 3 seeded 2-segment crack lines with faint pixel
  highlights — looks more like natural rock instead of uniform gray noise.
- Grass-side (tile 4): widened green band to 4px, added alternating 1–2px
  grass blade highlights at the top edge, and a fading transition zone (y=4–6).
- Sand (tile 5): added horizontal dune ripple lines every 3px (dark shadow +
  light highlight pair) for subtle wave texture.
- Leaves (tile 9): replaced single brightness-varied green with a 5-color
  palette sampled per pixel — trees now show visible multi-shade variation.
  Added 3 soft highlight blobs for leaf cluster accents.

**Files changed:** `src/Map.ts`

**Ideas for next run:**
- Better arm/hand mesh: wider geometry with a pixel-art skin canvas texture
  (per-face UV on BoxGeometry, 16×16 skin with shading bands)
- Enemy visual improvements: zombie face markings, goblin details
- Animated water: separate water mesh layer with scrolling UV offset
- Dirt texture (tile 2): add subtle pebble/root specks for more ground detail
- Wood side (tile 6): slightly higher contrast grain, maybe a knot detail
- Better torch mesh: billboard flame quad with emissive orange glow particle

## 2026-05-22 — Fixed missing dirt texture + tsconfig moduleResolution

**What was done:**
- Merged atlas expansion changes from parallel run — remote had already done a
  comprehensive 2-row 256×32 atlas expansion.
- Added missing `case "dirt":` to `getBlockTexIndex()` — dirt blocks were
  falling through to the plain white generic tile (index 13) instead of the
  correct dirt texture (index 2). Now both `dirt` and `farmland` use tile 2.
- Fixed pre-existing TypeScript 6.0 build error: `moduleResolution: "Node"` →
  `"Bundler"` in `tsconfig.json` (Vite projects must use Bundler resolution).

**Files changed:** `src/Map.ts`, `tsconfig.json`, `AUTOPROGRESS.md`

**Ideas for next run:**
- Better arm/hand mesh: per-face UV on BoxGeometry with a hand skin texture
- Enemy visual improvements: face markings for zombies, goblin ear details
- Animated water/lava: scrolling UV offset in SceneManager each frame
- Torch mesh: replace box geometry with billboard flame + emissive point light
- Cloud improvements: layered semi-transparent planes instead of opaque boxes
- Biome boundary smoothing: noise blend at forest/desert/taiga borders

## 2026-05-25 — Billboard flame torch sprite replaces ember sphere

**What was done:**
- Replaced the orange `SphereGeometry` ember on all torch meshes with a `THREE.Sprite` 
  using a hand-drawn 16×32 canvas flame texture.
- Flame texture: pixel-by-pixel teardrop shape — bright yellow base (rgb(255,255,0))
  fading to orange through the middle and red-orange at the tip; soft edge falloff via
  power curve; seeded noise adds jagged tips for organic look.
- `THREE.SpriteMaterial` with `AdditiveBlending + depthWrite=false` — flame adds warm
  light on top of the scene geometry without depth-sorting artifacts.
- Sprite auto-faces the camera (no per-frame rotation needed); positioned so base aligns
  with the stick tip (y = 0.72 + half-height).
- Flicker now applies `flame.scale.set(0.22 * s, 0.32 * s, 1)` to keep correct aspect
  while pulsing ±12% with a dual-sine pattern.
- `Game.buildFlameTexture()` is a private static method, called once at field initialisation
  time (not per-torch) so there's no runtime overhead per torch.
- Removed unused `_torchFlameGeo` (SphereGeometry) field; `_torchFlameMeshes` array type
  changed from `THREE.Mesh[]` to `THREE.Sprite[]`.

**Files changed:** `src/Game.ts`, `scripts/screenshot-torch.mjs`

**Ideas for next run:**
- Star twinkle: animate `PointsMaterial.size` per-frame with a slow sine wave (different
  phase per star group) for atmospheric night shimmer
- Held-block atlas texture: when holding a block item, show actual block atlas UV on the
  mini-cube faces (replace flat vertex color with per-face UV mapping via 6 materials)
- Orc/troll face canvas texture: war-paint markings, heavier brow ridge, tusks
- Dirt/sand biome tinting: apply warm tan tint to dirt blocks in desert areas (taiga/forest
  grass tinting is already done; dirt/sand should match)
- Water surface normal animation: add ShaderMaterial with sine-wave vertex Y-displacement
  on water tops for a 3D ripple feel
- Particle visual variety: different sizes/colors per damage type (fire=large orange,
  arrow=small white, sword=medium red)

---

## 2026-05-27 — Enemy body textures (zombie, skeleton, orc/troll)

### What was done
- **Zombie torso**: replaced flat `bodyMat` single-material with a 6-material `BoxGeometry`
  array. The +Z front face uses a 16×16 `CanvasTexture` showing mottled green-gray cloth
  with three horizontal dark tear streaks, a ragged alternating-pixel bottom edge, and a
  faint center seam line.
- **Skeleton torso**: same 6-material approach on `buildSkeletonMesh`. Front face shows
  bone-white base noise with 4 pairs of horizontal rib lines (dark shadow + light
  highlight above each), a sternum/spine double-pixel line down the centre, and side-edge
  shadows for depth.
- **Orc (and troll) torso**: 6-material front face shows dark leather base with a lighter
  centre armour panel, a horizontal chest strap band in dark brown, iron rivets at the
  strap ends with lighter specular pixel, and two diagonal battle-scratch marks.
- Added `buildZombieBodyTex`, `buildSkeletonBodyTex`, `buildOrcBodyTex` static builders
  following the same CanvasTexture NearestFilter pattern as the existing face builders.

**Files changed:** `src/Enemy.ts`

### Ideas for next time
- **Goblin body texture**: ratty torn tunic (dirty tan/brown cloth with stain patches)
- **Moon phase variation**: shift the shadow gradient left/right using `_totalDays % 8`
  to simulate a lunar cycle (new → crescent → half → gibbous → full → back).
- **Biome vertex-color tinting**: in `rebuildChunkMesh` multiply dirt/stone vertex RGB
  by a warm-sand tint for desert and blue-white for taiga to distinguish biomes visually.
- **Star Milky Way band**: a second `THREE.Points` with 2000 dense stars concentrated
  along a great-circle arc for a more dramatic night sky.
- **Particle type variety**: pass a `damageType` enum to `ParticleSystem.spawn()` and
  vary color/size per type (fire=large orange, arrow=small grey, sword=medium red).

---

## 2026-05-27 — Cloud coverage expansion + tsconfig deprecation fix

### What was done
- **Cloud positions expanded**: `buildClouds()` in `SceneManager.ts` now has 23 cloud
  clusters (up from 15) including positions in the negative-X/Z map margins and beyond
  the far edge, giving much better sky coverage with no visible "empty corner" gaps.
  Each cloud still uses the remote's 3-box puff technique (flat base + 2 raised puffs).
- **Optional center puff**: Large clouds (w > 8) with hash > 0.45 now get a third
  taller center puff for more varied cloud shapes.
- **Cloud material**: Slightly adjusted to `0xfafafa` and opacity 0.88 for a crisper
  white look.
- **tsconfig deprecation fix**: Resolved `moduleResolution=node10` deprecation warning
  in TypeScript 6 by setting `"moduleResolution": "bundler"` in `tsconfig.json` and
  `tsconfig.emit.json` (zero-impact on Vite bundling).
- **Merged remote improvements**: The remote `auto-iterate` branch already had
  32×32 block texture atlas, row-2 tile slots (tiles 16–31) for furnace/chest/crafting
  table/obsidian/iron_block/glass/water/bookshelf/snow/cactus/lava/etc.,
  per-face UV mapping (`blockFaceUV` export), fluid materials (water/lava), wheat
  billboard geometry, sky dome shader, star groups, detailed arm skin texture, and
  per-tool mesh builders. All of these were preserved as-is.

**Files changed:** `src/SceneManager.ts`, `tsconfig.json`, `tsconfig.emit.json`

### Ideas for next time
- **Biome vertex-color tinting**: in `rebuildChunkMesh` multiply dirt/stone vertex RGB
  by a warm-sand tint in desert areas and blue-white for taiga snow.
- **Moon phase variation**: use `_totalDays % 8` to animate the crescent shadow left/right.
- **Block breaking particles**: tint particles with the broken block's color so cobblestone
  breaks show gray chips, dirt shows brown, etc.
- **Goblin body texture**: ratty torn tunic on the front face (dirty tan/brown with stain patches).
- **Star twinkle**: animate `PointsMaterial.size` with a slow per-group sine wave at night.
