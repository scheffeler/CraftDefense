import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-web-security']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(5000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  window.__game.phase = 'gameover';
  const em = window.__game.enemies;
  // Spawn creeper further south at (32, 58) so it faces fortress (north, -Z dir)
  // ENEMY_Y = 7.5, head at y=8.74
  if (em) em.spawn('creeper', 32, 58);
});
await page.waitForTimeout(1500);
// Camera: between fortress and creeper, looking south at creeper's face
// Creeper at z=58, faces -Z (toward fortress). To see face, be at z < 57.76 looking +Z
await page.evaluate(() => {
  window.__game.phase = 'gameover';
  const cam = window.__game.scene.camera;
  cam.position.set(32, 8.74, 55.5);
  cam.lookAt(32, 8.74, 58);
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/creeper-face-north.png' });

// Alternative: spawn creeper facing EAST so we can view from west  
await page.evaluate(() => {
  const em = window.__game.enemies;
  if (em) em.spawn('creeper', 20, 32); // fortress at x=32, creeper at x=20 → faces +X
  const cam = window.__game.scene.camera;
  cam.position.set(17.5, 8.74, 32);
  cam.lookAt(20, 8.74, 32);
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/creeper-face-east.png' });

await browser.close();
console.log('Done!');
