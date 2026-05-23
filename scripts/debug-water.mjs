import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(5000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  window.__game.phase = 'gameover';
});

// Nice angle showing the pond from slightly above, with terrain context
await page.evaluate(() => {
  const cam = window.__game.scene.camera;
  cam.up.set(0, 1, 0);
  cam.position.set(16, 10, 24);
  cam.lookAt(8, 6.5, 14);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/water-nice.png' });

// Look across water from just above water level
await page.evaluate(() => {
  const cam = window.__game.scene.camera;
  cam.up.set(0, 1, 0);
  cam.position.set(-2, 7.8, 15);
  cam.lookAt(14, 7.1, 15);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/water-level.png' });

// Lava pool (check if there are any lava areas) - dungeon lava
await page.evaluate(() => {
  const cam = window.__game.scene.camera;
  cam.up.set(0, 1, 0);
  cam.position.set(32, 12, 55);
  cam.lookAt(32, 4, 42);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/lava-area.png' });

await browser.close();
console.log('Done');
