import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5175');
await page.waitForTimeout(1200);

// Force the canvas to fill the full viewport for screenshots
await page.addStyleTag({ content: `
  #app { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
  canvas { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
` });
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(800);

// Hide pointer-lock overlay so the actual HUD is visible
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt, .mode-select').forEach(el => {
    el.style.display = 'none';
  });
});

await page.screenshot({ path: 'screenshots/current.png' });
await browser.close();

console.log('Screenshot saved to screenshots/current.png');
