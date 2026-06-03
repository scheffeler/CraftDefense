import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);

// Hide the lock prompt and 2nd canvas
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  const canvases = document.querySelectorAll('canvas');
  canvases.forEach((c, i) => { if (i > 0) c.style.display = 'none'; });
});

// Wall close-up at noon
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.5;
  game.scene.camera.position.set(25, 8, 17);
  game.scene.camera.lookAt(32, 9, 18);
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/wall-noon.png' });

// Terrain / grass close-up
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.5;
  game.scene.camera.position.set(8, 8.5, 8);
  game.scene.camera.lookAt(20, 7.5, 20);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/terrain-noon.png' });

// Look straight up at noon sky
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.5;
  game.scene.camera.position.set(32, 9, 32);
  game.scene.camera.lookAt(32, 100, 30);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/sky-up.png' });

// Dawn sky gradient
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.27;
  game.scene.camera.position.set(32, 9, 32);
  game.scene.camera.lookAt(32, 50, 30);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/dawn-up.png' });

// Night sky
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.0;
  game.scene.camera.position.set(32, 9, 32);
  game.scene.camera.lookAt(32, 50, 30);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/night-up.png' });

await browser.close();
console.log('Done');
