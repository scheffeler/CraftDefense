import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx2.newPage();

await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded', timeout: 30000 });
// Wait for the game canvas to exist in DOM (not necessarily visible)
await page.waitForFunction(function() {
  return document.getElementById('game-canvas') !== null || document.querySelector('canvas') !== null;
}, { timeout: 20000 });
await page.waitForTimeout(7000);  // extra time for game to initialize and render

async function captureView(px2, py, pz, lx, ly, lz, outPath) {
  const dataUrl = await page.evaluate(function(args) {
    var g = window.__game;
    if (!g || !g.scene) return null;
    var cam = g.scene.camera;
    var renderer = g.scene.renderer;
    var scene = g.scene.scene;
    cam.position.set(args.px, args.py, args.pz);
    cam.lookAt(args.lx, args.ly, args.lz);
    renderer.clear();
    renderer.render(scene, cam);
    var canvas = document.getElementById('game-canvas') || document.querySelector('canvas');
    return canvas ? canvas.toDataURL('image/png') : null;
  }, { px: px2, py, pz, lx, ly, lz });

  if (!dataUrl) { console.log('No data for ' + outPath); return; }
  writeFileSync(outPath, Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64'));
  console.log('Saved ' + outPath);
}

// NW village area, wheat farms
await captureView(5, 9, 7, 12, 7, 13, 'screenshots/wheat-village.png');
await captureView(9, 16, 13, 9, 7, 13, 'screenshots/village-aerial.png');
await captureView(18, 35, 18, 32, 7, 32, 'screenshots/aerial-wide.png');

await browser.close();
console.log('Done');
