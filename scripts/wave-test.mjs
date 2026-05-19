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

const gameExists = await page.evaluate(() => typeof window.__game !== 'undefined');
console.log('Game loaded:', gameExists);

const waveInfo = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return null;
  return {
    totalWaves: g.waves?.totalWaves,
    currentWave: g.waves?.wave,
    isEndlessMode: g.waves?.isEndlessMode,
    isLastWave: g.waves?.isLastWave?.(),
  };
});
console.log('Wave info:', JSON.stringify(waveInfo));

// Take screenshot
await page.screenshot({ path: 'screenshots/endless-test.png' });

if (errors.length > 0) {
  console.log('Console errors:', errors.slice(0, 5));
}

await browser.close();
console.log('Test complete');
