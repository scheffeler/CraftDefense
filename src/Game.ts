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
import { ITEMS, type ItemDef } from "./config/items";
import { getSpawnPositions, DUNGEON_CHEST_POSITIONS } from "./WorldGen";
import { FORTRESS_CENTER_X, FORTRESS_CENTER_Z } from "./config/map";
import type { ItemStack } from "./Inventory";
import { Crafting } from "./Crafting";
import { PassiveMobManager } from "./PassiveMob";
import { WeatherSystem } from "./Weather";

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
  iron_ore:      "iron_ingot",
  gold_ore:      "gold_ingot",
  diamond_ore:   "diamond",
  sand:          "glass",
  cobblestone:   "stone",
  raw_beef:      "cooked_beef",
  raw_porkchop:  "cooked_porkchop",
  raw_chicken:   "cooked_chicken",
};
const SMELT_TIME = 10; // seconds per item
const FUEL_TIMES: Record<string, number> = {
  coal_ore: 80,
  planks:   15,
  wood:     15,
  stick:    5,
};

export class Game {
  private phase: GamePhase = "wave_clear";
  private mode: "helmsdeep" | "freeplay" = "helmsdeep";
  private lastTime = 0;

  // Initial build phase before wave 1 (seconds)
  private buildPhaseTimer = 60;

  // Torch point lights keyed by "wx,wy,wz"
  private readonly torchLights = new Map<string, THREE.PointLight>();

  // Best endless wave (persisted in localStorage)
  private _bestEndlessWave = parseInt(localStorage.getItem("craftdefense_best_endless") ?? "0", 10);

  // Hunger depletion timer
  private hungerTimer = 0;
  private _autoSaveTimer = 0;
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

  // Furnace state: keyed by "wx,wy,wz"
  private readonly furnaceStates = new Map<string, {
    inputItem: ItemStack | null;
    fuelItem:  ItemStack | null;
    outputItem: ItemStack | null;
    smeltProgress: number;   // 0..1
    fuelRemaining: number;   // seconds remaining on current fuel
    totalFuelTime: number;   // seconds the current fuel lasts
  }>();
  private openFurnaceKey: string | null = null;

  // Enchanting table
  private _enchantItem: import("./Inventory").ItemStack | null = null;

  // Enemy melee cooldown per enemy id
  private readonly enemyMeleeCooldown = new Map<number, number>();

  // Achievement tracking
  private readonly _achievements = new Set<string>();

  // Gun state
  private gunCooldown    = 0;
  private isSniperScoped = false;

  // Item entity drops — floating 3D items in the world
  private readonly itemEntities: Array<{
    group: THREE.Group;
    itemId: string;
    life: number;
    bobPhase: number;
    pullTimer: number;
  }> = [];

  private particles!:        ParticleSystem;
  private passiveMobs!:      PassiveMobManager;
  private weather!:          WeatherSystem;
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
    // Expose camera for screenshot tooling
    (window as any).__GAME_CAMERA__ = this.scene.camera;
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
    this.inventory.addItem("pistol", 1);
    this.inventory.addItem("bullet", 24);
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
    this.weather = new WeatherSystem(this.scene.scene);
    this.weather.onThunder = () => {
      this.audio.play("thunder", 0.85);
      this.ui.flashThunder();
    };
    this.passiveMobs = new PassiveMobManager(this.scene.scene);
    this.passiveMobs.onMobDied = (x, y, z, drops, xp) => {
      for (const d of drops) {
        for (let i = 0; i < d.count; i++) {
          this.spawnItemEntity(x + (Math.random() - 0.5) * 0.6, y, z + (Math.random() - 0.5) * 0.6, d.itemId);
        }
      }
      this.player.addXP(xp);
      this.refreshXPBar();
      this.audio.play("death", 0.35);
    };

    // Pre-populate world chests with loot
    const craftShackChest = `38,${7},30`;
    this.chestStorage.set(craftShackChest, [
      { itemId: "iron_ingot",  count: 6  },
      { itemId: "stick",       count: 8  },
      { itemId: "coal_ore",    count: 4  },
      { itemId: "planks",      count: 16 },
      null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
    ]);
    const barracksChest = `22,${7},30`;
    this.chestStorage.set(barracksChest, [
      { itemId: "iron_sword",    count: 1 },
      { itemId: "crossbow",      count: 1 },
      { itemId: "arrow_item",    count: 32 },
      { itemId: "apple",         count: 6 },
      { itemId: "bullet",        count: 16 },
      { itemId: "cobblestone",   count: 32 },
      { itemId: "gunpowder",     count: 4 },
      null, null, null, null,
      null, null, null, null, null, null, null, null, null,
      null, null, null, null, null, null, null, null, null,
    ]);

    // Dungeon chests — varied loot per dungeon
    const dungeonLoots: Array<Array<{itemId:string;count:number}|null>> = [
      [{ itemId:"iron_pickaxe", count:1 }, { itemId:"iron_ingot", count:4 }, { itemId:"coal_ore", count:6 }, { itemId:"bread", count:3 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      [{ itemId:"diamond_ore",  count:2 }, { itemId:"iron_ingot", count:8 }, { itemId:"gold_ore", count:3 }, { itemId:"apple", count:5 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      [{ itemId:"crossbow",     count:1 }, { itemId:"arrow_item", count:24 }, { itemId:"sniper_rifle", count:1 }, { itemId:"sniper_ammo", count:16 },
       { itemId:"pistol", count:1 }, { itemId:"bullet", count:16 }, { itemId:"shotgun", count:1 }, { itemId:"shotgun_shell", count:12 },
       { itemId:"raygun", count:1 }, { itemId:"energy_cell", count:6 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      [{ itemId:"iron_sword",   count:1 }, { itemId:"iron_boots", count:1 }, { itemId:"cobblestone", count:32 }, { itemId:"torch", count:8 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      [{ itemId:"book",         count:2 }, { itemId:"diamond",    count:1 }, { itemId:"iron_ingot",  count:6 }, { itemId:"wheat", count:6 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    ];
    for (let i = 0; i < DUNGEON_CHEST_POSITIONS.length; i++) {
      const [cx, cy, cz] = DUNGEON_CHEST_POSITIONS[i];
      this.chestStorage.set(`${cx},${cy},${cz}`, dungeonLoots[i % dungeonLoots.length]);
    }

    this.ui    = new UI(this.container);
    this.audio = new AudioManager();
    this.input = new InputManager(this.scene.renderer.domElement);

    // Pre-render minimap terrain once
    const G = 6; // GROUND_OFFSET
    this.ui.initMinimapTerrain(64, 64, (x, z) => {
      for (let y = G + 12; y >= G; y--) {
        const b = this.gameMap.world.getBlock(x, y, z);
        if (b !== "air") return b as string;
      }
      return "bedrock";
    });

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
      if (!locked) {
        // Show pause menu only if game is in progress (pointer was locked and user pressed Esc)
        if (this.phase !== "gameover" && this.phase !== "win" &&
            !this.ui.isInventoryOpen() && !this.ui.isWorkbenchOpen() &&
            !this.ui.isChestOpen() && !this.ui.isFurnaceOpen() && !this.ui.isEnchantingOpen()) {
          this.ui.showPause(true);
        }
        this.ui.showInventory(false);
      } else {
        this.ui.showPause(false);
        this.ui.showPointerLockPrompt(false);
      }
    };
    const requestLock = () => {
      if (!this.scene.isPointerLocked && !this.ui.isInventoryOpen() && !this.ui.isPauseOpen()) {
        this.scene.lockPointer();
      }
    };
    this.ui.onPointerLockRequest = requestLock;
    document.addEventListener("click", requestLock);

    // Pause menu callbacks
    this.ui.onPauseResume = () => {
      this.scene.lockPointer();
    };
    this.ui.onPauseReturnTitle = () => {
      this.ui.showPointerLockPrompt(true);
      // Reset game state for mode re-selection
      this.phase = "wave_clear";
      this.waves = new WaveManager();
      this.enemies.reset();
      this.buildPhaseTimer = 60;
      this._titleAngle = Math.PI * 1.25;
    };

    // Hotbar slot selection
    this.input.onSlotChange = (slot) => {
      this.inventory.activeSlot = slot;
      if (this.isSniperScoped) {
        this.isSniperScoped = false;
        this.ui.showScopeOverlay(false);
      }
      this.player.cancelCrossbow();
      this.refreshHotbar();
    };

    // Inventory toggle (E)
    this.input.onInventoryToggle = () => {
      if (this.ui.isEnchantingOpen()) {
        this.ui.onEnchantClose();
        return;
      }
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

    // Left click — melee attack / gun fire (mining is handled by isLeftMouseDown in update)
    this.input.onLeftClick = () => {
      if (this.ui.isInventoryOpen()) return;
      const stack   = this.inventory.getActiveItem();
      const itemDef = stack ? ITEMS[stack.itemId] : null;
      if (itemDef?.weaponType === "gun") {
        this.tryGunFire(itemDef);
        return;
      }
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

      // Check if looking at enchanting table — open enchanting UI
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "enchanting_table") {
        this._openEnchantingTable();
        return;
      }

      // Check if looking at a bed — sleep to skip night
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "bed") {
        if (!this.scene.isDay) {
          this.scene.skipToMorning();
          this.audio.play("step_wood", 0.4);
          this.ui.showAchievement("Good Morning!", "Slept through the night");
        } else {
          this.ui.showAchievement("Not sleepy", "You can only sleep at night");
        }
        return;
      }

      // Check if looking at a furnace — open furnace UI
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "furnace") {
        const key = `${tb.wx},${tb.wy},${tb.wz}`;
        if (!this.furnaceStates.has(key)) {
          this.furnaceStates.set(key, {
            inputItem: null, fuelItem: null, outputItem: null,
            smeltProgress: 0, fuelRemaining: 0, totalFuelTime: 0,
          });
        }
        this.openFurnaceKey = key;
        const fs = this.furnaceStates.get(key)!;
        this.ui.showFurnace(true);
        this.ui.updateFurnaceSlots(fs.inputItem, fs.fuelItem, fs.outputItem);
        this.ui.updateFurnaceProgress(fs.smeltProgress, fs.totalFuelTime > 0 ? fs.fuelRemaining / fs.totalFuelTime : 0);
        this.scene.unlockPointer();
        return;
      }

      if (itemDef?.id === "sniper_rifle") {
        this.isSniperScoped = !this.isSniperScoped;
        this.ui.showScopeOverlay(this.isSniperScoped);
        this.audio.play("scope_in", 0.4);
        return;
      }

      if (itemDef?.id === "crossbow" && this.inventory.hasItem("arrow_item", 1)) {
        if (this.player.isCrossbowLoaded) {
          // Second right-click: fire instantly
          const shot = this.player.fireCrossbow();
          if (shot) {
            const damage = itemDef.damage ?? 12;
            this.projectiles.fireFromPlayerCrossbow(shot.from, shot.direction, damage);
            this.inventory.removeItem("arrow_item", 1);
            this.audio.play("arrow_release");
            this.refreshHotbar();
          }
        } else {
          // First right-click: start loading
          this.player.startCrossbowLoad();
          this.audio.play("bow_charge", 0.5);
        }
      } else if (itemDef?.id === "bow" && this.inventory.hasItem("arrow_item", 1)) {
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
          if (ITEMS[drop]) this.spawnItemEntity(wx + 0.5, wy + 0.7, wz + 0.5, drop);
        }
      }
      if (id === "torch") this.removeTorchLight(wx, wy, wz);
      if (wy >= 1) this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);

      // Achievements
      if (id === "iron_ore") this.unlockAchievement("iron_ore", "Getting an Upgrade", "Mine your first iron ore");
      if (id === "coal_ore") this.unlockAchievement("coal_ore", "Hot Topic", "Mine your first coal");
      if (id === "diamond_ore") this.unlockAchievement("diamond_ore", "Diamonds!", "Find a rare diamond ore deposit");
    };

    this.blockInteraction.onBlockPlaced = (wx, wy, wz, id) => {
      this.audio.play("block_place", 0.5);
      if (id === "torch") this.addTorchLight(wx, wy, wz);
      this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
      this.refreshHotbar();
      if (id === "torch") this.unlockAchievement("torch_place", "Lighting the Way", "Place your first torch");
    };

    // Enemy events
    this.enemies.onEnemyDied = (state) => {
      const pos = this.enemies.getEnemyPosition(state.id);
      const isElite = state.elite === true;

      if (pos) {
        // Elite deaths leave extra particles and a golden flash
        const deathColor = isElite ? 0xff8800 : state.config.color;
        this.particles.spawnEnemyDeath(pos.x, pos.y, pos.z, deathColor);
        if (state.config.xpReward) {
          this.particles.spawnXPOrbs(pos.x, pos.y, pos.z, Math.min(state.config.xpReward, 8));
        }
      }
      if (state.config.xpReward) { this.player.addXP(state.config.xpReward); this.refreshXPBar(); }

      if (isElite) {
        this.unlockAchievement("elite_kill", "Elite Hunter", "Defeated an Elite enemy");
        this.ui.showFloatingNumber("★ ELITE KILL!", "#ff8800", window.innerWidth / 2, window.innerHeight * 0.35);
      }

      this.unlockAchievement("first_kill", "Monster Hunter", `Defeated your first ${state.config.name}`);
      if (state.config.drops && pos) {
        // Elites always drop their loot (100% chance each drop)
        const dropMultiplier = isElite ? 2 : 1;
        for (const drop of state.config.drops) {
          const roll = isElite ? 0 : Math.random(); // elites always drop
          if (roll < drop.chance) {
            const count = (drop.count ?? 1) * dropMultiplier;
            for (let d = 0; d < count; d++) {
              this.spawnItemEntity(
                pos.x + (Math.random() - 0.5) * 0.4,
                pos.y + 0.3,
                pos.z + (Math.random() - 0.5) * 0.4,
                drop.itemId,
              );
            }
          }
        }
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
      this.scene.shake(0.08, 0.4);
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

    this.enemies.onCreeperPrime = () => {
      this.audio.play("creeper_hiss", 0.75);
    };

    this.enemies.onSkeletonArrowHit = (damage) => {
      this.player.damage(damage);
      this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      this.ui.showDamageVignette();
      this.audio.play("player_hurt", 0.5);
    };

    this.enemies.onSpiderWebHit = () => {
      this.player.webSlowTimer = 3.0;  // 3 seconds of slow
      this.ui.showWebbedIndicator();
      this.audio.play("swing", 0.3);   // sticky thwack sound (reuse swing)
    };

    this.enemies.onTrollStomp = (x, y, z, radius, damage) => {
      this.audio.play("troll_stomp", 0.95);
      this.particles.spawnStompShockwave(x, y, z);
      this.scene.shake(0.14, 0.45);
      const pp   = this.player.position;
      const dist = Math.sqrt((pp.x - x) ** 2 + (pp.z - z) ** 2);
      if (dist <= radius) {
        const falloff     = Math.max(0, 1 - dist / radius);
        const actualDmg   = Math.ceil(damage * (0.5 + 0.5 * falloff));
        this.player.damage(actualDmg);
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
        this.ui.showDamageVignette();
        this.audio.play("player_hurt", 0.6);
        this.showDamageNumber(actualDmg, pp.x, pp.y + 2, pp.z);
      }
    };

    this.enemies.onBossHealthChanged = (name, pct) => {
      this.ui.showBossHealthBar(name, pct);
    };

    this.enemies.onBossDied = () => {
      this.ui.hideBossHealthBar();
      this.audio.play("victory", 0.6);
      this.scene.shake(0.12, 0.5);
      this.unlockAchievement("boss_slain", "The Battle of Helm's Deep", "Defeated the Uruk-hai Captain!");
    };

    this.enemies.onCreeperExplode = (x, y, z, radius) => {
      this.audio.play("explosion", 0.9);
      this.scene.shake(0.18, 0.6);
      this.particles.spawnExplosion(x, y + 0.5, z);
      // Damage player if in range
      const pp = this.player.position;
      const dx = pp.x - x, dy = pp.y - y, dz = pp.z - z;
      if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius + 1) {
        this.player.damage(6);
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
        this.ui.showDamageVignette();
      }
      // Break nearby blocks
      if (this.gameMap) {
        for (let bx = Math.floor(x - radius); bx <= Math.ceil(x + radius); bx++) {
          for (let by = Math.floor(y); by <= Math.ceil(y + radius); by++) {
            for (let bz = Math.floor(z - radius); bz <= Math.ceil(z + radius); bz++) {
              const ddx = bx - x, ddy = by - y, ddz = bz - z;
              if (ddx*ddx + ddy*ddy + ddz*ddz > radius*radius) continue;
              const block = this.gameMap.world.getBlock(bx, by, bz);
              if (block === "air" || block === "bedrock") continue;
              if (Math.random() < 0.45) this.gameMap.world.setBlock(bx, by, bz, "air");
            }
          }
        }
        this.gameMap.world.rebuildDirtyChunks();
      }
      this.waves.onEnemyEliminated();
    };

    // Player death
    this.player.onDeath = () => {
      this.phase = "gameover";
      let endlessWave: number | undefined;
      if (this.waves.isEndless) {
        endlessWave = this.waves.wave;
        if (endlessWave > this._bestEndlessWave) {
          this._bestEndlessWave = endlessWave;
          localStorage.setItem("craftdefense_best_endless", String(endlessWave));
        }
      }
      this.ui.showDeathScreen(endlessWave, this._bestEndlessWave);
      this.audio.play("player_death");
      if (this.scene.isPointerLocked) this.scene.unlockPointer();
    };

    // Wave events
    this.waves.onWaveComplete = (wave, _bonusGold) => {
      this.audio.play("wave_complete");
      if (this.waves.isLastWave()) {
        this.phase = "win";
        this.ui.showEnd("victory", `All ${wave} waves survived! The fortress holds!`, this._bestEndlessWave);
        this.audio.play("victory");
        if (this.scene.isPointerLocked) this.scene.unlockPointer();
      } else {
        this.phase = "wave_clear";
        const nextWave = wave + 1;
        const secs     = this.waves.betweenWaveDuration;
        const label    = this.waves.isEndless ? `∞ Wave ${nextWave}` : `Wave ${nextWave}`;
        this.ui.setObjective(
          `${this.waves.isEndless ? "★ ENDLESS" : ""} Wave ${wave} cleared! Reinforce the walls. ${label} in ${secs}s.`,
        );
        this.ui.updateWaveInfo(wave, this.waves.totalWaves, 0, undefined, undefined, this.waves.isEndless);
      }
    };

    this.waves.onBetweenWaveTick = (secondsLeft) => {
      const nextWave = this.waves.wave + 1;
      if (secondsLeft > 0) {
        this.ui.setObjective(
          `${this.waves.isEndless ? "[ENDLESS] " : ""}Reinforce the walls. Wave ${nextWave} in ${secondsLeft}s.`,
        );
      } else {
        this.startNextWave();
      }
    };

    // Continue to endless mode after final wave
    this.ui.onContinueEndless = () => {
      this.phase = "endless";
      this.waves.enableEndless();
      this.scene.lockPointer();
      const secs = this.waves.betweenWaveDuration;
      this.ui.setObjective(`ENDLESS MODE: Survive as long as you can! Wave ${this.waves.wave + 1} in ${secs}s.`);
      this.ui.updateWaveInfo(this.waves.wave, this.waves.totalWaves, 0, undefined, undefined, true);
    };

    // Continue saved game
    this.ui.onContinueGame = () => {
      this.loadGame();
      if (this.mode === "freeplay") {
        this.ui.setObjective("Free Play — Mine, Build, Explore!");
        this.ui.updateWaveInfo(0, 10, 0);
        const mobTypes = ["cow", "sheep", "pig", "chicken"] as const;
        for (let i = 0; i < 18; i++) {
          const type = mobTypes[Math.floor(Math.random() * mobTypes.length)];
          let x: number, z: number;
          do {
            x = 4 + Math.random() * 56;
            z = 4 + Math.random() * 56;
          } while (x >= 16 && x <= 47 && z >= 16 && z <= 47);
          this.passiveMobs.spawn(type, x, z);
        }
      } else {
        this.ui.setObjective(`Build fortifications! Wave 1 begins in ${Math.ceil(this.buildPhaseTimer)}s.`);
        this.ui.updateWaveInfo(0, this.waves.totalWaves, 0);
      }
      this.refreshHUD();
      this.scene.lockPointer();
    };
    if (Game.hasSave()) this.ui.showContinueButton(true);

    // Mode selection
    this.ui.onModeSelect = (mode) => {
      this.mode = mode;
      if (mode === "freeplay") {
        this.ui.setObjective("Free Play — Mine, Build, Explore!");
        this.ui.updateWaveInfo(0, 10, 0);
        // Spawn passive mobs scattered across the world
        const mobTypes: Array<"cow" | "sheep" | "pig" | "chicken"> = ["cow", "sheep", "pig", "chicken"];
        for (let i = 0; i < 18; i++) {
          const type = mobTypes[Math.floor(Math.random() * mobTypes.length)];
          let x: number, z: number;
          do {
            x = 4 + Math.random() * 56;
            z = 4 + Math.random() * 56;
          } while (x >= 16 && x <= 47 && z >= 16 && z <= 47); // avoid fortress
          this.passiveMobs.spawn(type, x, z);
        }
      } else {
        this.ui.setObjective(`Build fortifications! Wave 1 begins in ${Math.ceil(this.buildPhaseTimer)}s.`);
        this.ui.updateWaveInfo(0, this.waves.totalWaves, 0);
        this.passiveMobs.reset();
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

    // Furnace
    this.ui.onFurnaceInputClick = () => {
      if (!this.openFurnaceKey) return;
      const fs = this.furnaceStates.get(this.openFurnaceKey)!;
      const active = this.inventory.getActiveItem();
      if (active && SMELT_RECIPES[active.itemId]) {
        if (!fs.inputItem) {
          this.inventory.removeItem(active.itemId, 1);
          fs.inputItem = { itemId: active.itemId, count: 1 };
        } else {
          // Swap back to inventory
          this.inventory.addItem(fs.inputItem.itemId, fs.inputItem.count);
          fs.inputItem = null;
        }
      } else if (fs.inputItem && !active) {
        this.inventory.addItem(fs.inputItem.itemId, fs.inputItem.count);
        fs.inputItem = null;
      }
      this.ui.updateFurnaceSlots(fs.inputItem, fs.fuelItem, fs.outputItem);
      this.refreshHotbar();
    };

    this.ui.onFurnaceFuelClick = () => {
      if (!this.openFurnaceKey) return;
      const fs = this.furnaceStates.get(this.openFurnaceKey)!;
      const active = this.inventory.getActiveItem();
      if (active && FUEL_TIMES[active.itemId]) {
        if (!fs.fuelItem) {
          this.inventory.removeItem(active.itemId, 1);
          fs.fuelItem = { itemId: active.itemId, count: 1 };
        } else {
          this.inventory.addItem(fs.fuelItem.itemId, fs.fuelItem.count);
          fs.fuelItem = null;
        }
      } else if (fs.fuelItem && !active) {
        this.inventory.addItem(fs.fuelItem.itemId, fs.fuelItem.count);
        fs.fuelItem = null;
      }
      this.ui.updateFurnaceSlots(fs.inputItem, fs.fuelItem, fs.outputItem);
      this.refreshHotbar();
    };

    this.ui.onFurnaceOutputClick = () => {
      if (!this.openFurnaceKey) return;
      const fs = this.furnaceStates.get(this.openFurnaceKey)!;
      if (fs.outputItem) {
        this.inventory.addItem(fs.outputItem.itemId, fs.outputItem.count);
        fs.outputItem = null;
        this.audio.play("pickup", 0.5);
        this.ui.updateFurnaceSlots(fs.inputItem, fs.fuelItem, fs.outputItem);
        this.refreshHotbar();
      }
    };

    this.ui.onFurnaceClose = () => {
      this.ui.showFurnace(false);
      this.openFurnaceKey = null;
      this.scene.lockPointer();
    };

    // Enchanting table
    this.ui.onEnchantPick = (index: number) => {
      if (index < 0) {
        // Item slot clicked — move active item in/out
        const active = this.inventory.getActiveItem();
        if (active) {
          this._enchantItem = { ...active };
          this.inventory.removeItem(active.itemId, 1);
          this.refreshHotbar();
        } else if (this._enchantItem) {
          this.inventory.addItem(this._enchantItem.itemId, this._enchantItem.count);
          this._enchantItem = null;
          this.refreshHotbar();
        }
        this._refreshEnchantUI();
        return;
      }
      if (!this._enchantItem) return;
      const opts = this._buildEnchantOptions(this._enchantItem);
      const chosen = opts[index];
      if (!chosen || this.player.level < chosen.cost) return;
      // Spend levels
      for (let i = 0; i < chosen.cost; i++) {
        if (this.player.level > 0) this.player.level--;
      }
      // Apply enchantment
      this._enchantItem.enchantments = [...(this._enchantItem.enchantments ?? []), chosen.id];
      // Return item with enchantment
      this.inventory.addItem(this._enchantItem.itemId, 1);
      // Patch back the enchantments onto the newly added stack
      const slot = this.inventory.hotbar.findIndex(s => s?.itemId === this._enchantItem!.itemId && !s.enchantments?.length);
      const bpSlot = this.inventory.backpack.findIndex(s => s?.itemId === this._enchantItem!.itemId && !s.enchantments?.length);
      if (slot >= 0) this.inventory.hotbar[slot]!.enchantments = this._enchantItem.enchantments;
      else if (bpSlot >= 0) this.inventory.backpack[bpSlot]!.enchantments = this._enchantItem.enchantments;
      this._enchantItem = null;
      this.audio.play("pickup", 0.7);
      this.refreshHotbar();
      this.refreshXPBar();
      this._refreshEnchantUI();
    };

    this.ui.onEnchantClose = () => {
      // Return item to inventory if any
      if (this._enchantItem) {
        this.inventory.addItem(this._enchantItem.itemId, this._enchantItem.count);
        this._enchantItem = null;
        this.refreshHotbar();
      }
      this.ui.showEnchanting(false);
      this.scene.lockPointer();
    };

    // UI restart
    this.ui.onRestart = () => this.resetGame();
  }

  // ─── Wave control ──────────────────────────────────────────────────────────

  private startNextWave(): void {
    this.phase = this.waves.isEndless ? "endless" : "playing";
    this.waves.startWave((type, gate) => this.spawnEnemy(type, gate));
    this.audio.play("wave_start");
    const endlessTag = this.waves.isEndless ? "★ ENDLESS — " : "";
    this.ui.setObjective(`${endlessTag}Wave ${this.waves.wave} — Defend the fortress!`);
    this.ui.updateWaveInfo(this.waves.wave, this.waves.totalWaves, 0, undefined, undefined, this.waves.isEndless);
    this.ui.showWaveAnnouncement(this.waves.wave, this.waves.isEndless);
  }

  private spawnEnemy(type: EnemyTypeName, gate: "north" | "south"): void {
    const positions = getSpawnPositions(gate);
    const [sx, sz]  = positions[Math.floor(Math.random() * positions.length)];

    // From wave 5+, non-boss enemies have a scaling chance to spawn as elites
    const eliteChance = type === "uruk_captain" ? 0
      : Math.min(0.4, (this.waves.wave - 4) * 0.08);   // 8% at wave 5, capping at 40%
    if (this.waves.wave >= 5 && Math.random() < eliteChance) {
      this.enemies.spawnElite(type, sx + 0.5, sz + 0.5);
    } else {
      this.enemies.spawn(type, sx + 0.5, sz + 0.5);
    }
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
    this.player.position.set(32, 7, 32);
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

  private _titleAngle = Math.PI * 1.25; // start angle for title camera orbit

  private update(dt: number): void {
    // Apply underwater fog before day/night (uses previous frame's water state)
    this.scene.setUnderwaterEffect(this._wasInWater);
    // Day/night cycle runs even while paused/locked
    this.scene.updateDayNight(dt);
    this.audio.updateAmbient(dt, this.scene.daylight);

    // Title screen orbit: slowly rotate camera around fortress when pointer not locked
    if (!this.scene.isPointerLocked && this.phase !== "gameover" && this.phase !== "win") {
      this._titleAngle += dt * 0.06;
      const r = 35, h = 26;
      const cx = 32, cz = 32;
      const cam = this.scene.camera;
      cam.position.set(
        cx + Math.cos(this._titleAngle) * r,
        h,
        cz + Math.sin(this._titleAngle) * r,
      );
      cam.lookAt(cx, 7, cz);
    }

    if (this.phase === "gameover" || this.phase === "win") return;

    // Tick all furnace states even when pointer unlocked
    this.updateFurnaces(dt);

    if (!this.scene.isPointerLocked || this.ui.isInventoryOpen() || this.ui.isWorkbenchOpen() || this.ui.isChestOpen() || this.ui.isFurnaceOpen()) return;
    // Recipe book doesn't pause gameplay, just a HUD overlay

    // Player movement + bow/crossbow charge accumulation
    const input = this.input.getMovementInput();
    this.player.update(dt, input);

    // Update crossbow loading HUD
    this.ui.updateCrossbowProgress(
      this.player.crossbowLoadProgress,
      this.player.isCrossbowLoading,
      this.player.isCrossbowLoaded,
    );

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
      } else if (this.phase === "playing" || this.phase === "endless") {
        this.waves.update(dt);
        this.updateCombat(dt);
        const count = this.enemies.getAliveEnemies().length;
        const prefix = this.phase === "endless" ? "★ ENDLESS — " : "";
        this.ui.setObjective(`${prefix}Defend the fortress! ${count} enemies remaining.`);
        if (this.phase === "endless") {
          this.ui.updateWaveInfo(this.waves.wave, this.waves.totalWaves, count, undefined, undefined, true);
        }
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
        this.scene.shake(0.05, 0.25);
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

    // Auto-save every 60 seconds while playing
    this._autoSaveTimer += dt;
    if (this._autoSaveTimer >= 60) {
      this._autoSaveTimer = 0;
      this.saveGame();
      this.ui.showContinueButton(true);
    }

    // Sprint / scope FOV
    const targetFOV = this.isSniperScoped ? 20 : (input.sprint && isMovingH ? 85 : 75);
    this.scene.setFOV(targetFOV, dt);

    // Gun cooldown
    this.gunCooldown = Math.max(0, this.gunCooldown - dt);
    this.scene.updateShake(dt);

    // Sync armor value each frame
    this.player.armorValue = this.inventory.getArmorValue();

    // Particles
    this.particles.update(dt);

    // Item entity drops
    this.updateItemEntities(dt);

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

    // Passive mobs
    this.passiveMobs.update(dt);
    this.enemies.setPlayerPosition(this.player.position.x, this.player.position.z, this.player.position.y);

    // Weather
    this.weather.update(dt, this.scene.camera);
    this.scene.setWeatherIntensity(this.weather.intensity);
    this.audio.setRainIntensity(this.weather.intensity);

    // HUD
    this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
    this.ui.updateDayClock(this.scene.dayTime);
    this.refreshHotbar();

    // Compass — extract yaw from camera quaternion
    const euler = new THREE.Euler().setFromQuaternion(this.scene.camera.quaternion, "YXZ");
    this.ui.updateCompass(euler.y);

    // Minimap — update every frame with enemy positions
    const enemyPositions = this.enemies.getAliveEnemies().map(e => {
      const p = this.enemies.getEnemyPosition(e.id);
      return p ? { x: p.x, z: p.z } : null;
    }).filter((p): p is {x: number; z: number} => p !== null);
    this.ui.updateMinimap(this.player.position.x, this.player.position.z, enemyPositions);

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

  // ─── Item entity drops ─────────────────────────────────────────────────────

  private spawnItemEntity(x: number, y: number, z: number, itemId: string): void {
    const def = ITEMS[itemId];
    if (!def) return;

    const size = 0.28;
    const color = def.color ?? 0x888888;
    const inner = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      new THREE.MeshLambertMaterial({ color }),
    );
    // Spin offset so items don't all start at the same angle
    inner.rotation.y = Math.random() * Math.PI * 2;

    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.add(inner);
    this.scene.scene.add(group);

    // Random sideways pop-out velocity
    const popAngle = Math.random() * Math.PI * 2;
    const spread = 0.6 + Math.random() * 0.6;
    const baseY = y;
    this.itemEntities.push({
      group,
      itemId,
      life: 0,
      bobPhase: Math.random() * Math.PI * 2,
      pullTimer: 0,
    });
    (group as any).__vx = Math.cos(popAngle) * spread;
    (group as any).__vz = Math.sin(popAngle) * spread;
    (group as any).__vy = 2.0;
    (group as any).__baseY = baseY;
  }

  private updateItemEntities(dt: number): void {
    const COLLECT_RADIUS = 1.6;
    const AUTO_COLLECT_TIME = 25;
    const pp = this.player.position;

    for (let i = this.itemEntities.length - 1; i >= 0; i--) {
      const e = this.itemEntities[i];
      e.life += dt;

      const g = e.group as any;
      // Pop-out physics for first 0.55 s — arc out and land back at baseY
      if (e.life < 0.55) {
        g.__vy -= 14 * dt;
        g.position.x += g.__vx * dt;
        g.position.z += g.__vz * dt;
        g.position.y += g.__vy * dt;
        // Clamp to baseY once gravity pulls below
        if (g.position.y < g.__baseY) {
          g.position.y = g.__baseY;
          g.__vy = 0;
        }
      }

      // Bob and spin
      e.bobPhase += dt * 2.5;
      const inner = e.group.children[0] as THREE.Mesh;
      inner.position.y = Math.sin(e.bobPhase) * 0.06;
      inner.rotation.y += dt * 2.2;

      // Pull toward player when close enough
      const dx = pp.x - e.group.position.x;
      const dy = pp.y + 0.5 - e.group.position.y;
      const dz = pp.z - e.group.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < COLLECT_RADIUS) {
        e.pullTimer += dt;
        const t = Math.min(1, e.pullTimer / 0.25);
        e.group.position.x += dx * t * dt * 12;
        e.group.position.y += dy * t * dt * 12;
        e.group.position.z += dz * t * dt * 12;
      }

      if (dist < 0.4 || e.life > AUTO_COLLECT_TIME) {
        this.inventory.addItem(e.itemId, 1);
        this.audio.play("pickup", 0.45);
        this.scene.scene.remove(e.group);
        inner.geometry.dispose();
        (inner.material as THREE.Material).dispose();
        this.itemEntities.splice(i, 1);
        this.refreshHotbar();
      }
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

  // ─── Enchanting table ─────────────────────────────────────────────────────

  private static readonly ENCHANT_POOL: Array<{
    id: string; name: string; cost: number;
    categories: string[]; // item categories this applies to
  }> = [
    { id: "sharpness_1",  name: "Sharpness I",       cost: 1, categories: ["weapon"] },
    { id: "sharpness_2",  name: "Sharpness II",      cost: 2, categories: ["weapon"] },
    { id: "efficiency_1", name: "Efficiency I",      cost: 1, categories: ["tool"] },
    { id: "efficiency_2", name: "Efficiency II",     cost: 2, categories: ["tool"] },
    { id: "protection_1", name: "Protection I",      cost: 1, categories: ["armor"] },
    { id: "protection_2", name: "Protection II",     cost: 2, categories: ["armor"] },
    { id: "unbreaking_1", name: "Unbreaking I",      cost: 1, categories: ["weapon", "tool", "armor"] },
    { id: "fortune_1",    name: "Fortune I",         cost: 2, categories: ["tool"] },
    { id: "power_1",      name: "Power I",           cost: 1, categories: ["weapon"] },
    { id: "fire_aspect",  name: "Fire Aspect I",     cost: 2, categories: ["weapon"] },
    { id: "thorns_1",     name: "Thorns I",          cost: 2, categories: ["armor"] },
    { id: "feather_fall", name: "Feather Falling I", cost: 1, categories: ["armor"] },
  ];

  private _buildEnchantOptions(item: import("./Inventory").ItemStack): Array<{ id: string; name: string; cost: number }> {
    const { ENCHANT_POOL } = Game;
    const itemDef = ITEMS[item.itemId];
    if (!itemDef) return [];
    const cat = itemDef.category;
    const valid = ENCHANT_POOL.filter(e =>
      e.categories.includes(cat) && !(item.enchantments ?? []).includes(e.id),
    );
    // Pick 3 deterministically shuffled by item + level
    const seed = (item.itemId.charCodeAt(0) + this.player.level * 7) % valid.length;
    const picked: typeof valid = [];
    for (let i = 0; i < Math.min(3, valid.length); i++) {
      picked.push(valid[(seed + i * 3) % valid.length]);
    }
    return picked;
  }

  private _openEnchantingTable(): void {
    this.scene.unlockPointer();
    this.ui.showEnchanting(true);
    this._refreshEnchantUI();
  }

  private _refreshEnchantUI(): void {
    const opts = this._enchantItem ? this._buildEnchantOptions(this._enchantItem) : [];
    this.ui.updateEnchanting(this._enchantItem, this.player.level, opts);
  }

  /** Returns bonus damage from enchantments on the given item. */
  getEnchantDamageBonus(item: import("./Inventory").ItemStack | null): number {
    if (!item?.enchantments) return 0;
    let bonus = 0;
    if (item.enchantments.includes("sharpness_1")) bonus += 2;
    if (item.enchantments.includes("sharpness_2")) bonus += 4;
    if (item.enchantments.includes("power_1"))     bonus += 2;
    return bonus;
  }

  // ─── Furnace smelting ─────────────────────────────────────────────────────

  private updateFurnaces(dt: number): void {
    for (const [key, fs] of this.furnaceStates) {
      if (!fs.inputItem || !SMELT_RECIPES[fs.inputItem.itemId]) continue;

      // Start burning fuel if idle
      if (fs.fuelRemaining <= 0 && fs.fuelItem) {
        const burnTime = FUEL_TIMES[fs.fuelItem.itemId] ?? 0;
        if (burnTime > 0) {
          fs.fuelRemaining = burnTime;
          fs.totalFuelTime = burnTime;
          fs.fuelItem      = null;
        }
      }

      if (fs.fuelRemaining <= 0) continue; // no fuel

      fs.fuelRemaining = Math.max(0, fs.fuelRemaining - dt);
      fs.smeltProgress = Math.min(1, fs.smeltProgress + dt / SMELT_TIME);

      if (fs.smeltProgress >= 1) {
        const result = SMELT_RECIPES[fs.inputItem.itemId];
        fs.smeltProgress = 0;
        fs.inputItem = null;
        if (fs.outputItem && fs.outputItem.itemId === result && fs.outputItem.count < 64) {
          fs.outputItem.count++;
        } else if (!fs.outputItem) {
          fs.outputItem = { itemId: result, count: 1 };
        }
        this.audio.play("pickup", 0.3);
      }

      // Live-update furnace UI if open
      if (this.openFurnaceKey === key) {
        this.ui.updateFurnaceSlots(fs.inputItem, fs.fuelItem, fs.outputItem);
        this.ui.updateFurnaceProgress(
          fs.smeltProgress,
          fs.totalFuelTime > 0 ? fs.fuelRemaining / fs.totalFuelTime : 0,
        );
      }
    }
  }

  // ─── Combat ────────────────────────────────────────────────────────────────

  private updateCombat(dt: number): void {
    this.enemies.update(dt);

    // Enemy melee — damage player when within 1.8 blocks, once per 1.5 s
    const pp = this.player.position;
    for (const state of this.enemies.getAliveEnemies()) {
      const pos = this.enemies.getEnemyPosition(state.id);
      if (!pos) continue;
      const dx = pp.x - pos.x, dz = pp.z - pos.z;
      if (dx * dx + dz * dz < 1.8 * 1.8) {
        const cd = this.enemyMeleeCooldown.get(state.id) ?? 0;
        if (cd <= 0) {
          this.player.damage(state.config.damage);
          this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
          this.ui.showDamageVignette();
          this.scene.shake(0.07, 0.3);
          this.audio.play("player_hurt", 0.65);
          this.enemyMeleeCooldown.set(state.id, 1.5);
        } else {
          this.enemyMeleeCooldown.set(state.id, cd - dt);
        }
      }
    }
    // Clean up cooldowns for dead/removed enemies
    for (const [id] of this.enemyMeleeCooldown) {
      if (!this.enemies.getEnemy(id)) this.enemyMeleeCooldown.delete(id);
    }

    this.projectiles.update(
      dt,
      (id)         => this.enemies.getEnemyPosition(id),
      (id, d, s, dur) => {
        this.enemies.damage(id, d, s, dur);
        const pos = this.enemies.getEnemyPosition(id);
        if (pos) this.showDamageNumber(d, pos.x, pos.y + 1.8, pos.z);
      },
      (c, r)       => this.enemies.getAliveEnemies()
        .filter(e => { const p = this.enemies.getEnemyPosition(e.id); return p ? p.distanceTo(c) <= r : false; })
        .map(e => e.id),
      ()           => this.enemies.getAliveEnemies().map(e => e.id),
    );
  }

  private spawnNightMob(): void {
    const types: EnemyTypeName[] = ["zombie", "spider", "goblin", "creeper", "skeleton"];
    const type  = types[Math.floor(Math.random() * types.length)];
    const angle = Math.random() * Math.PI * 2;
    const r     = 12 + Math.random() * 8;
    const sx    = Math.max(2, Math.min(61, this.player.position.x + Math.cos(angle) * r));
    const sz    = Math.max(2, Math.min(61, this.player.position.z + Math.sin(angle) * r));
    this.enemies.spawn(type, sx, sz);
  }

  private tryMeleeAttack(): void {
    if (this.phase !== "playing" && this.phase !== "endless" && this.mode !== "freeplay") return;
    const stack   = this.inventory.getActiveItem();
    const itemDef = stack ? ITEMS[stack.itemId] : null;
    const damage  = (itemDef?.damage ?? 1) + this.getEnchantDamageBonus(stack);

    const result = this.player.tryMeleeAttack();
    if (!result) return;

    this.audio.play("swing");
    this.scene.swingArm();
    let hitSomething = false;
    for (const state of this.enemies.getAliveEnemies()) {
      const pos = this.enemies.getEnemyPosition(state.id);
      if (pos && pos.distanceTo(result.center) <= result.radius) {
        this.enemies.damage(state.id, damage, 1, 0, true); // knockback on melee
        this.audio.play("hit", 0.4);
        this.showDamageNumber(damage, pos.x, pos.y + 1.8, pos.z);
        hitSomething = true;
      }
    }
    // Also check passive mobs (in free play)
    if (!hitSomething && this.mode === "freeplay") {
      const hit = this.passiveMobs.damage(result.center.x, result.center.z, damage, result.radius);
      if (hit) this.audio.play("hit", 0.35);
    }
  }

  private tryGunFire(def: ItemDef): void {
    if (this.phase !== "playing" && this.phase !== "endless" && this.mode !== "freeplay") return;
    if (this.gunCooldown > 0) return;

    const ammoId = def.ammoType;
    if (ammoId && !this.inventory.hasItem(ammoId, 1)) {
      this.ui.showBlockTooltip("No ammo!");
      setTimeout(() => this.ui.showBlockTooltip(null), 1200);
      return;
    }

    this.gunCooldown = def.gunCooldown ?? 1;
    const range      = def.gunRange ?? 30;
    const damage     = def.damage ?? 10;
    const isSniper   = def.id === "sniper_rifle";
    const isShotgun  = def.id === "shotgun";
    const isRaygun   = def.id === "raygun";

    const from = this.player.getCameraPosition();
    const dir  = this.player.getLookDirection();

    if (isShotgun) {
      this.fireShotgunPellets(from, dir, range, damage);
    } else if (isRaygun) {
      this.fireRaygunChain(from, dir, range, damage);
      this.audio.play("hit", 0.3);
    } else {
      const hitRadius = isSniper ? 1.2 : 0.85;
      let closestT  = range;
      let closestId = -1;

      for (const state of this.enemies.getAliveEnemies()) {
        const pos = this.enemies.getEnemyPosition(state.id);
        if (!pos) continue;
        const toEnemy = pos.clone().sub(from);
        const t       = toEnemy.dot(dir);
        if (t < 0 || t > range) continue;
        const closest = from.clone().addScaledVector(dir, t);
        if (closest.distanceTo(pos) < hitRadius && t < closestT) {
          closestT  = t;
          closestId = state.id;
        }
      }

      const hitPos = closestId >= 0 ? this.enemies.getEnemyPosition(closestId) : null;
      if (closestId >= 0 && hitPos) {
        this.enemies.damage(closestId, damage);
        this.showDamageNumber(damage, hitPos.x, hitPos.y + 1.8, hitPos.z);
        this.particles.spawnBulletImpact(hitPos.x, hitPos.y + 1, hitPos.z);
        this.audio.play("hit", isSniper ? 0.25 : 0.45);
      }

      if (isSniper) {
        const endPos = hitPos
          ? hitPos.clone().add(new THREE.Vector3(0, 1, 0))
          : from.clone().addScaledVector(dir, range);
        this.spawnTracerLine(from, endPos);
      }
    }

    if (ammoId) {
      this.inventory.removeItem(ammoId, 1);
      this.refreshHotbar();
    }

    // Muzzle flash: small bright burst just in front of the gun barrel
    const muzzlePos = from.clone().addScaledVector(dir, 0.7);
    this.particles.spawnMuzzleFlash(muzzlePos.x, muzzlePos.y, muzzlePos.z, dir);

    this.scene.swingArm();
    this.scene.shake(
      isSniper ? 0.18 : isShotgun ? 0.16 : isRaygun ? 0.06 : 0.05,
      isSniper ? 0.25 : isShotgun ? 0.22 : isRaygun ? 0.20 : 0.18,
    );
    this.audio.play(
      isSniper ? "sniper_fire" : isShotgun ? "shotgun_blast" : isRaygun ? "raygun_fire" : "pistol_shot",
      isSniper ? 0.9 : isShotgun ? 1.0 : isRaygun ? 0.95 : 0.85,
    );
  }

  /** Fire 6 spread pellets in a cone — each pellet can hit a different enemy. */
  private fireShotgunPellets(from: THREE.Vector3, dir: THREE.Vector3, range: number, totalDamage: number): void {
    const PELLETS   = 6;
    const SPREAD    = 0.13; // half-cone ~7.5 degrees
    const pelletDmg = Math.round(totalDamage / PELLETS);

    const right = new THREE.Vector3(-dir.z, 0, dir.x).normalize();
    const up    = new THREE.Vector3().crossVectors(right, dir).normalize();

    const hitDamageMap = new Map<number, number>();

    for (let p = 0; p < PELLETS; p++) {
      const sx = (Math.random() - 0.5) * 2 * SPREAD;
      const sy = (Math.random() - 0.5) * 2 * SPREAD;
      const pelletDir = dir.clone()
        .addScaledVector(right, Math.sin(sx))
        .addScaledVector(up,    Math.sin(sy))
        .normalize();

      let closestT  = range;
      let closestId = -1;

      for (const state of this.enemies.getAliveEnemies()) {
        const pos = this.enemies.getEnemyPosition(state.id);
        if (!pos) continue;
        const toEnemy = pos.clone().sub(from);
        const t       = toEnemy.dot(pelletDir);
        if (t < 0 || t > range) continue;
        const closest = from.clone().addScaledVector(pelletDir, t);
        if (closest.distanceTo(pos) < 0.9 && t < closestT) {
          closestT  = t;
          closestId = state.id;
        }
      }

      if (closestId >= 0) {
        hitDamageMap.set(closestId, (hitDamageMap.get(closestId) ?? 0) + pelletDmg);
      }
    }

    let anyHit = false;
    for (const [enemyId, dmg] of hitDamageMap) {
      this.enemies.damage(enemyId, dmg);
      const pos = this.enemies.getEnemyPosition(enemyId);
      if (pos) {
        this.showDamageNumber(dmg, pos.x, pos.y + 1.8, pos.z);
        this.particles.spawnBulletImpact(pos.x, pos.y + 1, pos.z);
        anyHit = true;
      }
    }
    if (anyHit) this.audio.play("hit", 0.55);
  }

  private spawnTracerLine(from: THREE.Vector3, to: THREE.Vector3, color = 0xffff88): void {
    const points = [from.clone(), to.clone()];
    const geo  = new THREE.BufferGeometry().setFromPoints(points);
    const mat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 });
    const line = new THREE.Line(geo, mat);
    this.scene.scene.add(line);
    let t = 0;
    const fade = () => {
      t += 0.016;
      mat.opacity = Math.max(0, 0.7 - t * 4);
      if (mat.opacity > 0) requestAnimationFrame(fade);
      else { this.scene.scene.remove(line); geo.dispose(); mat.dispose(); }
    };
    requestAnimationFrame(fade);
  }

  /** Chain lightning for raygun — up to 3 targets, decreasing damage per jump. */
  private fireRaygunChain(from: THREE.Vector3, dir: THREE.Vector3, range: number, damage: number): void {
    // Primary hit — closest enemy to ray
    let primaryId = -1;
    let primaryT  = range;
    for (const state of this.enemies.getAliveEnemies()) {
      const pos = this.enemies.getEnemyPosition(state.id);
      if (!pos) continue;
      const toEnemy = pos.clone().sub(from);
      const t = toEnemy.dot(dir);
      if (t < 0 || t > range) continue;
      const closest = from.clone().addScaledVector(dir, t);
      if (closest.distanceTo(pos) < 1.0 && t < primaryT) {
        primaryT  = t;
        primaryId = state.id;
      }
    }

    const chainRadius = 7;   // jump range between enemies
    const hitIds      = new Set<number>();
    const damages     = [damage, Math.round(damage * 0.6), Math.round(damage * 0.35)];

    let prevPos = from;
    let currentId = primaryId;

    for (let i = 0; i < 3; i++) {
      if (currentId === -1) break;
      const pos = this.enemies.getEnemyPosition(currentId);
      if (!pos) break;

      hitIds.add(currentId);
      const dmg = damages[i];
      this.enemies.damage(currentId, dmg);
      this.showDamageNumber(dmg, pos.x, pos.y + 1.8, pos.z);
      this.particles.spawnBulletImpact(pos.x, pos.y + 1, pos.z);
      this.spawnTracerLine(prevPos, pos.clone().add(new THREE.Vector3(0, 1, 0)), 0x00ccff);

      prevPos = pos.clone().add(new THREE.Vector3(0, 1, 0));

      // Find next chain target — closest unhit enemy within chainRadius
      let nextId = -1;
      let nextDist = chainRadius;
      for (const state of this.enemies.getAliveEnemies()) {
        if (hitIds.has(state.id)) continue;
        const npos = this.enemies.getEnemyPosition(state.id);
        if (!npos) continue;
        const d = pos.distanceTo(npos);
        if (d < nextDist) { nextDist = d; nextId = state.id; }
      }
      currentId = nextId;
    }
  }

  private unlockAchievement(id: string, title: string, desc: string): void {
    if (this._achievements.has(id)) return;
    this._achievements.add(id);
    this.ui.showAchievement(title, desc);
  }

  private showDamageNumber(amount: number, wx: number, wy: number, wz: number): void {
    const v = new THREE.Vector3(wx, wy, wz);
    v.project(this.scene.camera);
    if (v.z > 1) return; // behind camera
    const sx = (v.x * 0.5 + 0.5) * window.innerWidth;
    const sy = (-v.y * 0.5 + 0.5) * window.innerHeight;
    this.ui.showFloatingNumber(`-${amount}`, "#ff4444", sx, sy);
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
    if (lvl >= thresholds.length - 1) { this.ui.updateXP(1, 1, lvl + 1); return; }
    const lo = thresholds[lvl], hi = thresholds[lvl + 1];
    this.ui.updateXP(this.player.xp - lo, hi - lo, lvl + 1);
  }

  private refreshHotbar(): void {
    this.ui.updateHotbar(
      this.inventory.hotbar as (ItemStack | null)[],
      this.inventory.activeSlot,
    );
    const active = this.inventory.getActiveItem();
    this.scene.updateArmItem(active?.itemId ?? null);
    this.ui.updateItemTooltip(active?.itemId ?? null, active?.durability);

    // Ammo counter for guns
    const itemDef = active ? ITEMS[active.itemId] : null;
    if (itemDef?.ammoType) {
      const ammoCount = this.inventory.countItem(itemDef.ammoType);
      this.ui.updateAmmoDisplay(ammoCount);
    } else {
      this.ui.updateAmmoDisplay(null);
    }
  }

  // ─── Save / Load ──────────────────────────────────────────────────────────

  static hasSave(): boolean {
    return !!localStorage.getItem("craftdefense_save");
  }

  saveGame(): void {
    try {
      const save = {
        version: 1,
        mode: this.mode,
        wave: this.waves.wave,
        dayTime: this.scene.dayTime,
        playerHealth: this.player.health,
        playerHunger: this.player.hunger,
        playerXP: this.player.xp,
        playerLevel: this.player.level,
        playerPos: { x: this.player.position.x, y: this.player.position.y, z: this.player.position.z },
        hotbar: this.inventory.hotbar,
        backpack: this.inventory.backpack,
        armor: this.inventory.armor,
        chestStorage: Object.fromEntries(this.chestStorage),
        achievements: [...this._achievements],
      };
      localStorage.setItem("craftdefense_save", JSON.stringify(save));
    } catch { /* localStorage not available */ }
  }

  loadGame(): boolean {
    try {
      const raw = localStorage.getItem("craftdefense_save");
      if (!raw) return false;
      const save = JSON.parse(raw);
      if (save.version !== 1) return false;

      this.mode = save.mode ?? "helmsdeep";

      if (save.playerHealth !== undefined) {
        this.player.health = save.playerHealth;
        this.player.hunger = save.playerHunger ?? 20;
        this.player.xp     = save.playerXP ?? 0;
        this.player.level  = save.playerLevel ?? 0;
      }
      if (save.playerPos) {
        this.player.position.set(save.playerPos.x, save.playerPos.y, save.playerPos.z);
      }
      if (save.hotbar) {
        for (let i = 0; i < save.hotbar.length; i++) this.inventory.hotbar[i] = save.hotbar[i];
      }
      if (save.backpack) {
        for (let i = 0; i < save.backpack.length; i++) this.inventory.backpack[i] = save.backpack[i];
      }
      if (save.armor) {
        Object.assign(this.inventory.armor, save.armor);
      }
      if (save.chestStorage) {
        for (const [k, v] of Object.entries(save.chestStorage)) {
          this.chestStorage.set(k, v as any);
        }
      }
      if (save.achievements) {
        for (const ach of save.achievements) this._achievements.add(ach as string);
      }

      return true;
    } catch { return false; }
  }

  deleteSave(): void {
    localStorage.removeItem("craftdefense_save");
  }
}
