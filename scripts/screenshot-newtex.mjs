import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx2.newPage();
await page.goto(`http://localhost:5178/`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4500);

// Extract texture atlas tiles 0, 4, 5, 9 to verify improvements
const atlasData = await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.scene) return null;
  let found = null;
  game.scene.scene.traverse((obj) => {
    if (!found && obj.isMesh && obj.material?.map?.image?.width > 200) {
      found = obj.material.map.image;
    }
  });
  if (!found) return null;
  // Draw the atlas scaled up 8x to see individual pixels
  const cvs = document.createElement('canvas');
  cvs.width = found.width; cvs.height = found.height * 8;
  const ctx = cvs.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(found, 0, 0, cvs.width, cvs.height);
  return cvs.toDataURL();
});

if (atlasData) {
  const { writeFileSync } = await import('fs');
  writeFileSync('screenshots/atlas-new.png', Buffer.from(atlasData.replace(/^data:image\/png;base64,/, ''), 'base64'));
}

// Also get a gameplay screenshot showing stone/grass/leaves/sand
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const scene = window.__game?.scene;
  if (!scene) return;
  Object.defineProperty(scene, 'isPointerLocked', { get: () => true, configurable: true });
});
await page.waitForTimeout(100);

// Look at the surface from slightly above to see grass, leaves, stone
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(22, 9, 20);
  scene.camera.lookAt(32, 7, 28);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/surface-textures.png' });

// Look at a tree closely to see leaves
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(20, 12, 22);
  scene.camera.lookAt(24, 10, 18);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/tree-leaves.png' });

await browser.close();
console.log('Done');
