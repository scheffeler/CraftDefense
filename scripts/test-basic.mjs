import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-web-security', '--disable-gpu', '--no-sandbox'],
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'domcontentloaded', timeout: 15000 });
const title = await page.title();
console.log('Page title:', title);
const canvases = await page.$$('canvas');
console.log('Canvas count:', canvases.length);
await browser.close();
