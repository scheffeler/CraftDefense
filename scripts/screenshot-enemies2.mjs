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

// Click "New Map" (helmsdeep mode)
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('*')];
  const b = btns.find(el => el.textContent?.includes('New Map'));
  if (b) { b.click(); console.log('clicked new map'); }
});
await page.waitForTimeout(4000);

// Force-spawn some enemies and move camera to watch them
const enemyInfo = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return 'no game';
  
  // Start wave to get enemies spawning
  const em = game.enemies;
  
  // Spawn some enemies near center of world
  const id1 = em.spawn("zombie", 32, 35);
  const id2 = em.spawn("goblin", 28, 35);
  const id3 = em.spawn("goblin", 36, 35);
  const id4 = em.spawn("zombie", 30, 36);
  
  // Move camera to ground level looking at spawn area
  const cam = game.scene.camera;
  cam.position.set(32, 10, 48);
  cam.lookAt(32, 8.5, 35);
  
  return { spawned: [id1, id2, id3, id4], phase: game.phase };
});
console.log('Enemy spawn result:', JSON.stringify(enemyInfo));

await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/enemies-wave.png' });

// Close-up on zombie face
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(32, 9.5, 40);
  cam.lookAt(32, 9, 35);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/zombie-face.png' });

// Side view showing goblin ears
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(24, 9.5, 39);
  cam.lookAt(28, 9, 35);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/goblin-ear.png' });

await browser.close();
console.log('Done!');
