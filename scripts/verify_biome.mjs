import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-gpu'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await context.newPage();

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Overview from high up to see biome color variation
await page.evaluate(() => {
  const cam = window.__game && window.__game.scene && window.__game.scene.camera;
  if (!cam) return;
  cam.position.set(32, 40, 32);
  cam.lookAt(32, 0, 32);
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/biome_top.png' });

// View from outside fortress looking at trees (leaves transparency test)
await page.evaluate(() => {
  const cam = window.__game && window.__game.scene && window.__game.scene.camera;
  if (!cam) return;
  cam.position.set(5, 11, 12);
  cam.lookAt(22, 8, 30);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/biome_trees.png' });

// View across desert biome
await page.evaluate(() => {
  const cam = window.__game && window.__game.scene && window.__game.scene.camera;
  if (!cam) return;
  cam.position.set(45, 12, 55);
  cam.lookAt(20, 6, 25);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/biome_desert.png' });

await browser.close();
console.log('Done');
