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

// Hide all UI overlays to see the world
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt, .ui-overlay, #ui, .hud').forEach(el => {
    el.style.display = 'none';
  });
  // Also hide any canvas-2d HUD elements
  document.querySelectorAll('canvas').forEach((c, i) => {
    if (i > 0) c.style.display = 'none';
  });
});

// Noon view: look at sky from ground level
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.5; // set to noon
    const cam = game.scene.camera;
    cam.position.set(32, 9, 32);
    cam.lookAt(32, 20, 0); // looking up and north toward sky
  }
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/sky-noon.png' });

// Dawn view  
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.27;
    const cam = game.scene.camera;
    cam.position.set(32, 9, 32);
    cam.lookAt(32, 18, 0);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/sky-dawn.png' });

// Full world view showing blocks and sky together (daytime)
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.5;
    const cam = game.scene.camera;
    cam.position.set(4, 22, 4);
    cam.lookAt(40, 7, 40);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/world-day.png' });

// Ground-level view showing block textures
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.5;
    const cam = game.scene.camera;
    cam.position.set(32, 8.5, 48);
    cam.lookAt(32, 7.5, 20);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/blocks.png' });

await browser.close();
console.log('Screenshots saved');
