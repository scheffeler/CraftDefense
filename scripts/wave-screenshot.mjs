import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ args: ['--disable-web-security', '--no-sandbox', '--disable-gpu'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Hide pointer lock prompt to see game
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Set camera to good view
await page.evaluate(() => {
  const g = window.__game;
  if (g?.scene?.camera) {
    g.scene.camera.position.set(32, 8.62, 36);
    g.scene.camera.lookAt(32, 8.0, 18);
  }
});

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/wave-hud.png' });

// Test endless wave generation - simulate completing wave 10
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  // Simulate wave 10 completion to trigger endless mode
  g.waves._endlessMode = false; // ensure clean state  
});

await browser.close();
console.log('Screenshot saved to screenshots/wave-hud.png');
