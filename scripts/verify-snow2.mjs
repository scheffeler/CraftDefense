import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: [
    '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage',
    '--disable-gpu-sandbox', '--disable-gpu', '--use-gl=swiftshader'
  ]
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const errors = [];
page.on('console', msg => { 
  if (msg.type() === 'error') errors.push(msg.text());
  else if (msg.text().includes('Game') || msg.text().includes('snow')) console.log('[console]', msg.text());
});

await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);

const hasCanvas = await page.locator('canvas').count();
console.log('Canvas count:', hasCanvas);

const result = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: 'No __game' };
  const hasSnow = game.weather && typeof game.weather.setTaigaSnow === 'function';
  const hasBlockPlace = game.particles && typeof game.particles.spawnBlockPlace === 'function';
  return { hasSnow, hasBlockPlace, gameType: typeof game };
});

console.log('Result:', JSON.stringify(result));
console.log('Errors:', errors.slice(0, 3));

if (result.hasSnow || result.hasBlockPlace) {
  await page.evaluate(() => {
    const g = window.__game;
    if (g?.weather) g.weather.setTaigaSnow(true);
    document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
    if (g?.scene?.camera) {
      g.scene.camera.position.set(55, 10, 5);
      g.scene.camera.lookAt(45, 7, 15);
    }
  });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshots/verify-snow.png' });
  console.log('Screenshot saved');
}

await browser.close();
