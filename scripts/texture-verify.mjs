import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt, .overlay').forEach(el => { el.style.display = 'none'; });
});

// View the crafting table + furnace + chest at (39, 7, 29..30)
// Camera: from inside fortress looking at those blocks
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(44, 9.5, 29);
  cam.lookAt(38, 7.5, 29.5);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/crafting-furnace-chest.png' });

// Look at the fortress walls (cobblestone) from outside north
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(32, 12, 8);
  cam.lookAt(32, 8, 18);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/fortress-north.png' });

// Look from outside at snowy/grassy terrain near the world edge
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(10, 10, 10);
  cam.lookAt(25, 7, 25);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/terrain-mix.png' });

await browser.close();
console.log('Texture verification screenshots saved');
