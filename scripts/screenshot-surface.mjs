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
await page.waitForTimeout(100);

// Use orbit camera at a specific angle to look at the world from above
// The orbit: r=35, h=26 around (32,7,32). Various angles show different areas.

// Angle π/2 (90°): cam at (32, 26, 67), looking at (32,7,32) = looking north from south
await page.evaluate(() => {
  if (window.__game) window.__game._titleAngle = Math.PI / 2;
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/orbit-south.png' });

// Angle 0: cam at (67, 26, 32), looking at (32,7,32) = looking west from east  
await page.evaluate(() => {
  if (window.__game) window.__game._titleAngle = 0;
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/orbit-east.png' });

// Angle 5π/4: cam at SW position to see the NE biomes
await page.evaluate(() => {
  if (window.__game) window.__game._titleAngle = Math.PI * 5 / 4;
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/orbit-sw.png' });

await browser.close();
console.log('Done');
