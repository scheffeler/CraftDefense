import { chromium } from '@playwright/test';

const browser = await chromium.launch({ args: ['--disable-web-security'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(2500);

// Start freeplay and give player a pistol with some bullets
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  game.ui.onModeSelect('freeplay');
  // Give pistol in slot 0
  game.inventory.hotbar[0] = { itemId: 'pistol', count: 1 };
  // Give 18 bullets in slot 1
  game.inventory.hotbar[1] = { itemId: 'bullet', count: 18 };
  game.inventory.activeSlot = 0;
  game['refreshHotbar']();
});
await page.waitForTimeout(500);

// Check that ammo badge is visible on slot 0
const badgeInfo = await page.evaluate(() => {
  const slot0 = document.querySelectorAll('.fps-hotbar-slot')[0];
  const badge = slot0?.querySelector('.fps-ammo-badge');
  return {
    badgeExists: !!badge,
    badgeVisible: badge?.style.display !== 'none',
    badgeText: badge?.textContent,
    badgeColor: badge?.style.color,
  };
});

console.log('Ammo badge info:', JSON.stringify(badgeInfo, null, 2));
console.log('Badge exists:', badgeInfo.badgeExists ? 'PASS' : 'FAIL');
console.log('Badge visible:', badgeInfo.badgeVisible ? 'PASS' : 'FAIL');
console.log('Badge text (18):', badgeInfo.badgeText === '18' ? 'PASS' : `FAIL (got: ${badgeInfo.badgeText})`);

// Take screenshot showing the badge
await page.screenshot({ path: 'screenshots/ammo-badge.png' });

// Test: switch to another slot - badge should hide
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  game.inventory.activeSlot = 2;
  game['refreshHotbar']();
});
await page.waitForTimeout(200);

const badgeAfterSwitch = await page.evaluate(() => {
  const slot0 = document.querySelectorAll('.fps-hotbar-slot')[0];
  const badge = slot0?.querySelector('.fps-ammo-badge');
  return { visible: badge?.style.display !== 'none' };
});
console.log('Badge hidden after slot switch:', !badgeAfterSwitch.visible ? 'PASS' : 'FAIL');

// Test: equip pistol in slot 2 with low ammo (red badge)
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  game.inventory.hotbar[2] = { itemId: 'pistol', count: 1 };
  // Clear previous bullets, give only 5 (< 20% of 64)
  game.inventory.hotbar[1] = { itemId: 'bullet', count: 5 };
  game['refreshHotbar']();
});
await page.waitForTimeout(200);

const lowAmmoInfo = await page.evaluate(() => {
  const slot2 = document.querySelectorAll('.fps-hotbar-slot')[2];
  const badge = slot2?.querySelector('.fps-ammo-badge');
  return { text: badge?.textContent, color: badge?.style.color, visible: badge?.style.display !== 'none' };
});
console.log('Low ammo badge (5 bullets):', JSON.stringify(lowAmmoInfo));
console.log('Low ammo badge red:', lowAmmoInfo.color === 'rgb(255, 68, 68)' ? 'PASS' : `FAIL (got: ${lowAmmoInfo.color})`);

await page.screenshot({ path: 'screenshots/ammo-badge-low.png' });

console.log('Console errors:', errors.slice(0, 3));
await browser.close();
console.log('All ammo badge tests complete!');
