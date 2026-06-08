import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
page.on("pageerror", e => console.error("[page-error]", e.message));

await page.goto("http://localhost:5175", { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(5000);

// Verify game loaded
const gameInfo = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: "no game" };
  return {
    hasParticles: !!game.particles,
    hasEnemies: !!game.enemies,
    decalsLen: game.particles.decals?.length ?? 0,
  };
});
console.log("Game info:", JSON.stringify(gameInfo));

// Set up camera
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt, .overlay, #overlay').forEach(el => { el.style.display = 'none'; });
  const game = window.__game;
  if (!game) return;
  game.scene.camera.position.set(28, 10, 38);
  game.scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(300);

// Test death stains are spawned
const stainResults = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: "no game" };
  const p = game.particles;
  const initialDecals = p.decals.length;

  p.spawnEnemyDeath(32, 8, 32, 0x2a5a2a, "zombie");
  const afterZombie = p.decals.length;

  p.spawnEnemyDeath(34, 8, 32, 0x556644, "orc");
  const afterOrc = p.decals.length;

  p.spawnEnemyDeath(30, 8, 32, 0x33aa44, "goblin");
  const afterGoblin = p.decals.length;

  p.spawnEnemyDeath(32, 8, 34, 0x222222, "uruk_captain");
  const afterUruk = p.decals.length;

  return {
    initial: initialDecals,
    zombieAdded: afterZombie - initialDecals,
    orcAdded: afterOrc - afterZombie,
    goblinAdded: afterGoblin - afterOrc,
    urukAdded: afterUruk - afterGoblin,
    totalStains: afterUruk - initialDecals,
  };
});
console.log("Stain results:", JSON.stringify(stainResults));

// Test flashDeath multi-material fix (skeleton shouldn't crash)
const flashResult = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: "no game" };
  try {
    const id = game.enemies.spawn("skeleton", 32, 8, 30);
    if (id == null) return { skeletonSpawned: false };
    game.enemies.damage(id, 9999, 0xffffff, true, 0, 0);
    return { skeletonSpawned: true, nocrash: true };
  } catch (e) {
    return { error: String(e) };
  }
});
console.log("Flash death test:", JSON.stringify(flashResult));

await page.screenshot({ path: 'screenshots/death-stains-result.png', timeout: 10000 }).catch(e => console.log("screenshot skip:", e.message));

await browser.close();
console.log("Done");
