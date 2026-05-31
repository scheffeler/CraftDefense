import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-sandbox', '--disable-gpu']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx2.newPage();
page.on('pageerror', e => console.log('Page error:', String(e)));

await page.goto('http://localhost:5175/', { waitUntil: 'load', timeout: 15000 });
await page.waitForTimeout(6000);

// Hide lock overlay and move camera to in-game view
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt, #lock-prompt').forEach(e => e.style.display='none');
  const g = window.__game;
  if (g?.scene?.camera) {
    g.scene.camera.position.set(32, 8.62, 36);
    g.scene.camera.lookAt(32, 8, 18);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/ingame.png' });

// Night time
await page.evaluate(() => {
  const g = window.__game;
  if (g?.scene) g.scene._dayTime = 0.02;
  if (g?.scene?.camera) {
    g.scene.camera.position.set(18, 28, 18);
    g.scene.camera.lookAt(32, 7, 32);
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/night.png' });

await browser.close();
console.log('Done');
