import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto('http://localhost:5175/');
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Apply all 3 effects
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  g.player.applyEffect('strength', 28, 0.5);
  g.player.applyEffect('speed', 22, 0.5);
  g.player.applyEffect('regeneration', 15, 0.5);
  g.ui.updateEffects(g.player.activeEffects);
  // Position camera for nice view
  g.scene.camera.position.set(32, 8.62, 36);
  g.scene.camera.lookAt(32, 8.0, 18);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/effects-panel.png' });
console.log('Effects panel screenshot saved');
await browser.close();
