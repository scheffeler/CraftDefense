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
  const b = btns.find(el => el.textContent?.includes('New Map'));
  if (b) b.click();
});
await page.waitForTimeout(3500);

// Hack: override the title camera loop by faking pointer lock and spawning enemies
const result = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return 'no game';
  
  // Override the _titleAngle update by patching isPointerLocked to return true
  // Actually simpler: just override game.scene.isPointerLocked getter
  Object.defineProperty(game.scene, 'isPointerLocked', { get: () => true, configurable: true });
  
  // Set camera to see enemies
  const cam = game.scene.camera;
  cam.position.set(32, 9.5, 44);
  cam.lookAt(32, 8.5, 35);
  
  // Spawn a bunch of enemies to see their faces
  const em = game.enemies;
  em.spawn("zombie",      32, 36);
  em.spawn("goblin",      28, 35);
  em.spawn("goblin",      36, 35);
  em.spawn("zombie",      30, 37);
  em.spawn("orc",         34, 38);
  em.spawn("goblin_miner",26, 36);
  
  return { phase: game.phase, locked: game.scene.isPointerLocked };
});
console.log('Result:', result);
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screenshots/enemies-new.png' });

// Close on zombie
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(31, 9.8, 40);
  cam.lookAt(32, 9, 36);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/zombie-new.png' });

// Close on goblin
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(25, 9.5, 40);
  cam.lookAt(28, 8.8, 35);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/goblin-new.png' });

await browser.close();
console.log('Done!');
