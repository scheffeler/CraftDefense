import * as THREE from "three";
import type { GamePhase, EnemyTypeName } from "./types";
import { SceneManager } from "./SceneManager";
import { GameMap } from "./Map";
import { FlowField } from "./FlowField";
import { Player } from "./Player";
import { Inventory } from "./Inventory";
import { EnemyManager } from "./Enemy";
import { ProjectileManager } from "./Projectile";
import { WaveManager } from "./WaveManager";
import { BlockInteraction } from "./BlockInteraction";
import { InputManager } from "./InputManager";
import { UI } from "./UI";
import { AudioManager } from "./AudioManager";
import { BLOCK_BEHAVIORS } from "./config/blocks";
import { ITEMS } from "./config/items";
import { getSpawnPositions } from "./WorldGen";
import { FORTRESS_CENTER_X, FORTRESS_CENTER_Z } from "./config/map";
import type { ItemStack } from "./Inventory";

export class Game {
  private phase: GamePhase = "wave_clear";
  private mode: "helmsdeep" | "freeplay" = "helmsdeep";
  private lastTime = 0;

  // Initial build phase before wave 1 (seconds)
  private buildPhaseTimer = 120;

  // Torch point lights keyed by "wx,wy,wz"
  private readonly torchLights = new Map<string, THREE.PointLight>();

  // Hunger depletion timer
  private hungerTimer = 0;

  private scene!:            SceneManager;
  private gameMap!:          GameMap;
  private flowField!:        FlowField;
  private player!:           Player;
  private inventory!:        Inventory;
  private enemies!:          EnemyManager;
  private projectiles!:      ProjectileManager;
  private waves!:            WaveManager;
  private blockInteraction!: BlockInteraction;
  private input!:            InputManager;
  private ui!:               UI;
  private audio!:            AudioManager;

  constructor(private readonly container: HTMLElement) {}

  start(): void {
    this.buildSystems();
    requestAnimationFrame(t => this.loop(t));
  }

  // ─── System construction ───────────────────────────────────────────────────

  private buildSystems(): void {
    this.scene   = new SceneManager(this.container);
    this.gameMap = new GameMap(this.scene.scene);

    this.flowField = new FlowField(this.gameMap.world);
    this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);

    this.player    = new Player(this.gameMap.world, this.scene.camera, 32, 48);
    this.inventory = new Inventory();
    this.inventory.addItem("wood_sword", 1);
    this.inventory.addItem("wood_pickaxe", 1);
    this.inventory.addItem("wood", 16);
    this.inventory.addItem("dirt", 16);
    this.inventory.addItem("torch", 8);
    this.inventory.addItem("apple", 4);

    this.enemies     = new EnemyManager(this.scene.scene, this.scene.camera);
    this.enemies.setFlowField(this.flowField);
    this.enemies.setWorld(this.gameMap.world);

    this.projectiles = new ProjectileManager(this.scene.scene);
    this.waves       = new WaveManager();

    this.blockInteraction = new BlockInteraction(
      this.gameMap.world,
      this.scene.scene,
      this.scene.camera,
    );

    this.ui    = new UI(this.container);
    this.audio = new AudioManager();
    this.input = new InputManager(this.scene.renderer.domElement);

    this.wireCallbacks();
    this.refreshHUD();
    this.ui.setObjective(
      `Build fortifications! Wave 1 begins in ${Math.ceil(this.buildPhaseTimer)}s.`,
    );
    this.ui.showPointerLockPrompt(true);
  }

  // ─── Callback wiring ───────────────────────────────────────────────────────

  private wireCallbacks(): void {
    // Pointer lock
    this.scene.onPointerLockChange = (locked) => {
      this.ui.showPointerLockPrompt(!locked);
      if (!locked) this.ui.showInventory(false);
    };
    const requestLock = () => {
      if (!this.scene.isPointerLocked && !this.ui.isInventoryOpen()) {
        this.scene.lockPointer();
      }
    };
    this.ui.onPointerLockRequest = requestLock;
    document.addEventListener("click", requestLock);

    // Hotbar slot selection
    this.input.onSlotChange = (slot) => {
      this.inventory.activeSlot = slot;
      this.refreshHotbar();
    };

    // Inventory toggle (E)
    this.input.onInventoryToggle = () => {
      const nowOpen = !this.ui.isInventoryOpen();
      this.ui.showInventory(nowOpen, this.inventory);
      if (nowOpen && this.scene.isPointerLocked) this.scene.unlockPointer();
      else if (!nowOpen && !this.scene.isPointerLocked) this.scene.lockPointer();
    };

    // Left click — melee attack (mining is handled by isLeftMouseDown in update)
    this.input.onLeftClick = () => {
      if (this.ui.isInventoryOpen()) return;
      if (!this.blockInteraction.getTargetBlock()) this.tryMeleeAttack();
    };

    // Right click — place block, start bow charge, or eat food
    this.input.onRightClick = () => {
      if (this.ui.isInventoryOpen()) return;
      const stack   = this.inventory.getActiveItem();
      const itemDef = stack ? ITEMS[stack.itemId] : null;
      if (itemDef?.id === "bow" && this.inventory.hasItem("arrow_item", 1)) {
        this.player.startBowCharge();
        this.audio.play("bow_charge", 0.4);
      } else if (itemDef?.category === "food" && itemDef.foodPoints && this.player.hunger < 20) {
        this.inventory.removeItem(stack!.itemId, 1);
        this.player.hunger = Math.min(20, this.player.hunger + itemDef.foodPoints);
        this.player.heal(Math.ceil(itemDef.foodPoints / 2));
        this.audio.play("eat", 0.6);
        this.refreshHotbar();
        this.ui.updateHunger(this.player.hunger, 20);
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      } else if (itemDef?.placesBlock && stack) {
        const placed = this.blockInteraction.tryPlace(itemDef.placesBlock);
        if (placed) {
          this.inventory.removeItem(stack.itemId, 1);
          this.audio.play("block_place", 0.5);
          this.refreshHotbar();
        }
      }
    };

    // Right release — fire bow
    this.input.onRightRelease = () => {
      if (this.player.isBowCharging) {
        const shot = this.player.releaseBow();
        if (shot) {
          const stack   = this.inventory.getActiveItem();
          const itemDef = stack ? ITEMS[stack.itemId] : null;
          const damage  = itemDef?.damage ?? 6;
          this.projectiles.fireFromPlayer(shot.from, shot.direction, shot.power, damage);
          this.inventory.removeItem("arrow_item", 1);
          this.audio.play("arrow_release");
          this.refreshHotbar();
        }
      }
    };

    // Block interaction callbacks
    this.blockInteraction.onBlockBroken = (wx, wy, wz, id, yieldsDrops) => {
      this.audio.play("block_break", 0.55);
      if (yieldsDrops) {
        const behavior = BLOCK_BEHAVIORS[id];
        const drops    = behavior?.drops ?? [id];
        for (const drop of drops) {
          if (ITEMS[drop]) this.inventory.addItem(drop, 1);
        }
        this.refreshHotbar();
      }
      if (id === "torch") this.removeTorchLight(wx, wy, wz);
      if (wy >= 1) this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
    };

    this.blockInteraction.onBlockPlaced = (wx, wy, wz, id) => {
      this.audio.play("block_place", 0.5);
      if (id === "torch") this.addTorchLight(wx, wy, wz);
      this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
      this.refreshHotbar();
    };

    // Enemy events
    this.enemies.onEnemyDied = (state) => {
      if (state.config.xpReward) { this.player.addXP(state.config.xpReward); this.refreshXPBar(); }
      this.waves.onEnemyEliminated();
      this.ui.updateWaveInfo(
        this.waves.wave, this.waves.totalWaves, this.enemies.getAliveEnemies().length,
      );
      this.audio.play("death", 0.4);
    };

    this.enemies.onEnemyReachedBase = (state) => {
      this.player.damage(state.config.damage);
      this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      this.audio.play("player_hurt", 0.7);
      this.waves.onEnemyEliminated();
      this.ui.updateWaveInfo(
        this.waves.wave, this.waves.totalWaves, this.enemies.getAliveEnemies().length,
      );
    };

    this.enemies.onWallBroken = (_wx, _wz) => {
      this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
      this.audio.play("block_break", 0.4);
    };

    // Player death
    this.player.onDeath = () => {
      this.phase = "gameover";
      this.ui.showDeathScreen();
      this.audio.play("player_death");
      if (this.scene.isPointerLocked) this.scene.unlockPointer();
    };

    // Wave events
    this.waves.onWaveComplete = (wave, _bonusGold) => {
      this.audio.play("wave_complete");
      if (this.waves.isLastWave()) {
        this.phase = "win";
        this.ui.showEnd("victory", `All ${wave} waves survived! The fortress holds!`);
        this.audio.play("victory");
        if (this.scene.isPointerLocked) this.scene.unlockPointer();
      } else {
        this.phase = "wave_clear";
        const nextWave = wave + 1;
        const secs     = this.waves.betweenWaveDuration;
        this.ui.setObjective(
          `Wave ${wave} cleared! Reinforce the walls. Wave ${nextWave} in ${secs}s.`,
        );
        this.ui.updateWaveInfo(wave, this.waves.totalWaves, 0);
      }
    };

    this.waves.onBetweenWaveTick = (secondsLeft) => {
      const nextWave = this.waves.wave + 1;
      if (secondsLeft > 0) {
        this.ui.setObjective(
          `Reinforce the walls. Wave ${nextWave} in ${secondsLeft}s.`,
        );
      } else {
        this.startNextWave();
      }
    };

    // Mode selection
    this.ui.onModeSelect = (mode) => {
      this.mode = mode;
      if (mode === "freeplay") {
        this.ui.setObjective("Free Play — Mine, Build, Explore!");
        this.ui.updateWaveInfo(0, 10, 0);
      } else {
        this.ui.setObjective(`Build fortifications! Wave 1 begins in ${Math.ceil(this.buildPhaseTimer)}s.`);
        this.ui.updateWaveInfo(0, this.waves.totalWaves, 0);
      }
    };

    // UI restart
    this.ui.onRestart = () => this.resetGame();
  }

  // ─── Wave control ──────────────────────────────────────────────────────────

  private startNextWave(): void {
    this.phase = "playing";
    this.waves.startWave((type, gate) => this.spawnEnemy(type, gate));
    this.audio.play("wave_start");
    this.ui.setObjective(`Wave ${this.waves.wave} — Defend the fortress!`);
    this.ui.updateWaveInfo(this.waves.wave, this.waves.totalWaves, 0);
  }

  private spawnEnemy(type: EnemyTypeName, gate: "north" | "south"): void {
    const positions = getSpawnPositions(gate);
    const [sx, sz]  = positions[Math.floor(Math.random() * positions.length)];
    this.enemies.spawn(type, sx + 0.5, sz + 0.5);
  }

  private resetGame(): void {
    this.phase            = "wave_clear";
    this.mode             = "helmsdeep";
    this.buildPhaseTimer  = 120;
    this.enemies.reset();
    this.projectiles.reset();
    this.waves.reset();
    this.player.health    = this.player.maxHealth;
    this.player.xp        = 0;
    this.player.level     = 0;
    this.player.hunger    = 20;
    this.player.onDeath   = this.player.onDeath;
    this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
    this.ui.hideDeathScreen();
    this.ui.hideEnd();
    this.refreshHUD();
    this.ui.showPointerLockPrompt(true);
  }

  // ─── Main loop ─────────────────────────────────────────────────────────────

  private loop(time: number): void {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    this.update(dt);
    this.scene.render(dt);
    requestAnimationFrame(t => this.loop(t));
  }

  private update(dt: number): void {
    // Day/night cycle runs even while paused/locked
    this.scene.updateDayNight(dt);

    if (this.phase === "gameover" || this.phase === "win") return;
    if (!this.scene.isPointerLocked || this.ui.isInventoryOpen()) return;

    // Player movement + bow charge accumulation
    const input = this.input.getMovementInput();
    this.player.update(dt, input);

    // Block interaction (mining)
    const activeStack = this.inventory.getActiveItem();
    this.blockInteraction.setActiveItem(activeStack);
    if (this.input.isLeftMouseDown() && this.blockInteraction.getTargetBlock()) {
      this.blockInteraction.startBreaking();
    } else {
      this.blockInteraction.stopBreaking();
    }
    this.blockInteraction.update(dt);

    // Wave + enemy logic (Helm's Deep mode only)
    if (this.mode === "helmsdeep") {
      if (this.phase === "wave_clear") {
        if (this.waves.wave === 0) {
          this.buildPhaseTimer = Math.max(0, this.buildPhaseTimer - dt);
          const secs = Math.ceil(this.buildPhaseTimer);
          if (secs > 0) {
            if (Math.ceil(this.buildPhaseTimer + dt) !== secs) {
              this.ui.setObjective(`Build fortifications! Wave 1 begins in ${secs}s.`);
            }
          } else {
            this.startNextWave();
          }
        } else {
          this.waves.update(dt);
        }
      } else if (this.phase === "playing") {
        this.waves.update(dt);
        this.enemies.update(dt);
        this.projectiles.update(
          dt,
          (id)         => this.enemies.getEnemyPosition(id),
          (id, d, s, dur) => this.enemies.damage(id, d, s, dur),
          (c, r)       => this.enemies.getAliveEnemies()
            .filter(e => {
              const p = this.enemies.getEnemyPosition(e.id);
              return p ? p.distanceTo(c) <= r : false;
            }).map(e => e.id),
          ()           => this.enemies.getAliveEnemies().map(e => e.id),
        );
        const count = this.enemies.getAliveEnemies().length;
        this.ui.setObjective(`Defend the fortress! ${count} enemies remaining.`);
      }
    }

    // Hunger depletion — 1 point every 45 seconds
    this.hungerTimer += dt;
    if (this.hungerTimer >= 45) {
      this.hungerTimer = 0;
      if (this.player.hunger > 0) {
        this.player.hunger = Math.max(0, this.player.hunger - 1);
        this.ui.updateHunger(this.player.hunger, 20);
      } else {
        this.player.damage(1);
      }
    }

    // Sync armor value each frame
    this.player.armorValue = this.inventory.getArmorValue();

    // HUD
    this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
    this.refreshHotbar();
  }

  // ─── Combat ────────────────────────────────────────────────────────────────

  private tryMeleeAttack(): void {
    if (this.phase !== "playing") return;
    const stack   = this.inventory.getActiveItem();
    const itemDef = stack ? ITEMS[stack.itemId] : null;
    const damage  = itemDef?.damage ?? 1;

    const result = this.player.tryMeleeAttack();
    if (!result) return;

    this.audio.play("swing");
    this.scene.swingArm();
    for (const state of this.enemies.getAliveEnemies()) {
      const pos = this.enemies.getEnemyPosition(state.id);
      if (pos && pos.distanceTo(result.center) <= result.radius) {
        this.enemies.damage(state.id, damage);
        this.audio.play("hit", 0.4);
      }
    }
  }

  // ─── Torch lights ─────────────────────────────────────────────────────────

  private torchKey(wx: number, wy: number, wz: number): string {
    return `${wx},${wy},${wz}`;
  }

  private addTorchLight(wx: number, wy: number, wz: number): void {
    const key = this.torchKey(wx, wy, wz);
    if (this.torchLights.has(key)) return;
    const light = new THREE.PointLight(0xffaa44, 1.8, 10, 2);
    light.position.set(wx + 0.5, wy + 0.8, wz + 0.5);
    this.scene.scene.add(light);
    this.torchLights.set(key, light);
  }

  private removeTorchLight(wx: number, wy: number, wz: number): void {
    const key = this.torchKey(wx, wy, wz);
    const light = this.torchLights.get(key);
    if (light) {
      this.scene.scene.remove(light);
      light.dispose();
      this.torchLights.delete(key);
    }
  }

  // ─── HUD helpers ───────────────────────────────────────────────────────────

  private refreshHUD(): void {
    this.refreshHotbar();
    this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
    this.ui.updateWaveInfo(this.waves.wave, this.waves.totalWaves, 0);
    this.ui.updateHunger(this.player.hunger, 20);
    this.refreshXPBar();
  }

  private refreshXPBar(): void {
    const thresholds = [0, 50, 150, 350, 700, 1200];
    const lvl = this.player.level;
    if (lvl >= thresholds.length - 1) { this.ui.updateXP(1, 1); return; }
    const lo = thresholds[lvl], hi = thresholds[lvl + 1];
    this.ui.updateXP(this.player.xp - lo, hi - lo);
  }

  private refreshHotbar(): void {
    this.ui.updateHotbar(
      this.inventory.hotbar as (ItemStack | null)[],
      this.inventory.activeSlot,
    );
    const active = this.inventory.getActiveItem();
    this.scene.updateArmItem(active?.itemId ?? null);
  }
}
