import pkg from '/home/user/CraftDefense/node_modules/@playwright/test/index.js';
const { chromium } = pkg;
import { mkdirSync } from 'fs';

mkdirSync('/home/user/CraftDefense/screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(4000);

// While still in title screen mode (aerial camera at 18,28,18 looking at 32,7,32)
// spawn sheep in a visible area near the fortress south area
await page.evaluate(() => {
  const pm = window.__game?.passiveMobs;
  if (!pm) return;
  // Spawn sheep in a row south of fortress, visible from title camera
  for (let i = 0; i < 10; i++) pm.spawn("sheep", 22 + i * 2, 48);
});
await page.waitForTimeout(500);

// Just use the title screen camera which we know works  
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  // Low aerial look at the south side where sheep are
  cam.position.set(20, 16, 58);
  cam.lookAt(32, 8, 46);
});
await page.waitForTimeout(600);
await page.screenshot({ path: '/home/user/CraftDefense/screenshots/sheep-colors.png' });

// Another angle: side view
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(15, 10, 48);
  cam.lookAt(38, 8, 48);
});
await page.waitForTimeout(400);
await page.screenshot({ path: '/home/user/CraftDefense/screenshots/sheep-colors-2.png' });

await browser.close();
console.log('Done');
