import { chromium } from '@playwright/test';

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-dev-shm-usage']
});
const page = await (await browser.newContext({ viewport: {width: 1280, height: 720} })).newPage();

await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

const result = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return { error: 'no game' };
  
  // Add items - hotbar may be full, check backpack too
  g.inventory.addItem('dispenser', 3);
  g.inventory.addItem('tnt', 3);
  
  const allSlots = [...g.inventory.hotbar, ...g.inventory.backpack].filter(Boolean);
  return {
    dispenser: allSlots.filter(s => s?.itemId === 'dispenser').length,
    tnt: allSlots.filter(s => s?.itemId === 'tnt').length,
    totalHotbarSlots: g.inventory.hotbar.filter(Boolean).length,
    // Verify BLOCK_DEFS has them
    dispenserBlock: !!window.__game?.gameMap?.world?.getBlock,
    dispenserPosMap: g.dispenserBlocks?.size ?? 'N/A'
  };
});
console.log('Result:', JSON.stringify(result));

await browser.close();
