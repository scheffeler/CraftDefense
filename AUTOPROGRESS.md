# CraftDefense Auto-Iteration Progress

## 2026-05-18 — TNT Block + Gunpowder + Chain Explosions

**What was done:**
- Added **TNT** craftable block (5 gunpowder + 4 sand, classic Minecraft pattern)
- Added **gunpowder** material item; creepers now drop gunpowder (80%, 2x count)
- TNT has a custom pixel-art texture (red sides with white stripes + "TNT" label, tile 16; tan starburst top, tile 17)
- Expanded block texture atlas from 16 → 20 tiles; UV mapping updated (÷20)
- Right-clicking a placed TNT block lights a 4-second fuse (creeper hiss sound)
- Fuse countdown runs independent of pointer-lock (fires even when inventory is open)
- Explosion: radius 4, damage 10 to player + all enemies in range, destroys blocks
- **Chain detonation**: TNT caught in another explosion auto-primes with 0.5s fuse
- Orange spark particles spawn above lit TNT during countdown
- Refactored creeper explosion into shared `triggerExplosion()` helper
- Starter barracks chest contains 8 gunpowder + 2 TNT for player discovery
- Fixed TypeScript 6.0 `moduleResolution: "Node"` deprecation (changed to "bundler")

**Architecture notes:**
- `litTNT: Map<string, {fuseTimer, sparkTimer}>` in Game.ts tracks lit blocks
- `updateLitTNT(dt)` called before pointer-lock guard so it always ticks
- `triggerExplosion()` shared by both creeper and TNT
- Atlas tiles 16 (TNT side) and 17 (TNT top) added to `makeBlockTexture()`

**Ideas for next run:**
- Potion system: brewing stand, blaze rods (new mob), health/speed/strength potions
- Flint and steel item for lighting TNT (more authentic, currently right-click any item)
- Spider webs block (slows enemies — great wave defense tool)
- Better enemy variety: Zombie Pigman, Witch
- Armor stand / equipment display
- More village content: trading with villagers using emeralds
- Sound effects for TNT fuse sparks (ticking sound)
- Visual flash on lit TNT (alternating red/white) as fuse burns down
- TNT cart (rolling TNT that enemies can push)
