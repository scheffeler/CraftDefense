# CraftDefense Auto-Iteration Progress

## 2026-05-28 — Higher-resolution block texture atlas (32×32)

**What was done:**
- Expanded the block texture atlas from 16×16 pixels per tile to 32×32 pixels per tile (2× resolution)
- Expanded the atlas from 16 tiles to 32 tile slots (`ATLAS_TILES = 32`) and fixed the hardcoded `/ 16` UV constant to use the module-level `ATLAS_TILES`
- Completely rewrote all 16 existing block textures with more detailed pixel art:
  - **Stone**: crack lines rendered as wandering paths, highlight patches
  - **Cobblestone**: distinct individual stone shapes with mortar, highlight/shadow on each stone
  - **Dirt**: pebble marks and lighter flecks
  - **Grass top**: darker patches and lighter tufts for variation
  - **Grass side**: 5px green strip with transition zone and downward grass tendrils
  - **Sand**: subtle ripple/wave pattern
  - **Wood side**: vertical grain with column variance and knot marks
  - **Wood top**: realistic ring pattern with bark edge ring
  - **Planks**: 8px board seams with alternating offset and wood grain
  - **Leaves**: 13% transparent holes for dappled look
  - **Ores** (iron/coal/gold/diamond): larger, more distinct ore veins
  - **Bedrock**: more varied dark/light patches
  - **Diamond**: proper rhombus shape with bright center
- Added **6 new dedicated textures** for blocks that previously showed only flat vertex color:
  - Index 16: **Gravel** — mosaic of rounded pebbles with highlight/shadow
  - Index 17: **Obsidian** — deep purple-black with subtle glassy streaks
  - Index 18: **Iron block** — brushed metal with panel dividers and rivets
  - Index 19: **Snow** — pale blue-white with crystalline sparkle
  - Index 20: **Cactus side** — ribbed green with thorn tips
  - Index 21: **Cactus top** — 8-pointed radial star pattern
- Updated `getBlockTexIndex()` to dispatch the new block types

**Result:** Visually richer world — cobblestone fortress walls look solid with distinct stone shapes, trees have natural-looking varied leaves, terrain surfaces have clear character.

**Ideas for next time:**
- Add **animated water texture** (scrolling UV or shader-based waves)
- Add **face-specific textures** for crafting table (workbench top) and furnace (glowing front face) — requires adding block orientation/state data
- Improve **enemy visuals**: bigger goblin, troll with proper proportions, skeleton with visible bow
- Add **particle trails** to sword swings and projectiles
- Add **ambient occlusion** in corners and under overhangs (currently present but could be more dramatic)
- Add **fog of war** / vignette post-processing
- Better **torch/light halos** — pointlight emissive around placed torches

---

## Session 2026-05-28 — Combat Impact Particles

**Goal:** Add visual particle feedback for melee and ranged combat hits.

**Changes made:**
- Added `spawnMeleeHit(x, y, z, color?)` to `Particles.ts`: 5–8 rectangular red splat particles exploding outward on sword/axe connect, each with slight random color variance between `0xcc2222` and `0xff3333`
- Added `spawnArrowHit(x, y, z)` to `Particles.ts`: 4–6 slim white/gray shard particles on arrow or bolt impact, oriented like wood splinters
- Added `onPlayerArrowHitEnemy` callback to `ProjectileManager` in `Projectile.ts`, fired on both arrow and crossbow bolt enemy hits; both arrow pool and bolt pool now call it
- Wired `spawnMeleeHit` into `tryMeleeAttack()` in `Game.ts` at the hit confirmation point
- Wired `spawnArrowHit` into `onSkeletonArrowHit` (skeleton arrows hitting player) and `onPlayerArrowHitEnemy` callback (player arrows/bolts hitting enemies)

**Result:** Sword hits now spray red particle splats; arrows and crossbow bolts emit shard bursts on impact — much more satisfying combat feel.

**Ideas for next time:**
- Add particle trails to fired projectiles (faint smoke/motion trail)
- Add screen-shake on heavy hits (orc, troll, troll_king) via camera position offset
- ~~Sword swing arc: brief translucent blade trail mesh~~ ✓ done
- Death burst particles when enemy HP reaches 0 (already some particle logic, extend it)
- Block break particle color matches block type (currently generic)

---

## Session 2026-05-28 — Sword Swing Arc

**Goal:** Add a translucent blade-trail plane to the first-person arm scene that flashes during melee weapon swings.

**Changes made:**
- Added `_swingArcMesh: THREE.Mesh` to `SceneManager` — a `PlaneGeometry(0.35, 0.55)` with `MeshBasicMaterial` using `AdditiveBlending`, `transparent: true`, `DoubleSide`, added directly to `armScene`
- Added `_swingWeaponEquipped: boolean` field, set to `true` in `updateArmItem()` when a sword/melee weapon or axe is equipped (not bows, not guns)
- In `renderArm()`, positions the arc mesh in camera-local space (slightly right and forward of center, aligned to blade area) and drives opacity via `sin(swingPct * π) * 0.45` — peaks at 45% opacity mid-swing, fully transparent at start/end
- Arc color is pale blue-white (`0xaaddff`) with additive blending for a luminous trail effect

**Result:** Sword and axe swings now show a brief ghost-plane trail at the blade tip, giving clear visual feedback that a swing is in progress. Bow, guns, tools, and empty hand produce no arc.

**Ideas for next time:**
- Add **particle trails** to fired projectiles (faint smoke/motion trail behind arrows and bolts)
- Add **death burst** particles when enemy HP reaches 0 (colored by enemy type)
- **Block break particle color** matches block type (stone = grey, dirt = brown, etc.)
- **Torch light halo** — emissive pointlight glow ring around placed torches
- **Screen-shake** on heavy hits (orc, troll, troll_king) — a quick camera offset jolt
