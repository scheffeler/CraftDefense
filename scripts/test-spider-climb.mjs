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

// Spawn a spider just outside the north wall and watch it climb
const setup = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return 'no game';

  // Make sure it's freeplay so enemies don't die immediately
  g.mode = 'freeplay';
  
  // Spawn a spider just north of the north wall (z=17 = just outside wall at z=18)
  // Position: x=32 (center), z=15 (north of wall), enemy should climb north wall at z=18
  g.enemies.spawn('spider', 32, 15);
  
  const spiders = g.enemies.getAliveEnemies().filter(e => e.config.type === 'spider');
  return {
    spiderCount: spiders.length,
    spiderPos: spiders.length > 0 ? {
      x: g.enemies.getEnemyPosition(spiders[0].id)?.x,
      y: g.enemies.getEnemyPosition(spiders[0].id)?.y,
      z: g.enemies.getEnemyPosition(spiders[0].id)?.z,
    } : null,
  };
});
console.log('Setup:', JSON.stringify(setup));

// Position camera to watch the north wall from outside
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  const g = window.__game;
  if (!g?.scene) return;
  // Camera outside the north wall, looking inward at wall z=18
  g.scene.camera.position.set(32, 14, 8);
  g.scene.camera.lookAt(32, 10, 20);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/spider-before.png' });

// Wait for spider to start climbing (takes ~1-2s to reach wall)
await page.waitForTimeout(2000);

const midState = await page.evaluate(() => {
  const g = window.__game;
  const spiders = g.enemies.getAliveEnemies().filter(e => e.config.type === 'spider');
  if (!spiders.length) return 'no spiders';
  const s = spiders[0];
  const pos = g.enemies.getEnemyPosition(s.id);
  return {
    climbPhase: s.climbPhase,
    y: pos?.y?.toFixed(2),
    z: pos?.z?.toFixed(2),
  };
});
console.log('Mid-climb state:', JSON.stringify(midState));
await page.screenshot({ path: 'screenshots/spider-climbing.png' });

// Wait more for spider to get over the wall
await page.waitForTimeout(3000);

const afterState = await page.evaluate(() => {
  const g = window.__game;
  const spiders = g.enemies.getAliveEnemies().filter(e => e.config.type === 'spider');
  if (!spiders.length) return 'no spiders (may have reached base)';
  const s = spiders[0];
  const pos = g.enemies.getEnemyPosition(s.id);
  return {
    climbPhase: s.climbPhase,
    y: pos?.y?.toFixed(2),
    z: pos?.z?.toFixed(2),
    insideFortress: pos && pos.z > 20 && pos.z < 44,
  };
});
console.log('After climbing state:', JSON.stringify(afterState));
await page.screenshot({ path: 'screenshots/spider-over-wall.png' });

await browser.close();
console.log('Done. Check screenshots/spider-*.png');
