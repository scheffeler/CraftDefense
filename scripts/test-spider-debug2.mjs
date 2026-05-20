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
  
  // Use the GAME's existing flow field (already computed)
  const ff = g.flowField;
  
  // Check flow at several positions north of the fortress
  const positions = [
    [32, 15], [25, 15], [32, 20], [32, 18],
    [25, 18], [25, 17], [25, 14],
  ];
  const flows = positions.map(([x, z]) => {
    const dist = ff.getDistance(x, z);
    const dir = ff.getFlowDirection(x, z);
    return { x, z, dist: dist === Infinity ? 'inf' : +(dist).toFixed(1), dx: +dir.dx.toFixed(2), dz: +dir.dz.toFixed(2) };
  });
  
  // Check wall blocks at x=25, z=18
  const wallCheck = [6, 7, 8, 9, 10, 11].map(y => ({
    y, block: g.gameMap.world.getBlock(25, y, 18)
  }));
  
  // Also check isPassable at z=18, x=25 (the flow field's internal check)
  const passable18_25 = g.gameMap.world.getBlock(25, 7, 18) === 'air';
  const passable18_32 = g.gameMap.world.getBlock(32, 7, 18) === 'air';
  
  return { flows, wallCheck, passable: { x25_z18: passable18_25, x32_z18: passable18_32 } };
});
console.log(JSON.stringify(debug, null, 2));

await browser.close();
