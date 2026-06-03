import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-gpu']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:5176/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Setup and fire test
const testResult = await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const game = window.__game;
  if (!game) return { error: 'no game' };

  // Enable shooting
  game.phase = 'playing';
  game.mode = 'freeplay';

  // Select pistol
  const pistolSlot = game.inventory?.hotbar?.findIndex(s => s?.itemId === 'pistol') ?? -1;
  if (pistolSlot >= 0) {
    game.inventory.activeSlot = pistolSlot;
    game.scene?.updateArmItem?.('pistol');
  }

  // Position camera looking at known position (will fire into empty space)
  const cam = game.scene?.camera;
  if (cam) {
    cam.position.set(32, 8.62, 32);
    cam.lookAt(32, 8.62, 15); // Looking forward
  }
  if (game.player) game.player.position.set(32, 7, 32);

  const beforeAmmo = game.inventory?.hotbar?.find(s => s?.itemId === 'pistol_ammo')?.count ?? 0;

  // Reset gun cooldown and fire via direct callback
  if (game.player) game.player.gunCooldown = 0;
  game.input?.onLeftClick?.();

  const afterAmmo = game.inventory?.hotbar?.find(s => s?.itemId === 'pistol_ammo')?.count ?? 0;
  const ammoDiff = beforeAmmo - afterAmmo;

  return {
    pistolSlot,
    beforeAmmo,
    afterAmmo,
    ammoDiff,
    shotFired: ammoDiff > 0,
  };
});
console.log('Pistol test result:', JSON.stringify(testResult, null, 2));

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/pistol-viewmodel.png' });
console.log('Screenshot saved');
if (errors.length) console.log('Errors:', errors);
await browser.close();
