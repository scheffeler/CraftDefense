// Get a good view of the night sky with Milky Way
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5175');
await page.waitForTimeout(3000);

// Hide UI elements
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt, #hud, #hotbar, #crosshair').forEach(el => {
    el.style.display = 'none';
  });
});

// Use a free-flying camera not controlled by PointerLock
// by temporarily replacing the camera with one looking up
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;

  // Set midnight
  g.scene._dayTime = 0.0;

  // Move camera to open area looking diagonally up at sky
  const cam = g.scene.camera;
  cam.position.set(32, 12, 32);

  // Use matrixAutoUpdate to manually point camera up
  const THREE = window.THREE;
  if (THREE) {
    // Look from center upward at a diagonal
    const target = new THREE.Vector3(80, 80, 32);
    cam.lookAt(target);
  } else {
    // Fallback: set rotation directly
    cam.rotation.x = -0.75;
    cam.rotation.y = 0.5;
    cam.rotation.z = 0;
  }
});

await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/milkyway-sky1.png' });

// Second angle
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.0;
  const cam = g.scene.camera;
  cam.position.set(32, 12, 32);
  const THREE = window.THREE;
  if (THREE) {
    cam.lookAt(new THREE.Vector3(-40, 90, 80));
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-sky2.png' });

// Third angle - more directly upward
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.scene._dayTime = 0.0;
  const cam = g.scene.camera;
  cam.position.set(32, 12, 32);
  const THREE = window.THREE;
  if (THREE) {
    cam.lookAt(new THREE.Vector3(32, 180, 32));
  }
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/milkyway-skyup.png' });

await browser.close();
console.log('Sky screenshots saved.');
