// Final Milky Way visibility test - starts game and takes night sky screenshots
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5175');
await page.waitForTimeout(5000); // Wait for game to load fully

// Start the game programmatically - trigger mode select
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  if (g.ui && g.ui.onModeSelect) {
    g.ui.onModeSelect('helmsdeep');
  }
});
await page.waitForTimeout(500);

// Set night and boost Milky Way for test
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;

  g.scene._dayTime = 0.02; // midnight

  if (g.scene._milkyWay) {
    g.scene._milkyWay.material.opacity = 0.7;
    g.scene._milkyWay.material.size = 0.55;
    g.scene._milkyWay.material.needsUpdate = true;
  }
  if (g.scene.starGroups) {
    for (const sg of g.scene.starGroups) {
      sg.material.opacity = 0.85;
      sg.material.size = 0.65;
      sg.material.needsUpdate = true;
    }
  }

  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = 'none';
  });

  const cam = g.scene.camera;
  cam.position.set(32, 8, 32);
  cam.lookAt(80, 60, 32);
});

await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/milkyway-final1.png' });

await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.02;
  const cam = g.scene.camera;
  cam.position.set(32, 8, 32);
  cam.lookAt(-20, 55, 80);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-final2.png' });

await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.02;
  const cam = g.scene.camera;
  cam.position.set(32, 8, 32);
  cam.lookAt(32, 200, 32.01);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-final3.png' });

await browser.close();
console.log('Final Milky Way screenshots saved.');
