import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox']
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForFunction(() => document.querySelector('canvas') !== null, { timeout: 20000 });
await page.waitForTimeout(6000);

async function captureView(px, py, pz, lx, ly, lz, dayTime, outPath) {
  const dataUrl = await page.evaluate((args) => {
    const g = window.__game;
    if (!g?.scene) return null;
    const { camera, renderer, scene } = g.scene;
    // Set daytime
    if (args.dayTime !== null && g.scene._dayTime !== undefined) {
      g.scene._dayTime = args.dayTime;
    }
    camera.position.set(args.px, args.py, args.pz);
    camera.lookAt(args.lx, args.ly, args.lz);
    renderer.clear();
    renderer.render(scene, camera);
    const canvas = document.querySelector('canvas');
    return canvas?.toDataURL('image/png') ?? null;
  }, { px, py, pz, lx, ly, lz, dayTime });

  if (!dataUrl) { console.log('No data for', outPath); return; }
  writeFileSync(outPath, Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64'));
  console.log('Saved', outPath);
}

// G=6, campfires at y=7
// Daytime view — eye level walking up to west campfire
await captureView(24, 8.6, 30, 26, 7.3, 36, 0.50, '/tmp/campfire_day_west.png');
// Eye level at east campfire
await captureView(40, 8.6, 30, 38, 7.3, 36, 0.50, '/tmp/campfire_day_east.png');
// Wide aerial interior daytime
await captureView(32, 18, 22, 32, 7, 36, 0.50, '/tmp/campfire_day_wide.png');
// Night view showing warm glow
await captureView(30, 8.6, 31, 26, 7.3, 36, 0.02, '/tmp/campfire_night.png');

await browser.close();
