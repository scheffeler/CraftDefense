// Test the Milky Way night sky visuals
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5175');
await page.waitForTimeout(3000);

// Hide lock prompt
await page.evaluate(() => {
  const el = document.querySelector('.fps-lock-prompt');
  if (el) el.style.display = 'none';
});

// Set to midnight and tilt camera to look at sky
await page.evaluate(() => {
  const g = window.__game;
  if (g && g.scene) {
    g.scene._dayTime = 0.0;
    // Point camera directly up to see the full sky
    g.scene.camera.rotation.set(-Math.PI / 2.2, 0, 0);
  }
});

await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/milkyway-zenith.png' });

// Diagonal sky view
await page.evaluate(() => {
  const g = window.__game;
  if (g && g.scene) {
    g.scene._dayTime = 0.0;
    g.scene.camera.rotation.set(-0.9, 0.5, 0);
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-diagonal.png' });

// Full night view from horizon
await page.evaluate(() => {
  const g = window.__game;
  if (g && g.scene) {
    g.scene._dayTime = 0.0;
    g.scene.camera.rotation.set(-0.35, 0, 0);
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-horizon.png' });

await browser.close();
console.log('Milky Way screenshots saved.');
