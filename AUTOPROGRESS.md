# CraftDefense Auto-Progress Log

## 2026-05-21 — Balrog Boss Enemy (Wave 10 Final Boss)

**What was done:**
- Added "balrog" as a new `EnemyTypeName` in `types.ts`
- Implemented `buildBalrogMesh()` in `Enemy.ts`: large dark volcanic humanoid with glowing orange/red fire elements, swept-back wings, jagged horns, lava belly, and fist glow — uses `balrog_fire` named material for animated emissive pulsing
- Balrog gets an attached `THREE.PointLight` (orange, range 10) for dynamic fire ambience
- Stomp shockwave mechanic: every 6 seconds the Balrog charges (lifts up 0.6 units over 1.2s), then slams down — fires `onBalrogStomp` callback in `Game.ts` which triggers screen shake, radial explosion particles, and deals up to 8 radial damage to the player
- Boss config: 1500 HP, speed 0.65, damage 15, can break walls, drops diamonds + diamond gear
- Wave 10 now has 1 Balrog + 3 trolls north + support enemies south; bonus gold raised to 400
- Boss UI in `UI.ts`:
  - `showBossAnnouncement(title, subtitle)` — dramatic red full-screen CSS animation
  - `updateBossBar(name, hp, maxHp)` — persistent red health bar at screen bottom
  - `hideBossBar()` — called on Balrog death
- On Balrog death: 8 sequential explosions with delay, extra screen shake, "Demon Slayer" achievement
- Wave 10 start triggers "THE BALROG COMES / You shall not pass!" banner instead of normal wave announcement

**Ideas for next run:**
- **Potion system**: Add a brewing stand block + potions (health, speed, strength). Very Minecraft-like and adds new crafting path. Glowstone dust + nether wart (new items) as ingredients
- **Shield item**: Right-click to block melee attacks, reducing damage by 50%. Simple to add, high gameplay value
- **TNT block**: Craftable from sand + coal, explodes when hit/shot. Thematic Helm's Deep defense tool
- **More block types**: Brick, mossy cobblestone, nether brick for building variety
- **Better enemy spawns**: Enemies could spawn from ladders/siege towers instead of just map edges
- **Endgame celebration**: When wave 10 is beaten, show a proper victory cutscene/fireworks
- **Sound for Balrog**: Add a specific roar sound when Balrog spawns (needs audio file)
- **Boss fight music**: Could switch to a more intense track for wave 10
- **Campfire block**: Provides warmth, cooking without furnace, atmosphere
