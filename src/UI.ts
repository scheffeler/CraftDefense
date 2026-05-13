import type { TowerTypeName, TowerState } from "./types";
import type { Inventory, ItemStack } from "./Inventory";
import { ITEMS } from "./config/items";

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

export class UI {
  // FPS callbacks
  onRestart: () => void = () => {};
  onCraftingSlotClick: (row: number, col: number) => void = () => {};
  onCraftingResultClick: () => void = () => {};

  // Legacy TD stubs (backward compat — Game.ts uses these until Phase 12)
  onStartWave: () => void = () => {};
  onSelectTowerType: (_t: TowerTypeName | null) => void = () => {};
  onUpgrade: () => void = () => {};
  onSell: () => void = () => {};
  onStartGame: (_difficulty: "easy" | "normal" | "hard") => void = () => {};

  private crosshair!: HTMLElement;
  private hotbarSlots: HTMLElement[] = [];
  private heartEls: HTMLElement[] = [];
  private elWaveInfo!: HTMLElement;
  private elObjective!: HTMLElement;
  private lockPrompt!: HTMLElement;
  private inventoryOverlay!: HTMLElement;
  private deathOverlay!: HTMLElement;
  private endOverlay!: HTMLElement;
  private floatingContainer!: HTMLElement;

  // Inventory slot elements
  private backpackSlotEls: HTMLElement[] = [];
  private hotbarInvSlotEls: HTMLElement[] = [];
  private armorSlotEls: Record<string, HTMLElement> = {};
  private personalCraftCells: HTMLElement[][] = [];
  private personalCraftResult!: HTMLElement;

  private _personalGrid: (string | null)[][] = [[null, null], [null, null]];
  private _inventoryOpen = false;

  private readonly container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.injectCSS();
    this.build();
  }

  // ─── FPS HUD update methods ────────────────────────────────────────────────

  updatePlayerHealth(current: number, max: number): void {
    const totalHearts = Math.ceil(max / 2);
    for (let i = 0; i < this.heartEls.length; i++) {
      const hp = current - i * 2;
      const el = this.heartEls[i];
      if (i >= totalHearts) { el.style.display = "none"; continue; }
      el.style.display = "";
      if (hp >= 2) { el.textContent = "♥"; el.style.color = "#ff4444"; }
      else if (hp === 1) { el.textContent = "♥"; el.style.color = "#884444"; }
      else { el.textContent = "♡"; el.style.color = "#553333"; }
    }
  }

  updateHotbar(hotbar: (ItemStack | null)[], activeSlot: number): void {
    for (let i = 0; i < 9; i++) {
      const slot = this.hotbarSlots[i];
      const stack = hotbar[i] ?? null;
      slot.classList.toggle("active", i === activeSlot);
      this.renderStackInSlot(slot, stack);
    }
  }

  updateWaveInfo(wave: number, total: number, enemyCount: number): void {
    this.elWaveInfo.innerHTML =
      `Wave ${wave}/${total}<br><span style="color:#ffaa44">${enemyCount} enemies</span>`;
  }

  setObjective(text: string): void {
    this.elObjective.textContent = text;
    this.elObjective.style.opacity = text ? "1" : "0";
  }

  showPointerLockPrompt(show: boolean): void {
    this.lockPrompt.style.display = show ? "flex" : "none";
  }

  showInventory(show: boolean, inventory?: Inventory): void {
    this._inventoryOpen = show;
    this.inventoryOverlay.style.display = show ? "flex" : "none";
    if (show && inventory) this.refreshInventoryDisplay(inventory);
  }

  isInventoryOpen(): boolean { return this._inventoryOpen; }

  showDeathScreen(): void { this.deathOverlay.style.display = "flex"; }
  hideDeathScreen(): void { this.deathOverlay.style.display = "none"; }

  showFloatingNumber(text: string, color: string, screenX: number, screenY: number): void {
    const div = document.createElement("div");
    div.className = "float-num";
    div.textContent = text;
    div.style.cssText = `left:${screenX}px;top:${screenY}px;color:${color}`;
    this.floatingContainer.appendChild(div);
    setTimeout(() => div.remove(), 1100);
  }

  // ── Personal crafting grid (2×2 in inventory overlay) ─────────────────────

  setPersonalCraftSlot(row: number, col: number, itemId: string | null): void {
    this._personalGrid[row][col] = itemId;
    const cell = this.personalCraftCells[row]?.[col];
    if (cell) this.renderIdInSlot(cell, itemId);
  }

  setPersonalCraftResult(itemId: string | null, count: number): void {
    this.renderIdInSlot(this.personalCraftResult, itemId, count > 1 ? count : undefined);
  }

  getPersonalCraftGrid(): (string | null)[][] {
    return this._personalGrid.map(r => [...r]);
  }

  // ─── End screens ──────────────────────────────────────────────────────────

  showEnd(type: "victory" | "gameover", detail: string): void {
    const box = this.endOverlay.querySelector(".overlay-box")!;
    const title = box.querySelector<HTMLElement>(".overlay-title")!;
    const stats = box.querySelector<HTMLElement>(".overlay-stats")!;
    title.textContent = type === "victory" ? "VICTORY!" : "GAME OVER";
    title.style.color = type === "victory" ? "#ffdd00" : "#ff4444";
    stats.textContent = detail;
    this.endOverlay.style.display = "flex";
  }

  hideEnd(): void { this.endOverlay.style.display = "none"; }

  // ─── Legacy TD stubs ──────────────────────────────────────────────────────
  // These are no-ops kept to avoid breaking Game.ts until Phase 12 rewrite.
  updateHealth(_current: number, _max?: number): void {}
  updateGold(_gold: number): void {}
  updateWave(_wave: number, _total: number): void {}
  updateEnemyCount(_count: number): void {}
  setStartWaveEnabled(_enabled: boolean): void {}
  updateTowerButtons(_gold: number): void {}
  selectTowerBtn(_type: TowerTypeName | null): void {}
  showSelectedTower(_state: TowerState | null, _gold: number): void {}
  showBanner(_text: string, _durationMs?: number): void {}
  showMenu(): void { this.showPointerLockPrompt(true); }
  hideMenu(): void { this.showPointerLockPrompt(false); }
  showGameOver(wave: number, kills: number): void {
    this.showEnd("gameover", `Survived ${wave} waves · ${kills} enemies defeated`);
  }
  showVictory(kills: number, gold: number): void {
    this.showEnd("victory", `All waves cleared! · ${kills} kills · $${gold} earned`);
  }
  hideEndScreens(): void { this.hideEnd(); }

  // ─────────────────────────────────────────────────────────────────────────
  // DOM construction
  // ─────────────────────────────────────────────────────────────────────────

  private build(): void {
    this.container.style.cssText = "position:relative;width:100vw;height:100vh;overflow:hidden;";

    this.crosshair = div("fps-crosshair");
    this.crosshair.innerHTML = `<span class="fps-ch-h"></span><span class="fps-ch-v"></span>`;
    this.container.appendChild(this.crosshair);

    this.elObjective = div("fps-objective");
    this.container.appendChild(this.elObjective);

    this.elWaveInfo = div("fps-wave-info");
    this.elWaveInfo.innerHTML = "Wave 0/10<br>0 enemies";
    this.container.appendChild(this.elWaveInfo);

    this.buildHearts();
    this.buildHotbar();

    this.floatingContainer = div("floating-container");
    this.container.appendChild(this.floatingContainer);

    this.lockPrompt = div("fps-lock-prompt");
    this.lockPrompt.innerHTML = `
      <div class="fps-lock-box">
        <div class="fps-lock-title">HELM'S DEEP</div>
        <div class="fps-lock-sub">Mine · Craft · Survive</div>
        <div class="fps-lock-cta">Click to Play</div>
        <div class="fps-lock-controls">
          WASD: move &nbsp;|&nbsp; Mouse: look &nbsp;|&nbsp;
          LClick: mine/attack &nbsp;|&nbsp; RClick: place &nbsp;|&nbsp;
          E: inventory &nbsp;|&nbsp; 1-9: hotbar &nbsp;|&nbsp; Esc: unlock
        </div>
      </div>`;
    this.container.appendChild(this.lockPrompt);

    this.buildInventoryOverlay();
    this.buildDeathOverlay();
    this.buildEndOverlay();
  }

  private buildHearts(): void {
    const wrap = div("fps-hearts");
    for (let i = 0; i < 10; i++) {
      const h = div("fps-heart");
      h.textContent = "♥";
      wrap.appendChild(h);
      this.heartEls.push(h);
    }
    this.container.appendChild(wrap);
  }

  private buildHotbar(): void {
    const bar = div("fps-hotbar");
    for (let i = 0; i < 9; i++) {
      const slot = div("fps-hotbar-slot");
      slot.innerHTML = `<span class="fps-slot-num">${i + 1}</span>
        <span class="fps-slot-icon"></span>
        <span class="fps-slot-count"></span>`;
      bar.appendChild(slot);
      this.hotbarSlots.push(slot);
    }
    this.container.appendChild(bar);
  }

  private buildInventoryOverlay(): void {
    const ov = div("fps-inventory overlay hidden");
    ov.style.display = "none";

    const box = div("fps-inv-box");

    // Top row: armor + 2×2 craft
    const topRow = div("fps-inv-top");

    const armorWrap = div("fps-inv-armor");
    const armorLabel = div("fps-inv-label");
    armorLabel.textContent = "Armor";
    armorWrap.appendChild(armorLabel);
    const armorGrid = div("fps-armor-grid");
    for (const slot of ["head", "chest", "legs", "feet"] as const) {
      const cell = div("fps-slot fps-armor-slot");
      cell.dataset.slot = slot;
      cell.title = slot;
      const icon = div("fps-slot-icon-inner");
      icon.textContent = armorIcon(slot);
      cell.appendChild(icon);
      armorGrid.appendChild(cell);
      this.armorSlotEls[slot] = cell;
    }
    armorWrap.appendChild(armorGrid);
    topRow.appendChild(armorWrap);

    const craftWrap = div("fps-inv-craft");
    const craftLabel = div("fps-inv-label");
    craftLabel.textContent = "Craft (2\xd72)";
    craftWrap.appendChild(craftLabel);
    const craftArea = div("fps-craft-area");
    const grid2 = div("fps-craft-grid fps-grid-2x2");
    this.personalCraftCells = [];
    for (let r = 0; r < 2; r++) {
      const row: HTMLElement[] = [];
      for (let c = 0; c < 2; c++) {
        const cell = div("fps-slot fps-craft-cell");
        cell.addEventListener("click", () => this.onCraftingSlotClick(r, c));
        grid2.appendChild(cell);
        row.push(cell);
      }
      this.personalCraftCells.push(row);
    }
    craftArea.appendChild(grid2);
    const arrow = div("fps-craft-arrow");
    arrow.textContent = "➡";
    craftArea.appendChild(arrow);
    this.personalCraftResult = div("fps-slot fps-craft-result");
    this.personalCraftResult.addEventListener("click", () => this.onCraftingResultClick());
    craftArea.appendChild(this.personalCraftResult);
    craftWrap.appendChild(craftArea);
    topRow.appendChild(craftWrap);

    box.appendChild(topRow);

    // Backpack grid (3 × 9)
    const bpLabel = div("fps-inv-label");
    bpLabel.textContent = "Inventory";
    box.appendChild(bpLabel);
    const bpGrid = div("fps-inv-grid");
    this.backpackSlotEls = [];
    for (let i = 0; i < 27; i++) {
      const cell = div("fps-slot");
      bpGrid.appendChild(cell);
      this.backpackSlotEls.push(cell);
    }
    box.appendChild(bpGrid);

    // Hotbar row
    const hbLabel = div("fps-inv-label");
    hbLabel.textContent = "Hotbar";
    box.appendChild(hbLabel);
    const hbGrid = div("fps-inv-hotbar-row");
    this.hotbarInvSlotEls = [];
    for (let i = 0; i < 9; i++) {
      const cell = div("fps-slot fps-slot-hotbar");
      hbGrid.appendChild(cell);
      this.hotbarInvSlotEls.push(cell);
    }
    box.appendChild(hbGrid);

    const hint = div("fps-inv-hint");
    hint.textContent = "[E] close  ·  Click slots to interact";
    box.appendChild(hint);

    ov.appendChild(box);
    this.inventoryOverlay = ov;
    this.container.appendChild(ov);
  }

  private buildDeathOverlay(): void {
    const ov = div("overlay");
    ov.style.display = "none";
    ov.innerHTML = `
      <div class="overlay-box">
        <h1 class="overlay-title" style="color:#ff4444">YOU DIED</h1>
        <p class="overlay-stats">The fortress has fallen.</p>
        <button class="overlay-btn" id="death-restart">Respawn</button>
      </div>`;
    ov.querySelector("#death-restart")!.addEventListener("click", () => {
      ov.style.display = "none";
      this.onRestart();
    });
    this.deathOverlay = ov;
    this.container.appendChild(ov);
  }

  private buildEndOverlay(): void {
    const ov = div("overlay");
    ov.style.display = "none";
    ov.innerHTML = `
      <div class="overlay-box">
        <h1 class="overlay-title"></h1>
        <p class="overlay-stats"></p>
        <button class="overlay-btn" id="end-restart">Play Again</button>
      </div>`;
    ov.querySelector("#end-restart")!.addEventListener("click", () => {
      ov.style.display = "none";
      this.onRestart();
    });
    this.endOverlay = ov;
    this.container.appendChild(ov);
  }

  // ─── Inventory display refresh ────────────────────────────────────────────

  private refreshInventoryDisplay(inv: Inventory): void {
    for (let i = 0; i < 27; i++) {
      this.renderStackInSlot(this.backpackSlotEls[i], inv.backpack[i]);
    }
    for (let i = 0; i < 9; i++) {
      this.renderStackInSlot(this.hotbarInvSlotEls[i], inv.hotbar[i]);
    }
    for (const [slot, el] of Object.entries(this.armorSlotEls)) {
      const stack = inv.armor[slot as keyof typeof inv.armor];
      this.renderStackInSlot(el, stack);
      const icon = el.querySelector<HTMLElement>(".fps-slot-icon-inner");
      if (icon) icon.style.display = stack ? "none" : "";
    }
  }

  // ─── Slot rendering helpers ───────────────────────────────────────────────

  private renderStackInSlot(el: HTMLElement, stack: ItemStack | null): void {
    this.renderIdInSlot(el, stack?.itemId ?? null, stack?.count);
  }

  private renderIdInSlot(el: HTMLElement, itemId: string | null, count?: number): void {
    const iconEl = el.querySelector<HTMLElement>(".fps-slot-icon") ??
                   el.querySelector<HTMLElement>(".fps-slot-icon-inner");
    const countEl = el.querySelector<HTMLElement>(".fps-slot-count");

    if (!itemId) {
      if (iconEl) { iconEl.style.backgroundColor = ""; iconEl.title = ""; }
      if (countEl) countEl.textContent = "";
      el.dataset.item = "";
      return;
    }

    const def = ITEMS[itemId];
    const color = def ? hexColor(def.color) : "#888888";
    const name  = def?.name ?? itemId;

    if (iconEl) {
      iconEl.style.backgroundColor = color;
      iconEl.title = name;
    } else {
      el.style.background = `linear-gradient(135deg, ${color}cc, ${color}66)`;
      el.title = name;
    }
    if (countEl && count !== undefined && count > 1) {
      countEl.textContent = String(count);
    } else if (countEl) {
      countEl.textContent = "";
    }
    el.dataset.item = itemId;
  }

  // ─── CSS injection ────────────────────────────────────────────────────────

  private injectCSS(): void {
    const style = document.createElement("style");
    style.textContent = FPS_CSS;
    document.head.appendChild(style);
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function div(cls: string): HTMLElement {
  const e = document.createElement("div");
  e.className = cls;
  return e;
}

function hexColor(n: number): string {
  return "#" + n.toString(16).padStart(6, "0");
}

function armorIcon(slot: string): string {
  return { head: "⛑", chest: "🧳", legs: "👖", feet: "👢" }[slot] ?? "?";
}

// ─── FPS-specific CSS ─────────────────────────────────────────────────────────

const FPS_CSS = `
/* Crosshair */
.fps-crosshair {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 20;
}
.fps-ch-h {
  position: absolute;
  width: 16px; height: 2px;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 0 4px rgba(0,0,0,0.8);
}
.fps-ch-v {
  position: absolute;
  width: 2px; height: 16px;
  background: rgba(255,255,255,0.85);
  box-shadow: 0 0 4px rgba(0,0,0,0.8);
}

/* Objective banner */
.fps-objective {
  position: absolute;
  top: 14px; left: 50%; transform: translateX(-50%);
  font-size: 13px; font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 6px rgba(0,0,0,0.9);
  background: rgba(0,0,0,0.45);
  padding: 5px 14px;
  border-radius: 20px;
  pointer-events: none; z-index: 15;
  transition: opacity 0.3s;
  white-space: nowrap;
}

/* Wave info (top right) */
.fps-wave-info {
  position: absolute;
  top: 10px; right: 14px;
  font-size: 13px; font-weight: bold;
  color: #88ccff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  background: rgba(0,0,0,0.45);
  padding: 6px 12px;
  border-radius: 6px;
  pointer-events: none; z-index: 15;
  line-height: 1.4; text-align: right;
}

/* Health hearts */
.fps-hearts {
  position: absolute;
  bottom: 68px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 3px;
  pointer-events: none; z-index: 15;
}
.fps-heart {
  font-size: 18px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
}

/* Hotbar */
.fps-hotbar {
  position: absolute;
  bottom: 10px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 4px;
  background: rgba(0,0,0,0.55);
  padding: 5px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  z-index: 15;
}
.fps-hotbar-slot {
  position: relative;
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.06);
  border: 2px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.fps-hotbar-slot.active {
  border-color: #fff;
  background: rgba(255,255,255,0.12);
  box-shadow: 0 0 8px rgba(255,255,255,0.3);
}
.fps-hotbar-slot .fps-slot-num {
  position: absolute; top: 2px; left: 4px;
  font-size: 9px; color: rgba(255,255,255,0.4);
  pointer-events: none;
}
.fps-hotbar-slot .fps-slot-icon {
  width: 30px; height: 30px;
  border-radius: 3px;
  display: block;
}
.fps-hotbar-slot .fps-slot-count {
  position: absolute; bottom: 2px; right: 3px;
  font-size: 9px; font-weight: bold;
  color: #fff; text-shadow: 0 1px 2px rgba(0,0,0,0.9);
}

/* Pointer lock prompt */
.fps-lock-prompt {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(6px);
  z-index: 60;
}
.fps-lock-box {
  text-align: center;
  padding: 48px 56px;
  background: rgba(10,15,25,0.95);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  max-width: 520px;
}
.fps-lock-title {
  font-size: 40px; font-weight: bold;
  letter-spacing: 0.1em;
  color: #ffdd44;
  text-shadow: 0 0 24px rgba(255,200,0,0.5);
  margin-bottom: 8px;
}
.fps-lock-sub {
  font-size: 16px; color: rgba(255,255,255,0.65);
  margin-bottom: 28px;
}
.fps-lock-cta {
  font-size: 20px; font-weight: bold;
  color: #88ee88;
  padding: 12px 32px;
  border: 2px solid #44aa44;
  border-radius: 8px;
  background: rgba(40,100,40,0.4);
  cursor: pointer;
  display: inline-block;
  margin-bottom: 20px;
}
.fps-lock-controls {
  font-size: 11px; color: rgba(255,255,255,0.35);
  line-height: 1.8;
}

/* Inventory overlay */
.fps-inventory {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(4px);
  z-index: 50;
}
.fps-inv-box {
  background: rgba(10,14,22,0.97);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 20px 24px;
  display: flex; flex-direction: column; gap: 14px;
  min-width: 420px;
}
.fps-inv-top {
  display: flex; gap: 20px; align-items: flex-start;
}
.fps-inv-label {
  font-size: 11px; color: rgba(255,255,255,0.4);
  text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 6px;
}
.fps-inv-armor { display: flex; flex-direction: column; }
.fps-armor-grid {
  display: grid; grid-template-columns: repeat(2, 40px); gap: 4px;
}
.fps-inv-craft { display: flex; flex-direction: column; }
.fps-craft-area {
  display: flex; align-items: center; gap: 8px;
}
.fps-craft-grid { display: grid; gap: 4px; }
.fps-grid-2x2  { grid-template-columns: repeat(2, 40px); }
.fps-craft-arrow { font-size: 18px; color: rgba(255,255,255,0.5); }
.fps-craft-result { width: 40px; height: 40px; cursor: pointer; }
.fps-craft-result:hover { border-color: #88ee88 !important; }
.fps-inv-grid {
  display: grid; grid-template-columns: repeat(9, 40px); gap: 4px;
}
.fps-inv-hotbar-row {
  display: grid; grid-template-columns: repeat(9, 40px); gap: 4px;
  padding-top: 4px; border-top: 1px solid rgba(255,255,255,0.08);
}
.fps-slot-hotbar { border-color: rgba(255,255,255,0.3) !important; }
.fps-inv-hint {
  font-size: 10px; color: rgba(255,255,255,0.25);
  text-align: center;
}

/* Generic inventory slot */
.fps-slot {
  width: 40px; height: 40px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 3px;
  display: flex; align-items: center; justify-content: center;
  cursor: default; position: relative; overflow: hidden;
}
.fps-slot:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.08); }
.fps-armor-slot { width: 40px; height: 40px; cursor: default; }
.fps-craft-cell { cursor: pointer; }
.fps-slot-icon-inner {
  font-size: 20px; pointer-events: none;
}

/* Floating numbers */
.floating-container {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 15;
}
.float-num {
  position: absolute;
  font-size: 16px; font-weight: bold;
  text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  pointer-events: none;
  animation: floatUp 1.1s ease-out forwards;
  transform: translateX(-50%);
}
@keyframes floatUp {
  0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
  80%  { opacity: 0.8; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-48px); }
}
`;
