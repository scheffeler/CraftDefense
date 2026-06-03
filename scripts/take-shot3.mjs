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

// Hide UI overlays
await page.evaluate(() => {
  document.querySelectorAll('canvas').forEach((c, i) => {
    if (i > 0) c.style.display = 'none';
  });
});

// Ground level, close to blocks, noon lighting, looking at fortress wall
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.5;
    const cam = game.scene.camera;
    cam.position.set(25, 8, 17);   // just outside north wall
    cam.lookAt(32, 10, 18);        // looking at cobblestone wall
  }
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/wall-close.png' });

// Look at grass from player height
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.5;
    const cam = game.scene.camera;
    cam.position.set(20, 9, 8);
    cam.lookAt(32, 8, 10);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/grass-close.png' });

// Night sky view
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.05;   // near midnight
    const cam = game.scene.camera;
    cam.position.set(32, 9, 32);
    cam.lookAt(32, 25, 0);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/sky-night.png' });

// Sunset sky
await page.evaluate(() => {
  const game = window.__game;
  if (game?.scene) {
    game.scene._dayTime = 0.73;
    const cam = game.scene.camera;
    cam.position.set(32, 9, 32);
    cam.lookAt(32, 18, 0);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/sky-sunset.png' });

await browser.close();
console.log('Screenshots saved');
