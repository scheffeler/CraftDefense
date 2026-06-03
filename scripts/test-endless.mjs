import { chromium } from '@playwright/test';

const browser = await chromium.launch({ args: ['--disable-web-security', '--no-sandbox', '--disable-gpu'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Test endless wave mode by fast-forwarding 
const result = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return 'no game';
  
  // Force wave 10 -> endless mode via internal state
  g.waves._currentWave = 10;
  
  // Simulate starting wave 11
  const waveManager = g.waves;
  waveManager.currentWave = 10; // direct property won't work since it's private
  
  // Check that isLastWave is always false
  const lastWaveResult = g.waves.isLastWave();
  
  // Check totalWaves before endless mode
  const totalBefore = g.waves.totalWaves;
  
  return { lastWaveResult, totalBefore };
});
console.log('Endless mode check:', JSON.stringify(result));

await browser.close();
console.log('Test complete');
