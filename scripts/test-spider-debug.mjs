import { chromium } from '@playwright/test';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(5000);

const debug = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return 'no game';
  
  // Check flow field at spider spawn position
  g.flowField.recompute(32, 32);
  const flowDir = g.flowField.getFlowDirection(32, 15);
  const flowDist = g.flowField.getDistance(32, 15);
  
  // Check what's at the wall position
  const wallBlock_y6 = g.gameMap.world.getBlock(32, 6, 18);
  const wallBlock_y7 = g.gameMap.world.getBlock(32, 7, 18);
  const wallBlock_y8 = g.gameMap.world.getBlock(32, 8, 18);
  const wallBlock_y9 = g.gameMap.world.getBlock(32, 9, 18);
  
  // Spawn spider and check its useFlowField property
  g.enemies.spawn('spider', 32, 15);
  const spiders = g.enemies.getAliveEnemies().filter(e => e.config.type === 'spider');
  const sp = spiders[0];
  
  // Manually do ONE tick to see what happens
  g.enemies.update(0.1);
  const pos = g.enemies.getEnemyPosition(sp?.id ?? -1);
  
  return {
    flowDir,
    flowDist,
    wallBlocks: { y6: wallBlock_y6, y7: wallBlock_y7, y8: wallBlock_y8, y9: wallBlock_y9 },
    spiderState: sp ? {
      id: sp.id,
      useFlowField: sp.useFlowField,
      speed: sp.speed,
      alive: sp.alive,
      climbPhase: sp.climbPhase,
    } : null,
    posAfterTick: pos ? { x: +(pos.x).toFixed(2), y: +(pos.y).toFixed(2), z: +(pos.z).toFixed(2) } : null,
  };
});
console.log(JSON.stringify(debug, null, 2));

await browser.close();
