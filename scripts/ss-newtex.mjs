import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-web-security'],
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });
await page.goto('http://localhost:5176/', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(4000);
await page.screenshot({ path: 'screenshots/newtex-overview.png' });
console.log('Screenshot saved: screenshots/newtex-overview.png');

// Look down at the ground for block texture view
await page.evaluate(() => {
  if (window.game && window.game.camera) {
    window.game.camera.rotation.x = -1.2; // look down
  }
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/newtex-ground.png' });
console.log('Screenshot saved: screenshots/newtex-ground.png');

await browser.close();
