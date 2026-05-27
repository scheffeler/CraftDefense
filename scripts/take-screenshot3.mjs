import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3500);

// Use the exposed camera directly
await page.evaluate(() => {
  const cam = window.__GAME_CAMERA__;
  if (cam) {
    cam.position.set(32, 8.62, 36);
    const THREE = window.__game?.scene?.camera ? null : null; // not needed
    // Look north toward gate
    cam.lookAt(32, 8, 18);
  }
});

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/fortress-new.png' });

// Overhead view
await page.evaluate(() => {
  const cam = window.__GAME_CAMERA__;
  if (cam) {
    cam.position.set(18, 28, 18);
    cam.lookAt(32, 7, 32);
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/overhead-new.png' });

// Check game objects
const info = await page.evaluate(() => {
  return {
    hasGame: !!window.__game,
    hasCamera: !!window.__GAME_CAMERA__,
    cameraPos: window.__GAME_CAMERA__ ? 
      `${window.__GAME_CAMERA__.position.x.toFixed(1)}, ${window.__GAME_CAMERA__.position.y.toFixed(1)}, ${window.__GAME_CAMERA__.position.z.toFixed(1)}` : 'none'
  };
});
console.log('Game info:', JSON.stringify(info));

await browser.close();
console.log('Screenshots saved');
