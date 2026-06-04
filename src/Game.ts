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
import { getSpawnPositions, DUNGEON_CHEST_POSITIONS, getBiomeAt } from "./WorldGen";
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

  // Torch point lights + visual meshes keyed by "wx,wy,wz"
  private readonly torchLights  = new Map<string, THREE.PointLight>();
  private readonly torchMeshes  = new Map<string, THREE.Group>();
  // Shared torch geometry/materials (created once)
  private readonly _torchStickGeo  = new THREE.BoxGeometry(0.09, 0.65, 0.09);
  private readonly _torchStickMat  = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
  private readonly _torchFlameMat  = new THREE.SpriteMaterial({
    map: Game.buildFlameTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  // Flame sprites for per-frame flicker animation
  private readonly _torchFlameMeshes: THREE.Sprite[] = [];

  // Best endless wave (persisted in localStorage)
  private _bestEndlessWave = parseInt(localStorage.getItem("craftdefense_best_endless") ?? "0", 10);

  // Primed TNT: key = "wx,wy,wz", mesh + light for blinking visual
  private readonly primedTNT = new Map<string, {
    timer: number;
    flashTimer: number;
    mesh: THREE.Mesh;
    light: THREE.PointLight;
  }>();

  // Lava block lights keyed by "wx,wy,wz"
  private readonly lavaLights = new Map<string, THREE.PointLight>();
  private _lavaParticleTimer = 0;
  private _lavaDamageTimer   = 0;

  // Lava spread: player-placed "source" blocks that periodically flow outward
  private readonly lavaSourceBlocks = new Set<string>();
  private _lavaSpreadTimer = 0;
  static readonly MAX_LAVA_BLOCKS = 80;

  // Fire spread: key = "wx,wy,wz", value = { burnTimer (remaining burn time), spreadTimer (time until next spread attempt) }
  private readonly activeFire = new Map<string, { burnTimer: number; spreadTimer: number }>();
  private readonly fireLights = new Map<string, THREE.PointLight>();
  private readonly fireMeshes = new Map<string, THREE.Mesh>();
  private _fireDamageTimer = 0;

  // Campfire lights + meshes keyed by "wx,wy,wz"
  private readonly campfireLights  = new Map<string, THREE.PointLight>();
  private readonly campfireMeshes  = new Map<string, THREE.Group>();
  private readonly _campfireFireMeshes: THREE.Mesh[] = [];

  // Fall damage tracking
  private _wasOnGround = true;

  // Hunger depletion timer
  private hungerTimer = 0;
  private _autoSaveTimer = 0;
  private _regenTimer = 0;
  private _stepTimer  = 0;
  private _footprintTimer = 0;
  private _headBob    = 0;
  private _wasInWater       = false;
  private _fogFarTarget  = 130;
  private _fogFarCurrent = 130;
  private _nightSpawnTimer  = 0;
  private _flowUpdateTimer  = 0;
  private _rainSplashTimer  = 0;
  private readonly activeCrops = new Map<string, number>(); // "x,y,z" → growth timer
  // Arrow dispensers: keyed by "wx,wy,wz", value = {x,y,z,timer}
  private readonly dispenserBlocks = new Map<string, { x: number; y: number; z: number; timer: number }>();
  // TNT fuses: keyed by "wx,wy,wz", value = {x,y,z,timer,flashTimer,displayN}
  private readonly tntFuses = new Map<string, { x: number; y: number; z: number; timer: number; flashTimer: number; displayN: number }>();
  // Floating countdown sprites above primed TNT blocks
  private readonly _tntCountdownSprites = new Map<string, THREE.Sprite>();
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

  // Fire Aspect burn tracker: enemy id → seconds remaining
  private readonly burningEnemies = new Map<number, number>();
  private _burnTickTimer   = 0;
  private _witherTickTimer = 0;


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

  // Thrown splash potions
  private readonly thrownPotions: Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    effect: string;
    magnitude: number;
    duration: number;
    life: number;
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
    this.initTorchLights();
    this.initCampfireLights();
    // Expose camera for screenshot tooling
    (window as any).__GAME_CAMERA__ = this.scene.camera;
    requestAnimationFrame(t => this.loop(t));
  }

  private initTorchLights(): void {
    const positions = this.gameMap.scanForBlock("torch");
    for (const [wx, wy, wz] of positions) this.addTorchLight(wx, wy, wz);
  }

  private initCampfireLights(): void {
    const positions = this.gameMap.scanForBlock("campfire");
    for (const [wx, wy, wz] of positions) this.addCampfireLight(wx, wy, wz);
  }

  // ─── System construction ───────────────────────────────────────────────────

  private buildSystems(): void {
    this.scene   = new SceneManager(this.container);
    this.gameMap = new GameMap(this.scene.scene);
    this.scene.setBlockTexture(this.gameMap.world.getBlockTexture());

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
    this.inventory.addItem("iron_bucket", 1);
    this.inventory.addItem("gunpowder", 10);
    this.inventory.addItem("sand", 8);
    // Starter potion ingredients so players can discover the system
    this.inventory.addItem("glass_bottle", 3);
    this.inventory.addItem("blaze_rod", 2);
    this.inventory.addItem("nether_wart", 4);

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
      [{ itemId:"diamond_ore",  count:2 }, { itemId:"iron_ingot", count:8 }, { itemId:"gold_ore", count:3 }, { itemId:"nether_wart", count:4 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      [{ itemId:"crossbow",     count:1 }, { itemId:"arrow_item", count:24 }, { itemId:"sniper_rifle", count:1 }, { itemId:"sniper_ammo", count:16 },
       { itemId:"pistol", count:1 }, { itemId:"bullet", count:16 }, { itemId:"shotgun", count:1 }, { itemId:"shotgun_shell", count:12 },
       { itemId:"raygun", count:1 }, { itemId:"energy_cell", count:6 }, { itemId:"blaze_rod", count:2 }, { itemId:"nether_wart", count:4 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      [{ itemId:"iron_sword",   count:1 }, { itemId:"glass_bottle", count:3 }, { itemId:"nether_wart", count:6 }, { itemId:"torch", count:8 },
       null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
      [{ itemId:"book",         count:2 }, { itemId:"blaze_rod", count:3 }, { itemId:"nether_wart", count:8 }, { itemId:"potion_healing", count:2 },
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
    this.scanWorldTorches();
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

      // Right-click TNT with flint_and_steel to ignite it
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "tnt") {
        if (stack?.itemId === "flint_and_steel" || stack?.itemId === "flint_steel") {
          const key = `${tb.wx},${tb.wy},${tb.wz}`;
          if (!this.tntFuses.has(key)) {
            this.tntFuses.set(key, { x: tb.wx, y: tb.wy, z: tb.wz, timer: 3.5, flashTimer: 0, displayN: 3 });
            this.spawnTNTSprite(key, tb.wx, tb.wy, tb.wz);
            this.audio.play("creeper_hiss", 0.6);
            this.ui.showAchievement("Boom!", "You lit a TNT block");
          }
          // Reduce flint_and_steel durability
          if (stack.durability !== undefined) {
            stack.durability = Math.max(0, stack.durability - 1);
            if (stack.durability <= 0) this.inventory.removeItem(stack.itemId, 1);
          }
          this.refreshHotbar();
          return;
        }
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

      // Arrow Dispenser info on right-click
      if (tb && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "dispenser") {
        const key = `${tb.wx},${tb.wy},${tb.wz}`;
        const d = this.dispenserBlocks.get(key);
        const status = d ? `Range: ${this.DISPENSER_RANGE}m · Damage: ${this.DISPENSER_DAMAGE} · Active` : "Inactive";
        this.ui.showAchievement("Arrow Dispenser", status);
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

      // Flint and Steel on TNT → prime it
      if (tb && itemDef?.id === "flint_steel" && this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "tnt") {
        this._primeTNT(tb.wx, tb.wy, tb.wz);
        this._damageHeldTool(stack!);
        return;
      }

      // Flint and Steel on flammable block → ignite fire on adjacent air face
      if (tb && itemDef?.id === "flint_steel") {
        const targetId = this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz);
        const FLAMMABLE: Set<string> = new Set(["wood", "planks", "leaves"]);
        if (FLAMMABLE.has(targetId)) {
          // Place fire on top of the flammable block if air
          const fy = tb.wy + 1;
          if (fy < 32 && this.gameMap.world.getBlock(tb.wx, fy, tb.wz) === "air") {
            this._igniteBlock(tb.wx, fy, tb.wz);
            this._damageHeldTool(stack!);
            this.audio.play("block_place", 0.6);
            this.unlockAchievement("playing_with_fire", "Playing with Fire", "Used Flint & Steel to ignite a block");
          }
          return;
        }
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
      } else if (itemDef?.category === "potion" && itemDef.potionEffect && stack) {
        this._drinkPotion(stack.itemId, itemDef);
      } else if (itemDef?.category === "food" && itemDef.foodPoints && this.player.hunger < 20) {
        this.inventory.removeItem(stack!.itemId, 1);
        this.player.hunger = Math.min(20, this.player.hunger + itemDef.foodPoints);
        this.player.heal(Math.ceil(itemDef.foodPoints / 2));
        this.audio.play("eat", 0.6);
        this.refreshHotbar();
        this.ui.updateHunger(this.player.hunger, 20);
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      } else if (itemDef?.id === "iron_bucket" && tb) {
        // Pick up lava with bucket
        if (this.gameMap.world.getBlock(tb.wx, tb.wy, tb.wz) === "lava") {
          this.gameMap.world.setBlock(tb.wx, tb.wy, tb.wz, "air");
          this.gameMap.world.rebuildDirtyChunks();
          this.removeLavaLight(tb.wx, tb.wy, tb.wz);
          this.lavaSourceBlocks.delete(`${tb.wx},${tb.wy},${tb.wz}`);
          this.inventory.removeItem("iron_bucket", 1);
          this.inventory.addItem("lava_bucket", 1);
          this.audio.play("block_place", 0.5);
          this.refreshHotbar();
        }
      } else if (itemDef?.id === "lava_bucket") {
        // Place lava using standard adjacent-block placement
        const placed = this.blockInteraction.tryPlace("lava");
        if (placed) {
          this.inventory.removeItem("lava_bucket", 1);
          this.inventory.addItem("iron_bucket", 1);
          this.refreshHotbar();
          // Add light at the placed position (tryPlace triggers onBlockPlaced which handles it)
        }
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
      this.particles.spawnBlockBreak(wx, wy, wz, blockColor, id);

      // Farming-specific drop handling
      if (id === "farmland" || id.startsWith("wheat_")) {
        if (yieldsDrops) this.handleFarmingBreak(wx, wy, wz, id);
        if (wy >= 1) this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
        return;
      }

      if (yieldsDrops) {
        const behavior = BLOCK_BEHAVIORS[id];
        const drops    = behavior?.drops ?? [id];
        const activeTool = this.inventory.getActiveItem();
        const hasFortune1 = activeTool?.enchantments?.includes("fortune_1") ?? false;
        const hasFortune2 = activeTool?.enchantments?.includes("fortune_2") ?? false;
        const ORE_BLOCKS = new Set(["iron_ore", "coal_ore", "gold_ore", "diamond_ore"]);
        const isOre = ORE_BLOCKS.has(id);
        const fortuneMult = hasFortune2 && isOre ? 3 : (hasFortune1 && isOre ? 2 : 1);
        for (const drop of drops) {
          if (ITEMS[drop]) {
            for (let i = 0; i < fortuneMult; i++) {
              this.spawnItemEntity(
                wx + 0.5 + (i > 0 ? (Math.random() - 0.5) * 0.3 : 0),
                wy + 0.7,
                wz + 0.5 + (i > 0 ? (Math.random() - 0.5) * 0.3 : 0),
                drop,
              );
            }
          }
        }
        if (fortuneMult > 1)
          this.ui.showFloatingNumber(`×${fortuneMult}`, "#aaff44", window.innerWidth / 2, window.innerHeight * 0.45);
      }
      if (id === "torch")    this.removeTorchLight(wx, wy, wz);
      if (id === "campfire") this.removeCampfireLight(wx, wy, wz);
      if (id === "lava")  { this.removeLavaLight(wx, wy, wz); this.lavaSourceBlocks.delete(`${wx},${wy},${wz}`); }
      if (id === "dispenser") this.dispenserBlocks.delete(`${wx},${wy},${wz}`);
      // TNT: re-place and start fuse instead of dropping item
      if (id === "tnt") {
        this.gameMap.world.setBlock(wx, wy, wz, "tnt");
        this.gameMap.world.rebuildDirtyChunks();
        const key = `${wx},${wy},${wz}`;
        if (!this.tntFuses.has(key)) {
          this.tntFuses.set(key, { x: wx, y: wy, z: wz, timer: 3.5, flashTimer: 0, displayN: 3 });
          this.spawnTNTSprite(key, wx, wy, wz);
          this.audio.play("creeper_hiss", 0.7);
        }
        return;
      }
      if (wy >= 1) this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);

      // Achievements
      if (id === "iron_ore") this.unlockAchievement("iron_ore", "Getting an Upgrade", "Mine your first iron ore");
      if (id === "coal_ore") this.unlockAchievement("coal_ore", "Hot Topic", "Mine your first coal");
      if (id === "diamond_ore") this.unlockAchievement("diamond_ore", "Diamonds!", "Find a rare diamond ore deposit");
    };

    this.blockInteraction.onBlockPlaced = (wx, wy, wz, id) => {
      this.audio.play("block_place", 0.5);
      if (id === "torch") this.addTorchLight(wx, wy, wz);
      if (id === "lava")  { this.addLavaLight(wx, wy, wz); this.lavaSourceBlocks.add(`${wx},${wy},${wz}`); }
      if (id === "dispenser") this.dispenserBlocks.set(`${wx},${wy},${wz}`, { x: wx, y: wy, z: wz, timer: 0.5 });
      this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
      this.refreshHotbar();
      if (id === "torch") this.unlockAchievement("torch_place", "Lighting the Way", "Place your first torch");
      if (id === "dispenser") this.unlockAchievement("dispenser_place", "Tower Defense", "Place your first Arrow Dispenser");
    };

    // Enemy events
    this.enemies.onEnemyDied = (state) => {
      const pos = this.enemies.getEnemyPosition(state.id);
      const isElite = state.elite === true;

      if (pos) {
        // Elite deaths leave extra particles and a golden flash
        const deathColor = isElite ? 0xff8800 : state.config.color;
        const deathType  = isElite ? undefined : state.config.type;
        this.particles.spawnEnemyDeath(pos.x, pos.y, pos.z, deathColor, deathType);
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
      if (state.config.type === "troll_king") {
        this.ui.hideBossHealthBar();
        this.unlockAchievement("boss_slain", "Kingslayer", "Slew the Troll King");
        this.scene.shake(0.30, 1.0);
      }
      if (state.config.drops && pos) {
        // Elites always drop their loot (100% chance each drop)
        const activeWeapon = this.inventory.getActiveItem();
        const hasLooting   = activeWeapon?.enchantments?.includes("looting_1") ?? false;
        const dropMultiplier = (isElite ? 2 : 1) + (hasLooting ? 1 : 0);
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
      const cam = this.scene.camera;
      this.particles.spawnArrowHit(cam.position.x, cam.position.y, cam.position.z);
      // Skeleton arrows apply Wither — 2 HP/s for 5 seconds
      this.player.applyEffect("wither", 5, 2);
      this.ui.showWitherIndicator();
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

    this.enemies.onBossWarCry = (_x, _z) => {
      this.ui.showBossWarCry();
      this.scene.shake(0.08, 0.4);
      this.audio.play("explosion", 0.25);
    };

    this.enemies.onBossSlam = (damage, bx, bz) => {
      const pp = this.player.position;
      const dx = pp.x - bx, dz = pp.z - bz;
      if (Math.sqrt(dx * dx + dz * dz) <= 7.0) {
        this.player.damage(damage);
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
        this.ui.showDamageVignette();
        this.scene.shake(0.20, 0.5);
        this.audio.play("player_hurt", 0.6);
      } else {
        this.scene.shake(0.10, 0.3);
      }
      this.particles.spawnExplosion(bx, 6, bz);
    };

    this.enemies.onCreeperExplode = (x, y, z, radius) => {
      this._doExplosion(x, y, z, radius, this.player.fireResistant ? 0 : 6);
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

    // Arrow hits a block — detonate TNT on contact
    this.projectiles.onPlayerArrowHitBlock = (bx, by, bz, blockId) => {
      if (blockId === "tnt") {
        this.gameMap.world.setBlock(bx, by, bz, "air");
        this.gameMap.world.rebuildDirtyChunks();
        this._doExplosion(bx + 0.5, by + 0.5, bz + 0.5, 4.5, 8);
      }
    };

    this.projectiles.onPlayerArrowHitEnemy = (x, y, z) => {
      this.particles.spawnArrowHit(x, y, z);
    };

    this.projectiles.onArrowTrail = (x, y, z, isBolt) => {
      this.particles.spawnArrowTrail(x, y, z, isBolt);
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
    this.scene.triggerWavePulse();
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
    this.dispenserBlocks.clear();
    this._tntCountdownSprites.forEach((_, k) => this.removeTNTSprite(k));
    this.tntFuses.clear();
    this.lavaSourceBlocks.clear();
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
    this.gameMap.updateFluidAnimation(dt);
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
      this.scene.hidePlayerShadow();
    }

    if (this.phase === "gameover" || this.phase === "win") return;

    // Tick all furnace states even when pointer unlocked
    this.updateFurnaces(dt);

    if (!this.scene.isPointerLocked || this.ui.isInventoryOpen() || this.ui.isWorkbenchOpen() || this.ui.isChestOpen() || this.ui.isFurnaceOpen()) return;
    // Recipe book doesn't pause gameplay, just a HUD overlay

    // Player movement + bow/crossbow charge accumulation
    const velYBefore  = this.player.velocity.y;
    const wasOnGround = this._wasOnGround;
    const input = this.input.getMovementInput();
    this.player.update(dt, input);

    // Fall damage — triggered when landing after a significant drop
    const justLanded = this.player.onGround && !wasOnGround && !this.player.inWater;
    if (justLanded) {
      const impactSpeed = -Math.min(velYBefore, 0); // m/s downward speed
      const SAFE_FALL   = 10; // no damage below this
      if (impactSpeed > SAFE_FALL) {
        let dmg = Math.floor((impactSpeed - SAFE_FALL) * 1.5);
        // Feather Falling I halves fall damage
        if (this.inventory.hasEnchantment("feather_fall")) dmg = Math.floor(dmg * 0.5);
        if (dmg > 0) {
          this.player.damage(dmg);
          this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
          this.ui.showDamageVignette();
          this.scene.shake(0.1, 0.35);
          this.audio.play("player_hurt", 0.7);
        }
      }
    }
    this._wasOnGround = this.player.onGround;

    // Player shadow blob — find ground surface directly below player and update blob
    {
      const ppx = this.player.position.x;
      const ppy = this.player.position.y;
      const ppz = this.player.position.z;
      let groundSurfY = 0;
      const startY = Math.max(0, Math.floor(ppy) - 1);
      for (let gy = startY; gy >= 0; gy--) {
        const bid = this.gameMap.world.getBlock(Math.floor(ppx), gy, Math.floor(ppz));
        if (bid !== "air" && !BLOCK_DEFS[bid]?.transparent) {
          groundSurfY = gy + 1.0;
          break;
        }
      }
      this.scene.updatePlayerShadow(ppx, groundSurfY, ppz, ppy - groundSurfY);
    }

    // Update crossbow loading HUD
    this.ui.updateCrossbowProgress(
      this.player.crossbowLoadProgress,
      this.player.isCrossbowLoading,
      this.player.isCrossbowLoaded,
    );

    // Water entry/exit effects
    const nowInWater = this.player.inWater;
    if (nowInWater && !this._wasInWater) {
      this.audio.play("splash", 0.8);
      const pp = this.player.position;
      this.particles.spawnSplashEffect(pp.x, pp.y + 0.5, pp.z);
    }
    this._wasInWater = nowInWater;

    // Lava damage — player takes 2 HP/s when in lava
    const playerFeetBlock = this.gameMap.world.getBlock(
      Math.floor(this.player.position.x),
      Math.floor(this.player.position.y),
      Math.floor(this.player.position.z),
    );
    const playerInLava = playerFeetBlock === "lava";
    this.scene.setInLavaEffect(playerInLava);
    if (playerInLava) {
      this._lavaDamageTimer += dt;
      if (this._lavaDamageTimer >= 1.0) {
        this._lavaDamageTimer = 0;
        this.player.damage(2);
        this.ui.showDamageVignette();
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      }
    } else {
      this._lavaDamageTimer = 0;
    }

    // Lava spread — source blocks flow outward every ~7 seconds
    this._lavaSpreadTimer += dt;
    if (this._lavaSpreadTimer >= 7.0) {
      this._lavaSpreadTimer = 0;
      this._spreadLava();
    }

    // Lava embers — spawn particles periodically from nearby lava blocks
    // Also: lava can ignite adjacent flammable blocks (low probability each tick)
    this._lavaParticleTimer += dt;
    if (this._lavaParticleTimer >= 0.25) {
      this._lavaParticleTimer = 0;
      const px = Math.floor(this.player.position.x);
      const pz = Math.floor(this.player.position.z);
      for (let dx = -6; dx <= 6; dx += 2) {
        for (let dz = -6; dz <= 6; dz += 2) {
          const lx = px + dx, lz = pz + dz;
          if (lx < 0 || lx >= 64 || lz < 0 || lz >= 64) continue;
          for (let ly = 3; ly <= 12; ly++) {
            if (this.gameMap.world.getBlock(lx, ly, lz) === "lava") {
              if (Math.random() < 0.35) {
                this.particles.spawnLavaEmbers(lx, ly, lz);
              }
              // Lava ignites adjacent flammable blocks (1.5% chance per tick)
              if (Math.random() < 0.015 && this.activeFire.size < Game.MAX_FIRE_BLOCKS) {
                const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
                const [rdx, rdz] = dirs[Math.floor(Math.random() * dirs.length)];
                const fx = lx + rdx, fz = lz + rdz;
                const fTop = ly + 1;
                if (fTop < 32 && Game.FLAMMABLE.has(this.gameMap.world.getBlock(fx, ly, fz))
                    && this.gameMap.world.getBlock(fx, fTop, fz) === "air") {
                  this._igniteBlock(fx, fTop, fz);
                }
              }
              break;
            }
          }
        }
      }
    }

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

    // Block interaction (mining) + haste/night-vision potion effects
    const activeStack = this.inventory.getActiveItem();
    this.blockInteraction.setActiveItem(activeStack);
    this.blockInteraction.hasteMultiplier = this.player.getHasteMult();
    this.scene.setNightVisionEffect(this.player.getNightVisionActive());
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

    // Regen potion effect — 1 HP every 2 seconds
    const regenEff = this.player.activeEffects.get("regen");
    if (regenEff && regenEff.duration > 0 && this.player.health < this.player.maxHealth) {
      this._regenTimer -= dt * 0.5; // heal 2x faster
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

    // Thrown splash potions
    this.updateThrownPotions(dt);

    // Wither DoT — 1 HP every 0.5s while active
    const witherEff = this.player.activeEffects.get("wither");
    if (witherEff && witherEff.duration > 0) {
      this._witherTickTimer += dt;
      if (this._witherTickTimer >= 0.5) {
        this._witherTickTimer -= 0.5;
        this.player.damage(1);
        this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
        this.ui.showDamageVignette();
      }
    } else {
      this._witherTickTimer = 0;
    }

    // Fire Aspect burn damage — 1 HP/s per burning enemy
    this.updateBurningEnemies(dt);

    // Fire spread and damage
    if (this.activeFire.size > 0) this._updateFire(dt);

    // Crop growth
    this.updateCrops(dt);

    // Arrow dispensers auto-shoot
    this.updateDispensers(dt);

    // TNT fuses countdown
    this.updateTNT(dt);

    // Torch flicker — per-torch random phase so all torches flicker independently
    if (this.torchLights.size > 0) {
      const t = performance.now() * 0.001;
      for (const light of this.torchLights.values()) {
        const p = (light.userData.flickerPhase as number) ?? 0;
        light.intensity = 1.6
          + Math.sin(t * 7.3  + p)       * 0.25
          + Math.sin(t * 12.1 + p * 1.7) * 0.12
          + Math.sin(t * 19.7 + p * 0.9) * 0.05; // third harmonic for organic crackle
      }
      // Flame sprites: each reads its own phase from userData (same phase as its sibling light)
      for (const flame of this._torchFlameMeshes) {
        const p = (flame.userData.flickerPhase as number) ?? 0;
        const fs = 1.0 + Math.sin(t * 9.1 + p) * 0.13 + Math.sin(t * 14.7 + p * 1.3) * 0.07;
        flame.scale.set(0.22 * fs, 0.32 * fs, 1);
      }
    }

    // Campfire flicker — richer oscillation than torches (bigger, more dramatic flame)
    if (this.campfireLights.size > 0) {
      const tc = performance.now() * 0.001;
      for (const light of this.campfireLights.values()) {
        const p = (light.userData.flickerPhase as number) ?? 0;
        light.intensity = 2.2
          + Math.sin(tc * 5.3  + p)       * 0.40
          + Math.sin(tc * 9.7  + p * 1.6) * 0.22
          + Math.sin(tc * 16.1 + p * 0.8) * 0.10;
      }
      // Animate fire cross-planes: scale + slow rotation for dancing flame effect
      for (const fire of this._campfireFireMeshes) {
        const p = (fire.userData.flickerPhase as number) ?? 0;
        fire.rotation.y = tc * 1.1 + p;
        fire.scale.y = 0.88 + Math.sin(tc * 10.3 + p) * 0.15 + Math.sin(tc * 6.7 + p * 1.4) * 0.08;
        fire.scale.x = 0.92 + Math.sin(tc * 7.1  + p * 0.9) * 0.07;
      }
    }

    // Lava light pulse — sync all lava PointLights to the bubbling emissive rhythm
    if (this.lavaLights.size > 0) {
      const glow = this.gameMap.lavaGlow;
      for (const light of this.lavaLights.values()) {
        light.intensity = 1.8 + glow * 1.4; // range: ~2.2–2.9
      }
    }

    // Water sky tint — at dawn/noon/dusk the water surface picks up the sky color
    {
      const skyBg = this.scene.scene.background as THREE.Color;
      this.gameMap.setWaterSkyTint(skyBg.r, skyBg.g, skyBg.b, this.scene.daylight);
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

    // Primed TNT countdown
    if (this.primedTNT.size > 0) this._updatePrimedTNT(dt);

    // Passive mobs
    this.passiveMobs.update(dt);
    this.enemies.setPlayerPosition(this.player.position.x, this.player.position.z, this.player.position.y);

    // Troll King boss health bar (shown via the existing boss bar UI)
    const boss = this.enemies.getBossState();
    if (boss) {
      this.ui.showBossHealthBar("☠ TROLL KING ☠", boss.state.health / boss.state.config.maxHealth);
    }

    // Weather
    this.weather.update(dt, this.scene.camera);
    this.scene.setWeatherIntensity(this.weather.intensity);
    this.audio.setRainIntensity(this.weather.intensity);
    this.gameMap.world.setWetness(this.weather.intensity);

    // Rain ground splashes — spawn tiny water-ring particles around the player when raining
    if (this.weather.intensity > 0.1) {
      this._rainSplashTimer -= dt;
      if (this._rainSplashTimer <= 0) {
        this._rainSplashTimer = 0.08 + Math.random() * 0.06;
        const cx = this.player.position.x;
        const cy = this.player.position.y - 1.7;
        const cz = this.player.position.z;
        const splashCount = Math.round(this.weather.intensity * 8);
        for (let s = 0; s < splashCount; s++) {
          const sx = cx + (Math.random() - 0.5) * 14;
          const sz = cz + (Math.random() - 0.5) * 14;
          this.particles.spawnRainSplash(sx, cy, sz);
        }
      }
    }

    // Biome-specific fog distance + sky tint: desert=clearer/warmer, taiga=mistier/cooler
    const biome = getBiomeAt(this.player.position.x, this.player.position.z);
    const biomeFogFar = biome === "desert" ? 165 : biome === "taiga" ? 115 : 130;
    this._fogFarTarget = biomeFogFar;
    this._fogFarCurrent += (this._fogFarTarget - this._fogFarCurrent) * Math.min(1, dt * 0.5);
    this.scene.setFogFarBase(this._fogFarCurrent);
    this.scene.setBiome(biome);

    // HUD
    this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
    this.ui.updateDayClock(this.scene.dayTime);
    this.ui.updateActiveEffects(this.player.activeEffects);
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

  // ─── Fire Aspect ────────────────────────────────────────────────────────────

  private updateBurningEnemies(dt: number): void {
    if (this.burningEnemies.size === 0) return;
    this._burnTickTimer += dt;
    const burnDt = 1.0; // damage once per second
    if (this._burnTickTimer < burnDt) return;
    this._burnTickTimer -= burnDt;

    for (const [id, remaining] of this.burningEnemies) {
      const newRemaining = remaining - burnDt;
      if (newRemaining <= 0) {
        this.burningEnemies.delete(id);
      } else {
        this.burningEnemies.set(id, newRemaining);
      }
      // Apply burn damage
      const state = this.enemies.getEnemy(id);
      if (!state || !state.alive || state.dying) { this.burningEnemies.delete(id); continue; }
      this.enemies.damage(id, 2);
      // Spawn small flame particles on the burning enemy
      const pos = this.enemies.getEnemyPosition(id);
      if (pos) this.particles.spawnBlockBreak(pos.x, pos.y + 1, pos.z, 0xff4400);
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

  private readonly DISPENSER_RANGE    = 14;
  private readonly DISPENSER_INTERVAL = 2.0;
  private readonly DISPENSER_DAMAGE   = 5;

  private updateDispensers(dt: number): void {
    if (this.dispenserBlocks.size === 0) return;
    for (const [, d] of this.dispenserBlocks) {
      d.timer -= dt;
      if (d.timer > 0) continue;
      d.timer = this.DISPENSER_INTERVAL;

      // Find nearest enemy in range
      const from = new THREE.Vector3(d.x + 0.5, d.y + 0.8, d.z + 0.5);
      let nearestId   = -1;
      let nearestDist = this.DISPENSER_RANGE;
      for (const enemy of this.enemies.getAliveEnemies()) {
        const pos = this.enemies.getEnemyPosition(enemy.id);
        if (!pos) continue;
        const dist = from.distanceTo(pos);
        if (dist < nearestDist) { nearestDist = dist; nearestId = enemy.id; }
      }
      if (nearestId < 0) continue;

      this.projectiles.fire("arrow", from, nearestId, this.DISPENSER_DAMAGE, 12);
      this.audio.play("arrow_release", 0.25);
      // Small flash at the dispenser front face
      this.particles.spawnBlockBreak(d.x, d.y, d.z, 0xffdd88);
    }
  }

  private updateTNT(dt: number): void {
    if (this.tntFuses.size === 0) return;
    for (const [key, tnt] of this.tntFuses) {
      tnt.timer     -= dt;
      tnt.flashTimer -= dt;
      if (tnt.flashTimer <= 0) {
        tnt.flashTimer = 0.3;
        this.particles.spawnBlockBreak(tnt.x, tnt.y + 0.5, tnt.z, 0xff5533);
      }
      // Update countdown sprite when displayed second changes
      const newDisplayN = Math.max(1, Math.min(3, Math.ceil(tnt.timer)));
      if (newDisplayN !== tnt.displayN) {
        tnt.displayN = newDisplayN;
        this.updateTNTSprite(key, newDisplayN);
      }
      if (tnt.timer > 0) continue;
      // Explode
      this.removeTNTSprite(key);
      this.tntFuses.delete(key);
      this.gameMap.world.setBlock(tnt.x, tnt.y, tnt.z, "air");
      this.gameMap.world.rebuildDirtyChunks();
      this.triggerExplosion(tnt.x + 0.5, tnt.y + 0.5, tnt.z + 0.5, 4.5, 14, 0.6);
    }
  }

  private triggerExplosion(x: number, y: number, z: number, radius: number, maxDamage: number, shakeAmt: number): void {
    this.audio.play("explosion", 0.9);
    this.scene.shake(shakeAmt, 0.7);
    this.particles.spawnExplosion(x, y, z);

    // Damage enemies
    for (const enemy of this.enemies.getAliveEnemies()) {
      const pos = this.enemies.getEnemyPosition(enemy.id);
      if (!pos) continue;
      const dist = pos.distanceTo(new THREE.Vector3(x, y, z));
      if (dist > radius) continue;
      const dmg = Math.round(maxDamage * (1 - dist / radius)) + 4;
      this.enemies.damage(enemy.id, dmg, 1, 0);
      const ep = this.enemies.getEnemyPosition(enemy.id);
      if (ep) this.showDamageNumber(dmg, ep.x, ep.y + 1.8, ep.z);
    }

    // Damage player if nearby
    const pp  = this.player.position;
    const pdx = pp.x - x, pdy = pp.y - y, pdz = pp.z - z;
    if (Math.sqrt(pdx*pdx + pdy*pdy + pdz*pdz) <= radius + 1) {
      const dmg = Math.round(maxDamage * 0.5);
      this.player.damage(dmg);
      this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      this.ui.showDamageVignette();
    }

    // Break blocks
    for (let bx = Math.floor(x - radius); bx <= Math.ceil(x + radius); bx++) {
      for (let by = Math.max(0, Math.floor(y - radius)); by <= Math.ceil(y + radius); by++) {
        for (let bz = Math.floor(z - radius); bz <= Math.ceil(z + radius); bz++) {
          const dx = bx - x, dy2 = by - y, dz = bz - z;
          if (dx*dx + dy2*dy2 + dz*dz > radius*radius) continue;
          const block = this.gameMap.world.getBlock(bx, by, bz);
          if (block === "air" || block === "bedrock") continue;
          if (Math.random() < 0.55) this.gameMap.world.setBlock(bx, by, bz, "air");
        }
      }
    }
    this.gameMap.world.rebuildDirtyChunks();
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
    { id: "fortune_2",    name: "Fortune II",        cost: 3, categories: ["tool"] },
    { id: "power_1",      name: "Power I",           cost: 1, categories: ["weapon"] },
    { id: "fire_aspect",  name: "Fire Aspect I",     cost: 2, categories: ["weapon"] },
    { id: "looting_1",   name: "Looting I",         cost: 2, categories: ["weapon"] },
    { id: "thorns_1",    name: "Thorns I",          cost: 2, categories: ["armor"] },
    { id: "feather_fall",name: "Feather Falling I", cost: 1, categories: ["armor"] },
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

    // Enemy footprint decals — dark fading circles under moving enemies
    this._footprintTimer += dt;
    if (this._footprintTimer >= 0.35) {
      this._footprintTimer -= 0.35;
      for (const state of this.enemies.getAliveEnemies()) {
        if (!state.alive || state.dying) continue;
        const pos = this.enemies.getEnemyPosition(state.id);
        if (!pos) continue;
        this.particles.spawnFootprint(pos.x, pos.y - 0.9, pos.z);
      }
    }

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
          // Thorns I — reflect 2 damage back to attacker
          if (this.inventory.hasEnchantment("thorns_1")) {
            this.enemies.damage(state.id, 2);
            this.particles.spawnBlockBreak(pos.x, pos.y + 1, pos.z, 0xff6600);
          }
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

    // Enemy lava damage — 1 damage per second when standing in lava
    for (const state of this.enemies.getAliveEnemies()) {
      const pos = this.enemies.getEnemyPosition(state.id);
      if (!pos) continue;
      const bx = Math.floor(pos.x), by = Math.floor(pos.y), bz = Math.floor(pos.z);
      if (this.gameMap.world.getBlock(bx, by, bz) === "lava" ||
          this.gameMap.world.getBlock(bx, by - 1, bz) === "lava") {
        this.enemies.damage(state.id, dt * 2);
      }
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
      (x, y, z)   => this.gameMap.world.getBlock(x, y, z),
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
    const damage  = Math.ceil(((itemDef?.damage ?? 1) + this.getEnchantDamageBonus(stack)) * this.player.strengthMult);

    const result = this.player.tryMeleeAttack();
    if (!result) return;

    this.audio.play("swing");
    this.scene.swingArm();
    const hasFireAspect = stack?.enchantments?.includes("fire_aspect") ?? false;
    let hitSomething = false;
    for (const state of this.enemies.getAliveEnemies()) {
      const pos = this.enemies.getEnemyPosition(state.id);
      if (pos && pos.distanceTo(result.center) <= result.radius) {
        this.enemies.damage(state.id, damage, 1, 0, true); // knockback on melee
        this.audio.play("hit", 0.4);
        this.showDamageNumber(damage, pos.x, pos.y + 1.8, pos.z);
        this.particles.spawnMeleeHit(pos.x, pos.y + 1.0, pos.z);
        hitSomething = true;
        if (hasFireAspect) {
          // Set enemy on fire for 4 seconds
          this.burningEnemies.set(state.id, Math.max(this.burningEnemies.get(state.id) ?? 0, 4));
        }
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

  private _drinkPotion(itemId: string, itemDef: import("./config/items").ItemDef): void {
    if (!itemDef.potionEffect) return;
    const effect = itemDef.potionEffect;
    const duration = itemDef.potionDuration ?? 0;
    const power = itemDef.potionPower ?? 1;
    if (itemDef.potionSplash) {
      this.throwSplashPotion(effect, duration, power);
      this.inventory.removeItem(itemId, 1);
      this.refreshHotbar();
      return;
    }
    this.player.applyPotionEffect(effect, duration, power);
    if (effect === "healing") {
      this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      this.particles.spawnHealEffect(
        this.player.position.x,
        this.player.position.y + 1,
        this.player.position.z,
      );
    }
    this.inventory.removeItem(itemId, 1);
    this.audio.play("eat", 0.7);
    this.refreshHotbar();
    this.ui.updateActiveEffects(this.player.activeEffects);
    this.unlockAchievement("first_potion", "Alchemist", "Drank your first potion");
  }

  private throwSplashPotion(effect: string, duration: number, magnitude: number): void {
    const geo = new THREE.SphereGeometry(0.12, 6, 6);
    const color = effect === "slowness" ? 0x44aaff : 0xff88ff;
    const mat = new THREE.MeshLambertMaterial({ color, transparent: true, opacity: 0.85 });
    const mesh = new THREE.Mesh(geo, mat);
    const from = this.player.getCameraPosition();
    mesh.position.copy(from);
    this.scene.scene.add(mesh);
    const dir = this.player.getLookDirection().multiplyScalar(12);
    dir.y += 3;
    this.thrownPotions.push({ mesh, velocity: dir, effect, magnitude, duration, life: 5 });
    this.audio.play("arrow_release", 0.5);
  }

  private updateThrownPotions(dt: number): void {
    const GRAVITY = 20;
    for (let i = this.thrownPotions.length - 1; i >= 0; i--) {
      const p = this.thrownPotions[i];
      p.life -= dt;
      p.velocity.y -= GRAVITY * dt;
      p.mesh.position.addScaledVector(p.velocity, dt);

      const bx = Math.floor(p.mesh.position.x);
      const by = Math.floor(p.mesh.position.y - 0.1);
      const bz = Math.floor(p.mesh.position.z);
      const hitGround = by >= 0 && by < 32 &&
        this.gameMap.world.getBlock(bx, by, bz) !== "air" &&
        this.gameMap.world.getBlock(bx, by, bz) !== "water";

      if (hitGround || p.life <= 0) {
        this.splashPotionImpact(p.mesh.position, p.effect, p.duration, p.magnitude);
        this.scene.scene.remove(p.mesh);
        (p.mesh.material as THREE.Material).dispose();
        p.mesh.geometry.dispose();
        this.thrownPotions.splice(i, 1);
      }
    }
  }

  private splashPotionImpact(pos: THREE.Vector3, effect: string, duration: number, magnitude: number): void {
    const RADIUS = 4;
    this.particles.spawnSplashEffect(pos.x, pos.y, pos.z);
    this.audio.play("splash", 0.7);
    for (const state of this.enemies.getAliveEnemies()) {
      const epos = this.enemies.getEnemyPosition(state.id);
      if (epos && epos.distanceTo(pos) <= RADIUS) {
        if (effect === "slowness") {
          this.enemies.damage(state.id, 0, magnitude, duration);
        }
      }
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

  /** Build a 16×32 canvas flame texture: yellow base → orange → red tip, alpha cutout edges. */
  // -------------------------------------------------------------------------
  // TNT countdown sprite helpers
  // -------------------------------------------------------------------------

  private static makeTNTCountdownCanvas(n: number): HTMLCanvasElement {
    const size = 64;
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d")!;
    const cx2 = size / 2;
    // Coloured ring — red for 1, orange for 2, yellow for 3
    const ringColor = n <= 1 ? "#ff2200" : n <= 2 ? "#ff6600" : "#ffaa00";
    ctx.beginPath();
    ctx.arc(cx2, cx2, cx2 - 3, 0, Math.PI * 2);
    ctx.fillStyle = n <= 1 ? "rgba(200,30,0,0.82)" : n <= 2 ? "rgba(200,80,0,0.78)" : "rgba(160,60,0,0.72)";
    ctx.fill();
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    // Big bold digit
    ctx.save();
    ctx.shadowColor = ringColor;
    ctx.shadowBlur = 10;
    ctx.fillStyle = "#ffe080";
    ctx.font = `bold ${Math.round(size * 0.62)}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(n), cx2, cx2 + 2);
    ctx.restore();
    return c;
  }

  private spawnTNTSprite(key: string, wx: number, wy: number, wz: number): void {
    const canvas = Game.makeTNTCountdownCanvas(3);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.setScalar(0.8);
    sprite.position.set(wx + 0.5, wy + 1.6, wz + 0.5);
    this.scene.scene.add(sprite);
    this._tntCountdownSprites.set(key, sprite);
  }

  private updateTNTSprite(key: string, n: number): void {
    const sprite = this._tntCountdownSprites.get(key);
    if (!sprite) return;
    const mat = sprite.material as THREE.SpriteMaterial;
    if (mat.map) mat.map.dispose();
    mat.map = new THREE.CanvasTexture(Game.makeTNTCountdownCanvas(n));
    mat.needsUpdate = true;
    sprite.scale.setScalar(0.7 + (3 - n) * 0.12);
  }

  private removeTNTSprite(key: string): void {
    const sprite = this._tntCountdownSprites.get(key);
    if (!sprite) return;
    const mat = sprite.material as THREE.SpriteMaterial;
    if (mat.map) mat.map.dispose();
    mat.dispose();
    this.scene.scene.remove(sprite);
    this._tntCountdownSprites.delete(key);
  }

  private static buildFlameTexture(): THREE.CanvasTexture {
    const W = 16, H = 32;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;

    // Seeded noise for jagged flame tip
    let seed = 0xdeadbeef;
    const rand = () => { seed = (seed * 1664525 + 1013904223) & 0xffffffff; return (seed >>> 0) / 0xffffffff; };

    for (let cy = 0; cy < H; cy++) {
      // t = 0 at canvas top (flame tip), 1 at canvas bottom (flame base)
      // Three.js CanvasTexture flips Y so canvas top → UV top → sprite top ✓
      const t = (H - 1 - cy) / (H - 1);
      const halfWidth = Math.sqrt(t) * (W * 0.48);
      // Jagged top edge for flame tips
      const jag = t < 0.25 ? (rand() - 0.5) * 3 * (1 - t / 0.25) : 0;
      for (let cx = 0; cx < W; cx++) {
        const dist = Math.abs(cx - (W / 2 - 0.5));
        const hw = halfWidth + jag;
        if (dist >= hw || hw <= 0) continue;
        const edge = Math.max(0, 1 - dist / hw);
        // Color: warm yellow base → orange middle → orange-red tip
        const gChannel = Math.max(0, Math.min(255, Math.round(80 + 175 * t)));
        const bChannel = Math.max(0, Math.round(20 * t));
        const alpha = Math.round(Math.pow(edge, 0.6) * (0.25 + 0.75 * Math.sqrt(t)) * 255);
        const idx = (cy * W + cx) * 4;
        data[idx]     = 255;
        data[idx + 1] = gChannel;
        data[idx + 2] = bChannel;
        data[idx + 3] = alpha;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }

  private torchKey(wx: number, wy: number, wz: number): string {
    return `${wx},${wy},${wz}`;
  }

  /** Scan the voxel world for pre-generated torch blocks and add point lights. */
  private scanWorldTorches(): void {
    const world = this.gameMap.world;
    for (let wx = 0; wx < 64; wx++) {
      for (let wz = 0; wz < 64; wz++) {
        for (let wy = 1; wy < 32; wy++) {
          if (world.getBlock(wx, wy, wz) === "torch") {
            this.addTorchLight(wx, wy, wz);
          }
        }
      }
    }
  }

  private addTorchLight(wx: number, wy: number, wz: number): void {
    const key = this.torchKey(wx, wy, wz);
    if (this.torchLights.has(key)) return;

    // Point light — warm orange glow with unique flicker phase per torch
    const light = new THREE.PointLight(0xffaa44, 1.8, 10, 2);
    light.position.set(wx + 0.5, wy + 0.8, wz + 0.5);
    const flickerPhase = Math.random() * Math.PI * 2;
    light.userData.flickerPhase = flickerPhase;
    this.scene.scene.add(light);
    this.torchLights.set(key, light);

    // Visual torch: wooden stick + billboard flame sprite
    const group = new THREE.Group();
    const stick = new THREE.Mesh(this._torchStickGeo, this._torchStickMat);
    stick.position.set(0, 0.325, 0);
    group.add(stick);

    // Sprite origin is at its center; position 0.72 + half-height so base aligns with stick tip
    const flame = new THREE.Sprite(this._torchFlameMat);
    flame.userData.flickerPhase = flickerPhase; // same phase as sibling light
    flame.scale.set(0.22, 0.32, 1);
    flame.position.set(0, 0.72 + 0.16, 0);
    group.add(flame);
    this._torchFlameMeshes.push(flame);

    group.position.set(wx + 0.5, wy, wz + 0.5);
    this.scene.scene.add(group);
    this.torchMeshes.set(key, group);
  }

  private removeTorchLight(wx: number, wy: number, wz: number): void {
    const key = this.torchKey(wx, wy, wz);
    const light = this.torchLights.get(key);
    if (light) {
      this.scene.scene.remove(light);
      light.dispose();
      this.torchLights.delete(key);
    }
    const mesh = this.torchMeshes.get(key);
    if (mesh) {
      // Remove flame sprite from flicker list
      const flame = mesh.children[1] as THREE.Sprite | undefined;
      if (flame) {
        const idx = this._torchFlameMeshes.indexOf(flame);
        if (idx !== -1) this._torchFlameMeshes.splice(idx, 1);
      }
      this.scene.scene.remove(mesh);
      this.torchMeshes.delete(key);
    }
  }

  private addCampfireLight(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    if (this.campfireLights.has(key)) return;

    const flickerPhase = Math.random() * Math.PI * 2;

    // PointLight — richer orange-red than torches, wider radius
    const light = new THREE.PointLight(0xff4400, 2.4, 9, 2);
    light.position.set(wx + 0.5, wy + 0.9, wz + 0.5);
    light.userData.flickerPhase = flickerPhase;
    this.scene.scene.add(light);
    this.campfireLights.set(key, light);

    const group = new THREE.Group();
    const cx = wx + 0.5, cy = wy, cz = wz + 0.5;

    // Stone ring — 4 rounded stones at N/S/E/W positions
    const stoneGeo  = new THREE.BoxGeometry(0.20, 0.14, 0.20);
    const stoneMat  = new THREE.MeshLambertMaterial({ color: 0x888878 });
    const stoneOffsets: [number, number][] = [[0, -0.33], [0, 0.33], [-0.33, 0], [0.33, 0]];
    for (const [ox, oz] of stoneOffsets) {
      const s = new THREE.Mesh(stoneGeo, stoneMat);
      s.position.set(ox, 0.07, oz);
      s.castShadow = true;
      group.add(s);
    }

    // Crossed log base
    const logMat = new THREE.MeshLambertMaterial({ color: 0x5a2a0a });
    const logX   = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.09, 0.11), logMat);
    logX.position.set(0, 0.055, 0);
    logX.castShadow = true;
    group.add(logX);
    const logZ   = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.58), logMat);
    logZ.position.set(0, 0.055, 0);
    logZ.castShadow = true;
    group.add(logZ);

    // Char embers at center — dark with warm emissive glow
    const emberMat  = new THREE.MeshLambertMaterial({ color: 0x1a0800, emissive: new THREE.Color(0x661100), emissiveIntensity: 0.7 });
    const ember     = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.26), emberMat);
    ember.position.set(0, 0.075, 0);
    group.add(ember);

    // Animated fire cross-planes — two quads crossing at 90°
    const hw = 0.40, hh = 0.52;
    const firePos = new Float32Array([
      -hw, 0,   0,   hw, 0,   0,   hw, hh, 0,   -hw, hh, 0,   // plane along X
       0,  0,  -hw,   0, 0,   hw,   0, hh, hw,    0, hh, -hw, // plane along Z
    ]);
    const fireIdx = new Uint16Array([
      0,1,2, 0,2,3, 2,1,0, 3,2,0,
      4,5,6, 4,6,7, 6,5,4, 7,6,4,
    ]);
    const fireGeo = new THREE.BufferGeometry();
    fireGeo.setAttribute("position", new THREE.BufferAttribute(firePos, 3));
    fireGeo.setIndex(new THREE.BufferAttribute(fireIdx, 1));
    const fireMat = new THREE.MeshBasicMaterial({
      color: 0xff6622, transparent: true, opacity: 0.92,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const fireMesh = new THREE.Mesh(fireGeo, fireMat);
    fireMesh.position.set(0, 0.12, 0);
    fireMesh.userData.flickerPhase = flickerPhase;
    group.add(fireMesh);
    this._campfireFireMeshes.push(fireMesh);

    group.position.set(cx, cy, cz);
    this.scene.scene.add(group);
    this.campfireMeshes.set(key, group);
  }

  private removeCampfireLight(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    const light = this.campfireLights.get(key);
    if (light) {
      this.scene.scene.remove(light);
      light.dispose();
      this.campfireLights.delete(key);
    }
    const mesh = this.campfireMeshes.get(key);
    if (mesh) {
      // Remove fire mesh from animation list
      for (const child of mesh.children) {
        if (child instanceof THREE.Mesh) {
          const idx = this._campfireFireMeshes.indexOf(child as THREE.Mesh);
          if (idx !== -1) this._campfireFireMeshes.splice(idx, 1);
        }
      }
      this.scene.scene.remove(mesh);
      this.campfireMeshes.delete(key);
    }
  }

  private _spreadLava(): void {
    if (this.lavaSourceBlocks.size === 0) return;
    const totalLava = this.lavaLights.size;
    if (totalLava >= Game.MAX_LAVA_BLOCKS) return;

    const toAdd: Array<[number, number, number]> = [];
    const DIRS = [[1,0],[-1,0],[0,1],[0,-1]] as const;

    for (const key of this.lavaSourceBlocks) {
      if (toAdd.length + totalLava >= Game.MAX_LAVA_BLOCKS) break;
      const [x, y, z] = key.split(",").map(Number);

      // Try horizontal neighbors at same level
      for (const [dx, dz] of DIRS) {
        const nx = x + dx, nz = z + dz;
        if (nx < 1 || nx > 62 || nz < 1 || nz > 62) continue;
        if (this.gameMap.world.getBlock(nx, y, nz) === "air") {
          toAdd.push([nx, y, nz]);
          break; // at most 1 spread per source per cycle
        }
        // If horizontal is blocked, try flowing down from it
        const below = y - 1;
        if (below >= 1 && this.gameMap.world.getBlock(nx, y, nz) !== "air"
            && this.gameMap.world.getBlock(nx, below, nz) === "air") {
          toAdd.push([nx, below, nz]);
          break;
        }
      }

      // Also try straight down
      const below = y - 1;
      if (below >= 1 && this.gameMap.world.getBlock(x, below, z) === "air") {
        if (!toAdd.some(([bx, by, bz]) => bx === x && by === below && bz === z)) {
          toAdd.push([x, below, z]);
        }
      }
    }

    // Apply all new lava blocks
    let added = 0;
    for (const [nx, ny, nz] of toAdd) {
      const nk = `${nx},${ny},${nz}`;
      if (this.gameMap.world.getBlock(nx, ny, nz) !== "air") continue;
      if (this.lavaLights.has(nk)) continue;
      this.gameMap.world.setBlock(nx, ny, nz, "lava");
      this.addLavaLight(nx, ny, nz);
      // Spawn a brief burst of lava ember particles at the new flow point
      this.particles.spawnLavaEmbers(nx, ny, nz);
      added++;
    }
    if (added > 0) this.gameMap.world.rebuildDirtyChunks();
  }

  private addLavaLight(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    if (this.lavaLights.has(key)) return;
    const light = new THREE.PointLight(0xff6600, 2.5, 12, 2);
    light.position.set(wx + 0.5, wy + 1.0, wz + 0.5);
    this.scene.scene.add(light);
    this.lavaLights.set(key, light);
  }

  private removeLavaLight(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    const light = this.lavaLights.get(key);
    if (light) {
      this.scene.scene.remove(light);
      light.dispose();
      this.lavaLights.delete(key);
    }
  }

  // ─── Fire helpers ──────────────────────────────────────────────────────────

  private static readonly FLAMMABLE = new Set<string>(["wood", "planks", "leaves"]);
  private static readonly FIRE_BURN_MIN = 18;
  private static readonly FIRE_BURN_MAX = 35;
  private static readonly FIRE_SPREAD_INTERVAL = 4.5;
  private static readonly MAX_FIRE_BLOCKS = 40;

  private _igniteBlock(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    if (this.activeFire.has(key)) return;
    if (this.activeFire.size >= Game.MAX_FIRE_BLOCKS) return;
    const burnDuration = Game.FIRE_BURN_MIN + Math.random() * (Game.FIRE_BURN_MAX - Game.FIRE_BURN_MIN);
    this.activeFire.set(key, { burnTimer: burnDuration, spreadTimer: Game.FIRE_SPREAD_INTERVAL * (0.5 + Math.random()) });
    this._addFireMesh(wx, wy, wz);
    this._addFireLight(wx, wy, wz);
  }

  private _extinguishBlock(wx: number, wy: number, wz: number): void {
    this.activeFire.delete(`${wx},${wy},${wz}`);
    this._removeFireMesh(wx, wy, wz);
    this._removeFireLight(wx, wy, wz);
    // Consume the flammable block beneath when fire burns out
    const below = this.gameMap.world.getBlock(wx, wy - 1, wz);
    if (Game.FLAMMABLE.has(below)) {
      this.gameMap.world.setBlock(wx, wy - 1, wz, "air");
      this.gameMap.world.rebuildDirtyChunks();
    }
  }

  private _addFireLight(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    if (this.fireLights.has(key)) return;
    const light = new THREE.PointLight(0xff8800, 1.8, 8, 2);
    light.position.set(wx + 0.5, wy + 0.7, wz + 0.5);
    this.scene.scene.add(light);
    this.fireLights.set(key, light);
  }

  private _removeFireLight(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    const light = this.fireLights.get(key);
    if (light) {
      this.scene.scene.remove(light);
      light.dispose();
      this.fireLights.delete(key);
    }
  }

  private _addFireMesh(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    if (this.fireMeshes.has(key)) return;
    // Two crossed vertical planes — Minecraft-style fire visualization
    const hw = 0.42, hh = 0.5;
    const positions = new Float32Array([
      -hw, -hh, 0,   hw, -hh, 0,   hw, hh, 0,   -hw, hh, 0,  // plane along X
       0, -hh, -hw,   0, -hh, hw,   0, hh, hw,    0, hh, -hw, // plane along Z
    ]);
    const indices = new Uint16Array([
      0,1,2, 0,2,3, 2,1,0, 3,2,0,
      4,5,6, 4,6,7, 6,5,4, 7,6,4,
    ]);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    const mat = new THREE.MeshBasicMaterial({
      color: 0xff7722, transparent: true, opacity: 0.9,
      side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(wx + 0.5, wy + 0.4, wz + 0.5);
    this.scene.scene.add(mesh);
    this.fireMeshes.set(key, mesh);
  }

  private _removeFireMesh(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    const mesh = this.fireMeshes.get(key);
    if (mesh) {
      this.scene.scene.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
      this.fireMeshes.delete(key);
    }
  }

  private _updateFire(dt: number): void {
    const toExtinguish: string[] = [];
    const t = performance.now() * 0.001;

    for (const [key, state] of this.activeFire) {
      const [wx, wy, wz] = key.split(",").map(Number);

      // Flicker the fire light
      const light = this.fireLights.get(key);
      if (light) {
        light.intensity = 1.5 + Math.sin(t * 9.1 + wx) * 0.5 + Math.sin(t * 13.7 + wz) * 0.3;
      }

      // Animate the fire mesh — slight rotation and scale wobble
      const fireMesh = this.fireMeshes.get(key);
      if (fireMesh) {
        fireMesh.rotation.y = t * 1.8 + wx * 1.4;
        fireMesh.scale.y = 0.9 + Math.sin(t * 11.7 + wz * 2.3) * 0.12;
      }

      state.burnTimer -= dt;
      if (state.burnTimer <= 0) {
        toExtinguish.push(key);
        continue;
      }

      // Spread attempt
      state.spreadTimer -= dt;
      if (state.spreadTimer <= 0) {
        state.spreadTimer = Game.FIRE_SPREAD_INTERVAL * (0.6 + Math.random() * 0.8);
        this._trySpreadFire(wx, wy, wz);
      }
    }

    for (const key of toExtinguish) {
      const [wx, wy, wz] = key.split(",").map(Number);
      this._extinguishBlock(wx, wy, wz);
    }

    // Fire damage to player every second
    if (this.activeFire.size > 0) {
      this._fireDamageTimer += dt;
      if (this._fireDamageTimer >= 1.0) {
        this._fireDamageTimer = 0;
        // Check if player is standing in or adjacent to fire
        const px = Math.round(this.player.position.x);
        const py = Math.round(this.player.position.y);
        const pz = Math.round(this.player.position.z);
        for (const [key] of this.activeFire) {
          const [fx, fy, fz] = key.split(",").map(Number);
          if (Math.abs(fx - px) <= 1 && Math.abs(fy - py) <= 1 && Math.abs(fz - pz) <= 1) {
            this.player.damage(1);
            this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
            this.ui.showDamageVignette();
            this.audio.play("player_hurt", 0.4);
            break;
          }
        }

        // Fire damage to enemies
        for (const state of this.enemies.getAliveEnemies()) {
          const ep = this.enemies.getEnemyPosition(state.id);
          if (!ep) continue;
          const ex = Math.round(ep.x), ey = Math.round(ep.y), ez = Math.round(ep.z);
          for (const [key] of this.activeFire) {
            const [fx, fy, fz] = key.split(",").map(Number);
            if (Math.abs(fx - ex) <= 1 && Math.abs(fy - ey) <= 1 && Math.abs(fz - ez) <= 1) {
              this.enemies.damage(state.id, 1);
              break;
            }
          }
        }
      }
    }
  }

  private _trySpreadFire(wx: number, wy: number, wz: number): void {
    if (this.activeFire.size >= Game.MAX_FIRE_BLOCKS) return;
    // Check all 6 adjacent blocks for flammable material + adjacent air
    const neighbors = [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
    for (const [dx, dy, dz] of neighbors) {
      const nx = wx + dx, ny = wy + dy, nz = wz + dz;
      if (ny < 0 || ny >= 32) continue;
      const nid = this.gameMap.world.getBlock(nx, ny, nz);
      if (!Game.FLAMMABLE.has(nid)) continue;
      // Try to place fire above the flammable block
      const fy = ny + 1;
      if (fy >= 32) continue;
      const above = this.gameMap.world.getBlock(nx, fy, nz);
      if (above !== "air") continue;
      if (this.activeFire.has(`${nx},${fy},${nz}`)) continue;
      if (Math.random() < 0.3) {
        this._igniteBlock(nx, fy, nz);
        this.particles.spawnExplosion(nx + 0.5, fy + 0.5, nz + 0.5);
      }
    }
  }

  // ─── TNT helpers ───────────────────────────────────────────────────────────

  private _primeTNT(wx: number, wy: number, wz: number): void {
    const key = `${wx},${wy},${wz}`;
    if (this.primedTNT.has(key)) return;
    // Remove the block so it doesn't render as solid
    this.gameMap.world.setBlock(wx, wy, wz, "air");
    this.gameMap.world.rebuildDirtyChunks();
    // Create blinking TNT mesh
    const geo  = new THREE.BoxGeometry(0.95, 0.95, 0.95);
    const mat  = new THREE.MeshLambertMaterial({ color: 0xcc2222 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(wx + 0.5, wy + 0.475, wz + 0.5);
    this.scene.scene.add(mesh);
    // Red point light
    const light = new THREE.PointLight(0xff4422, 2.0, 8, 2);
    light.position.copy(mesh.position);
    this.scene.scene.add(light);
    this.primedTNT.set(key, { timer: 4.0, flashTimer: 0, mesh, light });
    this.audio.play("creeper_hiss", 0.8);
    this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
  }

  private _updatePrimedTNT(dt: number): void {
    for (const [key, tnt] of this.primedTNT) {
      tnt.timer -= dt;
      tnt.flashTimer += dt;
      // Blink rate accelerates as timer approaches 0 (0.5s → 0.1s period)
      const blinkRate = tnt.timer > 1 ? 0.4 : 0.15;
      const on = (tnt.flashTimer % blinkRate) < blinkRate * 0.5;
      tnt.mesh.visible = on;
      tnt.light.intensity = on ? 2.5 : 0;
      if (tnt.timer <= 0) {
        this.scene.scene.remove(tnt.mesh);
        this.scene.scene.remove(tnt.light);
        tnt.mesh.geometry.dispose();
        (tnt.mesh.material as THREE.MeshLambertMaterial).dispose();
        tnt.light.dispose();
        this.primedTNT.delete(key);
        const parts = key.split(",");
        const x = parseInt(parts[0]) + 0.5;
        const y = parseInt(parts[1]) + 0.5;
        const z = parseInt(parts[2]) + 0.5;
        this._doExplosion(x, y, z, 4.5, 8);
      }
    }
  }

  private _doExplosion(x: number, y: number, z: number, radius: number, playerDamage: number): void {
    this.audio.play("explosion", 0.9);
    this.scene.shake(0.25, 0.7);
    this.particles.spawnExplosion(x, y + 0.5, z);
    // Damage player if in range
    const pp = this.player.position;
    const dx = pp.x - x, dy = pp.y - y, dz = pp.z - z;
    if (Math.sqrt(dx * dx + dy * dy + dz * dz) <= radius + 1) {
      this.player.damage(playerDamage);
      this.ui.updatePlayerHealth(this.player.health, this.player.maxHealth);
      this.ui.showDamageVignette();
    }
    // Break nearby blocks
    for (let bx = Math.floor(x - radius); bx <= Math.ceil(x + radius); bx++) {
      for (let by = Math.floor(y - 1); by <= Math.ceil(y + radius); by++) {
        for (let bz = Math.floor(z - radius); bz <= Math.ceil(z + radius); bz++) {
          const ddx = bx - x, ddy = by - y, ddz = bz - z;
          if (ddx*ddx + ddy*ddy + ddz*ddz > radius*radius) continue;
          const block = this.gameMap.world.getBlock(bx, by, bz);
          if (block === "air" || block === "bedrock") continue;
          // Chain-prime adjacent TNT
          if (block === "tnt") { this._primeTNT(bx, by, bz); continue; }
          if (Math.random() < 0.55) this.gameMap.world.setBlock(bx, by, bz, "air");
        }
      }
    }
    this.gameMap.world.rebuildDirtyChunks();
    this.flowField.recompute(FORTRESS_CENTER_X, FORTRESS_CENTER_Z);
    // Damage nearby enemies — track kills for TNT Trap achievement
    const killed = this.enemies.damageInRadius(x, y, z, radius, playerDamage * 1.5);
    if (killed >= 3) {
      this.unlockAchievement("tnt_trap", "TNT Trap!", `Killed ${killed} enemies with one blast`);
    }
  }

  private _damageHeldTool(stack: import("./Inventory").ItemStack): void {
    if (stack.durability == null) return;
    // Unbreaking I: 50% chance to skip durability loss
    if (stack.enchantments?.includes("unbreaking_1") && Math.random() < 0.5) return;
    stack.durability -= 1;
    if (stack.durability <= 0) {
      this.inventory.removeItem(stack.itemId, 1);
      this.audio.play("block_break", 0.6);
    }
    this.refreshHotbar();
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
      // Color-coded ammo badge on the gun's hotbar slot
      const ammoDef  = ITEMS[itemDef.ammoType];
      const maxStack = ammoDef?.stackSize ?? 64;
      this.ui.setSlotAmmoBadge(this.inventory.activeSlot, ammoCount, maxStack);
    } else {
      this.ui.updateAmmoDisplay(null);
      this.ui.setSlotAmmoBadge(null, 0, 1);
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
