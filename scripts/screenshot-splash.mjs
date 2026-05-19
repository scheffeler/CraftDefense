// Screenshots the splash and in-game HUD
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:6173');
await page.addStyleTag({ content: `
  #app { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
  canvas { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
` });
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(3500);

// Splash screen (before clicking)
await page.screenshot({ path: 'screenshots/splash.png' });

// HUD screenshot — hide the pointer-lock prompt to see the game world
await page.evaluate(() => {
  const el = document.querySelector('.fps-lock-prompt');
  if (el) el.style.display = 'none';
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/current.png' });

await browser.close();
console.log('Screenshots saved: screenshots/splash.png + screenshots/current.png');
