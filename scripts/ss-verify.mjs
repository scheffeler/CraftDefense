import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'] 
});
const page = await (await browser.newContext({ viewport:{width:1280,height:720},bypassCSP:true })).newPage();

// Collect console errors
const errors = [];
page.on('console', msg => { if(msg.type()==='error') errors.push(msg.text()); });

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 12000 });
await page.waitForTimeout(5000);

// Check sky dome via Three.js scene
const skyInfo = await page.evaluate(() => {
  const g = window.__game;
  if (!g?.scene) return 'no scene';
  const scene = g.scene.scene;
  let skyDome = null;
  scene.traverse(obj => {
    if (obj.isMesh && obj.renderOrder === -1) skyDome = obj;
  });
  if (!skyDome) return 'no skyDome found';
  const mat = skyDome.material;
  return {
    type: mat.type,
    isSkyDome: true,
    hasUniforms: !!mat.uniforms,
    zenith: mat.uniforms?.zenith?.value?.getHexString?.(),
    horizon: mat.uniforms?.horizon?.value?.getHexString?.(),
  };
});
console.log('Sky dome info:', JSON.stringify(skyInfo));
console.log('Errors:', errors.length ? errors.join('\n') : 'none');

// Take screenshot with explicit camera positioned looking partly up at sky  
await page.evaluate(() => {
  const g = window.__game;
  if (!g?.scene?.camera) return;
  const cam = g.scene.camera;
  // Title-screen camera is at (18,28,18) looking at (32,7,32)
  // Move it to see more sky
  cam.position.set(32, 8, 60);
  cam.lookAt(32, 25, 0); // looking up and forward at sky
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/sky-check.png' });

await browser.close();
console.log('Done');
