import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'] 
});
const page = await (await browser.newContext({ viewport:{width:1280,height:720},bypassCSP:true })).newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 12000 });
await page.waitForTimeout(5000);

// Check if __game is accessible
const gameExists = await page.evaluate(() => typeof window.__game !== 'undefined');
console.log('Game exists:', gameExists);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(e=>e.style.display='none');
  const g = window.__game;
  if (!g || !g.scene) { console.error('no game/scene'); return; }
  const cam = g.scene.camera;
  // Look up at the sky from inside fortress
  cam.position.set(32, 8, 32);
  cam.lookAt(32, 50, 32); // looking straight up
  cam.updateMatrixWorld();
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/sky-up.png' });

// Look at horizon - 45 degrees 
await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return;
  const cam = g.scene.camera;
  cam.position.set(32, 20, 32);
  cam.lookAt(80, 10, 32); // looking toward horizon
  cam.updateMatrixWorld();
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/sky-horizon.png' });

await browser.close();
console.log('Done');
