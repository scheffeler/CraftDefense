import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Interior view showing fortress walls (cobblestone), crafting tables, torches, etc.
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(32, 8.62, 36);
  game.scene.camera.lookAt(32, 8.0, 18);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/gameplay.png' });

// Aerial view
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(18, 28, 18);
  game.scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/aerial.png' });

// Look at terrain blocks from the outside
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(32, 12, 55);
  game.scene.camera.lookAt(32, 7, 40);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/outside.png' });

await browser.close();
console.log('Screenshots saved');
