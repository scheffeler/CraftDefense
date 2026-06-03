import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
});
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3500);

// Hide lock overlay
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Low angle across terrain to see grass, sand, snow blocks  
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(32, 9, 55);
  cam.lookAt(55, 7, 40);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/terrain-close.png' });

// Look at desert area  
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(50, 11, 50);
  cam.lookAt(60, 7, 60);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/desert.png' });

// Look underground to see ore textures
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(32, 4, 32);
  cam.lookAt(28, 2, 28);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/underground.png' });

await browser.close();
console.log('Screenshots saved');
