# CraftDefense Auto-Iteration Progress

## 2026-05-18 — Potion System & Player Status Effects

**What was done:**
- Added 5 potion items: Healing (instant +8 HP), Regeneration (regen 45s), Swiftness (speed +30% for 60s), Strength (+4 damage for 30s), Fire Resistance (80% explosion reduction for 3min)
- Added `glass_bottle` crafting material (3 glass in V shape → 3 bottles)
- Added `ActiveEffect` system to `Player.ts`: `activeEffects` Map, `applyEffect()`, `speedMultiplier`, `strengthBonus`, `hasFireResistance`
- Potions drink on right-click (instant heal handled separately from timed effects)
- Timed effects tick down in Player.update, `onEffectsChanged` callback fires UI refreshes
- Active effects HUD in top-right corner (colored icons with countdown timers)
- `showPotionEffect()` flash overlay when drinking
- Strength bonus applies to melee damage; Fire Resistance reduces creeper explosion damage from 6→1
- Regeneration potion speeds up HP regen interval from 4s → 1s
- Potions seeded in all 5 dungeon chests
- 6 crafting recipes added to workbench (glass bottle + various ingredients)
- Recipe book updated with potion recipes
- Item tooltips show potion duration/heal amount

**Notes for next run:**
- Could add splash potions (thrown, area effect) — would need projectile extension
- Brewing Stand block (with UI) would give potions a more authentic crafting chain
- Could add potion effects for enemies (slow, weakness — applied by skeleton splash arrows)
- Potion icons look good but a distinct flask SVG shape could be more readable
- The `npm install` step is needed each session (remote env is ephemeral — no node_modules)
- `npx tsc -p tsconfig.emit.json` exits 0 after npm install on this TypeScript 6.0 setup
