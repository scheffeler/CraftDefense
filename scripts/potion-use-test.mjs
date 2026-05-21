import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));

await page.goto('http://localhost:5175/');
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3500);

const result = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return { error: 'no game' };
  
  // Give potions and set active slot
  g.inventory.addItem('potion_healing', 3);
  g.inventory.addItem('potion_strength', 2);
  g.inventory.addItem('splash_slowness', 2);
  g.refreshHotbar();
  
  // Manually call usePotionItem for healing potion
  const hpBefore = g.player.health;
  g.player.health = 10; // take some damage first
  
  // Check game APIs are available
  const hasApplyEffect = typeof g.player.applyEffect === 'function';
  const hasGetDamageMult = typeof g.player.getDamageMult === 'function';
  const hasGetSpeedMult = typeof g.player.getSpeedMult === 'function';
  const hasThrowPotion = typeof g.projectiles.throwPotion === 'function';
  
  g.player.applyEffect('strength', 30, 0.5);
  const dmgMult = g.player.getDamageMult();
  
  g.player.applyEffect('speed', 25, 0.5);
  const spdMult = g.player.getSpeedMult();
  
  g.ui.updateEffects(g.player.activeEffects);
  
  return {
    hasApplyEffect, hasGetDamageMult, hasGetSpeedMult, hasThrowPotion,
    dmgMult, spdMult,
    effectsCount: g.player.activeEffects.size,
    hpBefore: 10,
  };
});

console.log('Potion system test results:', JSON.stringify(result, null, 2));
console.log('Runtime errors:', errors);

await page.screenshot({ path: 'screenshots/potion-use-test.png' });
await browser.close();
