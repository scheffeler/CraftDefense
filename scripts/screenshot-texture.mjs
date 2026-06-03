import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security', '--disable-cache']
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  bypassCSP: true,
});
const page = await context.newPage();

const ts = Date.now();
await page.goto(`http://localhost:5177/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Hide pointer-lock overlay
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Move camera to see blocks with the new textures
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  // Looking across the surface from an aerial angle to see many block types
  cam.position.set(28, 12, 28);
  cam.lookAt(32, 8.0, 40);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/textures-wide.png' });

// Close-up view looking at some blocks
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(32, 8.62, 36);
  cam.lookAt(32, 8.0, 18);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/textures-player-pov.png' });

await browser.close();
console.log('Screenshots saved.');
