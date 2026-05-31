import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--no-sandbox', '--disable-gpu']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx2.newPage();

const consoleErrors = [];
page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', e => consoleErrors.push(String(e)));

await page.goto('http://localhost:5175/', { waitUntil: 'load', timeout: 20000 });
await page.waitForTimeout(8000);

await page.evaluate(() => { document.querySelectorAll('.fps-lock-prompt, #lock-prompt').forEach(e => e.style.display='none'); });

// Sweep camera low across terrain to capture flora in foreground
await page.evaluate(() => {
  const g = window.__game;
  if (!g?.scene?.camera) return;
  g.scene.camera.position.set(22, 8.1, 26);
  g.scene.camera.lookAt(45, 8.0, 12);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/flora-sweep.png' });

// Close-up with flowers visible
await page.evaluate(() => {
  const g = window.__game;
  if (!g?.scene?.camera) return;
  g.scene.camera.position.set(30, 8.2, 30);
  g.scene.camera.lookAt(40, 7.8, 22);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/flora-detail.png' });

if (consoleErrors.length > 0) console.log('Errors:', consoleErrors.slice(0,3).join('\n'));
else console.log('No console errors');
await browser.close();
console.log('Flora screenshots done');
