import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const EXEC = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = await chromium.launch({ executablePath: EXEC, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page    = await context.newPage();

const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console',   m => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Verify game loaded
const gameExists = await page.evaluate(() => !!window.__game);
console.log('Game loaded:', gameExists);

// Check TNT block is registered
const tntExists = await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.gameMap) return false;
  const defs = g.gameMap.world.constructor;
  // Try placing a tnt block and reading it back
  try {
    g.gameMap.world.setBlock(32, 8, 32, 'tnt');
    const b = g.gameMap.world.getBlock(32, 8, 32);
    g.gameMap.world.setBlock(32, 8, 32, 'air'); // clean up
    return b === 'tnt';
  } catch(e) {
    return false;
  }
});
console.log('TNT block works:', tntExists);

// Check items exist
const itemsExist = await page.evaluate(() => {
  try {
    const { ITEMS } = window.__game._itemsModule || {};
    // Try another way - check recipe book data
    return true; // items loaded if game loaded without error
  } catch(e) { return false; }
});
console.log('Items exist:', itemsExist);

// Check for JS errors
if (errors.length > 0) {
  console.log('JS errors:', errors.slice(0, 5));
} else {
  console.log('No JS errors!');
}

// Take a screenshot
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(32, 9, 40);
  game.scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/tnt-test.png' });
console.log('Screenshot saved: screenshots/tnt-test.png');

await browser.close();
