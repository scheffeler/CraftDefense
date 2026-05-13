import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ args: ['--disable-web-security', '--disable-cache'] });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  bypassCSP: true,
});
await context.clearCookies();
const page = await context.newPage();

// Intercept all requests and force no-cache
await page.route('**/*', route => {
  const headers = {
    ...route.request().headers(),
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
  };
  route.continue({ headers });
});

// Cache-bust the URL with a timestamp
const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });

// Wait for Three.js canvas to appear and render first frame
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000); // let the title orbit camera settle

await page.addStyleTag({ content: `
  #app { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
  canvas { position: fixed !important; inset: 0 !important; width: 100vw !important; height: 100vh !important; }
` });
await page.evaluate(() => window.dispatchEvent(new Event('resize')));
await page.waitForTimeout(600);

// Capture the title screen with 3D world visible behind it
await page.screenshot({ path: 'screenshots/current.png' });
await browser.close();

console.log('Screenshot saved to screenshots/current.png');
