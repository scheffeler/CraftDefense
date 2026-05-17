import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
page.on('console', msg => { if (msg.type() === 'error') console.error('CONSOLE ERR:', msg.text()); });

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(2500);

// Start freeplay
await page.evaluate(() => window.__game?.ui?.onModeSelect?.('freeplay'));
await page.waitForTimeout(1500);

// Setup crossbow and simulate loading via UI update directly
const result = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: 'no game' };
  
  // Give crossbow and arrows
  game.inventory.hotbar[0] = { itemId: 'crossbow', count: 1 };
  game.inventory.hotbar[1] = { itemId: 'arrow_item', count: 64 };
  game.inventory.activeSlot = 0;
  game.refreshHotbar?.();
  
  // Manually trigger loading state and force UI update
  game.player.startCrossbowLoad();
  // Simulate 0.5s of loading (partial)
  game.player.crossbowLoadProgress = 0.5;
  // Force UI update
  game.ui.updateCrossbowProgress(0.5, true, false);
  
  const bar = document.querySelector('.fps-crossbow-bar');
  const fill = document.querySelector('.fps-crossbow-fill');
  return {
    barDisplay: bar?.style.display,
    fillWidth: fill?.style.width,
    isLoading: game.player.isCrossbowLoading,
  };
});
console.log('Loading state (50%):', result);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  const game = window.__game;
  if (game?.scene?.camera) {
    game.scene.camera.position.set(32, 8.62, 30);
    game.scene.camera.lookAt(32, 8.0, 15);
  }
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/crossbow-loading.png' });

// Simulate fully loaded state
const loaded = await page.evaluate(() => {
  const game = window.__game;
  game.player.isCrossbowLoading = false;
  game.player.isCrossbowLoaded = true;
  game.player.crossbowLoadProgress = 1;
  game.ui.updateCrossbowProgress(1, false, true);
  
  const bar = document.querySelector('.fps-crossbow-bar');
  const fill = document.querySelector('.fps-crossbow-fill');
  return {
    barDisplay: bar?.style.display,
    fillWidth: fill?.style.width,
    fillBg: fill?.style.background,
  };
});
console.log('Loaded state (100%):', loaded);
await page.screenshot({ path: 'screenshots/crossbow-loaded.png' });

// Verify crossbow icon in hotbar
const iconCheck = await page.evaluate(() => {
  const hotbarSlots = document.querySelectorAll('.fps-hotbar-slot img');
  return hotbarSlots.length > 0 ? 'hotbar has icons' : 'no icons';
});
console.log('Hotbar icons:', iconCheck);

await browser.close();
console.log('Done');
