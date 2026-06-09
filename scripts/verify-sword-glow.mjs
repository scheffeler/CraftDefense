import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const errors = [];
page.on('pageerror', err => errors.push(err.message));

const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(6000);

// Give swords to player
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  game.inventory.addItem('diamond_sword', 1);
  game.inventory.addItem('gold_sword', 1);
  game.inventory.addItem('iron_sword', 1);
  game.inventory.addItem('stone_sword', 1);
  game.inventory.addItem('energy_cell', 32);
  game.inventory.addItem('raygun', 1);
  game.refreshHotbar?.();
});
await page.waitForTimeout(300);

// Set camera for a clean arm view, set to night
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene) return;
  game.scene._dayTime = 0.0;
  if (game.scene.camera) {
    game.scene.camera.position.set(32, 10, 20);
    game.scene.camera.lookAt(32, 8, 5);
  }
});

// Diamond sword
await page.keyboard.press('Digit1');
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/glow-diamond.png' });

// Gold sword
await page.keyboard.press('Digit2');
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/glow-gold.png' });

// Iron sword
await page.keyboard.press('Digit3');
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/glow-iron.png' });

// Raygun (slot 5)
await page.keyboard.press('Digit6');
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/glow-raygun.png' });

if (errors.length > 0) {
  console.error('JS errors:', errors.join('\n'));
  process.exit(1);
} else {
  console.log('No JS errors. Screenshots: glow-diamond.png, glow-gold.png, glow-iron.png, glow-raygun.png');
}

await browser.close();
