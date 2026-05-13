import * as THREE from "three";
import type { GamePhase, EnemyTypeName } from "./types";
import { SceneManager } from "./SceneManager";
import { GameMap } from "./Map";
import { EnemyManager } from "./Enemy";
import { TowerManager } from "./Tower";
import { ProjectileManager } from "./Projectile";
import { WaveManager } from "./WaveManager";
import { Economy } from "./Economy";
import { InputManager } from "./InputManager";
import { UI } from "./UI";
import { AudioManager } from "./AudioManager";
import { TOWER_CONFIGS } from "./config/towers";
import { BASE_MAX_HEALTH } from "./config/map";
import { WAYPOINTS } from "./Path";

export class Game {
  private phase: GamePhase = "menu";
  private lastTime = 0;

  private scene!: SceneManager;
  private gameMap!: GameMap;
  private enemies!: EnemyManager;
  private towers!: TowerManager;
  private projectiles!: ProjectileManager;
  private waves!: WaveManager;
  private economy!: Economy;
  private input!: InputManager;
  private ui!: UI;
  private audio!: AudioManager;

  private baseHealth = BASE_MAX_HEALTH;
  private totalKills = 0;
  private totalGoldEarned = 0;
  private difficulty: "easy" | "normal" | "hard" = "normal";

  private readonly difficultyMods = {
    easy:   { speedMult: 0.8, healthMult: 0.7 },
    normal: { speedMult: 1.0, healthMult: 1.0 },
    hard:   { speedMult: 1.2, healthMult: 1.4 },
  };

  constructor(private readonly container: HTMLElement) {}

  start(): void {
    this.buildSystems();
    this.ui.showMenu();
    requestAnimationFrame(t => this.loop(t));
  }

  // -------------------------------------------------------------------------
  // Bootstrap all systems
  // -------------------------------------------------------------------------
  private buildSystems(): void {
    this.scene = new SceneManager(this.container);
    this.gameMap = new GameMap(this.scene.scene);
    this.enemies = new EnemyManager(this.scene.scene, this.scene.camera);
    this.towers  = new TowerManager(this.scene.scene, this.gameMap);
    this.projectiles = new ProjectileManager(this.scene.scene);
    this.waves   = new WaveManager();
    this.economy = new Economy();
    this.audio   = new AudioManager();
    this.ui      = new UI(this.container);
    this.input   = new InputManager(
      this.scene.renderer.domElement,
      this.scene.camera,
      this.gameMap,
      this.towers,
    );

    this.input.addHoverToScene(this.scene.scene);
    this.input.getPhase = () => this.phase;

    // Add path marker arrows for visual path hint
    this.addPathMarkers();

    this.wireCallbacks();
  }

  // -------------------------------------------------------------------------
  // Callback wiring
  // -------------------------------------------------------------------------
  private wireCallbacks(): void {
    // Economy → UI
    this.economy.onChange = (gold) => {
      this.ui.updateGold(gold);
      this.ui.updateTowerButtons(gold);
      const sel = this.towers.getSelected();
      if (sel) this.ui.showSelectedTower(sel, gold);
    };

    // Enemy callbacks
    this.enemies.onEnemyDied = (state) => {
      const reward = state.config.reward;
      this.economy.addGold(reward);
      this.totalGoldEarned += reward;
      this.totalKills++;
      this.waves.onEnemyEliminated();
      this.ui.updateEnemyCount(this.enemies.getAliveEnemies().length);
      this.audio.play("death", 0.4);
      // Floating gold number
      this.showFloatingGold(`+$${reward}`, this.enemies.getEnemyPosition(state.id) ?? new THREE.Vector3());
    };

    this.enemies.onEnemyReachedBase = (state) => {
      this.baseHealth = Math.max(0, this.baseHealth - state.config.damage);
      this.ui.updateHealth(this.baseHealth);
      this.audio.play("base_hit");
      this.waves.onEnemyEliminated();
      this.ui.updateEnemyCount(this.enemies.getAliveEnemies().length);
      if (this.baseHealth <= 0) {
        this.setPhase("gameover");
      }
    };

    // Wave callbacks
    this.waves.onWaveComplete = (wave, bonusGold) => {
      this.economy.addGold(bonusGold);
      this.totalGoldEarned += bonusGold;
      this.audio.play("wave_complete");

      if (this.waves.isLastWave()) {
        setTimeout(() => this.setPhase("win"), 1500);
      } else {
        this.setPhase("wave_clear");
        this.ui.showBanner(`Wave ${wave} Complete! +$${bonusGold}`, 2500);
        this.ui.updateWave(wave, this.waves.totalWaves);
        this.ui.setStartWaveEnabled(true);
      }
    };

    // Input callbacks
    this.input.onPlaceTower = (gx, gz, type) => {
      const cfg = TOWER_CONFIGS[type];
      const cost = cfg.levels[0].cost;
      if (!this.economy.spend(cost)) return;
      const state = this.towers.place(gx, gz, type);
      if (!state) {
        this.economy.addGold(cost); // refund if placement failed
        return;
      }
      this.audio.play("place");
    };

    this.input.onSelectTower = (gx, gz) => {
      const tower = this.towers.getTowerAt(gx, gz);
      if (tower) {
        this.towers.selectTower(tower.id);
        this.ui.showSelectedTower(tower, this.economy.gold);
      }
    };

    this.input.onDeselect = () => {
      this.towers.selectTower(null);
      this.ui.showSelectedTower(null, this.economy.gold);
      this.ui.selectTowerBtn(null);
      this.input.setSelectedType(null);
    };

    // UI callbacks
    this.ui.onStartGame = (diff) => {
      this.difficulty = diff;
      this.ui.hideMenu();
      this.ui.hideEndScreens();
      this.startGame();
    };

    this.ui.onStartWave = () => {
      if (this.phase !== "playing" && this.phase !== "wave_clear") return;
      this.setPhase("playing");
      this.ui.setStartWaveEnabled(false);
      this.waves.startWave((type) => this.spawnEnemy(type));
      this.ui.showBanner(`Wave ${this.waves.wave}`, 1500);
      this.ui.updateWave(this.waves.wave, this.waves.totalWaves);
      this.audio.play("wave_start");
    };

    this.ui.onSelectTowerType = (type) => {
      this.input.setSelectedType(type);
      this.ui.selectTowerBtn(type);
      this.towers.selectTower(null);
      this.ui.showSelectedTower(null, this.economy.gold);
    };

    this.ui.onUpgrade = () => {
      const sel = this.towers.getSelected();
      if (!sel || sel.level >= 2) return;
      const cfg = TOWER_CONFIGS[sel.type];
      const cost = cfg.levels[sel.level + 1].cost;
      if (!this.economy.spend(cost)) return;
      this.towers.upgrade(sel.id);
      this.audio.play("upgrade");
      this.ui.showSelectedTower(this.towers.getSelected(), this.economy.gold);
    };

    this.ui.onSell = () => {
      const sel = this.towers.getSelected();
      if (!sel) return;
      const refund = this.towers.sell(sel.id);
      this.economy.addGold(refund);
      this.audio.play("sell");
      this.ui.showSelectedTower(null, this.economy.gold);
    };

    this.ui.onRestart = () => {
      this.ui.hideEndScreens();
      this.resetGame();
      this.ui.showMenu();
    };
  }

  // -------------------------------------------------------------------------
  // Game lifecycle
  // -------------------------------------------------------------------------
  private startGame(): void {
    this.baseHealth = BASE_MAX_HEALTH;
    this.totalKills = 0;
    this.totalGoldEarned = 0;
    this.economy.reset();
    this.waves.reset();
    this.enemies.reset();
    this.towers.reset();
    this.projectiles.reset();

    this.ui.updateHealth(this.baseHealth);
    this.ui.updateGold(this.economy.gold);
    this.ui.updateWave(0, this.waves.totalWaves);
    this.ui.updateEnemyCount(0);
    this.ui.setStartWaveEnabled(true);
    this.ui.showSelectedTower(null, this.economy.gold);

    this.setPhase("playing");
    this.scene.resetCamera();
  }

  private resetGame(): void {
    this.enemies.reset();
    this.towers.reset();
    this.projectiles.reset();
    this.waves.reset();
    this.economy.reset();
  }

  private setPhase(phase: GamePhase): void {
    this.phase = phase;
    if (phase === "gameover") {
      this.audio.play("explosion");
      this.ui.showGameOver(this.waves.wave, this.totalKills);
    } else if (phase === "win") {
      this.audio.play("victory");
      this.ui.showVictory(this.totalKills, this.totalGoldEarned);
    }
  }

  private spawnEnemy(type: EnemyTypeName): void {
    const mod = this.difficultyMods[this.difficulty];
    const id = this.enemies.spawn(type);
    const state = this.enemies.getEnemy(id)!;
    const modSpeed = state.config.speed * mod.speedMult;
    // Clone config so difficulty modifiers don't affect the shared ENEMY_CONFIGS
    state.config = {
      ...state.config,
      maxHealth: Math.round(state.config.maxHealth * mod.healthMult),
      speed: modSpeed,
    };
    state.health = state.config.maxHealth;
    state.speed = modSpeed;
    this.ui.updateEnemyCount(this.enemies.getAliveEnemies().length);
  }

  // -------------------------------------------------------------------------
  // Main loop
  // -------------------------------------------------------------------------
  private loop(time: number): void {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    this.update(dt);
    this.scene.render();
    requestAnimationFrame(t => this.loop(t));
  }

  private update(dt: number): void {
    if (this.phase !== "playing" && this.phase !== "wave_clear") return;

    this.waves.update(dt);

    this.enemies.update(dt);

    this.towers.update(
      dt,
      this.enemies.getAliveEnemies(),
      (id) => this.enemies.getEnemyProgress(id),
      (id) => this.enemies.getEnemyPosition(id),
      this.projectiles,
    );

    this.projectiles.update(
      dt,
      (id) => this.enemies.getEnemyPosition(id),
      (id, dmg, slow, slowDur) => {
        this.enemies.damage(id, dmg, slow, slowDur);
        this.audio.play("hit", 0.3);
      },
      (center, radius) => {
        return this.enemies.getAliveEnemies()
          .filter(e => {
            const pos = this.enemies.getEnemyPosition(e.id);
            return pos && pos.distanceTo(center) <= radius;
          })
          .map(e => e.id);
      },
    );
  }

  // -------------------------------------------------------------------------
  // Visual helpers
  // -------------------------------------------------------------------------
  private addPathMarkers(): void {
    // Directional arrows at path turn points pointing toward next waypoint
    const mat = new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.5 });
    for (let i = 1; i < WAYPOINTS.length - 1; i++) {
      const wp = WAYPOINTS[i];
      const nextWp = WAYPOINTS[i + 1];
      const dir = nextWp.clone().sub(wp).normalize();
      const angle = Math.atan2(dir.x, dir.z);

      const geo = new THREE.ConeGeometry(0.16, 0.38, 4);
      const mesh = new THREE.Mesh(geo, mat);
      // Cone points up by default; rotate to point horizontally in movement direction
      mesh.rotation.x = -Math.PI / 2;
      mesh.rotation.z = angle;
      mesh.position.set(wp.x, 1.25, wp.z);
      this.scene.scene.add(mesh);
    }
  }

  private showFloatingGold(text: string, worldPos: THREE.Vector3): void {
    const projected = worldPos.clone().project(this.scene.camera);
    const sx = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    this.ui.showFloatingNumber(text, "#ffdd00", sx, sy);
  }
}
