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

// Extract the texture atlas by creating the canvas directly
const atlasDataUrl = await page.evaluate(() => {
  // The texture atlas is a canvas - find it by creating the same logic
  // Actually let's look in the game's world for the blockTex
  const game = window.__game;
  if (!game) return null;
  const map = game.map;
  if (!map) return null;
  const world = map.world;
  if (!world) return null;
  // The blockTex is a private member — let's access it via the renderer info
  // Or we can just re-create the atlas canvas here to verify...
  // Check if we can access __blockTex (won't work as it's private)
  // Instead, let's render the texture onto a fresh canvas
  const textures = Object.values(world).find(v => v && v.image && v.image.width);
  return textures ? textures.image.toDataURL() : null;
});

if (atlasDataUrl) {
  const base64 = atlasDataUrl.split(',')[1];
  writeFileSync('screenshots/atlas.png', Buffer.from(base64, 'base64'));
  console.log('Atlas saved');
} else {
  console.log('Could not extract atlas');
}

// Take a big screenshot of the title view which IS showing correctly
await page.screenshot({ path: 'screenshots/title-full.png' });

await browser.close();
