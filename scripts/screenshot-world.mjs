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

// Set up camera to view fortress EXTERIOR from outside
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  Object.defineProperty(game.scene, 'isPointerLocked', { get: () => true, configurable: true });
  const cam = game.scene.camera;
  // View from outside the fortress south entrance, looking north 
  cam.position.set(32, 11, 62);
  cam.lookAt(32, 9, 45);
});
await page.waitForTimeout(1000);

// Hide UI
await page.addStyleTag({ content: `
  div:not(#game-canvas) { visibility: hidden !important; }
  canvas { visibility: visible !important; }
` });
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/world-exterior.png' });

// Now position for overhead view
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  const cam = game.scene.camera;
  cam.position.set(50, 18, 50);
  cam.lookAt(35, 8, 35);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/world-overhead.png' });

// Look at the wall from close up for texture detail
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  const cam = game.scene.camera;
  cam.position.set(32, 9.5, 55);
  cam.lookAt(32, 8, 48);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/wall-detail.png' });

await browser.close();
console.log('Done!');
