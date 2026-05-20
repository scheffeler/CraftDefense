import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(5000);

// Spawn a spider just outside the north wall and manually tick the game
const result = await page.evaluate(async () => {
  const g = window.__game;
  if (!g) return 'no game';
  
  // Set flow field target to fortress center
  g.flowField.recompute(32, 32);
  
  // Spawn a spider at north approach (z=15, just before north wall at z=18)
  g.enemies.spawn('spider', 32, 15);
  
  const spiders = () => g.enemies.getAliveEnemies().filter(e => e.config.type === 'spider');
  
  const log = [];
  const DT = 0.05; // 50ms ticks
  
  for (let tick = 0; tick < 200; tick++) {
    g.enemies.update(DT);
    if (tick % 20 === 0) {
      const sp = spiders();
      if (!sp.length) { log.push({tick, note: 'spider gone'}); break; }
      const pos = g.enemies.getEnemyPosition(sp[0].id);
      log.push({
        tick,
        phase: sp[0].climbPhase ?? 'normal',
        y: +(pos?.y ?? 0).toFixed(2),
        z: +(pos?.z ?? 0).toFixed(2),
      });
    }
  }
  return log;
});
console.log('Spider tick log:', JSON.stringify(result, null, 2));

// Now take a screenshot after the manual ticks to see the spider position
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  const g = window.__game;
  if (!g?.scene) return;
  g.scene.camera.position.set(32, 14, 8);
  g.scene.camera.lookAt(32, 10, 20);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/spider-climb-test.png' });

await browser.close();
console.log('Done.');
