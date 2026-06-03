import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security']
});
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto(`http://localhost:5178/`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4500);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// SE corner - shows sand desert biome (if exists)
await page.evaluate(() => {
  if (window.__game) window.__game._titleAngle = Math.PI * 1.75;
});
await page.waitForTimeout(350);
await page.screenshot({ path: 'screenshots/biome-se.png' });

// Low angle from just outside fortress south, looking north, showing grass side blocks
await page.evaluate(() => {
  if (window.__game) window.__game._titleAngle = Math.PI * 0.6;
});
await page.waitForTimeout(350);
await page.screenshot({ path: 'screenshots/grass-close.png' });

await browser.close();
console.log('Done');
