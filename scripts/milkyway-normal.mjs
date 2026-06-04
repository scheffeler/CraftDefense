// Show Milky Way with slightly boosted but normal settings
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5175');
await page.waitForTimeout(5000);

// Restore normal appearance but slightly boosted
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.02; // midnight

  if (g.scene._milkyWay) {
    const mw = g.scene._milkyWay;
    mw.material.vertexColors = true;  // restore vertex colors
    mw.material.blending = 2;          // AdditiveBlending
    mw.material.opacity = 0.55;        // slightly boosted vs production 0.38
    mw.material.size = 0.40;           // slightly larger than 0.28
    mw.material.needsUpdate = true;
  }
  if (g.scene.starGroups) {
    for (const sg of g.scene.starGroups) {
      sg.material.opacity = 0.85;
      sg.material.size = 0.6;
      sg.material.needsUpdate = true;
    }
  }

  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = 'none';
  });
});

await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/milkyway-normal1.png' });

// Rotate camera to look at where the band is visible (upper right)
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.02;
  // Look toward right side of map where band was visible
  const cam = g.scene.camera;
  // Don't change position, just adjust to look more rightward/upward
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/milkyway-normal2.png' });

await browser.close();
console.log('Normal appearance screenshots saved.');
