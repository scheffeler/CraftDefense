// Verify Milky Way is in scene and check opacity
import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

await page.goto('http://localhost:5175');
await page.waitForTimeout(3000);

const info = await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return { error: 'no game' };
  const mw = g.scene._milkyWay;
  if (!mw) return { error: 'no milky way field' };
  return {
    type: mw.type,
    posCount: mw.geometry.attributes.position?.count ?? 0,
    colorCount: mw.geometry.attributes.color?.count ?? 0,
    opacity: mw.material.opacity,
    size: mw.material.size,
    inScene: g.scene.scene.children.includes(mw),
  };
});
console.log('Milky Way info:', JSON.stringify(info, null, 2));

// Now force midnight and wait several frames
await page.evaluate(() => {
  const g = window.__game;
  if (g && g.scene) {
    g.scene._dayTime = 0.0;
  }
});
await page.waitForTimeout(1500);

const nightInfo = await page.evaluate(() => {
  const g = window.__game;
  if (!g || !g.scene) return { error: 'no game' };
  const mw = g.scene._milkyWay;
  if (!mw) return { error: 'no mw' };
  const nightness = Math.max(0, 1 - 0.08 * 4); // ambientInt at midnight ≈ 0.08
  return {
    opacity: mw.material.opacity,
    expectedOpacity: nightness * 0.38,
    dayTime: g.scene._dayTime,
  };
});
console.log('Night info:', JSON.stringify(nightInfo));

await page.screenshot({ path: 'screenshots/milkyway-verify.png' });
await browser.close();
console.log('Done.');
