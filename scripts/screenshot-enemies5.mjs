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

// Start game
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('*')];
  const b = btns.find(el => el.textContent && el.textContent.includes('New Map'));
  if (b) b.click();
});
await page.waitForTimeout(3500);

// Spawn enemies in open terrain and position camera
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  Object.defineProperty(game.scene, 'isPointerLocked', { get: () => true, configurable: true });
  
  // Spawn enemies far south in open terrain
  game.enemies.spawn("zombie", 32, 56);
  game.enemies.spawn("goblin", 30, 56);
  game.enemies.spawn("goblin", 34, 56);
  game.enemies.spawn("zombie", 28, 57);
  game.enemies.spawn("goblin_miner", 36, 57);
  game.enemies.spawn("orc", 32, 58);
  
  // Camera south of fortress, looking toward enemies (north)
  const cam = game.scene.camera;
  cam.position.set(32, 9.5, 62);
  cam.lookAt(32, 8.5, 56);
});

await page.waitForTimeout(2000);

// Hide all UI
await page.addStyleTag({ content: `
  div:not(#game-canvas) { visibility: hidden !important; }
  canvas { visibility: visible !important; }
` });
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/enemies-open.png' });

// Closer view
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  const cam = game.scene.camera;
  cam.position.set(32, 9.3, 60);
  cam.lookAt(32, 8.8, 56);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/enemies-closer.png' });

// Side angle for goblin ears
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  const cam = game.scene.camera;
  cam.position.set(28, 9.5, 60);
  cam.lookAt(30, 8.8, 56);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/goblin-side.png' });

await browser.close();
console.log('Done!');
