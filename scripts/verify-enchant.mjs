// Verify enchanting table floating book aura
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-gpu', '--disable-web-security']
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const jsErrors = [];
page.on('console', m => { if (m.type() === 'error') jsErrors.push(m.text()); });
page.on('pageerror', e => jsErrors.push(e.message));

await page.goto('http://localhost:5176/', { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(4000);

const gameLoaded = await page.evaluate(() => !!(window.__game));
console.log('Game loaded:', gameLoaded);

// Manually trigger onBlockPlaced for enchanting_table to test the aura
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  if (g.blockInteraction && g.blockInteraction.onBlockPlaced) {
    g.blockInteraction.onBlockPlaced(32, 8, 32, 'enchanting_table');
  }
});

await page.waitForTimeout(2000);

// Check for JS errors and scene objects
const diagnostics = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return { error: 'no game' };
  const sceneChildren = g.scene.scene.children.length;
  return {
    sceneChildren,
    noErrors: true
  };
});
console.log('Diagnostics:', JSON.stringify(diagnostics));

await page.screenshot({ path: 'screenshots/enchant-aura.png' });
console.log('Screenshot saved: screenshots/enchant-aura.png');

if (jsErrors.length) console.log('JS ERRORS:', jsErrors.join('\n'));
else console.log('No JS errors!');

await browser.close();
