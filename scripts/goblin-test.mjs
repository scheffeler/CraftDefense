import { chromium } from '@playwright/test';
import { writeFileSync, mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const executablePath = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const browser = await chromium.launch({ 
  executablePath,
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
await page.waitForTimeout(8000);

// Hide overlays
await page.evaluate(() => {
  const app = document.getElementById('app');
  if (app) for (const child of app.children) if (child.tagName !== 'CANVAS') child.style.display = 'none';
});

// Spawn goblins directly in front of the camera
const camPos = { x: 32, y: 7.7, z: 36 };
await page.evaluate((pos) => {
  const game = window.__game;
  if (!game?.enemies) return;
  // Spawn a row of goblins close to camera
  game.enemies.spawn('goblin',       pos.x - 3, pos.z - 5);
  game.enemies.spawn('goblin',       pos.x,     pos.z - 5);
  game.enemies.spawn('goblin',       pos.x + 3, pos.z - 5);
  game.enemies.spawn('goblin_miner', pos.x - 1.5, pos.z - 7);
  game.enemies.spawn('goblin_miner', pos.x + 1.5, pos.z - 7);
}, camPos);

// Camera close to goblins, at face level looking slightly down
await page.evaluate((pos) => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(pos.x, pos.y + 1.5, pos.z);
  cam.lookAt(pos.x, pos.y - 0.5, pos.z - 6);
}, camPos);
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screenshots/goblin-bodies-front.png' });

// Side view
await page.evaluate((pos) => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(pos.x - 6, pos.y + 0.5, pos.z - 5);
  cam.lookAt(pos.x, pos.y, pos.z - 5);
}, camPos);
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/goblin-bodies-side.png' });

// Extract and display the goblin body texture
const texDataUrl = await page.evaluate(() => {
  const game = window.__game;
  if (!game?.enemies) return null;
  const meshes = game.enemies.getEnemyMeshes();
  for (const group of meshes) {
    for (const child of (group.children || [])) {
      if (child.material && Array.isArray(child.material) && child.material.length === 6) {
        const frontMat = child.material[4];
        if (frontMat?.map?.image) {
          const c = document.createElement('canvas');
          c.width = 64; c.height = 64;
          const ctx = c.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(frontMat.map.image, 0, 0, 64, 64);
          return c.toDataURL();
        }
      }
    }
  }
  return null;
});

if (texDataUrl) {
  writeFileSync('screenshots/goblin-body-tex.png', Buffer.from(texDataUrl.split(',')[1], 'base64'));
  await page.evaluate((url) => {
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = 'position:fixed;bottom:8px;right:8px;width:128px;height:128px;image-rendering:pixelated;z-index:99999;border:3px solid white;background:#333';
    document.body.appendChild(img);
  }, texDataUrl);
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshots/goblin-with-tex-preview.png' });
  console.log('Goblin texture extracted!');
}

await browser.close();
console.log('Done!');
