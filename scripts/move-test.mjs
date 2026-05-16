// Headless regression test for player movement and block mining.
// Drives Player/BlockInteraction directly — the in-game loop only ticks while
// the pointer is locked, which headless Chromium will not grant.
import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:5175/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });
page.on("pageerror", e => console.log("PAGE ERROR:", e.message));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__game && window.__game.player, null, { timeout: 15000 });

// --- Movement --------------------------------------------------------------
const sim = (input, frames) => page.evaluate(({ input, frames }) => {
  const p = window.__game.player;
  const before = [p.position.x, p.position.y, p.position.z];
  for (let i = 0; i < frames; i++) p.update(1 / 60, input);
  const after = [p.position.x, p.position.y, p.position.z];
  return { before, after, onGround: p.onGround };
}, { input, frames });

const NONE = { forward: false, backward: false, left: false, right: false, jump: false, sprint: false };

const settle = await sim(NONE, 30);
console.log("spawn settled:", JSON.stringify(settle.after), "onGround:", settle.onGround);

const fwd = await sim({ ...NONE, forward: true }, 90);
const dF = Math.hypot(fwd.after[0] - fwd.before[0], fwd.after[2] - fwd.before[2]);
const right = await sim({ ...NONE, right: true }, 90);
const dR = Math.hypot(right.after[0] - right.before[0], right.after[2] - right.before[2]);
const moved = dF + dR;
console.log(moved > 4
  ? `movement: moves freely ✅ (${moved.toFixed(1)} blocks)`
  : `movement: STUCK ❌ (${moved.toFixed(1)} blocks)`);

// --- Mining ----------------------------------------------------------------
// Place a wood block, aim the camera at it, hold-to-break, and confirm it
// breaks and that break progress accumulates frame over frame.
const mine = await page.evaluate(() => {
  const g = window.__game;
  const world = g.gameMap.world;
  const bi = g.blockInteraction;
  const cam = g.scene.camera;
  const TX = 32, TY = 12, TZ = 24;

  world.setBlock(TX, TY, TZ, "wood");
  world.rebuildDirtyChunks();

  cam.position.set(TX + 0.5, TY + 0.5, TZ - 3);
  cam.lookAt(TX + 0.5, TY + 0.5, TZ + 0.5);
  cam.updateMatrixWorld(true);

  bi.setBreaking(true);
  const progress = [];
  let brokeAtFrame = -1;
  for (let i = 0; i < 600; i++) {
    bi.update(1 / 60);
    if (i % 30 === 0) progress.push(+bi.getBreakProgress().toFixed(2));
    if (world.getBlock(TX, TY, TZ) === "air") { brokeAtFrame = i; break; }
  }
  return { targeted: !!bi.getTargetBlock(), brokeAtFrame, progress,
           finalBlock: world.getBlock(TX, TY, TZ) };
});
console.log("mining: targeted =", mine.targeted,
            "| progress =", JSON.stringify(mine.progress));
console.log(mine.brokeAtFrame >= 0
  ? `mining: works ✅ (block broke after ${mine.brokeAtFrame} frames)`
  : `mining: BROKEN ❌ (block still "${mine.finalBlock}" after 600 frames)`);

await browser.close();
