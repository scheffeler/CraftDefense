import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--disable-cache', '--no-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await context.newPage();
await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(6000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Night view - fortress wall with torches
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.02;
  const cam = game.scene.camera;
  cam.position.set(24, 10, 30);
  cam.lookAt(18, 8, 18);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screenshots/torch-night.png' });

// Close-up of a torch
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.02;
  const cam = game.scene.camera;
  cam.position.set(19.5, 8.8, 21);
  cam.lookAt(19.5, 9.2, 18.5);
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/torch-closeup.png' });

await browser.close();
console.log('Done');
