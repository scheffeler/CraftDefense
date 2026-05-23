import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Hide title overlay
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Pond at x=8, z=15, surface at Y=6 (water at Y=6, top face at Y=7)
// Camera looks at the pond from above/angle
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(8, 10, 22);
  cam.lookAt(8, 7, 15);
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/water-view.png' });

// Close-up from near water level, from a slightly higher angle
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(2, 8, 18);
  game.scene.camera.lookAt(8, 7, 15);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/water-side.png' });

// Look from the other pond (x=10, z=35)
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(3, 9, 40);
  game.scene.camera.lookAt(10, 7, 35);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/water-side2.png' });

// Overview to check everything else looks fine
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(18, 28, 18);
  game.scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/overview.png' });

await browser.close();
console.log('Done: water-view.png, water-side.png, water-side2.png, overview.png');
