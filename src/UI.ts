import type { TowerTypeName, TowerState } from "./types";
import type { Inventory, ItemStack } from "./Inventory";
import { ITEMS } from "./config/items";

// ─────────────────────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────────────────────

// Maps item IDs to SVG data URIs for pixel-art style hotbar icons
function makeItemIcon(color: string, shape: "sword" | "pick" | "axe" | "bow" | "block" | "food" | "armor" | "material"): string {
  const s = 32;
  let path = "";
  switch (shape) {
    case "sword":
      path = `<rect x="13" y="4" width="6" height="18" fill="${color}"/>
               <rect x="8" y="8" width="16" height="4" fill="${color}"/>
               <rect x="13" y="22" width="6" height="6" fill="#5c3a1a"/>`;
      break;
    case "pick":
      path = `<rect x="4" y="8" width="24" height="6" fill="${color}"/>
               <rect x="4" y="8" width="6" height="14" fill="${color}"/>
               <rect x="14" y="14" width="4" height="12" fill="#5c3a1a"/>`;
      break;
    case "axe":
      path = `<rect x="4" y="6" width="14" height="12" fill="${color}"/>
               <rect x="14" y="6" width="4" height="20" fill="#5c3a1a"/>`;
      break;
    case "bow":
      path = `<rect x="6" y="4" width="4" height="24" fill="#8b6914"/>
               <rect x="10" y="4" width="12" height="2" fill="#8b6914"/>
               <rect x="10" y="26" width="12" height="2" fill="#8b6914"/>
               <rect x="10" y="15" width="12" height="2" fill="#c8a060"/>`;
      break;
    case "food":
      path = `<rect x="8" y="8" width="16" height="16" fill="${color}"/>
               <rect x="10" y="6" width="4" height="4" fill="#3a7a25"/>`;
      break;
    case "armor":
      path = `<rect x="6" y="6" width="20" height="20" fill="${color}"/>
               <rect x="10" y="4" width="5" height="4" fill="${color}"/>
               <rect x="17" y="4" width="5" height="4" fill="${color}"/>`;
      break;
    default: // material / block
      path = `<rect x="4" y="4" width="24" height="24" fill="${color}"/>
               <rect x="4" y="4" width="24" height="4" fill="${color}cc"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}">${path}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function makeSvgUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

// Pixel-art heart icons (18×18 px)
const HEART_FULL  = makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect x="2" y="4" width="4" height="2" fill="#c00000"/><rect x="10" y="4" width="4" height="2" fill="#c00000"/><rect x="0" y="6" width="16" height="2" fill="#c00000"/><rect x="0" y="8" width="16" height="4" fill="#c00000"/><rect x="2" y="12" width="12" height="2" fill="#c00000"/><rect x="4" y="14" width="8" height="2" fill="#c00000"/><rect x="6" y="16" width="4" height="2" fill="#c00000"/><rect x="2" y="4" width="2" height="2" fill="#ff4444"/><rect x="10" y="4" width="2" height="2" fill="#ff4444"/></svg>`);
const HEART_HALF  = makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect x="2" y="4" width="4" height="2" fill="#7a0000"/><rect x="10" y="4" width="4" height="2" fill="#7a0000"/><rect x="0" y="6" width="16" height="2" fill="#7a0000"/><rect x="0" y="8" width="16" height="4" fill="#7a0000"/><rect x="2" y="12" width="12" height="2" fill="#7a0000"/><rect x="4" y="14" width="8" height="2" fill="#7a0000"/><rect x="6" y="16" width="4" height="2" fill="#7a0000"/><rect x="0" y="8" width="8" height="4" fill="#c00000"/><rect x="0" y="6" width="8" height="2" fill="#c00000"/><rect x="2" y="4" width="4" height="2" fill="#c00000"/></svg>`);
const HEART_EMPTY = makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect x="2" y="4" width="4" height="2" fill="#373737"/><rect x="10" y="4" width="4" height="2" fill="#373737"/><rect x="0" y="6" width="16" height="2" fill="#373737"/><rect x="0" y="8" width="16" height="4" fill="#373737"/><rect x="2" y="12" width="12" height="2" fill="#373737"/><rect x="4" y="14" width="8" height="2" fill="#373737"/><rect x="6" y="16" width="4" height="2" fill="#373737"/></svg>`);

// Pixel-art food/drumstick icons (18×18 px)
const FOOD_FULL  = makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect x="8" y="2" width="6" height="4" fill="#c8a060"/><rect x="10" y="4" width="6" height="6" fill="#c8a060"/><rect x="8" y="8" width="8" height="4" fill="#aa7030"/><rect x="4" y="10" width="8" height="4" fill="#aa7030"/><rect x="2" y="12" width="8" height="2" fill="#8b5c2a"/><rect x="2" y="14" width="4" height="2" fill="#8b5c2a"/></svg>`);
const FOOD_HALF  = makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect x="8" y="2" width="6" height="4" fill="#886040"/><rect x="10" y="4" width="6" height="6" fill="#886040"/><rect x="8" y="8" width="8" height="4" fill="#664020"/><rect x="4" y="10" width="8" height="4" fill="#664020"/><rect x="2" y="12" width="8" height="2" fill="#4a3010"/><rect x="2" y="14" width="4" height="2" fill="#4a3010"/></svg>`);
const FOOD_EMPTY = makeSvgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><rect x="8" y="2" width="6" height="4" fill="#333"/><rect x="10" y="4" width="6" height="6" fill="#333"/><rect x="8" y="8" width="8" height="4" fill="#2a2a2a"/><rect x="4" y="10" width="8" height="4" fill="#2a2a2a"/><rect x="2" y="12" width="8" height="2" fill="#222"/><rect x="2" y="14" width="4" height="2" fill="#222"/></svg>`);

const ITEM_ICONS: Record<string, string> = {};
function getItemIcon(itemId: string): string {
  if (ITEM_ICONS[itemId]) return ITEM_ICONS[itemId];
  const def = ITEMS[itemId];
  if (!def) return "";
  const hex = hexColor(def.color);
  let shape: Parameters<typeof makeItemIcon>[1] = "material";
  if (def.category === "weapon") shape = "sword";
  else if (def.toolCategory === "pickaxe") shape = "pick";
  else if (def.toolCategory === "axe") shape = "axe";
  else if (def.id === "bow") shape = "bow";
  else if (def.category === "food") shape = "food";
  else if (def.category === "armor") shape = "armor";
  else if (def.category === "block") shape = "block";
  ITEM_ICONS[itemId] = makeItemIcon(hex, shape);
  return ITEM_ICONS[itemId];
}

export class UI {
  // FPS callbacks
  onRestart: () => void = () => {};
  onPointerLockRequest: () => void = () => {};
  onModeSelect: (mode: "helmsdeep" | "freeplay") => void = () => {};
  onCraftingSlotClick: (row: number, col: number) => void = () => {};
  onCraftingResultClick: () => void = () => {};
  onWorkbenchSlotClick: (row: number, col: number) => void = () => {};
  onWorkbenchResultClick: () => void = () => {};
  onWorkbenchClose: () => void = () => {};
  onRecipeBookClose: () => void = () => {};

  // Legacy TD stubs (backward compat — Game.ts uses these until Phase 12)
  onStartWave: () => void = () => {};
  onSelectTowerType: (_t: TowerTypeName | null) => void = () => {};
  onUpgrade: () => void = () => {};
  onSell: () => void = () => {};
  onStartGame: (_difficulty: "easy" | "normal" | "hard") => void = () => {};

  private crosshair!: HTMLElement;
  private hotbarSlots: HTMLElement[] = [];
  private heartEls: HTMLElement[] = [];
  private hungerEls: HTMLElement[] = [];
  private xpBarFill!: HTMLElement;
  private itemTooltip!: HTMLElement;
  private blockTooltip!: HTMLElement;
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

  // Workbench overlay
  private workbenchOverlay!: HTMLElement;
  private recipeBookOverlay!: HTMLElement;
  private workbenchCells: HTMLElement[][] = [];
  private workbenchResult!: HTMLElement;
  private _workbenchGrid: (string | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

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
      if (hp >= 2)     el.style.backgroundImage = `url("${HEART_FULL}")`;
      else if (hp === 1) el.style.backgroundImage = `url("${HEART_HALF}")`;
      else               el.style.backgroundImage = `url("${HEART_EMPTY}")`;
    }
  }

  updateXP(current: number, max: number): void {
    const pct = max > 0 ? Math.min(1, current / max) * 100 : 0;
    this.xpBarFill.style.width = `${pct}%`;
  }

  updateHunger(current: number, _max: number): void {
    for (let i = 0; i < this.hungerEls.length; i++) {
      const food = current - i * 2;
      const el = this.hungerEls[i];
      if (food >= 2)     { el.style.backgroundImage = `url("${FOOD_FULL}")`; el.style.opacity = "1"; }
      else if (food === 1) { el.style.backgroundImage = `url("${FOOD_HALF}")`; el.style.opacity = "1"; }
      else                 { el.style.backgroundImage = `url("${FOOD_EMPTY}")`; el.style.opacity = "1"; }
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

  showBlockTooltip(name: string | null): void {
    if (!name) { this.blockTooltip.style.display = "none"; return; }
    this.blockTooltip.textContent = name;
    this.blockTooltip.style.display = "block";
  }

  updateItemTooltip(itemId: string | null, durability?: number): void {
    if (!itemId) { this.itemTooltip.style.display = "none"; return; }
    const def = ITEMS[itemId];
    if (!def) { this.itemTooltip.style.display = "none"; return; }
    const durStr = (durability != null && def.durability != null)
      ? ` <span style="color:#aaa;font-size:7px">(${durability}/${def.durability})</span>` : "";
    this.itemTooltip.innerHTML = def.name + durStr;
    this.itemTooltip.style.display = "block";
  }

  updateWaveInfo(wave: number, total: number, enemyCount: number, dayNum?: number, isDay?: boolean): void {
    const dayStr = dayNum != null
      ? `<br><span style="color:${isDay ? "#ffee88" : "#aabbff"}">${isDay ? "☀" : "☽"} Day ${dayNum}</span>`
      : "";
    this.elWaveInfo.innerHTML =
      `Wave ${wave}/${total}<br>${enemyCount} enemies${dayStr}`;
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

  showSmeltNotice(input: string, output: string): void {
    const name = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
    const el = document.createElement("div");
    el.className = "smelt-notice";
    el.textContent = `${name(input)} → ${name(output)}`;
    this.container.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  showLevelUp(level: number): void {
    const el = document.createElement("div");
    el.className = "level-up-announce";
    el.innerHTML = `LEVEL UP!<br><span class="level-up-sub">Level ${level}</span>`;
    this.container.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  }

  /** Shows a big centered announcement that fades out after ~2 seconds. */
  showWaveAnnouncement(waveNum: number): void {
    const el = document.createElement("div");
    el.className = "wave-announce";
    el.textContent = `WAVE ${waveNum}`;
    this.container.appendChild(el);
    setTimeout(() => el.remove(), 2500);
  }

  showFloatingNumber(text: string, color: string, screenX: number, screenY: number): void {
    const div = document.createElement("div");
    div.className = "float-num";
    div.textContent = text;
    div.style.cssText = `left:${screenX}px;top:${screenY}px;color:${color}`;
    this.floatingContainer.appendChild(div);
    setTimeout(() => div.remove(), 1100);
  }

  // ── 3×3 Workbench overlay ──────────────────────────────────────────────────

  isWorkbenchOpen(): boolean { return this.workbenchOverlay.style.display !== "none"; }

  showWorkbench(open: boolean): void {
    this.workbenchOverlay.style.display = open ? "flex" : "none";
    if (!open) {
      this._workbenchGrid = [[null,null,null],[null,null,null],[null,null,null]];
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 3; c++)
          this.renderIdInSlot(this.workbenchCells[r][c], null);
      this.renderIdInSlot(this.workbenchResult, null);
    }
  }

  setWorkbenchSlot(row: number, col: number, itemId: string | null): void {
    this._workbenchGrid[row][col] = itemId;
    this.renderIdInSlot(this.workbenchCells[row][col], itemId);
  }

  setWorkbenchResult(itemId: string | null, count: number): void {
    this.renderIdInSlot(this.workbenchResult, itemId, count > 1 ? count : undefined);
  }

  getWorkbenchGrid(): (string | null)[][] {
    return this._workbenchGrid.map(r => [...r]);
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

  showDamageVignette(): void {
    const el = document.createElement("div");
    el.className = "damage-vignette";
    this.container.appendChild(el);
    // Remove after animation completes
    setTimeout(() => el.remove(), 600);
  }

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

    // Screen vignette
    const vignette = div("fps-vignette");
    this.container.appendChild(vignette);

    this.crosshair = div("fps-crosshair");
    this.crosshair.innerHTML = `<span class="fps-ch-h"></span><span class="fps-ch-v"></span>`;
    this.container.appendChild(this.crosshair);

    this.elObjective = div("fps-objective");
    this.container.appendChild(this.elObjective);

    this.elWaveInfo = div("fps-wave-info");
    this.elWaveInfo.innerHTML = "Wave 0/10<br>0 enemies";
    this.container.appendChild(this.elWaveInfo);

    this.buildHearts();
    this.buildHungerBar();
    this.buildXPBar();
    this.buildHotbar();
    this.buildItemTooltip();

    this.floatingContainer = div("floating-container");
    this.container.appendChild(this.floatingContainer);

    this.lockPrompt = div("fps-lock-prompt");
    this.lockPrompt.innerHTML = `
      <div class="fps-lock-box">
        <div class="fps-lock-title">HELM'S DEEP</div>
        <div class="fps-lock-sub">A Minecraft-Style Fortress Survival</div>
        <div class="fps-mode-row">
          <button class="fps-mode-btn" id="btn-helmsdeep">
            <span class="fps-mode-icon">⚔</span>
            <span class="fps-mode-name">Helm's Deep</span>
            <span class="fps-mode-desc">Defend across 10 waves</span>
          </button>
          <button class="fps-mode-btn" id="btn-freeplay">
            <span class="fps-mode-icon">🏗</span>
            <span class="fps-mode-name">Free Play</span>
            <span class="fps-mode-desc">Mine, build, explore</span>
          </button>
        </div>
        <div class="fps-lock-controls">
          WASD: move &nbsp;|&nbsp; Shift: sprint &nbsp;|&nbsp; Space: jump &nbsp;|&nbsp; Mouse: look<br>
          LClick: mine/attack &nbsp;|&nbsp; RClick: place/use &nbsp;|&nbsp; E: inventory<br>
          R: recipe book &nbsp;|&nbsp; 1-9: hotbar &nbsp;|&nbsp; Esc: unlock
        </div>
      </div>`;
    this.lockPrompt.querySelector("#btn-helmsdeep")!.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onModeSelect("helmsdeep");
      this.onPointerLockRequest();
    });
    this.lockPrompt.querySelector("#btn-freeplay")!.addEventListener("click", (e) => {
      e.stopPropagation();
      this.onModeSelect("freeplay");
      this.onPointerLockRequest();
    });
    this.container.appendChild(this.lockPrompt);

    this.buildInventoryOverlay();
    this.buildWorkbenchOverlay();
    this.buildRecipeBookOverlay();
    this.buildDeathOverlay();
    this.buildEndOverlay();
  }

  private buildHearts(): void {
    const wrap = div("fps-hearts");
    for (let i = 0; i < 10; i++) {
      const h = div("fps-heart");
      h.style.backgroundImage = `url("${HEART_FULL}")`;
      wrap.appendChild(h);
      this.heartEls.push(h);
    }
    this.container.appendChild(wrap);
  }

  private buildItemTooltip(): void {
    this.itemTooltip = div("fps-item-tooltip");
    this.itemTooltip.style.display = "none";
    this.container.appendChild(this.itemTooltip);

    this.blockTooltip = div("fps-block-tooltip");
    this.blockTooltip.style.display = "none";
    this.container.appendChild(this.blockTooltip);
  }

  private buildHungerBar(): void {
    const wrap = div("fps-hunger");
    for (let i = 0; i < 10; i++) {
      const h = div("fps-hunger-icon");
      h.style.backgroundImage = `url("${FOOD_FULL}")`;
      wrap.appendChild(h);
      this.hungerEls.push(h);
    }
    this.container.appendChild(wrap);
  }

  private buildXPBar(): void {
    const track = div("fps-xp-track");
    this.xpBarFill = div("fps-xp-fill");
    this.xpBarFill.style.width = "0%";
    track.appendChild(this.xpBarFill);
    this.container.appendChild(track);
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

  private buildWorkbenchOverlay(): void {
    const ov = div("fps-inventory overlay hidden");
    ov.style.display = "none";

    const box = div("fps-inv-box");

    const title = div("fps-inv-label");
    title.textContent = "Crafting Table";
    title.style.cssText = "font-size:14px;margin-bottom:12px;color:#ffdd44;";
    box.appendChild(title);

    const craftArea = div("fps-craft-area");

    const grid3 = div("fps-craft-grid fps-grid-3x3");
    this.workbenchCells = [];
    for (let r = 0; r < 3; r++) {
      const row: HTMLElement[] = [];
      for (let c = 0; c < 3; c++) {
        const cell = div("fps-slot fps-craft-cell");
        cell.addEventListener("click", () => this.onWorkbenchSlotClick(r, c));
        grid3.appendChild(cell);
        row.push(cell);
      }
      this.workbenchCells.push(row);
    }
    craftArea.appendChild(grid3);

    const arrow = div("fps-craft-arrow");
    arrow.textContent = "➡";
    craftArea.appendChild(arrow);

    this.workbenchResult = div("fps-slot fps-craft-result");
    this.workbenchResult.addEventListener("click", () => this.onWorkbenchResultClick());
    craftArea.appendChild(this.workbenchResult);
    box.appendChild(craftArea);

    const hint = div("fps-inv-hint");
    hint.textContent = "[E] close  ·  Click slots, then take result";
    box.appendChild(hint);

    const closeBtn = div("fps-inv-close-btn");
    closeBtn.textContent = "✕ Close";
    closeBtn.addEventListener("click", () => this.onWorkbenchClose());
    box.appendChild(closeBtn);

    ov.appendChild(box);
    this.workbenchOverlay = ov;
    this.container.appendChild(ov);
  }

  private buildRecipeBookOverlay(): void {
    const ov = div("fps-recipe-book");
    ov.style.display = "none";

    const title = div("fps-rb-title");
    title.textContent = "Recipe Book";
    ov.appendChild(title);

    const entries = [
      { name: "Planks", ingredients: "1 Wood → 4 Planks", key: "planks_from_wood" },
      { name: "Sticks", ingredients: "2 Planks (vertical) → 4 Sticks", key: "sticks" },
      { name: "Crafting Table", ingredients: "4 Planks (2×2) → Crafting Table", key: "crafting_table" },
      { name: "Torches", ingredients: "1 Coal + 1 Stick → 4 Torches", key: "torches" },
      { name: "Wood Sword", ingredients: "2 Planks + 1 Stick → Sword", key: "wood_sword" },
      { name: "Wood Pickaxe", ingredients: "3 Planks + 2 Sticks → Pickaxe", key: "wood_pickaxe" },
      { name: "Wood Axe", ingredients: "3 Planks + 2 Sticks → Axe", key: "wood_axe" },
      { name: "Stone Sword", ingredients: "2 Cobblestone + 1 Stick", key: "stone_sword" },
      { name: "Stone Pickaxe", ingredients: "3 Cobblestone + 2 Sticks", key: "stone_pickaxe" },
      { name: "Iron Sword", ingredients: "2 Iron Ingot + 1 Stick", key: "iron_sword" },
      { name: "Iron Pickaxe", ingredients: "3 Iron Ingot + 2 Sticks", key: "iron_pickaxe" },
      { name: "Iron Block", ingredients: "9 Iron Ingots (3×3)", key: "iron_block" },
      { name: "Iron Helmet", ingredients: "5 Iron Ingots (horseshoe shape)", key: "iron_helmet" },
      { name: "Iron Chestplate", ingredients: "8 Iron Ingots (chest shape)", key: "iron_chestplate" },
      { name: "Arrows", ingredients: "1 Flint + 1 Stick → 4 Arrows", key: "arrows" },
      { name: "Bow", ingredients: "3 Sticks + 3 Arrows (diagonal)", key: "bow" },
    ];

    const list = div("fps-rb-list");
    for (const entry of entries) {
      const row = div("fps-rb-row");
      const nameEl = div("fps-rb-name");
      nameEl.textContent = entry.name;
      const ingEl = div("fps-rb-ing");
      ingEl.textContent = entry.ingredients;
      row.appendChild(nameEl);
      row.appendChild(ingEl);
      list.appendChild(row);
    }
    ov.appendChild(list);

    const hint = div("fps-rb-hint");
    hint.textContent = "[R] to close";
    ov.appendChild(hint);

    this.recipeBookOverlay = ov;
    this.container.appendChild(ov);
  }

  isRecipeBookOpen(): boolean { return this.recipeBookOverlay.style.display !== "none"; }

  showRecipeBook(open: boolean): void {
    this.recipeBookOverlay.style.display = open ? "flex" : "none";
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
    const name  = def?.name ?? itemId;

    const icon = def ? getItemIcon(itemId) : null;
    if (iconEl) {
      iconEl.style.backgroundImage = icon ? `url("${icon}")` : "";
      iconEl.style.backgroundSize = "contain";
      iconEl.style.backgroundRepeat = "no-repeat";
      iconEl.style.backgroundPosition = "center";
      iconEl.style.backgroundColor = "rgba(0,0,0,0.2)";
      iconEl.style.boxShadow = "";
      iconEl.textContent = "";
      iconEl.title = name;
    } else {
      el.style.backgroundImage = icon ? `url("${icon}")` : "";
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
/* Vignette overlay */
.fps-vignette {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 5;
  background: radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%);
}

/* Crosshair — Minecraft pixel + */
.fps-crosshair {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 20;
}
.fps-ch-h {
  position: absolute;
  width: 14px; height: 2px;
  background: #fff;
}
.fps-ch-v {
  position: absolute;
  width: 2px; height: 14px;
  background: #fff;
}

/* Objective banner — flat, no blur, pixel shadow */
.fps-objective {
  position: absolute;
  top: 8px; left: 50%; transform: translateX(-50%);
  font-size: 13px; font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #000, 2px 2px 0 #000;
  background: rgba(0,0,0,0.6);
  padding: 4px 10px;
  pointer-events: none; z-index: 15;
  white-space: nowrap;
}

/* Wave info — flat, white text */
.fps-wave-info {
  position: absolute;
  top: 8px; right: 8px;
  font-size: 12px; font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #000, 2px 2px 0 #000;
  background: rgba(0,0,0,0.5);
  padding: 4px 8px;
  pointer-events: none; z-index: 15;
  line-height: 1.4; text-align: right;
}

/* Health hearts — left of center, above hotbar */
.fps-hearts {
  position: absolute;
  bottom: 68px; right: calc(50% + 6px);
  display: flex; gap: 1px;
  pointer-events: none; z-index: 15;
}
.fps-heart {
  width: 18px; height: 18px;
  background-size: 18px 18px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

/* Hunger bar — right of center, above hotbar */
.fps-hunger {
  position: absolute;
  bottom: 68px; left: calc(50% + 6px);
  display: flex; gap: 1px; flex-direction: row-reverse;
  pointer-events: none; z-index: 15;
}
.fps-hunger-icon {
  width: 18px; height: 18px;
  background-size: 18px 18px;
  background-repeat: no-repeat;
  image-rendering: pixelated;
}

/* XP bar — sits just above hotbar */
.fps-xp-track {
  position: absolute;
  bottom: 62px; left: 50%; transform: translateX(-50%);
  width: 430px; height: 7px;
  background: #000;
  border: 1px solid #333;
  pointer-events: none; z-index: 15;
}
.fps-xp-fill {
  height: 100%;
  background: #80ff20;
  transition: width 0.3s;
}

/* Block name tooltip — appears just below crosshair */
.fps-block-tooltip {
  position: absolute;
  top: calc(50% + 28px); left: 50%; transform: translateX(-50%);
  font-size: 9px; color: #eee;
  text-shadow: 1px 1px 0 #000, 2px 2px 0 #000;
  background: rgba(0,0,0,0.55);
  padding: 2px 7px;
  pointer-events: none; z-index: 14;
  white-space: nowrap;
}

/* Item tooltip — name above hotbar */
.fps-item-tooltip {
  position: absolute;
  bottom: 62px; left: 50%; transform: translateX(-50%);
  font-size: 10px; color: #fff;
  text-shadow: 1px 1px 0 #000, 2px 2px 0 #000;
  background: rgba(0,0,0,0.7);
  padding: 3px 8px;
  pointer-events: none; z-index: 14;
  white-space: nowrap;
}

/* Hotbar — Minecraft dark gray, square slots */
.fps-hotbar {
  position: absolute;
  bottom: 10px; left: 50%; transform: translateX(-50%);
  display: flex; gap: 2px;
  background: #000;
  padding: 3px;
  border: 2px solid #555;
  z-index: 15;
}
.fps-hotbar-slot {
  position: relative;
  width: 46px; height: 46px;
  background: #373737;
  border: 2px solid #555;
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.fps-hotbar-slot.active {
  border: 3px solid #fff;
  background: #555;
}
.fps-hotbar-slot .fps-slot-num {
  position: absolute; top: 1px; left: 3px;
  font-size: 8px; color: rgba(255,255,255,0.7);
  pointer-events: none;
  text-shadow: 1px 1px 0 #000;
}
.fps-hotbar-slot .fps-slot-icon {
  width: 32px; height: 32px;
  display: block;
  image-rendering: pixelated;
}
.fps-hotbar-slot .fps-slot-count {
  position: absolute; bottom: 1px; right: 2px;
  font-size: 9px; font-weight: bold;
  color: #fff; text-shadow: 1px 1px 0 #000;
}

/* Pointer lock splash — Minecraft title screen style */
.fps-lock-prompt {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: #000;
  z-index: 60;
}
.fps-lock-box {
  text-align: center;
  padding: 40px 56px;
  background: #1a1a1a;
  border: 3px solid #555;
  max-width: 520px;
}
.fps-lock-title {
  font-size: 42px; font-weight: bold;
  letter-spacing: 0.08em;
  color: #ffff55;
  text-shadow: 3px 3px 0 #3f3f00;
  margin-bottom: 6px;
}
.fps-lock-sub {
  font-size: 14px; color: #aaa;
  text-shadow: 1px 1px 0 #000;
  margin-bottom: 24px;
}
.fps-lock-cta {
  font-size: 18px; font-weight: bold;
  color: #fff;
  padding: 10px 28px;
  border: 2px solid #888;
  background: #555;
  cursor: pointer;
  display: inline-block;
  margin-bottom: 20px;
  text-shadow: 1px 1px 0 #000;
}
.fps-lock-cta:hover { background: #777; }
.fps-lock-controls {
  font-size: 8px; color: rgba(255,255,255,0.3);
  line-height: 2;
}
.fps-mode-row {
  display: flex; gap: 16px; justify-content: center;
  margin-bottom: 24px;
}
.fps-mode-btn {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 16px 24px;
  background: #373737;
  border: 3px solid #555;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  min-width: 160px;
  transition: background 0.1s, border-color 0.1s;
}
.fps-mode-btn:hover { background: #555; border-color: #fff; }
.fps-mode-icon { font-size: 28px; }
.fps-mode-name { font-size: 11px; font-weight: bold; color: #ffff55; text-shadow: 2px 2px 0 #3f3f00; }
.fps-mode-desc { font-size: 7px; color: rgba(255,255,255,0.5); }

/* Inventory overlay — Minecraft gray panel */
.fps-inventory {
  position: absolute; inset: 0;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0,0,0,0.5);
  z-index: 50;
}
.fps-inv-box {
  background: #c6c6c6;
  border: 3px solid #555;
  padding: 16px 20px;
  display: flex; flex-direction: column; gap: 10px;
  min-width: 420px;
}
.fps-inv-top {
  display: flex; gap: 20px; align-items: flex-start;
}
.fps-inv-label {
  font-size: 10px; color: #555; font-weight: bold;
  text-transform: uppercase; letter-spacing: 0.06em;
  margin-bottom: 4px;
}
.fps-inv-armor { display: flex; flex-direction: column; }
.fps-armor-grid {
  display: grid; grid-template-columns: repeat(2, 40px); gap: 3px;
}
.fps-inv-craft { display: flex; flex-direction: column; }
.fps-craft-area {
  display: flex; align-items: center; gap: 6px;
}
.fps-craft-grid { display: grid; gap: 3px; }
.fps-grid-2x2  { grid-template-columns: repeat(2, 40px); }
.fps-grid-3x3  { grid-template-columns: repeat(3, 40px); }
.fps-inv-close-btn {
  margin-top: 10px; padding: 6px 16px;
  background: #555; border: 2px solid #888; color: #fff;
  font-family: 'Press Start 2P', monospace; font-size: 9px;
  cursor: pointer; text-align: center; display: inline-block;
}
.fps-inv-close-btn:hover { background: #777; }
.fps-craft-arrow { font-size: 18px; color: #555; }
.fps-craft-result { width: 40px; height: 40px; cursor: pointer; }
.fps-craft-result:hover { border-color: #fff !important; }
.fps-inv-grid {
  display: grid; grid-template-columns: repeat(9, 40px); gap: 3px;
}
.fps-inv-hotbar-row {
  display: grid; grid-template-columns: repeat(9, 40px); gap: 3px;
  padding-top: 4px; border-top: 2px solid #555;
}
.fps-slot-hotbar { border-color: #555 !important; }
.fps-inv-hint {
  font-size: 9px; color: #555;
  text-align: center;
}

/* Generic slot — Minecraft beveled gray */
.fps-slot {
  width: 40px; height: 40px;
  background: #8b8b8b;
  border: 2px solid #373737;
  border-top-color: #fff;
  border-left-color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: default; position: relative; overflow: hidden;
}
.fps-slot:hover { background: #9f9f9f; }
.fps-armor-slot { width: 40px; height: 40px; cursor: default; }
.fps-craft-cell { cursor: pointer; }
.fps-slot-icon-inner {
  font-size: 20px; pointer-events: none;
}

/* Floating damage numbers */
.floating-container {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 15;
}
.float-num {
  position: absolute;
  font-size: 14px; font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 0 #000;
  pointer-events: none;
  animation: floatUp 1.1s ease-out forwards;
  transform: translateX(-50%);
}
@keyframes floatUp {
  0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
  80%  { opacity: 0.8; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-48px); }
}

/* Smelt notice (bottom center, small) */
.smelt-notice {
  position: absolute;
  bottom: 110px; left: 50%; transform: translateX(-50%);
  font-family: 'Press Start 2P', monospace;
  font-size: 10px; color: #ffaa22;
  text-shadow: 1px 1px 0 #000;
  pointer-events: none; z-index: 50;
  animation: smeltFade 1.8s ease-out forwards;
  white-space: nowrap;
}
@keyframes smeltFade {
  0%   { opacity: 0; transform: translateX(-50%) translateY(6px); }
  20%  { opacity: 1; transform: translateX(-50%) translateY(0); }
  75%  { opacity: 1; }
  100% { opacity: 0; }
}

/* Level-up banner */
.level-up-announce {
  position: absolute;
  top: 22%;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Press Start 2P', monospace;
  font-size: 28px;
  color: #80ff20;
  text-shadow: 2px 2px 0 #000, -1px -1px 0 #000;
  text-align: center;
  pointer-events: none;
  z-index: 50;
  animation: levelUpAnim 3.0s ease-out forwards;
  white-space: nowrap;
}
.level-up-sub {
  font-size: 16px;
  color: #ffffff;
  display: block;
  margin-top: 8px;
}
@keyframes levelUpAnim {
  0%   { opacity: 0; transform: translateX(-50%) translateY(10px) scale(0.8); }
  15%  { opacity: 1; transform: translateX(-50%) translateY(0) scale(1.05); }
  40%  { opacity: 1; transform: translateX(-50%) translateY(0) scale(1.0); }
  85%  { opacity: 1; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-16px); }
}

/* Wave announcement banner */
.wave-announce {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Press Start 2P', monospace;
  font-size: 36px;
  color: #ffff00;
  text-shadow: 3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000;
  pointer-events: none;
  z-index: 50;
  animation: waveAnnounce 2.5s ease-out forwards;
  white-space: nowrap;
}
@keyframes waveAnnounce {
  0%   { opacity: 0; transform: translateX(-50%) scale(0.5); }
  20%  { opacity: 1; transform: translateX(-50%) scale(1.1); }
  40%  { opacity: 1; transform: translateX(-50%) scale(1.0); }
  80%  { opacity: 1; transform: translateX(-50%) scale(1.0); }
  100% { opacity: 0; transform: translateX(-50%) scale(1.0) translateY(-20px); }
}
.damage-vignette {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(200,0,0,0.75) 100%);
  animation: damageFlash 0.6s ease-out forwards;
}
@keyframes damageFlash {
  0%   { opacity: 1; }
  30%  { opacity: 0.9; }
  100% { opacity: 0; }
}
.fps-recipe-book {
  position: absolute;
  top: 50%; right: 16px;
  transform: translateY(-50%);
  background: #1a1a1a;
  border: 3px solid #555;
  padding: 14px 18px;
  max-height: 70vh; overflow-y: auto;
  z-index: 55;
  pointer-events: all;
  flex-direction: column; gap: 6px;
  min-width: 280px;
}
.fps-rb-title {
  font-size: 13px; color: #ffdd44;
  text-shadow: 1px 1px 0 #000;
  margin-bottom: 10px; text-align: center;
  border-bottom: 1px solid #444; padding-bottom: 6px;
}
.fps-rb-list { display: flex; flex-direction: column; gap: 4px; }
.fps-rb-row {
  padding: 4px 6px;
  border: 1px solid #333;
  background: #242424;
}
.fps-rb-name { font-size: 9px; color: #fff; margin-bottom: 2px; }
.fps-rb-ing  { font-size: 7px; color: #aaa; }
.fps-rb-hint { font-size: 7px; color: #666; text-align: center; margin-top: 8px; }
`;
