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

// Hide only the lock prompt (title screen overlay)
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = 'none';
  });
});

const shots = [
  { name: 'fortress_inside', pos: [32, 8.6, 36], look: [32, 7.5, 18] },
  { name: 'terrain_ground',  pos: [15, 7.8, 15], look: [30, 7.0, 30] },
  { name: 'terrain_high',    pos: [32, 22, 32],  look: [32, 6, 55]   },
  { name: 'underground',     pos: [32, 3.5, 32], look: [40, 3.5, 38] },
];

for (const shot of shots) {
  await page.evaluate((s) => {
    const game = window.__game;
    if (!game || !game.scene || !game.scene.camera) return;
    const cam = game.scene.camera;
    cam.position.set(s.pos[0], s.pos[1], s.pos[2]);
    cam.lookAt(s.look[0], s.look[1], s.look[2]);
  }, shot);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `screenshots/${shot.name}.png` });
  console.log('Saved ' + shot.name + '.png');
}

await browser.close();
