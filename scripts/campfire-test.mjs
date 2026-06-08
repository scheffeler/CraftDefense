import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

const execPath = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ 
  executablePath: execPath,
  args: ['--disable-web-security', '--no-sandbox', '--disable-gpu', '--headless=new'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

page.on('pageerror', e => console.log('ERROR:', e.message));
await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);

await page.evaluate(() => {
  const game = window.__game;
  if (game && game.ui) {
    game.ui.showPointerLockPrompt(false);
    game.ui.onModeSelect('freeplay');
  }
});
await page.waitForTimeout(2000);

const renderFrom = async (px, py, pz, lx, ly, lz, filename) => {
  const dataUrl = await page.evaluate(([px, py, pz, lx, ly, lz]) => {
    const game = window.__game;
    const scene = game['scene'];
    const renderer = scene['renderer'];
    const threeScene = scene['scene'];
    const cam = window.__GAME_CAMERA__;
    if (!cam || !renderer || !threeScene) return null;
    cam.position.set(px, py, pz);
    cam.lookAt(lx, ly, lz);
    renderer.clear();
    renderer.render(threeScene, cam);
    return renderer.domElement.toDataURL('image/png');
  }, [px, py, pz, lx, ly, lz]);
  
  if (dataUrl) {
    const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
    writeFileSync(filename, Buffer.from(base64, 'base64'));
    console.log('Saved:', filename);
  }
};

// Close-up of west campfire (27.5, 7, 34.5) — from east at eye level
await renderFrom(30.5, 8.5, 35.5, 27.5, 7.5, 34.5, '/tmp/cf-west-close.png');

// Looking at both campfires (27 and 37) from south
await renderFrom(32, 9.5, 38, 32, 7.5, 34, '/tmp/cf-both.png');

// Night-ish — directly above campfire looking down
await renderFrom(27.5, 12, 34.5, 27.5, 7.5, 34.5, '/tmp/cf-top.png');

await browser.close();
