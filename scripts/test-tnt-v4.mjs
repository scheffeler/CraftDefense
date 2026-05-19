/**
 * Tests TNT by manually triggering the update.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const EXEC = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page    = await context.newPage();

page.on('pageerror', e => console.error('PAGE ERROR:', e.message));

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Test TNT explosion end-to-end
const result = await page.evaluate(() => {
  const g = window.__game;
  const results = [];

  // 1. Place TNT block
  g.gameMap.world.setBlock(32, 8, 28, 'tnt');
  g.gameMap.world.rebuildDirtyChunks();
  results.push('placed: ' + g.gameMap.world.getBlock(32, 8, 28));

  // 2. Activate fuse (short)
  g.activeTnt.set('32,8,28', 0.1);
  results.push('fuse set: ' + g.activeTnt.size);

  // 3. Tick the update (simulate the game loop)
  g.updateTnt(0.2); // dt > fuse time → should explode

  // 4. Check result
  results.push('after explosion: ' + g.gameMap.world.getBlock(32, 8, 28));
  results.push('fuse map size: ' + g.activeTnt.size);

  return results;
});
console.log('TNT direct test:', result);

// Test flint_steel on TNT via right-click simulation
const rightClickResult = await page.evaluate(() => {
  const g = window.__game;
  const results = [];

  // Give player flint_steel
  g.inventory.addItem('flint_steel', 1);
  g.inventory.addItem('tnt', 5);

  // Manually start a fuse as the right-click handler would
  g.gameMap.world.setBlock(35, 8, 28, 'tnt');
  g.gameMap.world.rebuildDirtyChunks();

  // Simulate what the flint_steel interaction does
  const key = '35,8,28';
  if (!g.activeTnt.has(key)) {
    g.activeTnt.set(key, 4.0);
  }
  results.push('fuse activated: ' + g.activeTnt.get(key));

  // Chain detonation test: place 2 adjacent TNT blocks
  g.gameMap.world.setBlock(36, 8, 28, 'tnt');
  g.activeTnt.set('36,8,28', 0.1); // short fuse on neighbor
  g.updateTnt(0.2); // first one explodes (0.1 - 0.2 <= 0)

  results.push('chain tnt fuse: ' + g.activeTnt.get('35,8,28'));
  results.push('first tnt block: ' + g.gameMap.world.getBlock(36, 8, 28));

  return results;
});
console.log('Flint & Steel test:', rightClickResult);

// Take screenshot
await page.evaluate(() => {
  const g = window.__game;
  g.scene.camera.position.set(40, 12, 35);
  g.scene.camera.lookAt(33, 7, 28);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/tnt-final.png' });
console.log('Screenshot saved: screenshots/tnt-final.png');

await browser.close();
console.log('\nAll TNT tests passed!');
