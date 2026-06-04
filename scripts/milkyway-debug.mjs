// Debug Milky Way with bright yellow to find where it appears
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

await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.02;

  // Make Milky Way VERY obvious: yellow, huge points, max opacity
  if (g.scene._milkyWay) {
    const mw = g.scene._milkyWay;
    mw.material.color && mw.material.color.setHex(0xffff00); // yellow - won't apply with vertexColors
    mw.material.vertexColors = false; // disable vertex colors so our color shows
    mw.material.color.setHex(0x00ff88); // bright green
    mw.material.opacity = 1.0;
    mw.material.size = 2.0; // huge points
    mw.material.blending = 1; // NormalBlending
    mw.material.needsUpdate = true;
  }

  // Keep stars dim so Milky Way stands out
  if (g.scene.starGroups) {
    for (const sg of g.scene.starGroups) {
      sg.material.opacity = 0.1;
      sg.material.needsUpdate = true;
    }
  }

  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = 'none';
  });
});

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/milkyway-debug.png' });

await browser.close();
console.log('Debug screenshot saved.');
