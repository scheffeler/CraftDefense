import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ args: ['--disable-web-security'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

page.on('console', msg => { if (msg.type() === 'error') console.log('JS ERROR:', msg.text()); });

const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Test: Die during endless mode at wave 15, previous best was 12 → new record
const result = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return { error: 'no game' };
  g.waves._endless = true;
  g.waves.currentWave = 15;
  g.phase = 'endless';
  localStorage.setItem('craftdefense_best_endless', '12');
  g._bestEndlessWave = 12;
  g.player.health = 1;
  if (g.player.onDeath) g.player.onDeath();
  return {
    statsText: document.querySelector('.overlay-stats')?.textContent,
    recordText: document.querySelector('.death-record')?.textContent,
    recordDisplay: document.querySelector('.death-record')?.style.display,
    newBest: g._bestEndlessWave,
    localStorageBest: localStorage.getItem('craftdefense_best_endless'),
  };
});
console.log('Endless death result:', JSON.stringify(result, null, 2));

await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/endless-record.png' });
await browser.close();
