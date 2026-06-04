// Brighten the Milky Way and rotate through multiple sky views
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5175');
await page.waitForTimeout(3000);

// Boost opacity to max to see the band clearly
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.0;
  const mw = g.scene._milkyWay;
  if (mw) {
    mw.material.opacity = 0.9;  // max brightness for visibility test
    mw.material.size = 0.8;     // larger points too
    mw.material.needsUpdate = true;
  }
  // Also max stars
  for (const sg of g.scene.starGroups) {
    sg.material.opacity = 0.9;
    sg.material.size = 0.7;
    sg.material.needsUpdate = true;
  }
});

await page.waitForTimeout(500);

// Take 4 screenshots with different heading angles (yaw)
// by manipulating PointerLockControls yawObject directly
for (let i = 0; i < 4; i++) {
  await page.evaluate((angle) => {
    const g = window.__game;
    if (!g) return;
    const controls = g.scene.controls;
    if (controls) {
      // PointerLockControls has getObject() that is the yaw container
      const yaw = controls.getObject ? controls.getObject() : null;
      if (yaw) {
        yaw.rotation.y = angle;
        // The camera (pitch) is a child
        if (yaw.children[0]) {
          yaw.children[0].rotation.x = -0.5; // look slightly up
        }
      }
    }
  }, (i * Math.PI / 2));

  await page.waitForTimeout(200);
  await page.screenshot({ path: `screenshots/milkyway-b${i}.png` });
}

await browser.close();
console.log('Bright test screenshots saved.');
