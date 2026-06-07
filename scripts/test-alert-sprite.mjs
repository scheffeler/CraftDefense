import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-web-security', '--disable-gpu', '--no-sandbox'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Set up scene for alert sprite demo
const result = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return 'no game';

  // Suppress overlay
  document.querySelectorAll('.fps-lock-prompt, #overlay').forEach(el => {
    el.style.display = 'none';
  });

  game.phase = 'play';
  const cam = game.scene.camera;

  // Position camera looking from south toward north — where enemies will appear
  cam.position.set(32, 10, 38);
  cam.lookAt(32, 8.5, 28);

  // Move internal player position to be exactly 10 units from spawn point
  // (inside the ALERT_DETECTION_RANGE of 13)
  const em = game.enemies;
  if (em && em.setPlayerPosition) {
    em.setPlayerPosition(32, 38, 9);
  }

  // Spawn several enemy types — they'll be at ~(32, ?, 28) area, 10 units from player
  if (em && em.spawn) {
    try { em.spawn("goblin",  30, 28); } catch(e) { /* ignore */ }
    try { em.spawn("orc",     34, 27); } catch(e) { /* ignore */ }
    try { em.spawn("zombie",  32, 26); } catch(e) { /* ignore */ }
    try { em.spawn("skeleton",28, 29); } catch(e) { /* ignore */ }
  }

  return 'ok';
});

console.log('Setup result:', result);
await page.waitForTimeout(500);

// Take screenshot immediately to catch alert sprites at peak opacity
await page.screenshot({ path: 'screenshots/alert-sprite-test.png' });
console.log('Screenshot saved: screenshots/alert-sprite-test.png');

// Wait for sprites to fade and take another screenshot
await page.waitForTimeout(1600);
await page.screenshot({ path: 'screenshots/alert-sprite-faded.png' });
console.log('Screenshot saved: screenshots/alert-sprite-faded.png');

// Check for JS errors
if (errors.length > 0) {
  console.error('JS errors:', errors);
} else {
  console.log('No JS errors detected.');
}

await browser.close();
