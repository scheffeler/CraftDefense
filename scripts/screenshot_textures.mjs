import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(5000);

// Hide all overlays
await page.evaluate(() => {
  document.querySelectorAll('div').forEach(el => {
    const s = el.style;
    if (s.position === 'fixed' || s.position === 'absolute') s.display = 'none';
  });
});

const shots = [
  // inside fortress looking at cobblestone walls
  { name: 'cobblestone_walls', pos: [32, 8.6, 36], look: [32, 8.0, 18] },
  // above world looking at terrain
  { name: 'terrain_overview', pos: [32, 25, 32], look: [32, 6, 50] },
  // ground level view of grass
  { name: 'grass_ground', pos: [15, 7.6, 15], look: [25, 7.0, 25] },
  // underground view 
  { name: 'underground', pos: [32, 4, 32], look: [38, 4, 38] },
];

for (const shot of shots) {
  await page.evaluate((s) => {
    const game = window.__game;
    if (!game?.scene?.camera) return;
    const cam = game.scene.camera;
    cam.position.set(...s.pos);
    cam.lookAt(...s.look);
  }, shot);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `screenshots/${shot.name}.png` });
}

await browser.close();
console.log('Done!');
