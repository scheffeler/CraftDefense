import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('/home/user/CraftDefense/screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await page.waitForTimeout(8000);

await page.screenshot({ path: '/home/user/CraftDefense/screenshots/debug.png' });
console.log('debug screenshot taken');

await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  if (game.enemies) {
    game.enemies.spawn('zombie', 32, 40);
    game.enemies.spawn('skeleton', 28, 40);
    game.enemies.spawn('orc', 36, 40);
  }
  const cam = game.scene && game.scene.camera;
  if (cam) { cam.position.set(32, 11, 48); cam.lookAt(32, 8, 40); }
});
await page.waitForTimeout(1500);
await page.screenshot({ path: '/home/user/CraftDefense/screenshots/enemies.png' });

await browser.close();
console.log('Done');
