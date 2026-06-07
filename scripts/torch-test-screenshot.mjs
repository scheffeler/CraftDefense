import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await context.newPage();

page.on('console', m => console.log('[browser]', m.text()));

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForTimeout(5000);

// Setup
await page.evaluate(() => {
  const g = window.__game;
  if (!g) return;
  if (g.ui && g.ui.onModeSelect) g.ui.onModeSelect('freeplay');
  if (g.scene) Object.defineProperty(g.scene, 'isPointerLocked', { get: () => true, configurable: true });
  // Night scene for best glow visibility
  if (typeof g.scene._dayTime !== 'undefined') g.scene._dayTime = 0.02;
});
await page.waitForTimeout(300);

// Hide UI
await page.evaluate(() => {
  const canvas = document.getElementById('game-canvas');
  const app = document.getElementById('app');
  if (app) Array.from(app.children).forEach(c => { if (c !== canvas) c.style.setProperty('display','none','important'); });
});

// Camera directly in front of a torch on the north inner wall
// Torches at x={21,27,33,39}, y=9, z=20 (north wall inner face)
// Camera 2 units away from torch, at torch height, looking at torch
await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return;
  // Aim at torch at (27, 9, 20) from position (27, 9, 22) - 2 units south
  if (g.player) g.player.position.set(27, 7.38, 22);
  const ctrl = g.scene.controls;
  if (ctrl && ctrl.getObject) ctrl.getObject().position.set(27, 9.0, 22);
  const cam = g.scene.camera;
  if (cam) cam.lookAt(27, 9.2, 20);
  for (let i = 0; i < 5; i++) g.scene.render(0.016);
});
await page.waitForTimeout(50);
await page.screenshot({ path: 'screenshots/torch_direct_night.png' });

// Multiple torches view
await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return;
  if (g.player) g.player.position.set(32, 7.38, 28);
  const ctrl = g.scene.controls;
  if (ctrl && ctrl.getObject) ctrl.getObject().position.set(32, 9.5, 28);
  const cam = g.scene.camera;
  if (cam) cam.lookAt(32, 8.5, 20);
  for (let i = 0; i < 5; i++) g.scene.render(0.016);
});
await page.waitForTimeout(50);
await page.screenshot({ path: 'screenshots/torch_multiple_night.png' });

// Daytime - to see glow sprites even in bright light
await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return;
  if (typeof g.scene._dayTime !== 'undefined') g.scene._dayTime = 0.5;
  if (g.player) g.player.position.set(27, 7.38, 22);
  const ctrl = g.scene.controls;
  if (ctrl && ctrl.getObject) ctrl.getObject().position.set(27, 9.0, 22);
  const cam = g.scene.camera;
  if (cam) cam.lookAt(27, 9.2, 20);
  for (let i = 0; i < 5; i++) g.scene.render(0.016);
});
await page.waitForTimeout(50);
await page.screenshot({ path: 'screenshots/torch_direct_day.png' });

await browser.close();
console.log('Done');
