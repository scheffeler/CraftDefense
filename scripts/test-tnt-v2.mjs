/**
 * Tests TNT gameplay with proper timing.
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const EXEC = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page    = await context.newPage();

const errors = [];
page.on('pageerror', e => errors.push(e.message));

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Place TNT block and start fuse
await page.evaluate(() => {
  const g = window.__game;
  // Place TNT at a visible spot
  g.gameMap.world.setBlock(32, 8, 28, 'tnt');
  g.gameMap.world.rebuildDirtyChunks();
  // Direct access to private field works at runtime
  g.activeTnt.set('32,8,28', 0.5); // 500ms fuse
});

// Position camera to watch
await page.evaluate(() => {
  const g = window.__game;
  g.scene.camera.position.set(32, 10, 36);
  g.scene.camera.lookAt(32, 8, 28);
});

// Take screenshot before explosion
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/tnt-before.png' });
console.log('Before explosion screenshot saved');

// Wait for fuse to expire (game loop runs at ~60fps)
await page.waitForTimeout(800);

// Check if explosion happened
const afterBlock = await page.evaluate(() => {
  const g = window.__game;
  return {
    block: g.gameMap.world.getBlock(32, 8, 28),
    fusesRemaining: g.activeTnt.size,
  };
});
console.log('After explosion:', afterBlock);

// Take screenshot after explosion
await page.screenshot({ path: 'screenshots/tnt-after.png' });
console.log('After explosion screenshot saved');

// Test recipe existence by checking ITEMS
const itemsCheck = await page.evaluate(() => {
  // Access via the crafting module
  const hasGunpowder = !!window.__game?._itemsRef?.gunpowder;
  // The items are loaded statically - check via inventory test
  try {
    // Try to add items directly
    const g = window.__game;
    g.inventory.addItem('gunpowder', 4);
    g.inventory.addItem('tnt', 2);
    g.inventory.addItem('flint_steel', 1);
    const has = g.inventory.hasItem('tnt', 1);
    return { gunpowder: g.inventory.hasItem('gunpowder', 4), tnt: has, flint_steel: g.inventory.hasItem('flint_steel', 1) };
  } catch(e) { return { error: String(e) }; }
});
console.log('Items check:', itemsCheck);

const realErrors = errors.filter(e => !e.includes('ERR_CERT') && !e.includes('favicon'));
console.log('JS errors:', realErrors.length > 0 ? realErrors : 'none');

await browser.close();
console.log('\nTest complete!');
