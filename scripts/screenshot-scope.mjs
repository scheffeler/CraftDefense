import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-cache']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await context.newPage();

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'networkidle' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Move camera to player gameplay position (inside fortress, looking outward)
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (cam) {
    cam.position.set(32, 8.62, 36);
    cam.lookAt(32, 8.0, 18);
    cam.fov = 20; // sniper FOV
    cam.updateProjectionMatrix();
  }
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  window.__game?.ui?.showScopeOverlay(true);
});

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/scope-gameplay.png' });

// Overlay-only screenshot
await page.evaluate(() => {
  const canvas = document.querySelector('#game-canvas');
  if (canvas) canvas.style.visibility = 'hidden';
});
await page.screenshot({ path: 'screenshots/scope-overlay-only.png' });

await browser.close();
console.log('Done');
