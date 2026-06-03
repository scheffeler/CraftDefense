import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'] 
});
const page = await (await browser.newContext({ viewport:{width:1280,height:720},bypassCSP:true })).newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 12000 });
await page.waitForTimeout(5000);
// Show the game without the title overlay to see pure sky
await page.evaluate(() => {
  const g = window.__game;
  if (!g?.scene?.camera) return;
  // Tilt the camera up to see the sky gradient
  const cam = g.scene.camera;
  cam.position.set(32, 12, 40);
  cam.lookAt(32, 40, -20); // look up at sky
});
await page.waitForTimeout(700);
await page.screenshot({ path: 'screenshots/sky-gradient.png' });
await browser.close();
console.log('Done');
