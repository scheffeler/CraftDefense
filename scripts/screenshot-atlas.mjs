import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx2.newPage();

await page.goto(`http://localhost:5177/`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Extract texture atlas from Three.js material
const atlasDataURL = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return null;
  // Find the chunk mesh's material texture
  const scene = game.scene?.scene;
  if (!scene) return null;
  
  let texDataURL = null;
  scene.traverse((obj) => {
    if (obj.isMesh && obj.material && !texDataURL) {
      const mat = obj.material;
      if (mat.map && mat.map.image && mat.map.image.width > 200) {
        // This is likely the block atlas
        const cvs = document.createElement('canvas');
        cvs.width = mat.map.image.width;
        cvs.height = mat.map.image.height * 8; // scale up to see
        const ctx = cvs.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(mat.map.image, 0, 0, cvs.width, cvs.height);
        texDataURL = cvs.toDataURL();
      }
    }
  });
  return texDataURL;
});

if (atlasDataURL) {
  const { writeFileSync } = await import('fs');
  const data = atlasDataURL.replace(/^data:image\/png;base64,/, '');
  writeFileSync('screenshots/atlas.png', Buffer.from(data, 'base64'));
  console.log('Atlas saved');
} else {
  console.log('Could not extract atlas');
}

await browser.close();
