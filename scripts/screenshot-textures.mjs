import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(5000);

// Dump atlas texture to a canvas and screenshot it
const atlasDataUrl = await page.evaluate(() => {
  // Access the block texture from the Three.js scene
  const game = window.__game;
  if (!game?.map?.world) return null;
  // Walk through scene children to find the chunk mesh material
  let found = null;
  game.scene.scene.traverse(obj => {
    if (obj.isMesh && obj.material?.map?.image) {
      found = obj.material.map.image;
    }
  });
  if (!found) return null;
  const c = document.createElement('canvas');
  c.width = found.width; c.height = found.height;
  c.getContext('2d').drawImage(found, 0, 0);
  return c.toDataURL('image/png');
});

if (atlasDataUrl) {
  const base64 = atlasDataUrl.replace('data:image/png;base64,', '');
  import('fs').then(fs => {
    fs.writeFileSync('screenshots/atlas.png', Buffer.from(base64, 'base64'));
    console.log('Atlas saved');
  });
}

// Hide overlays and view the world
await page.evaluate(() => {
  document.querySelectorAll('div').forEach(el => {
    const s = window.getComputedStyle(el);
    if ((s.position === 'fixed' || s.position === 'absolute') && s.zIndex && parseInt(s.zIndex) > 10) {
      el.style.visibility = 'hidden';
    }
  });
});

// View from inside fortress looking at chests/crafting tables  
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  // Look straight at ground blocks inside fortress
  cam.position.set(32, 8.5, 30);
  cam.lookAt(32, 8, 20);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/tex-fortress-inside.png' });

// Look down from above to see blocks
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(32, 14, 25);
  cam.lookAt(32, 8, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/tex-top-down.png' });

await browser.close();
console.log('Done');
