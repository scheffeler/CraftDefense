# CraftDefense Auto-Iteration Progress

## Session 2026-05-28 — Projectile Particle Trails

**Goal:** Add faint smoke/motion trail particles behind flying player arrows.

**Changes made:**
- Added `spawnArrowTrail(x, y, z)` to `Particles.ts`: emits 1–2 tiny smoke puffs (size 0.022–0.044) per call with very short life (0.14–0.24s), near-zero drift velocity, and 60% starting opacity that fades with age. Warm gray-brown color (`0x887766`).
- Added `trailCallback: ((pos: THREE.Vector3) => void) | null` public field and `_trailFrame` counter to `ProjectileManager` in `Projectile.ts`; every 4th update frame, calls the callback for each active arrow with its current world position.
- Wired `trailCallback` in `Game.ts` after `ParticleSystem` construction, delegating to `particles.spawnArrowTrail`.

**Result:** Fired arrows now leave a brief wispy smoke trail as they arc through the air, making the projectile path clearly visible and archery feel more satisfying.

**Ideas for next time:**
- Add **animated water texture** (scrolling UV or shader-based waves)
- Add **face-specific textures** for crafting table (workbench top) and furnace (glowing front face)
- Improve **enemy visuals**: bigger goblin, troll with proper proportions, skeleton with visible bow
- Add **screen-shake** on heavy hits (orc, troll, troll_king) via camera position offset
- Add **impact particles** for arrow hits on enemies (`onPlayerArrowHitEnemy` callback + `spawnArrowHit`)
- Add **melee hit splat particles** for sword and axe swings
- Add **torch halos** — emissive pointlight glow around placed torches
