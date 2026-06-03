import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, ignoreHTTPSErrors: true });
const page = await context.newPage();

const errors = [];
page.on('console', msg => {
  if (msg.type() === 'error') errors.push(msg.text());
  else if (msg.type() === 'log') console.log('[browser]', msg.text());
});
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:3737/', { waitUntil: 'load', timeout: 30000 });
await page.waitForTimeout(8000);

await page.evaluate(() => {
  const spans = document.querySelectorAll('span');
  for (const s of spans) {
    if (s.textContent && s.textContent.trim() === 'Free Play') { s.click(); return; }
  }
});
await page.waitForTimeout(4000);

const snap = async (px, py, pz, lx, ly, lz, label) => {
  const dataURL = await page.evaluate(([px, py, pz, lx, ly, lz]) => {
    const game = window.__game;
    if (!game || !game.scene) return null;
    const renderer = game.scene.renderer;
    const threeScene = game.scene.scene;
    const cam = game.scene.camera;
    if (!renderer || !threeScene || !cam) return null;
    const origPos = cam.position.clone();
    const origQuat = cam.quaternion.clone();
    cam.position.set(px, py, pz);
    cam.lookAt(lx, ly, lz);
    cam.updateMatrixWorld(true);
    renderer.clear();
    renderer.render(threeScene, cam);
    const dataURL = renderer.domElement.toDataURL('image/png');
    cam.position.copy(origPos);
    cam.quaternion.copy(origQuat);
    return dataURL;
  }, [px, py, pz, lx, ly, lz]);
  if (!dataURL) { console.log('No dataURL for', label); return; }
  const path = `screenshots/${label}.png`;
  writeFileSync(path, Buffer.from(dataURL.split(',')[1], 'base64'));
  console.log('Saved', path);
};

// Wheat blocks confirmed at: (13,15,18), (13,15,19), (15,15,18), (15,15,19), (16,15,18), (16,15,19)
// and (13,19,17), (14,19,17), (15,19,17), (16,19,17), (17,19,17)

// Close overhead of lower farm (y=15 wheat)
await snap(15, 20, 18, 15, 15, 18, 'A-wheat-overhead-close');

// South side of lower farm - eye level with wheat
await snap(15, 16.5, 23, 15, 15, 18, 'B-wheat-eye-level-south');

// East angle of lower farm
await snap(22, 16.5, 18, 14, 15.5, 18, 'C-wheat-eye-level-east');

// Side view showing two crossed quads
await snap(12, 16.2, 21, 16, 15.3, 17, 'D-wheat-diagonal-view');

// Upper farm (y=19 wheat)
await snap(15, 24, 17, 15, 19, 17, 'E-wheat-upper-overhead');

// World overview showing both farm areas
await snap(18, 30, 18, 32, 7, 32, 'F-world-aerial');

await browser.close();
console.log('Done! Errors:', errors.length);
