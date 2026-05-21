import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-web-security']
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:5175/');
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Hide the title overlay
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});
await page.waitForTimeout(500);

// Give the player potions via game API
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.inventory.addItem('potion_healing', 2);
  g.inventory.addItem('potion_strength', 1);
  g.inventory.addItem('potion_speed', 1);
  g.inventory.addItem('splash_harming', 2);
  g.inventory.addItem('glass_bottle', 4);
  g.player.applyEffect('strength', 30, 0.5);
  g.player.applyEffect('speed', 20, 0.5);
  g.refreshHotbar();
  g.ui.updateEffects(g.player.activeEffects);
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/potions-hotbar.png' });
console.log('Screenshot saved: screenshots/potions-hotbar.png');

// Check no JS errors occurred
const errors = await page.evaluate(() => window.__errors || []);
console.log('JS errors:', errors);

await browser.close();
// Already closed browser above - add another test
