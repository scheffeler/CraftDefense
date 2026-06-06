import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(4500);

const result = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: 'No game' };
  const hasSnow = game.weather && typeof game.weather.setTaigaSnow === 'function';
  const hasBlockPlace = game.particles && typeof game.particles.spawnBlockPlace === 'function';
  if (hasSnow) game.weather.setTaigaSnow(true);
  if (hasBlockPlace) game.particles.spawnBlockPlace(30, 5, 30, 'grass');
  return { hasSnow, hasBlockPlace, sceneChildren: game.scene?.scene?.children?.length ?? 0 };
});

console.log('Result:', JSON.stringify(result, null, 2));
if (errors.length) console.log('Errors:', errors.slice(0, 3));

await page.evaluate(() => {
  const g = window.__game;
  if (!g?.scene?.camera) return;
  g.scene.camera.position.set(55, 10, 5);
  g.scene.camera.lookAt(45, 7, 15);
  if (g.weather) g.weather.setTaigaSnow(true);
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screenshots/verify-snow.png' });

await browser.close();
console.log('Screenshot saved: screenshots/verify-snow.png');
