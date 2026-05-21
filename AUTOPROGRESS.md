# CraftDefense Auto-Progress Log

## 2026-05-21 — Potion System

**What was done:**
- Added full Minecraft-style potion system with 7 new items:
  - `glass_bottle` (material, crafted from 2 glass)
  - `potion_healing` (instant +6 HP, craft: bottle + apple)
  - `potion_regeneration` (heals 0.5 HP/s for 30s, craft: bottle + cooked beef)
  - `potion_strength` (+50% melee damage for 30s, craft: bottle + iron ingot)
  - `potion_speed` (+50% movement speed for 30s, craft: bottle + gold ingot)
  - `splash_slowness` (throwable, slows enemies in AoE to 30% speed for 6s, craft: bottle + gravel + cobblestone)
  - `splash_harming` (throwable, deals 6 AoE damage, craft: bottle + flint + coal)
- `Player.ts`: Added `activeEffects` map, `applyEffect()`, `getSpeedMult()`, `getDamageMult()` — effects tick and expire over time; regen accumulates HP fractionally
- `Projectile.ts`: Added `ThrownPotion` pool with physics arc + gravity; `onSplashLand` callback triggers splash effect in `Game.ts`; colored sphere projectile with rotation
- `Game.ts`: Right-click potion handling (drink or throw); strength multiplier applied to melee damage; `onSplashLand` applies slowness/harming AoE to enemies; achievement popups on potion use
- `UI.ts`: Active effects panel in top-right HUD (below wave info) showing colored icons with countdown timers; distinct bottle-shaped pixel icon for potion items; recipe book updated with potion entries
- Dungeon chest loot seeded with potions so players discover them early
- Fixed TypeScript 6.0 compatibility: updated `tsconfig.json` to use `moduleResolution: "Bundler"` and added `moduleResolution: "Bundler"` to `tsconfig.emit.json`

**Ideas for next time:**
- Add a brewing stand block for more authentic Minecraft brewing (requires nether wart, blaze powder)
- Add shield item (right-click to block — reduces damage by 50% while held)
- Add fishing rod + fishing mechanic for between-wave peaceful activity
- Add more block types: fence, trapdoor, slab, stairs — improves fortress building
- Add a trident weapon (melee + throwable)
- Improve enemy variety: add a "Witch" enemy that throws splash potions at the player
- Add potion effects visual feedback: screen tint overlay (subtle color) while effect is active
- Consider adding a "fire resistance" potion that prevents creeper explosion damage
