import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
});
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3500);

// Hide lock overlay
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Overhead aerial view showing terrain
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(18, 28, 18);
  game.scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/overhead.png' });

// Close up view of different biomes (north-east area shows taiga)
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(55, 18, 5);
  game.scene.camera.lookAt(50, 7, 20);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/biomes.png' });

// Inside fortress looking out  
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(32, 8.62, 36);
  game.scene.camera.lookAt(32, 8, 18);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/fortress.png' });

await browser.close();
console.log('Screenshots saved: overhead.png, biomes.png, fortress.png');
