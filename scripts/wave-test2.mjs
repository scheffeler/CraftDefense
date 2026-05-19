import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ args: ['--disable-web-security', '--no-sandbox', '--disable-gpu'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Check wave manager state
const info = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return null;
  return {
    totalWaves: g.waves?.totalWaves,
    wave: g.waves?.wave,
    isEndless: g.waves?.isEndless,
    isEndlessMode: g.waves?.isEndlessMode,
    isLastWave: g.waves?.isLastWave?.(),
  };
});
console.log('Wave info:', JSON.stringify(info));

// Hide lock prompt and take screenshot
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const g = window.__game;
  if (g?.scene?.camera) {
    g.scene.camera.position.set(32, 8.62, 36);
    g.scene.camera.lookAt(32, 8.0, 18);
  }
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/wave-test2.png' });

if (errors.length > 0) console.log('Errors:', errors.slice(0,3));
await browser.close();
console.log('Done');
