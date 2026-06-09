import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'],
});
const context = await browser.newContext({ viewport: {width:1280, height:720}, bypassCSP: true });
const page = await context.newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'load' });
const canvases = await page.$$('canvas');
console.log('Canvas count:', canvases.length);
const visibility = await page.$eval('canvas', el => {
  const s = window.getComputedStyle(el);
  return { display: s.display, visibility: s.visibility, width: el.offsetWidth, height: el.offsetHeight };
});
console.log('Canvas visibility:', visibility);
await browser.close();
