import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4500);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt, .overlay').forEach(el => { el.style.display = 'none'; });
});

// Force the game into a state where camera is free  
// Temporarily override the title camera update and force camera position
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  // Override the phase to prevent title camera from running
  // Also directly manipulate the camera
  const cam = game.scene.camera;
  // Stop the title camera by faking pointer lock
  game.scene._forceCameraOverride = true;
  cam.position.set(44, 9.5, 29);
  cam.lookAt(38, 7.5, 29.5);
  // Freeze the game loop camera override
  const origUpdate = game._titleAngle;
  game._titleAngle = undefined; // this won't work...
});
await page.waitForTimeout(100);
await page.screenshot({ path: 'screenshots/test-camera.png' });

await browser.close();
console.log('Done');
