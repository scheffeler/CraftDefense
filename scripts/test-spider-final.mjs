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

// Run the climbing simulation and capture mid-climb screenshot
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Spawn spider at exact position and give it a fixed target so we know where to look
const info = await page.evaluate(() => {
  const g = window.__game;
  
  // Spawn spider just outside north wall at x=25 (non-gate), z=10
  g.enemies.spawn('spider', 25, 10);
  const sp = g.enemies.getAliveEnemies().find(e => e.config.type === 'spider');
  
  // Override target to a known position for camera setup
  sp.climbTargetX = 25.5;
  sp.climbTargetZ = 18;
  sp.climbInnerZ = 20;
  sp.climbDirZ = 1;
  
  // Fast-forward to mid-climb (up phase)
  for (let i = 0; i < 35; i++) g.enemies.update(0.1);
  
  const pos = g.enemies.getEnemyPosition(sp.id);
  return { phase: sp.climbPhase, x: pos?.x?.toFixed(1), y: pos?.y?.toFixed(1), z: pos?.z?.toFixed(1) };
});
console.log('Spider state:', JSON.stringify(info));

// Camera: inside fortress looking back at north wall at x=25
await page.evaluate(() => {
  const g = window.__game;
  if (!g?.scene) return;
  g.scene.camera.position.set(25, 13, 23);
  g.scene.camera.lookAt(25, 10, 17);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/spider-climb-final.png' });

await browser.close();
console.log('Screenshot: screenshots/spider-climb-final.png');
