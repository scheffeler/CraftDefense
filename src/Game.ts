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
import { ParticleSystem } from "./Particles";
import { BLOCK_BEHAVIORS } from "./config/blocks";
import { BLOCK_DEFS } from "./Map";
import { ITEMS } from "./config/items";
import { getSpawnPositions } from "./WorldGen";
import { FORTRESS_CENTER_X, FORTRESS_CENTER_Z } from "./config/map";
import type { ItemStack } from "./Inventory";
import { Crafting } from "./Crafting";

const SURFACE_STEP_SOUND = {
  grass:       "step_grass",
  dirt:        "step_dirt",
  sand:        "step_sand",
  stone:       "step_stone",
  cobblestone: "step_stone",
  wood:        "step_wood",
  planks:      "step_wood",
  leaves:      "step_grass",
  iron_block:  "step_stone",
} as const;

const SMELT_RECIPES: Record<string, string> = {
  iron_ore: "iron_ingot",
  sand:     "glass",
  cobblestone: "stone",
};

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
  private _regenTimer = 0;
  private _stepTimer  = 0;
  private _headBob    = 0;
  private _wasInWater       = false;
  private _nightSpawnTimer  = 0;
  private _flowUpdateTimer  = 0;
  private readonly activeCrops = new Map<string, number>(); // "x,y,z" → growth timer
  // Chest storage: key = "wx,wy,wz", value = array of {itemId, count} | null
  private readonly chestStorage = new Map<string, Array<{itemId:string;count:number}|null>>();
  private openChestKey: string | null = null;

  private particles!:        ParticleSystem;
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

    this.player    = new Player(this.gameMap.world, this.scene.camera, 32, 32);
    this.inventory = new Inventory();
    this.inventory.addItem("stone_sword", 1);
    this.inventory.addItem("stone_pickaxe", 1);
    this.inventory.addItem("wood_axe", 1);
    this.inventory.addItem("wood_hoe", 1);
    this.inventory.addItem("cobblestone", 32);
    this.inventory.addItem("wood", 16);
    this.inventory.addItem("torch", 8);
    this.inventory.addItem("apple", 8);
    this.inventory.addItem("wheat_seeds", 8);

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

    this.particles = new ParticleSystem(this.scene.scene);

    // Pre-populate world chests with loot
    const craftShackChest = "38,1,30";
    this.chestStorage.set(craftShackChest, [
      { itemId: "iron_ingot",  count: 6  },
      { itemId: "stick",       count: 8  },
      { itemId: "coal_ore",    count: 4  },
      { itemId: "planks",      count: 16 },
      null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
    ]);
    const barracksChest = "22,1,30";
    this.chestStorage.set(barracksChest, [
      { itemId: "iron_sword",    count: 1 },
      { itemId: "apple",         count: 6 },
      { itemId: "arrow_item",    count: 12 },
      { itemId: "cobblestone",   count: 32 },
      null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
    ]);

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
      if (this.ui.isWorkbenchOpen()) {
        this.ui.showWorkbench(false);
        if (!this.scene.isPointerLocked) this.scene.lockPointer();
        return;
      }
      if (this.ui.isChestOpen()) {
        this.ui.showChest(false);
        this.openChestKey = null;
        if (!this.scene.isPointerLocked) this.scene.lockPointer();
        return;
      }
      const nowOpen = !this.ui.isInventoryOpen();
      this.ui.showInventory(nowOpen, this.inventory);
      if (nowOpen && this.scene.isPointerLocked) this.scene.unlockPointer();
      else if (!nowOpen && !this.scene.isPointerLocked) this.scene.lockPointer();
    };

    // Recipe book toggle (R)
    this.input.onRecipeBookToggle = () => {
      if (!this.scene.isPointerLocked) return;
      const nowOpen = !this.ui.isRecipeBookOpen();
      this.ui.showRecipeBook(nowOpen);
    };

    // Left click — melee attack (mining is handled by isLeftMouseDown in update)
    this.input.onLeftClick = () => {
      if (this.ui.isInventoryOpen()) return;
      if (!this.blockInteraction.getTargetBlock()) this.tryMeleeAttack();
    };

    // Right click — place block, start bow charge, eat food, or smelt at furnace
    this.input.onRightClick = () => {
      if (this.ui.isInventoryOpen()) return;
      const stack   = this.inventory.getActiveItem();
      const itemDef = stack ? ITEMS[stack.itemId] : null;

      // Check if looking at a crafting_table — open workbench
      const tb = this.blockInteraction.getTargetBlock();
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "crafting_table") {
        this.ui.showWorkbench(true);
        if (this.scene.isPointerLocked) this.scene.unlockPointer();
        return;
      }

      // Check if looking at a chest — open chest storage
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "chest") {
        const key = `${tb.wx},${tb.wy},${tb.wz}`;
        if (!this.chestStorage.has(key)) {
          this.chestStorage.set(key, Array(27).fill(null));
        }
        this.openChestKey = key;
        this.ui.showChest(true, this.chestStorage.get(key)!);
        if (this.scene.isPointerLocked) this.scene.unlockPointer();
        return;
      }

      // Hoe on dirt/grass → farmland
      if (tb && stack?.itemId.endsWith("_hoe")) {
        const bid = this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz);
        if (bid === "dirt" || bid === "grass") {
          this.gameMap.world.setBlock(tb.wx, tb.wy, tb.wz, "farmland");
          this.gameMap.world.rebuildDirtyChunks();
          this.audio.play("block_place", 0.5);
          return;
        }
      }

      // Wheat seeds on farmland → plant wheat
      if (tb && stack?.itemId === "wheat_seeds") {
        const bid = this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz);
        if (bid === "farmland") {
          const ay = tb.wy + 1;
          if (ay < 32 && this.gameMap.world.getBlock(tb.wx, ay, tb.wz) === "air") {
            this.gameMap.world.setBlock(tb.wx, ay, tb.wz, "wheat_0");
            this.gameMap.world.rebuildDirtyChunks();
            this.inventory.removeItem("wheat_seeds", 1);
            this.activeCrops.set(`${tb.wx},${ay},${tb.wz}`, 0);
            this.audio.play("block_place", 0.5);
            this.refreshHotbar();
            return;
          }
        }
      }

      // Check if looking at a furnace — smelt active item
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "furnace") {
        if (stack && SMELT_RECIPES[stack.itemId]) {
          const result = SMELT_RECIPES[stack.itemId];
          this.inventory.removeItem(stack.itemId, 1);
          this.inventory.addItem(result, 1);
          this.audio.play("block_place", 0.7);
          this.refreshHotbar();
          this.ui.showSmeltNotice(stack.itemId, result);
          return;
        }
        return; // clicked furnace but nothing to smelt
      }

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
      const blockColor = BLOCK_DEFS[id]?.color ?? 0x888888;
      this.particles.spawnBlockBreak(wx, wy, wz, blockColor);

      // Farming-specific drop handling
      if (id === "farmland" || id.startsWith("wheat_")) {
        if (yieldsDrops) this.handleFarmingBreak(wx, wy, wz, id);
        if (wy >= 1) this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
        return;
      }

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
      const pos = this.enemies.getEnemyPosition(state.id);
      if (pos) {
        this.particles.spawnEnemyDeath(pos.x, pos.y, pos.z, state.config.color);
        if (state.config.xpReward) {
          this.particles.spawnXPOrbs(pos.x, pos.y, pos.z, Math.min(state.config.xpReward, 5));
        }
      }
      if (state.config.xpReward) { this.player.addXP(state.config.xpReward); this.refreshXPBar(); }
      if (state.config.drops) {
        for (const drop of state.config.drops) {
          if (Math.random() < drop.chance) {
            this.inventory.addItem(drop.itemId, drop.count ?? 1);
            this.audio.play("pickup", 0.4);
          }
        }
        this.refreshHotbar();
      }
      this.waves.onEnemyEliminated();
      this.ui.updateWaveInfo(
        this.waves.wave, this.waves.totalWaves, this.enemies.getAliveEnemies().length,
        this.scene.dayNumber, this.scene.isDay,
      );
      this.audio.play("death", 0.4);
    };

    this.enemies.onEnemyReachedBase = (state) => {
      this.player.damage(state.config.damage);
      this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      this.ui.showDamageVignette();
      this.audio.play("player_hurt", 0.7);
      this.waves.onEnemyEliminated();
      this.ui.updateWaveInfo(
        this.waves.wave, this.waves.totalWaves, this.enemies.getAliveEnemies().length,
        this.scene.dayNumber, this.scene.isDay,
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

    // Personal 2×2 crafting (inventory screen)
    this.ui.onCraftingSlotClick = (row, col) => {
      const active = this.inventory.getActiveItem();
      if (active) {
        this.ui.setPersonalCraftSlot(row, col, active.itemId);
      } else {
        this.ui.setPersonalCraftSlot(row, col, null);
      }
      const recipe = Crafting.findRecipe(this.ui.getPersonalCraftGrid());
      this.ui.setPersonalCraftResult(recipe?.result.itemId ?? null, recipe?.result.count ?? 0);
    };

    this.ui.onCraftingResultClick = () => {
      const grid = this.ui.getPersonalCraftGrid();
      const recipe = Crafting.findRecipe(grid);
      if (!recipe) return;
      const result = Crafting.craft(this.inventory, recipe);
      if (result) {
        this.audio.play("pickup", 0.5);
        this.refreshHotbar();
        for (let r = 0; r < 2; r++)
          for (let c = 0; c < 2; c++)
            this.ui.setPersonalCraftSlot(r, c, null);
        this.ui.setPersonalCraftResult(null, 0);
      }
    };

    // Workbench 3×3 crafting
    this.ui.onWorkbenchSlotClick = (row, col) => {
      const active = this.inventory.getActiveItem();
      if (active) {
        this.ui.setWorkbenchSlot(row, col, active.itemId);
        const recipe = Crafting.findRecipe(this.ui.getWorkbenchGrid());
        this.ui.setWorkbenchResult(recipe?.result.itemId ?? null, recipe?.result.count ?? 0);
      } else {
        this.ui.setWorkbenchSlot(row, col, null);
        const recipe = Crafting.findRecipe(this.ui.getWorkbenchGrid());
        this.ui.setWorkbenchResult(recipe?.result.itemId ?? null, recipe?.result.count ?? 0);
      }
    };

    this.ui.onWorkbenchResultClick = () => {
      const grid = this.ui.getWorkbenchGrid();
      const recipe = Crafting.findRecipe(grid);
      if (!recipe) return;
      const result = Crafting.craft(this.inventory, recipe);
      if (result) {
        this.audio.play("pickup", 0.5);
        this.refreshHotbar();
        // Clear the workbench grid
        for (let r = 0; r < 3; r++)
          for (let c = 0; c < 3; c++)
            this.ui.setWorkbenchSlot(r, c, null);
        this.ui.setWorkbenchResult(null, 0);
      }
    };

    this.ui.onWorkbenchClose = () => {
      this.ui.showWorkbench(false);
      this.scene.lockPointer();
    };

    // Chest storage
    this.ui.onChestSlotClick = (index) => {
      if (!this.openChestKey) return;
      const storage = this.chestStorage.get(this.openChestKey);
      if (!storage) return;
      const active = this.inventory.getActiveItem();
      if (active && !storage[index]) {
        // Put active item in chest
        storage[index] = { itemId: active.itemId, count: active.count };
        this.inventory.removeItem(active.itemId, active.count);
        this.ui.updateChestSlot(index, storage[index]);
        this.refreshHotbar();
      } else if (storage[index]) {
        // Take item from chest
        const s = storage[index]!;
        this.inventory.addItem(s.itemId, s.count);
        storage[index] = null;
        this.ui.updateChestSlot(index, null);
        this.audio.play("pickup", 0.4);
        this.refreshHotbar();
      }
    };

    this.ui.onChestClose = () => {
      this.ui.showChest(false);
      this.openChestKey = null;
      this.scene.lockPointer();
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
    this.ui.showWaveAnnouncement(this.waves.wave);
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
    this.player.position.set(32, 1, 32);
    this.scene.resetCamera();
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
    // Apply underwater fog before day/night (uses previous frame's water state)
    this.scene.setUnderwaterEffect(this._wasInWater);
    // Day/night cycle runs even while paused/locked
    this.scene.updateDayNight(dt);
    this.audio.updateAmbient(dt, this.scene.daylight);

    if (this.phase === "gameover" || this.phase === "win") return;
    if (!this.scene.isPointerLocked || this.ui.isInventoryOpen() || this.ui.isWorkbenchOpen() || this.ui.isChestOpen()) return;
    // Recipe book doesn't pause gameplay, just a HUD overlay

    // Player movement + bow charge accumulation
    const input = this.input.getMovementInput();
    this.player.update(dt, input);

    // Water entry/exit effects
    const nowInWater = this.player.inWater;
    if (nowInWater && !this._wasInWater) this.audio.play("splash", 0.8);
    this._wasInWater = nowInWater;

    // Footstep sounds + head bob
    const isMovingH = input.forward || input.backward || input.left || input.right;
    if (isMovingH && this.player.onGround && !nowInWater) {
      const stepInterval = input.sprint ? 0.32 : 0.45;
      this._stepTimer += dt;
      if (this._stepTimer >= stepInterval) {
        this._stepTimer = 0;
        const fx = Math.floor(this.player.position.x);
        const fz = Math.floor(this.player.position.z);
        const surfaceBlock = this.gameMap.world.getBlock(fx, Math.floor(this.player.position.y) - 1, fz);
        const sfx = SURFACE_STEP_SOUND[surfaceBlock as keyof typeof SURFACE_STEP_SOUND] ?? "step_stone";
        this.audio.play(sfx as any, 0.35);
      }
      this._headBob = Math.min(1, this._headBob + dt * 8);
    } else {
      this._headBob = Math.max(0, this._headBob - dt * 12);
      this._stepTimer = 0;
    }
    const bobSpeed  = input.sprint ? 14 : 9;
    const bobAmt    = 0.035 * this._headBob;
    this.scene.camera.position.y += Math.sin(performance.now() * 0.001 * bobSpeed) * bobAmt;

    // Block interaction (mining)
    const activeStack = this.inventory.getActiveItem();
    this.blockInteraction.setActiveItem(activeStack);
    if (this.input.isLeftMouseDown() && this.blockInteraction.getTargetBlock()) {
      this.blockInteraction.startBreaking();
    } else {
      this.blockInteraction.stopBreaking();
    }
    this.blockInteraction.update(dt);

    // Wave + enemy logic
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
        this.updateCombat(dt);
        const count = this.enemies.getAliveEnemies().length;
        this.ui.setObjective(`Defend the fortress! ${count} enemies remaining.`);
      }
    } else if (this.mode === "freeplay") {
      // Night mob spawning
      if (!this.scene.isDay) {
        this._nightSpawnTimer += dt;
        if (this._nightSpawnTimer >= 20 && this.enemies.getAliveEnemies().length < 8) {
          this._nightSpawnTimer = 0;
          this.spawnNightMob();
        }
      } else {
        this._nightSpawnTimer = 0;
      }
      if (this.enemies.getAliveEnemies().length > 0) {
        this.updateCombat(dt);
        const count = this.enemies.getAliveEnemies().length;
        this.ui.setObjective(`Night! ${count} hostile${count === 1 ? "" : "s"} nearby!`);
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
        this.ui.showDamageVignette();
      }
    }

    // Health regeneration — regen 1 HP every 4 seconds when hunger >= 18
    this._regenTimer += dt;
    if (this._regenTimer >= 4) {
      this._regenTimer = 0;
      if (this.player.hunger >= 18 && this.player.health < this.player.maxHealth) {
        this.player.heal(1);
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      }
    }

    // Sprint FOV
    this.scene.setFOV(input.sprint && isMovingH ? 85 : 75, dt);

    // Sync armor value each frame
    this.player.armorValue = this.inventory.getArmorValue();

    // Particles
    this.particles.update(dt);

    // Crop growth
    this.updateCrops(dt);

    // Torch flicker — subtle sine-wave intensity variation
    if (this.torchLights.size > 0) {
      const t = performance.now() * 0.001;
      for (const light of this.torchLights.values()) {
        light.intensity = 1.6 + Math.sin(t * 7.3) * 0.25 + Math.sin(t * 12.1 + 1.5) * 0.12;
      }
    }

    // Freeplay: flow field tracks player (recomputed every 3 s)
    if (this.mode === "freeplay" && this.enemies.getAliveEnemies().length > 0) {
      this._flowUpdateTimer += dt;
      if (this._flowUpdateTimer >= 3) {
        this._flowUpdateTimer = 0;
        this.flowField.recompute(
          Math.round(this.player.position.x),
          Math.round(this.player.position.z),
        );
      }
    }

    // HUD
    this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
    this.refreshHotbar();

    // Block name tooltip when targeting a block
    const tb2 = this.blockInteraction.getTargetBlock();
    if (tb2) {
      const blockId = this.gameMap.world.getBlock(tb2.wx, tb2.wy, tb2.wz);
      const blockName = BLOCK_DEFS[blockId]?.name ?? blockId;
      this.ui.showBlockTooltip(blockName);
    } else {
      this.ui.showBlockTooltip(null);
    }
  }

  // ─── Farming ───────────────────────────────────────────────────────────────

  private updateCrops(dt: number): void {
    const GROWTH_TIME = 30;
    for (const [key, timer] of this.activeCrops) {
      const [x, y, z] = key.split(",").map(Number);
      const block = this.gameMap.world.getBlock(x, y, z) as string;
      if (!block.startsWith("wheat_")) {
        this.activeCrops.delete(key);
        continue;
      }
      const newTimer = timer + dt;
      if (newTimer < GROWTH_TIME) {
        this.activeCrops.set(key, newTimer);
        continue;
      }
      const stage = parseInt(block[block.length - 1]);
      if (stage < 3) {
        this.gameMap.world.setBlock(x, y, z, `wheat_${stage + 1}` as import("./types").BlockId);
        this.gameMap.world.rebuildDirtyChunks();
      }
      if (stage >= 2) {
        this.activeCrops.delete(key);
      } else {
        this.activeCrops.set(key, 0);
      }
    }
  }

  private handleFarmingBreak(wx: number, wy: number, wz: number, id: string): void {
    if (id === "farmland") {
      const above = this.gameMap.world.getBlock(wx, wy + 1, wz) as string;
      if (above.startsWith("wheat_")) {
        this.gameMap.world.setBlock(wx, wy + 1, wz, "air");
        this.gameMap.world.rebuildDirtyChunks();
        this.activeCrops.delete(`${wx},${wy + 1},${wz}`);
        this.inventory.addItem("wheat_seeds", 1);
      }
      this.inventory.addItem("dirt", 1);
    } else if (id.startsWith("wheat_")) {
      const stage = parseInt(id[id.length - 1]);
      this.activeCrops.delete(`${wx},${wy},${wz}`);
      if (stage >= 3) {
        this.inventory.addItem("wheat", 1 + Math.floor(Math.random() * 2));
        this.inventory.addItem("wheat_seeds", 1 + Math.floor(Math.random() * 2));
      } else {
        this.inventory.addItem("wheat_seeds", 1);
      }
    }
    this.refreshHotbar();
  }

  // ─── Combat ────────────────────────────────────────────────────────────────

  private updateCombat(dt: number): void {
    this.enemies.update(dt);
    this.projectiles.update(
      dt,
      (id)         => this.enemies.getEnemyPosition(id),
      (id, d, s, dur) => this.enemies.damage(id, d, s, dur),
      (c, r)       => this.enemies.getAliveEnemies()
        .filter(e => { const p = this.enemies.getEnemyPosition(e.id); return p ? p.distanceTo(c) <= r : false; })
        .map(e => e.id),
      ()           => this.enemies.getAliveEnemies().map(e => e.id),
    );
  }

  private spawnNightMob(): void {
    const types: EnemyTypeName[] = ["zombie", "spider", "goblin"];
    const type  = types[Math.floor(Math.random() * types.length)];
    const angle = Math.random() * Math.PI * 2;
    const r     = 12 + Math.random() * 8;
    const sx    = Math.max(2, Math.min(61, this.player.position.x + Math.cos(angle) * r));
    const sz    = Math.max(2, Math.min(61, this.player.position.z + Math.sin(angle) * r));
    this.enemies.spawn(type, sx, sz);
  }

  private tryMeleeAttack(): void {
    if (this.phase !== "playing" && this.mode !== "freeplay") return;
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
    this.ui.updateWaveInfo(this.waves.wave, this.waves.totalWaves, 0, this.scene.dayNumber, this.scene.isDay);
    this.ui.updateHunger(this.player.hunger, 20);
    this.refreshXPBar();
  }

  private _lastLevel = 0;
  private refreshXPBar(): void {
    const thresholds = [0, 50, 150, 350, 700, 1200];
    const lvl = this.player.level;
    if (lvl > this._lastLevel) {
      this._lastLevel = lvl;
      this.ui.showLevelUp(lvl);
    }
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
    this.ui.updateItemTooltip(active?.itemId ?? null, active?.durability);
  }
}
