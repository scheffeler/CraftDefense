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

async function captureView(px, py, pz, lx, ly, lz, outPath) {
  const dataUrl = await page.evaluate((args) => {
    const g = window.__game;
    if (!g?.scene) return null;
    const { camera, renderer, scene } = g.scene;
    camera.position.set(args.px, args.py, args.pz);
    camera.lookAt(args.lx, args.ly, args.lz);
    renderer.clear();
    renderer.render(scene, camera);
    const canvas = document.querySelector('canvas');
    return canvas?.toDataURL('image/png') ?? null;
  }, { px, py, pz, lx, ly, lz });

  if (!dataUrl) { console.log('No data for', outPath); return; }
  writeFileSync(outPath, Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64'));
  console.log('Saved', outPath);
}

// GROUND_OFFSET=6 so campfires are at y=7 (G+1)
// West campfire at (26, 7, 36)
await captureView(24, 9, 29, 26, 7, 36, '/tmp/campfire_west.png');
// East campfire at (38, 7, 36)
await captureView(40, 9, 29, 38, 7, 36, '/tmp/campfire_east.png');
// Wide interior view showing both
await captureView(32, 14, 24, 32, 7, 37, '/tmp/campfire_wide.png');
// Very close view of west campfire
await captureView(26, 7.8, 32, 26, 7, 36, '/tmp/campfire_closeup.png');

const info = await page.evaluate(() => {
  const g = window.__game;
  return { lights: g?.campfireLights?.size, meshes: g?.campfireMeshes?.size };
});
console.log('Campfire state:', info);

await browser.close();
// Doesn't actually run — just reuse the browser setup above
