import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-dev-shm-usage']
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'networkidle', timeout: 15000 });
await page.waitForTimeout(5000);

// Stop the game loop by overriding requestAnimationFrame
await page.evaluate(() => {
  // Freeze the game loop
  window._origRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = () => 0;
});
await page.waitForTimeout(200);

const capture = async (name, fn) => {
  await page.evaluate(fn);
  const data = await page.evaluate(() => {
    const game = window.__game;
    if (!game?.scene) return null;
    // Manually render one frame
    game.scene.render(0.016);
    const c = document.getElementById('game-canvas');
    return c ? c.toDataURL('image/png') : null;
  });
  if (data) {
    writeFileSync(`screenshots/${name}.png`, Buffer.from(data.split(',')[1], 'base64'));
    console.log(`Saved ${name}.png`);
  }
};

// Close-up of north cobblestone wall
await capture('wall-closeup', () => {
  const game = window.__game;
  if (!game?.scene) return;
  game.scene.camera.position.set(32, 10, 23);
  game.scene.camera.lookAt(32, 10, 18.5);
});

// Grass terrain with trees
await capture('terrain-grass', () => {
  const game = window.__game;
  if (!game?.scene) return;
  game.scene.camera.position.set(12, 9, 12);
  game.scene.camera.lookAt(20, 8, 20);
});

// Inside fortress floor view
await capture('fortress-floor', () => {
  const game = window.__game;
  if (!game?.scene) return;
  game.scene.camera.position.set(32, 7.8, 32);
  game.scene.camera.lookAt(32, 7.8, 20);
});

// Wood/tree close-up
await capture('wood-tree', () => {
  const game = window.__game;
  if (!game?.scene) return;
  // Find a tree near the fortress - there should be trees around x=35-45, z=15-17
  game.scene.camera.position.set(40, 8.5, 13);
  game.scene.camera.lookAt(38, 9, 10);
});

await browser.close();
console.log('All done.');
