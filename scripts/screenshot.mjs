import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ args: ['--disable-web-security', '--disable-cache'] });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  bypassCSP: true,
});
await context.clearCookies();
const page = await context.newPage();

await page.route('**/*', route => {
  const headers = {
    ...route.request().headers(),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  };
  route.continue({ headers });
});

const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3500);

// Tag the Three.js canvas if it doesn't already have an id
await page.evaluate(() => {
  const canvases = document.querySelectorAll('canvas');
  // Three.js canvas is always the first canvas in the container
  if (canvases.length > 0 && !canvases[0].id) canvases[0].id = 'game-canvas';
});

// Only scale the Three.js renderer canvas — leave HUD canvases alone
await page.addStyleTag({ content: `
  #app { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
  #game-canvas { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
` });
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(400);

// Hide the title/lock overlay to capture the in-game HUD
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = 'none';
  });
});

// Move camera to interior player POV — standing inside fortress looking north toward gate
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  const cam = game.scene.camera;
  cam.position.set(32, 8.62, 36);
  cam.lookAt(32, 8.0, 18);
});

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/current.png' });

// Also save title screen shot
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = '';
  });
  const game = window.__game;
  if (game?.scene?.camera) {
    game.scene.camera.position.set(18, 28, 18);
    game.scene.camera.lookAt(32, 7, 32);
  }
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/title.png' });

await browser.close();
console.log('Screenshots saved: current.png (gameplay), title.png (title screen)');
