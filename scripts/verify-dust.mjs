import { chromium } from "@playwright/test";

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
});
const page = await browser.newPage();
const errors = [];
page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
page.on('pageerror', err => errors.push(err.message));

await page.goto('http://localhost:5176/');
await page.waitForTimeout(3000);

// Directly call updateBiomeDust to test spawning without pointer lock
const result = await page.evaluate(() => {
  const g = window.__game;
  if (!g) return { error: 'no __game' };
  const particles = g.particles;
  if (!particles) return { error: 'no particles' };
  
  // Call updateBiomeDust directly for forest
  particles.updateBiomeDust(32, 4, 32, 'forest', 0.016);
  const afterForest = particles._dustMotes.length;
  
  // Call multiple times to fill pool  
  for (let i = 0; i < 20; i++) particles.updateBiomeDust(32, 4, 32, 'forest', 0.016);
  const afterMany = particles._dustMotes.length;
  
  // Test biome switch (should clear)
  particles.updateBiomeDust(60, 4, 60, 'desert', 0.016);
  const afterSwitch = { count: particles._dustMotes.length, biome: particles._dustBiome };
  
  // Fill desert pool
  for (let i = 0; i < 20; i++) particles.updateBiomeDust(60, 4, 60, 'desert', 0.016);
  const desertFull = particles._dustMotes.length;
  
  return {
    afterOneForestTick: afterForest,
    afterManyForestTicks: afterMany,
    afterBiomeSwitch: afterSwitch,
    desertFull,
    maxForest: 28,
    maxDesert: 22,
  };
});

console.log('Dust test result:', JSON.stringify(result, null, 2));

if (errors.length > 0) {
  console.log('\nBrowser errors:');
  errors.forEach(e => console.log('  ', e));
} else {
  console.log('\nNo browser errors.');
}

// Verify expectations
const ok = result.afterOneForestTick === 2 &&       // 2 motes spawned per call
           result.afterManyForestTicks === 28 &&     // caps at 28 for forest
           result.afterBiomeSwitch.count === 2 &&    // cleared + 2 new desert motes
           result.afterBiomeSwitch.biome === 'desert' &&
           result.desertFull === 22;                  // caps at 22 for desert
console.log('\nAll assertions pass:', ok);

await browser.close();
