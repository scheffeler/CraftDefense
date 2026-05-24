import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(5000);

// Start freeplay and stop camera orbit
const btn = page.locator('#btn-freeplay');
if (await btn.count()) { await btn.click(); await page.waitForTimeout(1500); }
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  if (window.__game) window.__game.phase = 'win';
});

async function shot(pos, lookAt, filename) {
  await page.evaluate(([p, l]) => {
    const cam = window.__GAME_CAMERA__;
    if (cam) { cam.position.set(p[0],p[1],p[2]); cam.lookAt(l[0],l[1],l[2]); }
  }, [pos, lookAt]);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `screenshots/${filename}` });
  console.log(`Saved ${filename}`);
}

// Water pond at [8, 15] (x=8, z=15) - look at it from close
await shot([8, 9, 18], [8, 6, 14], 'tex-water.png');

// Cactus should be in desert biome - look around far areas
// Try east side at various z coordinates
await shot([58, 10, 20], [54, 7, 15], 'tex-desert1.png');
await shot([55, 10, 40], [50, 7, 35], 'tex-desert2.png');

// Snow blocks on top of hills in taiga - try far corners
await shot([58, 12, 55], [52, 8, 48], 'tex-taiga1.png');

// Village buildings should have bookshelves - check WorldGen for village positions
await shot([18, 10, 60], [25, 7, 55], 'tex-village.png');

await browser.close();
console.log('All screenshots saved.');
