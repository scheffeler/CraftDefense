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

const result = await page.evaluate(async () => {
  const g = window.__game;
  if (!g) return 'no game';
  
  // Spawn spider at known location south of north wall
  g.enemies.spawn('spider', 25, 10);  // x=25 is a non-gate position, z=10 is outside fortress
  
  const getSpider = () => g.enemies.getAliveEnemies().find(e => e.config.type === 'spider');
  
  const log = [];
  const DT = 0.1; // 100ms ticks
  
  // Run 150 ticks = 15 seconds of simulation
  for (let tick = 0; tick < 150; tick++) {
    const sp = getSpider();
    if (!sp) { log.push({tick, note: 'spider gone (reached base)'}); break; }
    
    if (tick % 10 === 0) {
      const pos = g.enemies.getEnemyPosition(sp.id);
      log.push({
        t: +(tick * DT).toFixed(1),
        phase: sp.climbPhase ?? 'normal',
        x: +(pos?.x ?? 0).toFixed(1),
        y: +(pos?.y ?? 0).toFixed(1),
        z: +(pos?.z ?? 0).toFixed(1),
        targetX: sp.climbTargetX?.toFixed(1),
        targetZ: sp.climbTargetZ?.toFixed(1),
      });
    }
    
    g.enemies.update(DT);
  }
  return log;
});

console.log('Spider climb log:');
result.forEach(entry => console.log(JSON.stringify(entry)));

await browser.close();
