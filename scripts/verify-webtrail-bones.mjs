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

await page.goto("http://localhost:3000", { waitUntil: "networkidle", timeout: 20000 });
await page.waitForTimeout(5000);

// Verify game loaded and check particle systems are accessible
const gameInfo = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: "no game" };
  return {
    hasParticles: !!game.particles,
    hasEnemies: !!game.enemies,
    webTrailDrops: game.enemies._webTrailDrops?.length ?? "not found",
    decalsLen: "accessible"
  };
});
console.log("Game info:", JSON.stringify(gameInfo));

// Hide overlay and view game
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  const game = window.__game;
  if (!game) return;
  game.scene.camera.position.set(25, 12, 45);
  game.scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/verify-init.png' });

// Verify web trail drops array is reachable and starts empty
const trailCheck = await page.evaluate(() => {
  const game = window.__game;
  const drops = game.enemies._webTrailDrops;
  return { isArray: Array.isArray(drops), length: drops?.length };
});
console.log("Trail drops:", JSON.stringify(trailCheck));

// Spawn spider, wait for web to be shot
await page.evaluate(() => {
  const game = window.__game;
  const id = game.enemies.spawn("spider");
  const mesh = game.enemies.meshes.get(id);
  if (mesh) mesh.position.set(35, 8, 35);
  // Set player pos so spider wants to spit web
  game.enemies._playerX = 32; game.enemies._playerY = 8.5; game.enemies._playerZ = 32;
});
await page.waitForTimeout(6000); // wait for spider web interval (4.5s)
const afterSpider = await page.evaluate(() => {
  const game = window.__game;
  return { drops: game.enemies._webTrailDrops?.length ?? -1 };
});
console.log("After spider (web may have fired):", JSON.stringify(afterSpider));
await page.screenshot({ path: 'screenshots/verify-spider.png' });

await browser.close();
console.log("Done");
