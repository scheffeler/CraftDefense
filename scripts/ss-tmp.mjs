import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox'] 
});
const page = await (await browser.newContext({ viewport:{width:1280,height:720},bypassCSP:true })).newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 12000 });
await page.waitForTimeout(5000);
await page.evaluate(() => document.querySelectorAll('.fps-lock-prompt').forEach(e=>e.style.display='none'));
await page.evaluate(() => { const g=window.__game; if(g&&g.scene){const c=g.scene.camera;c.position.set(32,8.62,36);c.lookAt(32,8,18);} });
await page.waitForTimeout(700);
await page.screenshot({ path: 'screenshots/gameplay.png' });
await page.evaluate(() => { const g=window.__game; if(g&&g.scene){const c=g.scene.camera;c.position.set(18,28,18);c.lookAt(32,7,32);} });
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/aerial.png' });
await page.evaluate(() => { const g=window.__game; if(g&&g.scene){const c=g.scene.camera;c.position.set(32,8.62,32);c.lookAt(32,8,10);} });
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/outside.png' });
await browser.close();
console.log('Screenshots taken.');
