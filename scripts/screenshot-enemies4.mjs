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

// Click "New Map" 
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('*')];
  const b = btns.find(el => el.textContent && el.textContent.includes('New Map'));
  if (b) b.click();
});
await page.waitForTimeout(3500);

// Set up scene and spawn enemies
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  Object.defineProperty(game.scene, 'isPointerLocked', { get: () => true, configurable: true });
  const cam = game.scene.camera;
  cam.position.set(32, 9.5, 44);
  cam.lookAt(32, 8.5, 35);
  game.enemies.spawn("zombie", 32, 36);
  game.enemies.spawn("goblin", 28, 35);
  game.enemies.spawn("goblin", 36, 35);
  game.enemies.spawn("zombie", 30, 37);
  game.enemies.spawn("goblin_miner", 26, 36);
});
await page.waitForTimeout(2000);

// Aggressively hide all overlay divs
await page.addStyleTag({ content: `
  div:not(#game-canvas) { visibility: hidden !important; }
  canvas { visibility: visible !important; }
  #minimap, #hud, #hotbar, #crosshair { visibility: visible !important; }
` });
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/enemies-final.png' });

// Closer view
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  const cam = game.scene.camera;
  cam.position.set(32, 9.3, 41);
  cam.lookAt(32, 8.8, 35);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/enemies-zoom.png' });

await browser.close();
console.log('Done!');
