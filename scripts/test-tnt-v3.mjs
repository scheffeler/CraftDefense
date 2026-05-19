/**
 * Debug TNT fuse mechanism.
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

// Diagnose the issue
const diag = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return { error: 'no game' };

  return {
    phase: g.phase,
    isPointerLocked: g.scene?.isPointerLocked,
    activeTntType: typeof g.activeTnt,
    activeTntIsMap: g.activeTnt instanceof Map,
    // Check if all private fields are accessible
    fields: Object.getOwnPropertyNames(g).filter(k => k.includes('Tnt') || k.includes('tnt') || k.includes('activeCrops')),
  };
});
console.log('Diagnostics:', JSON.stringify(diag, null, 2));

// Try manual fuse tick
const manualResult = await page.evaluate(() => {
  const g = window.__game;
  g.gameMap.world.setBlock(32, 8, 28, 'tnt');
  g.gameMap.world.rebuildDirtyChunks();

  // Set fuse
  g.activeTnt.set('32,8,28', 0.01); // tiny fuse

  // Manually call updateTnt
  const before = g.gameMap.world.getBlock(32, 8, 28);
  g.updateTnt?.(0.1); // might fail if private
  const after = g.gameMap.world.getBlock(32, 8, 28);

  return { before, after, canCallUpdateTnt: typeof g.updateTnt };
});
console.log('Manual tick result:', manualResult);

await browser.close();
