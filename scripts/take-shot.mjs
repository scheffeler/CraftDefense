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
await page.waitForTimeout(4000);

await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene?.camera) {
    game.scene.camera.position.set(32, 8.62, 36);
    game.scene.camera.lookAt(32, 8.0, 18);
  }
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/current.png' });

await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene?.camera) {
    game.scene.camera.position.set(18, 28, 18);
    game.scene.camera.lookAt(32, 7, 32);
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/title.png' });

await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene?.camera) {
    game.scene.camera.position.set(32, 12, 0);
    game.scene.camera.lookAt(32, 8, 32);
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/sky.png' });

await browser.close();
console.log('Screenshots saved');
