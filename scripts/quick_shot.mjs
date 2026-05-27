import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=swiftshader']
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(32, 8.6, 36);
  game.scene.camera.lookAt(32, 7.5, 18);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/final_check.png' });
console.log('Done!');
await browser.close();
