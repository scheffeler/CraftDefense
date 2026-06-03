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

// Set up camera looking at north wall from inside
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
  const g = window.__game;
  if (!g?.scene) return;
  // Camera inside fortress near north wall, looking out at the wall
  g.scene.camera.position.set(25, 14, 22);
  g.scene.camera.lookAt(25, 10, 17);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/spider-wall-view.png' });

// Spawn spider outside wall and tick to "up" phase
const phases = await page.evaluate(() => {
  const g = window.__game;
  g.enemies.spawn('spider', 25, 10);
  const sp = () => g.enemies.getAliveEnemies().find(e => e.config.type === 'spider');
  
  // Fast-forward to "up" phase
  for (let i = 0; i < 30; i++) g.enemies.update(0.1);
  const s = sp();
  const pos = g.enemies.getEnemyPosition(s?.id ?? -1);
  return { phase: s?.climbPhase, y: pos?.y?.toFixed(1), z: pos?.z?.toFixed(1) };
});
console.log('Spider at up phase:', JSON.stringify(phases));

// Screenshot during climb
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/spider-climbing-vis.png' });

// Continue to "across" phase
const phases2 = await page.evaluate(() => {
  const g = window.__game;
  for (let i = 0; i < 20; i++) g.enemies.update(0.1);
  const sp = g.enemies.getAliveEnemies().find(e => e.config.type === 'spider');
  const pos = g.enemies.getEnemyPosition(sp?.id ?? -1);
  return { phase: sp?.climbPhase, y: pos?.y?.toFixed(1), z: pos?.z?.toFixed(1) };
});
console.log('Spider at across/down phase:', JSON.stringify(phases2));
await page.screenshot({ path: 'screenshots/spider-across.png' });

await browser.close();
console.log('Screenshots: spider-wall-view.png, spider-climbing-vis.png, spider-across.png');
