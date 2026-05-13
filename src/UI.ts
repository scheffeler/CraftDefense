import type { TowerTypeName, TowerState } from "./types";
import { TOWER_CONFIGS } from "./config/towers";

import { BASE_MAX_HEALTH } from "./config/map";

export class UI {
  // Callbacks wired by Game
  onStartWave: () => void = () => {};
  onSelectTowerType: (t: TowerTypeName | null) => void = () => {};
  onUpgrade: () => void = () => {};
  onSell: () => void = () => {};
  onStartGame: (difficulty: "easy" | "normal" | "hard") => void = () => {};
  onRestart: () => void = () => {};

  // Top bar elements
  private elHealth!: HTMLElement;
  private elGold!: HTMLElement;
  private elWave!: HTMLElement;
  private elEnemies!: HTMLElement;
  private elStartWave!: HTMLButtonElement;

  // Tower buttons
  private towerBtns: Map<TowerTypeName, HTMLButtonElement> = new Map();

  // Selected tower panel
  private selectedPanel!: HTMLElement;
  private elTowerName!: HTMLElement;
  private elTowerStats!: HTMLElement;
  private elUpgradeBtn!: HTMLButtonElement;
  private elSellBtn!: HTMLButtonElement;

  // Overlays
  private menuOverlay!: HTMLElement;
  private gameOverOverlay!: HTMLElement;
  private victoryOverlay!: HTMLElement;
  private banner!: HTMLElement;
  // Floating numbers container
  private floatingContainer!: HTMLElement;

  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.build();
  }

  // -------------------------------------------------------------------------
  // Build DOM
  // -------------------------------------------------------------------------
  private build(): void {
    // Don't clear container — canvas was already appended by SceneManager
    this.container.style.cssText = "position:relative;width:100vw;height:100vh;overflow:hidden;";

    // Top HUD bar
    const topBar = el("div", "hud-top");
    this.elHealth  = el("div", "hud-stat hud-health", "♥ 20 / 20");
    this.elGold    = el("div", "hud-stat hud-gold",   "💰 150");
    this.elWave    = el("div", "hud-stat hud-wave",   "Wave 0 / 10");
    this.elEnemies = el("div", "hud-stat hud-enemies","👾 0");
    topBar.append(this.elHealth, this.elGold, this.elWave, this.elEnemies);
    this.container.appendChild(topBar);

    // Bottom bar: tower buttons + start wave
    const botBar = el("div", "hud-bottom");

    const towerDefs: { type: TowerTypeName; label: string; key: string }[] = [
      { type: "arrow",  label: "Arrow\n$50",   key: "1" },
      { type: "cannon", label: "Cannon\n$100", key: "2" },
      { type: "ice",    label: "Ice\n$75",     key: "3" },
    ];

    const towerGroup = el("div", "tower-group");
    for (const { type, label, key } of towerDefs) {
      const btn = document.createElement("button");
      btn.className = "tower-btn";
      btn.innerHTML = `<span class="tower-icon">${towerIcon(type)}</span><span class="tower-label">${label}</span><span class="tower-key">[${key}]</span>`;
      btn.dataset.type = type;
      btn.addEventListener("click", () => {
        const alreadySelected = btn.classList.contains("selected");
        this.towerBtns.forEach(b => b.classList.remove("selected"));
        if (alreadySelected) {
          this.onSelectTowerType(null);
        } else {
          btn.classList.add("selected");
          this.onSelectTowerType(type);
        }
      });
      this.towerBtns.set(type, btn);
      towerGroup.appendChild(btn);
    }

    this.elStartWave = document.createElement("button");
    this.elStartWave.className = "start-wave-btn";
    this.elStartWave.textContent = "▶ Start Wave 1";
    this.elStartWave.addEventListener("click", () => this.onStartWave());

    botBar.append(towerGroup, this.elStartWave);
    this.container.appendChild(botBar);

    // Selected tower panel (right side)
    this.selectedPanel = el("div", "tower-panel hidden");
    this.elTowerName  = el("div", "tower-panel-name", "");
    this.elTowerStats = el("div", "tower-panel-stats", "");
    this.elUpgradeBtn = document.createElement("button");
    this.elUpgradeBtn.className = "panel-btn upgrade-btn";
    this.elUpgradeBtn.textContent = "Upgrade";
    this.elUpgradeBtn.addEventListener("click", () => this.onUpgrade());
    this.elSellBtn = document.createElement("button");
    this.elSellBtn.className = "panel-btn sell-btn";
    this.elSellBtn.textContent = "Sell";
    this.elSellBtn.addEventListener("click", () => this.onSell());
    this.selectedPanel.append(this.elTowerName, this.elTowerStats, this.elUpgradeBtn, this.elSellBtn);
    this.container.appendChild(this.selectedPanel);

    // Phase banner (center)
    this.banner = el("div", "phase-banner hidden", "");
    this.container.appendChild(this.banner);

    // Floating numbers container
    this.floatingContainer = el("div", "floating-container");
    this.container.appendChild(this.floatingContainer);

    // Help button
    const helpBtn = el("button", "help-btn", "?");
    helpBtn.addEventListener("click", () => this.showHelp());
    this.container.appendChild(helpBtn);

    // Menu overlay
    this.menuOverlay = this.buildMenuOverlay();
    this.container.appendChild(this.menuOverlay);

    // Game over overlay
    this.gameOverOverlay = el("div", "overlay hidden");
    this.gameOverOverlay.innerHTML = `
      <div class="overlay-box">
        <h1 class="overlay-title" style="color:#ff4444">☠ GAME OVER</h1>
        <p id="go-stats" class="overlay-stats"></p>
        <button class="overlay-btn" id="go-restart">Play Again</button>
      </div>`;
    this.gameOverOverlay.querySelector("#go-restart")!.addEventListener("click", () => this.onRestart());
    this.container.appendChild(this.gameOverOverlay);

    // Victory overlay
    this.victoryOverlay = el("div", "overlay hidden");
    this.victoryOverlay.innerHTML = `
      <div class="overlay-box">
        <h1 class="overlay-title" style="color:#ffdd00">🏆 VICTORY!</h1>
        <p id="vic-stats" class="overlay-stats"></p>
        <button class="overlay-btn" id="vic-restart">Play Again</button>
      </div>`;
    this.victoryOverlay.querySelector("#vic-restart")!.addEventListener("click", () => this.onRestart());
    this.container.appendChild(this.victoryOverlay);
  }

  private buildMenuOverlay(): HTMLElement {
    const overlay = el("div", "overlay");
    overlay.innerHTML = `
      <div class="overlay-box">
        <h1 class="overlay-title craft-title">⚔ CRAFTDEFENSE</h1>
        <p class="overlay-subtitle">Defend the base from waves of blocky enemies!</p>
        <div class="difficulty-row">
          <button class="diff-btn" data-diff="easy">Easy</button>
          <button class="diff-btn selected" data-diff="normal">Normal</button>
          <button class="diff-btn" data-diff="hard">Hard</button>
        </div>
        <button class="overlay-btn start-btn" id="menu-start">▶ Start Game</button>
        <div class="controls-hint">
          <b>Controls:</b> Click grass to place tower · Click tower to upgrade · Right-drag to orbit · Scroll to zoom · [1/2/3] select tower type
        </div>
      </div>`;

    let selectedDiff: "easy" | "normal" | "hard" = "normal";
    overlay.querySelectorAll(".diff-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        overlay.querySelectorAll(".diff-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedDiff = (btn as HTMLElement).dataset.diff as "easy" | "normal" | "hard";
      });
    });

    overlay.querySelector("#menu-start")!.addEventListener("click", () => {
      this.onStartGame(selectedDiff);
    });

    return overlay;
  }

  // -------------------------------------------------------------------------
  // Update calls
  // -------------------------------------------------------------------------
  updateHealth(current: number, max = BASE_MAX_HEALTH): void {
    this.elHealth.textContent = `♥ ${current} / ${max}`;
    this.elHealth.style.color = current <= 5 ? "#ff4444" : current <= 10 ? "#ffaa00" : "#ffffff";
  }

  updateGold(gold: number): void {
    this.elGold.textContent = `💰 ${gold}`;
  }

  updateWave(wave: number, total: number): void {
    this.elWave.textContent = `Wave ${wave} / ${total}`;
    const nextWave = wave + 1;
    if (nextWave <= total) {
      this.elStartWave.textContent = `▶ Start Wave ${nextWave}`;
    } else {
      this.elStartWave.textContent = "⬛ Final Wave";
    }
  }

  updateEnemyCount(count: number): void {
    this.elEnemies.textContent = `👾 ${count}`;
  }

  setStartWaveEnabled(enabled: boolean): void {
    this.elStartWave.disabled = !enabled;
    this.elStartWave.classList.toggle("disabled", !enabled);
  }

  updateTowerButtons(gold: number): void {
    for (const [type, btn] of this.towerBtns) {
      const cost = TOWER_CONFIGS[type].levels[0].cost;
      btn.classList.toggle("unaffordable", gold < cost);
    }
  }

  selectTowerBtn(type: TowerTypeName | null): void {
    this.towerBtns.forEach((btn, t) => btn.classList.toggle("selected", t === type));
  }

  showSelectedTower(state: TowerState | null, gold: number): void {
    if (!state) {
      this.selectedPanel.classList.add("hidden");
      return;
    }
    const cfg = TOWER_CONFIGS[state.type];
    const lvl = cfg.levels[state.level];
    const nextLvl = state.level < 2 ? cfg.levels[state.level + 1] : null;
    const refund = Math.floor(state.totalSpent * 0.5);

    this.elTowerName.textContent = `${cfg.name} (Lv.${state.level + 1})`;
    this.elTowerStats.innerHTML =
      `DMG: ${lvl.damage}  RNG: ${lvl.range}  RoF: ${lvl.fireRate.toFixed(1)}/s` +
      (lvl.aoeRadius ? `  AoE: ${lvl.aoeRadius}` : "") +
      (lvl.slowFactor && lvl.slowFactor < 1 ? `  Slow: ${Math.round((1 - lvl.slowFactor) * 100)}%` : "");

    if (nextLvl && state.level < 2) {
      const canAfford = gold >= nextLvl.cost;
      this.elUpgradeBtn.textContent = `Upgrade $${nextLvl.cost}`;
      this.elUpgradeBtn.disabled = !canAfford;
      this.elUpgradeBtn.classList.toggle("unaffordable", !canAfford);
      this.elUpgradeBtn.classList.remove("hidden");
    } else {
      this.elUpgradeBtn.classList.add("hidden");
    }

    this.elSellBtn.textContent = `Sell +$${refund}`;
    this.selectedPanel.classList.remove("hidden");
  }

  showBanner(text: string, durationMs = 2500): void {
    this.banner.textContent = text;
    this.banner.classList.remove("hidden");
    this.banner.classList.add("visible");
    clearTimeout(this._bannerTimeout);
    this._bannerTimeout = window.setTimeout(() => {
      this.banner.classList.remove("visible");
      setTimeout(() => this.banner.classList.add("hidden"), 400);
    }, durationMs);
  }

  private _bannerTimeout = 0;

  showMenu(): void {
    this.menuOverlay.classList.remove("hidden");
    this.gameOverOverlay.classList.add("hidden");
    this.victoryOverlay.classList.add("hidden");
  }

  hideMenu(): void {
    this.menuOverlay.classList.add("hidden");
  }

  showGameOver(wave: number, totalKills: number): void {
    const stats = this.gameOverOverlay.querySelector("#go-stats")!;
    stats.textContent = `Survived ${wave} waves · ${totalKills} enemies defeated`;
    this.gameOverOverlay.classList.remove("hidden");
  }

  showVictory(totalKills: number, goldEarned: number): void {
    const stats = this.victoryOverlay.querySelector("#vic-stats")!;
    stats.textContent = `All 10 waves cleared! · ${totalKills} kills · $${goldEarned} earned`;
    this.victoryOverlay.classList.remove("hidden");
  }

  hideEndScreens(): void {
    this.gameOverOverlay.classList.add("hidden");
    this.victoryOverlay.classList.add("hidden");
  }

  // Floating damage / gold number
  showFloatingNumber(text: string, color: string, screenX: number, screenY: number): void {
    const div = document.createElement("div");
    div.className = "float-num";
    div.textContent = text;
    div.style.cssText = `left:${screenX}px;top:${screenY}px;color:${color}`;
    this.floatingContainer.appendChild(div);
    setTimeout(() => div.remove(), 1100);
  }

  private showHelp(): void {
    const existing = document.querySelector(".help-overlay");
    if (existing) { existing.remove(); return; }
    const help = el("div", "overlay help-overlay");
    help.innerHTML = `
      <div class="overlay-box" style="max-width:480px">
        <h2 style="margin-bottom:12px">How to Play</h2>
        <ul style="text-align:left;line-height:1.8">
          <li>🖱 Right-drag to orbit · Scroll to zoom</li>
          <li>🗼 Click [1] Arrow  [2] Cannon  [3] Ice to select a tower</li>
          <li>🟩 Click a <b>green grass tile</b> to place the tower</li>
          <li>🔧 Click an existing tower to upgrade or sell</li>
          <li>▶ Press <b>Start Wave</b> to send the next enemy wave</li>
          <li>💀 Don't let enemies reach the ⬛ base!</li>
          <li>[Esc] to deselect tower</li>
        </ul>
        <button class="overlay-btn" style="margin-top:16px" onclick="this.closest('.help-overlay').remove()">Close</button>
      </div>`;
    this.container.appendChild(help);
  }
}

// -------------------------------------------------------------------------
// Helpers
// -------------------------------------------------------------------------
function el(tag: string, cls: string, text = ""): HTMLElement & HTMLButtonElement {
  const e = document.createElement(tag) as HTMLElement & HTMLButtonElement;
  e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function towerIcon(type: TowerTypeName): string {
  return { arrow: "🏹", cannon: "💣", ice: "❄" }[type];
}
