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
await page.waitForTimeout(5000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Look straight up at noon to see zenith color
await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return;
  g.scene._dayTime = 0.5;
  g.scene.camera.position.set(32, 9, 32);
  // look straight up
  g.scene.camera.lookAt(32, 200, 32);
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/zenith-noon.png' });

// Low horizon view at sunset showing gradient
await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return;
  g.scene._dayTime = 0.73;
  g.scene.camera.position.set(32, 9, 32);
  g.scene.camera.lookAt(32, 40, -100);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/sunset-horizon.png' });

// Close-up block texture view
await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return;
  g.scene._dayTime = 0.5;
  g.scene.camera.position.set(32, 9, 42);
  g.scene.camera.lookAt(32, 8, 18);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/blocks-close.png' });

await browser.close();
console.log('Done');
