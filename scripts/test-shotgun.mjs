import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-gpu'],
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5176/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4500);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Give player a shotgun and shells, select it
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  const inv = game.inventory;
  // Add shotgun to hotbar directly
  inv.hotbar[8] = { itemId: 'shotgun', count: 1, durability: 150 };
  inv.addItem('shotgun_shell', 16);
  inv._activeSlot = 8;
  game.scene.updateArmItem('shotgun');
  game.ui.updateAmmoDisplay(inv.countItem('shotgun_shell'));

  // Position camera
  const cam = game.scene.camera;
  cam.position.set(32, 8.62, 38);
  cam.lookAt(32, 8.0, 15);
});

await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/shotgun-viewmodel.png' });

const state = await page.evaluate(() => {
  const game = window.__game;
  const inv = game.inventory;
  return {
    hasShotgun: inv.hasItem('shotgun', 1),
    shellCount: inv.countItem('shotgun_shell'),
    activeSlot: inv.activeSlot,
    activeItem: inv.getActiveItem(),
    items: { 
      shotgun: !!inv.hotbar.find(s => s && s.itemId === 'shotgun'),
    }
  };
});
console.log('State:', JSON.stringify(state));

await browser.close();
console.log('Done!');
