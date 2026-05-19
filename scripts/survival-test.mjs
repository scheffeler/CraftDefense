// Headless verification for the survival-mode redesign + lighting.
import { chromium } from "playwright";

const URL = process.env.URL || "http://localhost:6173/";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 700 } });
page.on("pageerror", e => console.log("PAGE ERROR:", e.message));

await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForFunction(() => window.__game && window.__game.flag, null, { timeout: 15000 });

// --- World / flag assertions ----------------------------------------------
const checks = await page.evaluate(() => {
  const g = window.__game;
  const w = g.gameMap.world;
  return {
    flagHealth:   g.flag.health,
    flagMax:      g.flag.maxHealth,
    platform:     w.getBlock(32, 6, 32),          // starter platform
    craftingTbl:  w.getBlock(30, 7, 30),          // starter utility
    clearingGrnd: w.getBlock(32, 6, 26),          // open clearing surface
    oldTowerTop:  w.getBlock(19, 11, 19),         // old corner tower — must be gone
    oldWall:      w.getBlock(18, 13, 30),         // old wall merlon (Y=13, above any hill)
  };
});
const pass = (name, cond, detail) =>
  console.log(`${cond ? "✅" : "❌"} ${name}${detail ? "  (" + detail + ")" : ""}`);

pass("flag exists at full health", checks.flagHealth === checks.flagMax && checks.flagMax === 100,
     `${checks.flagHealth}/${checks.flagMax}`);
pass("starter platform present", checks.platform === "cobblestone", checks.platform);
pass("starter crafting table present", checks.craftingTbl === "crafting_table", checks.craftingTbl);
pass("clearing is flat grass", checks.clearingGrnd === "grass", checks.clearingGrnd);
pass("old corner tower removed", checks.oldTowerTop === "air", `(19,11,19)=${checks.oldTowerTop}`);
pass("old wall removed", checks.oldWall === "air", `(18,13,30)=${checks.oldWall}`);

// --- Rendering screenshots -------------------------------------------------
const hideUI = () => page.evaluate(() => {
  const c = document.querySelector("canvas");
  document.querySelectorAll("*").forEach(el => {
    if (el === c || el.contains(c)) return;
    el.style.setProperty("display", "none", "important");
  });
});
const shot = async (name, cam, look) => {
  await page.evaluate(({ cam, look }) => {
    const g = window.__game;
    g.phase = "win";                       // freeze the title-orbit camera
    const c = g.scene.camera;
    c.position.set(cam[0], cam[1], cam[2]);
    c.lookAt(look[0], look[1], look[2]);
    c.updateMatrixWorld(true);
  }, { cam, look });
  await page.waitForTimeout(400);
  await page.screenshot({ path: "screenshots/" + name });
  console.log("saved screenshots/" + name);
};
await hideUI();
await shot("survival-overview.png", [32, 20, 6], [32, 8, 36]);   // clearing + flag from afar
await shot("survival-flag.png",     [32, 9, 22], [32, 9, 33]);   // flag close-up

// --- Flag damage + loss path ----------------------------------------------
const dmg = await page.evaluate(() => {
  const g = window.__game;
  g.phase = "playing";
  const before = g.flag.health;
  g.flag.takeDamage(40);
  const afterHit = g.flag.health;
  // Simulate an enemy reaching the flag with a lethal blow.
  g.enemies.onEnemyReachedBase({ id: -1, config: { damage: 999 } });
  return { before, afterHit, flagHealth: g.flag.health, phase: g.phase };
});
pass("flag takes damage", dmg.afterHit === dmg.before - 40, `${dmg.before} -> ${dmg.afterHit}`);
pass("flag loss ends the game", dmg.phase === "gameover" && dmg.flagHealth === 0,
     `phase=${dmg.phase}, flagHP=${dmg.flagHealth}`);

await browser.close();
