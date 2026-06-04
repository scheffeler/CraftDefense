// View night sky from title screen aerial camera (no game start)
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

// DON'T start game — title screen has fixed aerial camera at (18, 28, 18) looking at (32, 7, 32)
// This should show more sky above

await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;

  // Set to midnight
  g.scene._dayTime = 0.02;

  // Boost Milky Way for visibility test
  if (g.scene._milkyWay) {
    g.scene._milkyWay.material.opacity = 0.8;
    g.scene._milkyWay.material.size = 0.6;
    g.scene._milkyWay.material.needsUpdate = true;
  }
  if (g.scene.starGroups) {
    for (const sg of g.scene.starGroups) {
      sg.material.opacity = 0.9;
      sg.material.needsUpdate = true;
    }
  }

  // Hide menu overlay
  document.querySelectorAll('.fps-lock-prompt, .menu, [class*="menu"], [class*="modal"]').forEach(el => {
    el.style.display = 'none';
  });

  // Move camera to see more sky (higher up)
  const cam = g.scene.camera;
  // Look up from current position
  cam.position.set(18, 35, 18);
  cam.lookAt(32, 80, 80);
});

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/milkyway-aerial1.png' });

// Look in another direction
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.02;
  const cam = g.scene.camera;
  cam.position.set(32, 5, 32);
  cam.lookAt(32, 60, -50);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-aerial2.png' });

// Pan to see the arc
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.02;
  const cam = g.scene.camera;
  cam.position.set(32, 5, 32);
  cam.lookAt(-60, 50, 32);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-aerial3.png' });

await browser.close();
console.log('Aerial sky screenshots saved.');
