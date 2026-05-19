import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:6173');
await page.waitForTimeout(2000);

await page.addStyleTag({ content: `
  #app { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
  canvas { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
` });
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(500);

// Inject the furnace overlay directly into the DOM for screenshot
await page.evaluate(() => {
  // Show the furnace overlay
  const furnaceOverlay = document.querySelector('.fps-inventory.overlay.hidden');
  if (furnaceOverlay) {
    furnaceOverlay.style.display = 'flex';
  }
  // Also hide the lock prompt
  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = 'none';
  });
});

await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/furnace-ui.png' });

// Also take inventory screenshot
await page.evaluate(() => {
  document.querySelectorAll('.fps-inventory.overlay.hidden').forEach(el => {
    el.style.display = 'none';
  });
  const invEl = document.getElementById('fps-inventory-overlay');
  if (invEl) invEl.style.display = 'flex';
});

await page.screenshot({ path: 'screenshots/inventory-ui.png' });
await browser.close();

console.log('Screenshots saved to screenshots/furnace-ui.png and screenshots/inventory-ui.png');
