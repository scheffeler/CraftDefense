import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load', timeout: 15000 });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(5000);

// Stop the title animation and move camera to close terrain view
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  // Freeze title angle
  g._titleAngle = 0;
  // Move camera close to the ground to see blocks
  const cam = g.scene.camera;
  cam.position.set(32, 9, 48);
  // Set rotation manually to look forward at fortress
  cam.rotation.order = 'YXZ';
  cam.rotation.x = -0.15;
  cam.rotation.y = Math.PI;
  cam.rotation.z = 0;
  cam.updateMatrixWorld(true);
});

// Force several renders
await page.waitForTimeout(600);

// Get canvas content
const frameDataURL = await page.evaluate(() => {
  const c = document.getElementById('game-canvas');
  if (!c) {
    const canvases = document.querySelectorAll('canvas');
    for (const cv of canvases) {
      if (cv.width > 500) try { return cv.toDataURL('image/png'); } catch(e) { return null; }
    }
    return null;
  }
  try { return c.toDataURL('image/png'); } catch(e) { return null; }
});

if (frameDataURL && frameDataURL.startsWith('data:image/png;base64,')) {
  const base64 = frameDataURL.replace('data:image/png;base64,', '');
  writeFileSync('screenshots/terrain-eye-level.png', Buffer.from(base64, 'base64'));
  console.log('Eye-level view captured');
}

// Another angle: looking down at grass from above at close range
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  const cam = g.scene.camera;
  cam.position.set(34, 12, 36);
  cam.rotation.x = -1.2;
  cam.rotation.y = 0;
  cam.rotation.z = 0;
  cam.updateMatrixWorld(true);
});
await page.waitForTimeout(400);
const frame2 = await page.evaluate(() => {
  const canvases = document.querySelectorAll('canvas');
  for (const cv of canvases) {
    if (cv.width > 500) try { return cv.toDataURL('image/png'); } catch(e) { return null; }
  }
  return null;
});
if (frame2 && frame2.startsWith('data:')) {
  writeFileSync('screenshots/terrain-overhead-close.png', Buffer.from(frame2.split(',')[1], 'base64'));
  console.log('Close overhead view captured');
}

await browser.close();
console.log('Done.');
