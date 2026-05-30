import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Extract the atlas by finding the canvas texture used by the three.js renderer
const atlasInfo = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return { error: 'no game' };
  
  // Walk the scene looking for the block texture
  let blockTexCanvas = null;
  game.scene.scene.traverse((obj) => {
    if (obj.isMesh && obj.material && obj.material.map) {
      const tex = obj.material.map;
      if (tex.image && tex.image.width === 512 && tex.image.height === 16) {
        blockTexCanvas = tex.image;
      }
    }
  });
  
  if (!blockTexCanvas) return { error: 'texture not found, scene objects: ' + game.scene.scene.children.length };
  
  // Scale up 8x for visibility
  const scale = 8;
  const scaled = document.createElement('canvas');
  scaled.width = 512 * scale;
  scaled.height = 16 * scale;
  const sctx = scaled.getContext('2d');
  sctx.imageSmoothingEnabled = false;
  sctx.drawImage(blockTexCanvas, 0, 0, 512 * scale, 16 * scale);
  
  // Add index labels
  sctx.fillStyle = "rgba(255,255,0,0.8)";
  sctx.font = "bold 10px monospace";
  for (let i = 0; i < 32; i++) {
    sctx.fillText(i.toString(), i * 16 * scale + 2, 16 * scale - 2);
  }
  
  return scaled.toDataURL('image/png');
});

if (typeof atlasInfo === 'string') {
  const base64 = atlasInfo.split(',')[1];
  writeFileSync('screenshots/atlas-preview.png', Buffer.from(base64, 'base64'));
  console.log('Atlas preview saved');
} else {
  console.log('Error:', JSON.stringify(atlasInfo));
}

await browser.close();
