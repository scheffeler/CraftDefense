import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-web-security', '--disable-gpu', '--no-sandbox'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(5000);

// Spawn enemies near the camera to screenshot their faces
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;

  // Hide overlay
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  
  // Position camera to look at the scene from ground level
  game.phase = 'play';
  const cam = game.scene.camera;
  cam.position.set(32, 9, 40);
  cam.lookAt(32, 8, 32);

  // Manually spawn test enemies near (32, 8, 30) if enemies object exists
  const em = game.enemies;
  if (em) {
    // Spawn zombie, goblin, orc directly if possible
    try {
      em.spawn(1, "zombie", 30, 8, 30);
      em.spawn(2, "goblin", 28, 8, 28);
      em.spawn(3, "orc",    34, 8, 28);
    } catch(e) { console.log('spawn failed:', e.message); }
  }
});
await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/enemies-face.png' });

// Closer angle on zombie face
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(30, 9, 34);
  cam.lookAt(30, 8.5, 30);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/zombie-closeup.png' });

// Another angle showing goblin ears
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(26, 9, 33);
  cam.lookAt(28, 8.5, 28);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/goblin-closeup.png' });

await browser.close();
console.log('Done!');
