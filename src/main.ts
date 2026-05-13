import * as THREE from "three";
import RAPIER from "@dimforge/rapier3d-compat";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";
import "./style.css";
import type { GameState, BlockId, EnemyType, BlockDef, EnemyConfig, WaveConfig, Settings } from "./types";

// BVH-accelerated raycasting
(THREE.BufferGeometry.prototype as any).computeBoundsTree = computeBoundsTree;
(THREE.BufferGeometry.prototype as any).disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const VignetteShader = {
  uniforms: { tDiffuse: { value: null as THREE.Texture | null }, offset: { value: 0.9 }, darkness: { value: 0.32 } },
  vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float offset; uniform float darkness; varying vec2 vUv; void main() { vec4 texel = texture2D(tDiffuse, vUv); vec2 uv = (vUv - 0.5) * 2.0; float vig = smoothstep(offset, offset - 0.25, dot(uv, uv)); gl_FragColor = vec4(mix(texel.rgb * (1.0 - darkness), texel.rgb, vig), texel.a); }`,
};

// ---------------------------------------------------------------------------
// Block definitions
// ---------------------------------------------------------------------------
const BLOCK_DEFS: Record<BlockId, BlockDef> = {
  air:         { id: "air",         name: "Air",         color: 0x000000, hardness: 0,   placeable: false, transparent: true  },
  grass:       { id: "grass",       name: "Grass",       color: 0x5d9e3a, topColor: 0x5d9e3a, bottomColor: 0x8b5c2a, hardness: 1,   placeable: true,  transparent: false },
  dirt:        { id: "dirt",        name: "Dirt",        color: 0x8b5c2a, hardness: 1,   placeable: true,  transparent: false },
  stone:       { id: "stone",       name: "Stone",       color: 0x888888, hardness: 3,   placeable: true,  transparent: false },
  wood:        { id: "wood",        name: "Wood",        color: 0x6b4c2a, hardness: 2,   placeable: true,  transparent: false },
  planks:      { id: "planks",      name: "Planks",      color: 0xc8a060, hardness: 2,   placeable: true,  transparent: false },
  cobblestone: { id: "cobblestone", name: "Cobblestone", color: 0x777777, hardness: 3,   placeable: true,  transparent: false },
  sand:        { id: "sand",        name: "Sand",        color: 0xd4c484, hardness: 1,   placeable: true,  transparent: false },
  glass:       { id: "glass",       name: "Glass",       color: 0x88ccee, hardness: 1,   placeable: true,  transparent: true  },
  leaves:      { id: "leaves",      name: "Leaves",      color: 0x3a7a25, hardness: 0.5, placeable: true,  transparent: true  },
  obsidian:    { id: "obsidian",    name: "Obsidian",    color: 0x1a0a2a, hardness: 10,  placeable: true,  transparent: false },
};

const PLACEABLE_BLOCKS: BlockId[] = ["planks", "cobblestone", "stone", "wood", "glass", "obsidian"];

// ---------------------------------------------------------------------------
// Enemy configurations
// ---------------------------------------------------------------------------
const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
  zombie:   { type: "zombie",   name: "Zombie",   health: 20,  speed: 2.2,  damage: 4,  attackRange: 1.4, attackRate: 1.2, score: 10, color: 0x3a7a3a, headColor: 0xc8b090, scale: 1.0  },
  skeleton: { type: "skeleton", name: "Skeleton", health: 15,  speed: 2.6,  damage: 3,  attackRange: 12,  attackRate: 1.8, score: 15, color: 0xd0d0c8, headColor: 0xe0ddd0, scale: 0.95 },
  creeper:  { type: "creeper",  name: "Creeper",  health: 18,  speed: 2.8,  damage: 40, attackRange: 2.5, attackRate: 0.3, score: 20, color: 0x3a9a3a, headColor: 0x3a9a3a, scale: 1.0  },
  spider:   { type: "spider",   name: "Spider",   health: 16,  speed: 3.8,  damage: 3,  attackRange: 1.6, attackRate: 1.0, score: 18, color: 0x1a1a1a, headColor: 0x1a1a1a, scale: 0.85 },
  enderman: { type: "enderman", name: "Enderman", health: 40,  speed: 3.2,  damage: 7,  attackRange: 1.8, attackRate: 1.5, score: 35, color: 0x1a001a, headColor: 0x1a001a, scale: 1.4  },
};

// ---------------------------------------------------------------------------
// Wave definitions
// ---------------------------------------------------------------------------
const WAVE_CONFIGS: WaveConfig[] = [
  { enemies: [{ type: "zombie", count: 5  }],                                           spawnInterval: 2.0 },
  { enemies: [{ type: "zombie", count: 6  }, { type: "skeleton", count: 2 }],           spawnInterval: 1.8 },
  { enemies: [{ type: "zombie", count: 6  }, { type: "skeleton", count: 3 }, { type: "creeper", count: 1 }], spawnInterval: 1.6 },
  { enemies: [{ type: "zombie", count: 8  }, { type: "skeleton", count: 4 }, { type: "creeper", count: 2 }], spawnInterval: 1.4 },
  { enemies: [{ type: "zombie", count: 8  }, { type: "skeleton", count: 4 }, { type: "creeper", count: 3 }, { type: "spider", count: 2 }], spawnInterval: 1.2 },
];

function getWaveConfig(round: number): WaveConfig {
  if (round <= WAVE_CONFIGS.length) return WAVE_CONFIGS[round - 1];
  // Scale up past defined waves
  const base = WAVE_CONFIGS[WAVE_CONFIGS.length - 1];
  const scale = 1 + (round - WAVE_CONFIGS.length) * 0.25;
  return {
    spawnInterval: Math.max(0.6, base.spawnInterval - (round - WAVE_CONFIGS.length) * 0.05),
    enemies: base.enemies.map(e => ({ type: e.type, count: Math.ceil(e.count * scale) })),
  };
}

// ---------------------------------------------------------------------------
// Voxel world
// ---------------------------------------------------------------------------
const CHUNK_SIZE = 16;
const WORLD_HEIGHT = 32;
const WORLD_CHUNKS_XZ = 8; // 8x8 chunks = 128x128 blocks
const BLOCK_SIZE = 1.0;

type BlockData = Uint8Array; // flat [x + z*W + y*W*W] index into BlockId keys

const BLOCK_ID_INDEX: BlockId[] = Object.keys(BLOCK_DEFS) as BlockId[];
const BLOCK_TO_IDX: Record<BlockId, number> = {} as Record<BlockId, number>;
BLOCK_ID_INDEX.forEach((id, i) => { BLOCK_TO_IDX[id] = i; });

class Chunk {
  readonly cx: number;
  readonly cz: number;
  readonly data: BlockData;
  mesh: THREE.Mesh | null = null;
  dirty = true;

  constructor(cx: number, cz: number) {
    this.cx = cx;
    this.cz = cz;
    this.data = new Uint8Array(CHUNK_SIZE * WORLD_HEIGHT * CHUNK_SIZE);
  }

  getBlock(lx: number, ly: number, lz: number): BlockId {
    if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) return "air";
    return BLOCK_ID_INDEX[this.data[lx + lz * CHUNK_SIZE + ly * CHUNK_SIZE * CHUNK_SIZE]];
  }

  setBlock(lx: number, ly: number, lz: number, id: BlockId): void {
    if (lx < 0 || lx >= CHUNK_SIZE || ly < 0 || ly >= WORLD_HEIGHT || lz < 0 || lz >= CHUNK_SIZE) return;
    this.data[lx + lz * CHUNK_SIZE + ly * CHUNK_SIZE * CHUNK_SIZE] = BLOCK_TO_IDX[id];
    this.dirty = true;
  }
}

class VoxelWorld {
  private readonly chunks = new Map<string, Chunk>();
  readonly scene: THREE.Scene;
  private readonly chunkMeshGroup: THREE.Group;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.chunkMeshGroup = new THREE.Group();
    scene.add(this.chunkMeshGroup);
  }

  private key(cx: number, cz: number) { return `${cx},${cz}`; }

  getChunk(cx: number, cz: number): Chunk {
    const k = this.key(cx, cz);
    if (!this.chunks.has(k)) this.chunks.set(k, new Chunk(cx, cz));
    return this.chunks.get(k)!;
  }

  getBlock(wx: number, wy: number, wz: number): BlockId {
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const lx = wx - cx * CHUNK_SIZE;
    const lz = wz - cz * CHUNK_SIZE;
    return this.getChunk(cx, cz).getBlock(lx, wy, lz);
  }

  setBlock(wx: number, wy: number, wz: number, id: BlockId): void {
    const cx = Math.floor(wx / CHUNK_SIZE);
    const cz = Math.floor(wz / CHUNK_SIZE);
    const lx = wx - cx * CHUNK_SIZE;
    const lz = wz - cz * CHUNK_SIZE;
    this.getChunk(cx, cz).setBlock(lx, wy, lz, id);
    // Mark neighbors dirty if on edge
    if (lx === 0) this.getChunk(cx - 1, cz).dirty = true;
    if (lx === CHUNK_SIZE - 1) this.getChunk(cx + 1, cz).dirty = true;
    if (lz === 0) this.getChunk(cx, cz - 1).dirty = true;
    if (lz === CHUNK_SIZE - 1) this.getChunk(cx, cz + 1).dirty = true;
  }

  generateFlatWorld(): void {
    for (let cx = 0; cx < WORLD_CHUNKS_XZ; cx++) {
      for (let cz = 0; cz < WORLD_CHUNKS_XZ; cz++) {
        const chunk = this.getChunk(cx, cz);
        for (let lx = 0; lx < CHUNK_SIZE; lx++) {
          for (let lz = 0; lz < CHUNK_SIZE; lz++) {
            chunk.setBlock(lx, 0, lz, "stone");
            chunk.setBlock(lx, 1, lz, "dirt");
            chunk.setBlock(lx, 2, lz, "dirt");
            chunk.setBlock(lx, 3, lz, "grass");
          }
        }
        chunk.dirty = true;
      }
    }
  }

  rebuildDirtyChunks(): void {
    this.chunks.forEach((chunk) => {
      if (!chunk.dirty) return;
      chunk.dirty = false;
      this.rebuildChunkMesh(chunk);
    });
  }

  private rebuildChunkMesh(chunk: Chunk): void {
    if (chunk.mesh) {
      this.chunkMeshGroup.remove(chunk.mesh);
      chunk.mesh.geometry.dispose();
      (chunk.mesh.material as THREE.Material).dispose();
      chunk.mesh = null;
    }

    const positions: number[] = [];
    const normals: number[]   = [];
    const colors: number[]    = [];
    const indices: number[]   = [];
    let vi = 0;

    const addFace = (
      ox: number, oy: number, oz: number,
      ax: number, ay: number, az: number,
      bx: number, by: number, bz: number,
      nx: number, ny: number, nz: number,
      r: number, g: number, b: number,
      shade: number
    ) => {
      const sr = r * shade, sg = g * shade, sb = b * shade;
      positions.push(
        ox,    oy,    oz,
        ox+ax, oy+ay, oz+az,
        ox+bx, oy+by, oz+bz,
        ox+ax+bx, oy+ay+by, oz+az+bz
      );
      for (let i = 0; i < 4; i++) normals.push(nx, ny, nz);
      for (let i = 0; i < 4; i++) colors.push(sr, sg, sb);
      indices.push(vi, vi+1, vi+2, vi+1, vi+3, vi+2);
      vi += 4;
    };

    const offX = chunk.cx * CHUNK_SIZE;
    const offZ = chunk.cz * CHUNK_SIZE;

    for (let lx = 0; lx < CHUNK_SIZE; lx++) {
      for (let ly = 0; ly < WORLD_HEIGHT; ly++) {
        for (let lz = 0; lz < CHUNK_SIZE; lz++) {
          const id = chunk.getBlock(lx, ly, lz);
          if (id === "air") continue;
          const def = BLOCK_DEFS[id];
          const wx = offX + lx, wy = ly, wz = offZ + lz;

          const c = def.color;
          const r = ((c >> 16) & 0xff) / 255;
          const g = ((c >> 8)  & 0xff) / 255;
          const b = (c         & 0xff) / 255;

          const topC = def.topColor ?? def.color;
          const tr = ((topC >> 16) & 0xff) / 255;
          const tg = ((topC >> 8)  & 0xff) / 255;
          const tb = (topC         & 0xff) / 255;

          const neighbors: [number,number,number][] = [[0,1,0],[0,-1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
          const faces = [
            // top
            { n:[0,1,0], a:[1,0,0], b:[0,0,1], shade:1.0, cr:tr, cg:tg, cb:tb },
            // bottom
            { n:[0,-1,0], a:[0,0,1], b:[1,0,0], shade:0.5, cr:r, cg:g, cb:b },
            // +x
            { n:[1,0,0], a:[0,0,1], b:[0,1,0], shade:0.75, cr:r, cg:g, cb:b },
            // -x
            { n:[-1,0,0], a:[0,1,0], b:[0,0,1], shade:0.75, cr:r, cg:g, cb:b },
            // +z
            { n:[0,0,1], a:[0,1,0], b:[1,0,0], shade:0.65, cr:r, cg:g, cb:b },
            // -z
            { n:[0,0,-1], a:[1,0,0], b:[0,1,0], shade:0.65, cr:r, cg:g, cb:b },
          ];

          for (let fi = 0; fi < 6; fi++) {
            const [nx, ny, nz] = neighbors[fi];
            const nbId = this.getBlock(wx + nx, wy + ny, wz + nz);
            if (nbId !== "air" && !BLOCK_DEFS[nbId].transparent) continue;
            const f = faces[fi];
            addFace(
              wx + (f.n[0] < 0 ? 0 : f.n[0] > 0 ? 1 : 0),
              wy + (f.n[1] < 0 ? 0 : f.n[1] > 0 ? 1 : 0),
              wz + (f.n[2] < 0 ? 0 : f.n[2] > 0 ? 1 : 0),
              f.a[0] * BLOCK_SIZE, f.a[1] * BLOCK_SIZE, f.a[2] * BLOCK_SIZE,
              f.b[0] * BLOCK_SIZE, f.b[1] * BLOCK_SIZE, f.b[2] * BLOCK_SIZE,
              f.n[0], f.n[1], f.n[2],
              f.cr, f.cg, f.cb,
              f.shade
            );
          }
        }
      }
    }

    if (positions.length === 0) return;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute("normal",   new THREE.Float32BufferAttribute(normals, 3));
    geo.setAttribute("color",    new THREE.Float32BufferAttribute(colors, 3));
    geo.setIndex(indices);
    geo.computeBoundsTree();

    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.FrontSide });
    chunk.mesh = new THREE.Mesh(geo, mat);
    chunk.mesh.receiveShadow = true;
    chunk.mesh.castShadow = false;
    this.chunkMeshGroup.add(chunk.mesh);
  }
}

// ---------------------------------------------------------------------------
// Audio engine (trimmed from FPS codebase)
// ---------------------------------------------------------------------------
class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private uiGain: GainNode | null = null;
  volume = { master: 0.8, effects: 1.0, ui: 0.8 };

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain  = this.ctx.createGain();
      this.effectsGain = this.ctx.createGain();
      this.uiGain      = this.ctx.createGain();
      this.effectsGain.connect(this.masterGain);
      this.uiGain.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
      this.updateVolumes();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  updateVolumes(): void {
    if (!this.masterGain || !this.effectsGain || !this.uiGain) return;
    this.masterGain.gain.value  = this.volume.master;
    this.effectsGain.gain.value = this.volume.effects;
    this.uiGain.gain.value      = this.volume.ui;
  }

  play(sound: "swing" | "hit" | "death" | "place" | "break" | "ui_click" | "explosion" | "arrow", vol = 1.0): void {
    const ctx = this.ensureCtx();
    const gain = ctx.createGain();
    const dest = sound === "ui_click" ? this.uiGain! : this.effectsGain!;
    gain.gain.value = vol;
    gain.connect(dest);

    const noiseBurst = (dur: number, freq: number, decay: number) => {
      const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * decay));
      const src = ctx.createBufferSource();
      const filt = ctx.createBiquadFilter();
      filt.type = "bandpass"; filt.frequency.value = freq; filt.Q.value = 1.2;
      src.buffer = buf; src.connect(filt); filt.connect(gain);
      src.start(); src.stop(ctx.currentTime + dur);
    };

    const tone = (freq: number, dur: number, type: OscillatorType = "sine", fade = 0.05) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(g); g.connect(dest);
      osc.start(); osc.stop(ctx.currentTime + dur + fade);
    };

    switch (sound) {
      case "swing":     tone(180, 0.08, "sawtooth"); noiseBurst(0.07, 300, 0.03); break;
      case "hit":       noiseBurst(0.12, 800, 0.04); tone(120, 0.1, "square");   break;
      case "death":     noiseBurst(0.3, 200, 0.15); tone(80, 0.25, "sawtooth");  break;
      case "place":     noiseBurst(0.06, 600, 0.025);                             break;
      case "break":     noiseBurst(0.14, 300, 0.07); tone(100, 0.1, "square");   break;
      case "ui_click":  tone(880, 0.06, "sine");                                  break;
      case "explosion": noiseBurst(0.5, 80, 0.3); tone(60, 0.4, "sawtooth");     break;
      case "arrow":     tone(440, 0.05, "sawtooth"); noiseBurst(0.04, 1200, 0.02); break;
    }
  }
}

// ---------------------------------------------------------------------------
// Enemy
// ---------------------------------------------------------------------------
interface Enemy {
  id: number;
  type: EnemyType;
  group: THREE.Group;
  body: THREE.Mesh;
  head: THREE.Mesh;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  attackRange: number;
  attackRate: number;
  nextAttack: number;
  alive: boolean;
  dying: boolean;
  dyingUntil: number;
  state: "walk" | "attack" | "exploding";
  explodeTimer: number;
  movePhase: number;
}

// ---------------------------------------------------------------------------
// App
// ---------------------------------------------------------------------------
const defaultSettings: Settings = {
  sensitivity: 0.0018,
  fov: 75,
  quality: "medium",
  difficulty: "normal",
  volume: { master: 0.8, effects: 1.0, ui: 0.8 },
};

class App {
  private readonly renderer: THREE.WebGLRenderer;
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly composer: EffectComposer;
  private readonly clock = new THREE.Clock();
  private readonly audio = new AudioEngine();

  private world!: VoxelWorld;
  private rapier!: typeof RAPIER;
  private physWorld!: RAPIER.World;
  private playerBody!: RAPIER.RigidBody;
  private playerController!: RAPIER.KinematicCharacterController;

  private gameState: GameState = "menu";
  private round = 0;
  private score = 0;
  private playerHealth = 20;
  private readonly playerMaxHealth = 20;

  private readonly enemies: Enemy[] = [];
  private enemyIdCounter = 0;
  private spawnQueue: Array<{ type: EnemyType; delay: number }> = [];
  private spawnTimer = 0;
  private enemiesRemainingInWave = 0;

  // Build phase
  private buildPhaseActive = false;
  private buildPhaseTimer = 0;
  private readonly buildPhaseDuration = 30;
  private selectedBlock: BlockId = "planks";
  private readonly inventory: Partial<Record<BlockId, number>> = {
    planks: 20, cobblestone: 10, stone: 5, glass: 5,
  };

  // Player movement
  private readonly keys = new Set<string>();
  private readonly velocity = new THREE.Vector3();
  private yaw = 0;
  private pitch = 0;
  private isOnGround = false;
  private readonly playerHeight = 1.8;
  private attackCooldown = 0;
  private breakCooldown = 0;
  private readonly REACH = 5.0;

  private settings: Settings = { ...defaultSettings };

  // Base block position (center of world, player defends this)
  private readonly basePos = new THREE.Vector3(
    WORLD_CHUNKS_XZ * CHUNK_SIZE / 2,
    4,
    WORLD_CHUNKS_XZ * CHUNK_SIZE / 2
  );

  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    document.getElementById("app")!.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x8bb8d8, 40, 120);
    this.scene.background = new THREE.Color(0x8bb8d8);

    this.camera = new THREE.PerspectiveCamera(this.settings.fov, window.innerWidth / window.innerHeight, 0.05, 200);

    this.composer = this.buildComposer();

    this.setupLighting();
    this.setupHUD();
    this.setupMenu();
    this.setupInput();
    window.addEventListener("resize", () => this.onResize());
    this.renderer.domElement.addEventListener("click", () => {
      if (this.gameState === "playing") this.renderer.domElement.requestPointerLock();
    });
    document.addEventListener("pointerlockchange", () => {
      const locked = document.pointerLockElement === this.renderer.domElement;
      document.getElementById("lock-prompt")!.classList.toggle("hidden", locked);
    });

    this.init();
  }

  private buildComposer(): EffectComposer {
    const composer = new EffectComposer(this.renderer);
    composer.addPass(new RenderPass(this.scene, this.camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.18, 0.4, 0.85));
    composer.addPass(new ShaderPass(VignetteShader));
    composer.addPass(new OutputPass());
    return composer;
  }

  private setupLighting(): void {
    this.scene.add(new THREE.AmbientLight(0xc8d8f0, 0.7));
    const sun = new THREE.DirectionalLight(0xfff4d0, 1.4);
    sun.position.set(40, 60, 30);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 200;
    sun.shadow.camera.left = -80;
    sun.shadow.camera.right = 80;
    sun.shadow.camera.top = 80;
    sun.shadow.camera.bottom = -80;
    this.scene.add(sun);
  }

  private async init(): Promise<void> {
    const fill = document.getElementById("load-fill")!;
    fill.style.width = "20%";

    await RAPIER.init();
    this.rapier = RAPIER;
    fill.style.width = "50%";

    this.physWorld = new this.rapier.World({ x: 0, y: -20, z: 0 });

    this.world = new VoxelWorld(this.scene);
    this.world.generateFlatWorld();
    fill.style.width = "75%";

    this.world.rebuildDirtyChunks();
    this.addBaseStructure();
    this.addSkyDome();
    fill.style.width = "90%";

    // Ground collider (flat physics floor)
    this.physWorld.createCollider(
      this.rapier.ColliderDesc.cuboid(
        WORLD_CHUNKS_XZ * CHUNK_SIZE / 2, 0.5,
        WORLD_CHUNKS_XZ * CHUNK_SIZE / 2
      ).setTranslation(
        WORLD_CHUNKS_XZ * CHUNK_SIZE / 2, 3.25,
        WORLD_CHUNKS_XZ * CHUNK_SIZE / 2
      )
    );

    this.setupPlayer();
    fill.style.width = "100%";

    setTimeout(() => {
      document.getElementById("loading")!.classList.add("hidden");
    }, 300);

    this.renderer.setAnimationLoop(() => this.tick());
  }

  private setupPlayer(): void {
    const desc = this.rapier.RigidBodyDesc.kinematicPositionBased()
      .setTranslation(
        this.basePos.x + 8,
        this.playerHeight + 4,
        this.basePos.z + 8
      );
    this.playerBody = this.physWorld.createRigidBody(desc);
    const collDesc = this.rapier.ColliderDesc.capsule(this.playerHeight / 2 - 0.4, 0.38);
    this.physWorld.createCollider(collDesc, this.playerBody);
    this.playerController = this.physWorld.createCharacterController(0.01);
    this.playerController.setApplyImpulsesToDynamicBodies(true);
    this.playerController.enableSnapToGround(0.4);
  }

  private addBaseStructure(): void {
    // Central base marker — obsidian block at world center
    const cx = Math.floor(this.basePos.x);
    const cz = Math.floor(this.basePos.z);
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        this.world.setBlock(cx + dx, 4, cz + dz, "obsidian");
      }
    }
    // Glowing beacon pillar
    const beacon = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 6, 8),
      new THREE.MeshStandardMaterial({ color: 0x00ffaa, emissive: 0x00ffaa, emissiveIntensity: 1.5 })
    );
    beacon.position.set(this.basePos.x, this.basePos.y + 3, this.basePos.z);
    this.scene.add(beacon);

    const beaconLight = new THREE.PointLight(0x00ffaa, 2.0, 18);
    beaconLight.position.copy(beacon.position).y += 2;
    this.scene.add(beaconLight);
  }

  private addSkyDome(): void {
    const geo = new THREE.SphereGeometry(150, 16, 12);
    const canvas = document.createElement("canvas");
    canvas.width = 4; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0,   "#5080c8");
    grad.addColorStop(0.5, "#8bb8d8");
    grad.addColorStop(1,   "#c8dce8");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 4, 256);
    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.MeshBasicMaterial({ map: tex, side: THREE.BackSide });
    this.scene.add(new THREE.Mesh(geo, mat));
  }

  // ---------------------------------------------------------------------------
  // Input
  // ---------------------------------------------------------------------------
  private setupInput(): void {
    document.addEventListener("keydown", (e) => {
      this.keys.add(e.code);
      if (e.code === "Escape" && this.gameState === "playing") this.pauseGame();
      else if (e.code === "Escape" && this.gameState === "paused") this.resumeGame();
      if (e.code === "KeyE" && this.gameState === "playing") this.tryPlaceBlock();
      if (e.code === "KeyQ" && this.gameState === "playing") this.cycleBlock(-1);
      if (e.code === "KeyR" && this.gameState === "playing") this.cycleBlock(1);
    });
    document.addEventListener("keyup", (e) => this.keys.delete(e.code));
    document.addEventListener("mousemove", (e) => {
      if (document.pointerLockElement !== this.renderer.domElement) return;
      this.yaw   -= e.movementX * this.settings.sensitivity;
      this.pitch -= e.movementY * this.settings.sensitivity;
      this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
    });
    document.addEventListener("mousedown", (e) => {
      if (document.pointerLockElement !== this.renderer.domElement) return;
      if (e.button === 0) this.tryAttack();
      if (e.button === 2) this.tryBreakBlock();
    });
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("wheel", (e) => {
      if (this.gameState !== "playing") return;
      this.cycleBlock(e.deltaY > 0 ? 1 : -1);
    });
  }

  // ---------------------------------------------------------------------------
  // Block interaction
  // ---------------------------------------------------------------------------
  private raycastBlock(): { wx: number; wy: number; wz: number; face: THREE.Vector3 } | null {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    ray.far = this.REACH;

    const hits = ray.intersectObjects(this.scene.children, true);
    if (hits.length === 0) return null;
    const hit = hits[0];
    if (!hit.face || !hit.point) return null;

    const nx = hit.face.normal.x;
    const ny = hit.face.normal.y;
    const nz = hit.face.normal.z;

    const wx = Math.floor(hit.point.x - nx * 0.5);
    const wy = Math.floor(hit.point.y - ny * 0.5);
    const wz = Math.floor(hit.point.z - nz * 0.5);

    return { wx, wy, wz, face: hit.face.normal };
  }

  private tryPlaceBlock(): void {
    const hit = this.raycastBlock();
    if (!hit) return;
    const count = this.inventory[this.selectedBlock] ?? 0;
    if (count <= 0) return;
    const px = hit.wx + hit.face.x;
    const py = hit.wy + hit.face.y;
    const pz = hit.wz + hit.face.z;
    // Don't place inside player
    const pos = this.playerBody.translation();
    const dx = px - pos.x, dy = py - pos.y, dz = pz - pos.z;
    if (Math.abs(dx) < 0.7 && Math.abs(dy) < this.playerHeight && Math.abs(dz) < 0.7) return;
    this.world.setBlock(px, py, pz, this.selectedBlock);
    this.world.rebuildDirtyChunks();
    this.inventory[this.selectedBlock] = count - 1;
    this.audio.play("place", 0.6);
    this.updateHotbar();
  }

  private tryBreakBlock(): void {
    if (this.breakCooldown > 0) return;
    const hit = this.raycastBlock();
    if (!hit) return;
    const id = this.world.getBlock(hit.wx, hit.wy, hit.wz);
    if (id === "air" || id === "obsidian") return;
    this.world.setBlock(hit.wx, hit.wy, hit.wz, "air");
    this.world.rebuildDirtyChunks();
    // Drop block to inventory
    this.inventory[id] = (this.inventory[id] ?? 0) + 1;
    this.breakCooldown = BLOCK_DEFS[id].hardness * 0.4;
    this.audio.play("break", 0.7);
    this.updateHotbar();
  }

  private cycleBlock(dir: number): void {
    const idx = PLACEABLE_BLOCKS.indexOf(this.selectedBlock);
    const next = (idx + dir + PLACEABLE_BLOCKS.length) % PLACEABLE_BLOCKS.length;
    this.selectedBlock = PLACEABLE_BLOCKS[next];
    this.updateHotbar();
    this.updateBlockIndicator();
  }

  // ---------------------------------------------------------------------------
  // Combat
  // ---------------------------------------------------------------------------
  private tryAttack(): void {
    if (this.attackCooldown > 0) return;
    this.attackCooldown = 0.5;
    this.audio.play("swing", 0.6);

    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    const origin = this.camera.position.clone();

    let closest: Enemy | null = null;
    let closestDist = this.REACH;

    for (const enemy of this.enemies) {
      if (!enemy.alive || enemy.dying) continue;
      const ep = enemy.group.position;
      const toEnemy = ep.clone().sub(origin);
      const dist = toEnemy.length();
      if (dist > this.REACH) continue;
      const dot = toEnemy.normalize().dot(dir);
      if (dot < 0.85) continue;
      if (dist < closestDist) { closest = enemy; closestDist = dist; }
    }

    if (closest) {
      const dmg = this.settings.difficulty === "easy" ? 8 : this.settings.difficulty === "hard" ? 4 : 6;
      this.damageEnemy(closest, dmg);
      this.audio.play("hit", 0.8);
    }
  }

  private damageEnemy(enemy: Enemy, amount: number): void {
    enemy.health = Math.max(0, enemy.health - amount);
    this.showDamageNumber(enemy.group.position.clone().add(new THREE.Vector3(0, 1.5, 0)), amount, false);
    if (enemy.health <= 0 && !enemy.dying) this.killEnemy(enemy);
  }

  private killEnemy(enemy: Enemy): void {
    enemy.alive = false;
    enemy.dying = true;
    enemy.dyingUntil = this.clock.getElapsedTime() + 0.5;
    this.score += ENEMY_CONFIGS[enemy.type].score;
    this.enemiesRemainingInWave--;
    this.audio.play("death", 0.7);
    this.addKillFeedEntry(`${enemy.type.charAt(0).toUpperCase() + enemy.type.slice(1)} killed`);
    this.updateScoreHUD();
    if (this.enemiesRemainingInWave <= 0 && this.spawnQueue.length === 0) {
      this.onWaveClear();
    }
  }

  // ---------------------------------------------------------------------------
  // Wave system
  // ---------------------------------------------------------------------------
  private startWave(): void {
    this.round++;
    this.buildPhaseActive = false;
    document.getElementById("build-panel")!.classList.remove("visible");

    const cfg = getWaveConfig(this.round);
    this.spawnQueue = [];
    let delay = 0;
    for (const group of cfg.enemies) {
      for (let i = 0; i < group.count; i++) {
        this.spawnQueue.push({ type: group.type, delay });
        delay += cfg.spawnInterval;
      }
    }
    this.enemiesRemainingInWave = this.spawnQueue.length;
    this.spawnTimer = 0;
    this.updateRoundHUD();
    this.showPhaseBanner(`WAVE ${this.round}`, "Defend the beacon!", 0xffffff);
  }

  private onWaveClear(): void {
    // Restore some health
    this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 4);
    this.updateHealthHUD();
    // Grant resources
    this.inventory.planks  = (this.inventory.planks  ?? 0) + 8;
    this.inventory.cobblestone = (this.inventory.cobblestone ?? 0) + 5;
    this.updateHotbar();

    this.buildPhaseActive = true;
    this.buildPhaseTimer = this.buildPhaseDuration;
    document.getElementById("build-panel")!.classList.add("visible");
    this.showPhaseBanner("BUILD PHASE", `${this.buildPhaseDuration}s to fortify — next wave incoming`, 0x5d9e3a);
  }

  private spawnEnemy(type: EnemyType): void {
    const cfg = ENEMY_CONFIGS[type];
    const angle = Math.random() * Math.PI * 2;
    const radius = 48 + Math.random() * 12;
    const spawnX = this.basePos.x + Math.cos(angle) * radius;
    const spawnZ = this.basePos.z + Math.sin(angle) * radius;
    const spawnY = 4.6;

    const group = new THREE.Group();
    group.position.set(spawnX, spawnY, spawnZ);

    // Body
    const bodyGeo = new THREE.BoxGeometry(0.6 * cfg.scale, 0.8 * cfg.scale, 0.35 * cfg.scale);
    const bodyMat = new THREE.MeshLambertMaterial({ color: cfg.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.4 * cfg.scale;
    group.add(body);

    // Head
    const headGeo = new THREE.BoxGeometry(0.5 * cfg.scale, 0.5 * cfg.scale, 0.5 * cfg.scale);
    const headMat = new THREE.MeshLambertMaterial({ color: cfg.headColor });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = (0.8 + 0.4 + 0.25) * cfg.scale;
    group.add(head);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.26 * cfg.scale, 0.5 * cfg.scale, 0.26 * cfg.scale);
    const legMat = new THREE.MeshLambertMaterial({ color: cfg.color });
    [-0.16, 0.16].forEach((ox) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(ox * cfg.scale, -0.05 * cfg.scale, 0);
      group.add(leg);
    });

    this.scene.add(group);

    const enemy: Enemy = {
      id: this.enemyIdCounter++,
      type, group, body, head,
      health: cfg.health, maxHealth: cfg.health,
      speed: cfg.speed, damage: cfg.damage,
      attackRange: cfg.attackRange, attackRate: cfg.attackRate,
      nextAttack: 0,
      alive: true, dying: false, dyingUntil: 0,
      state: "walk", explodeTimer: 0,
      movePhase: Math.random() * Math.PI * 2,
    };
    this.enemies.push(enemy);
  }

  // ---------------------------------------------------------------------------
  // Tick
  // ---------------------------------------------------------------------------
  private tick(): void {
    const dt = Math.min(this.clock.getDelta(), 0.05);

    if (this.gameState === "playing") {
      this.updatePlayer(dt);
      this.updateEnemies(dt);
      this.updateSpawner(dt);
      this.updateTimers(dt);
    }

    this.composer.render();
  }

  private updatePlayer(dt: number): void {
    this.attackCooldown  = Math.max(0, this.attackCooldown - dt);
    this.breakCooldown   = Math.max(0, this.breakCooldown - dt);

    const speed = this.keys.has("ShiftLeft") ? 6.5 : 4.2;

    const fwd = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const rgt = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();
    if (this.keys.has("KeyW")) move.addScaledVector(fwd, 1);
    if (this.keys.has("KeyS")) move.addScaledVector(fwd, -1);
    if (this.keys.has("KeyA")) move.addScaledVector(rgt, -1);
    if (this.keys.has("KeyD")) move.addScaledVector(rgt, 1);
    if (move.lengthSq() > 0) move.normalize();

    if (this.keys.has("Space") && this.isOnGround) this.velocity.y = 8.0;
    this.velocity.y -= 22 * dt;
    if (this.isOnGround && this.velocity.y < 0) this.velocity.y = -0.5;

    const desired = new THREE.Vector3(
      move.x * speed + this.velocity.x * 0.1,
      this.velocity.y * dt,
      move.z * speed + this.velocity.z * 0.1
    );
    desired.x *= dt; desired.z *= dt;

    const pos = this.playerBody.translation();
    this.playerController.computeColliderMovement(
      this.physWorld.getCollider(0)!,
      { x: desired.x, y: desired.y, z: desired.z }
    );
    const computed = this.playerController.computedMovement();
    this.playerBody.setNextKinematicTranslation({
      x: pos.x + computed.x,
      y: pos.y + computed.y,
      z: pos.z + computed.z,
    });
    this.isOnGround = this.playerController.computedGrounded();
    if (this.isOnGround) this.velocity.y = 0;

    const t = this.playerBody.translation();
    this.camera.position.set(t.x, t.y + this.playerHeight * 0.42, t.z);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }

  private updateEnemies(dt: number): void {
    const now = this.clock.getElapsedTime();
    const playerPos = this.camera.position;
    const toRemove: number[] = [];

    for (let i = 0; i < this.enemies.length; i++) {
      const enemy = this.enemies[i];
      if (enemy.dying) {
        enemy.group.rotation.x += dt * 3;
        enemy.group.children.forEach(c => {
          if ((c as THREE.Mesh).material) {
            ((c as THREE.Mesh).material as THREE.MeshLambertMaterial).opacity -= dt * 3;
            ((c as THREE.Mesh).material as THREE.MeshLambertMaterial).transparent = true;
          }
        });
        if (now > enemy.dyingUntil) {
          this.scene.remove(enemy.group);
          toRemove.push(i);
        }
        continue;
      }
      if (!enemy.alive) continue;

      const toBase = this.basePos.clone().sub(enemy.group.position);
      const toPlayer = playerPos.clone().sub(enemy.group.position);
      const distToBase = toBase.length();
      const distToPlayer = toPlayer.length();

      // Target: base if closer, else player
      const target = distToBase < distToPlayer ? this.basePos.clone().setY(enemy.group.position.y) : playerPos.clone();
      const toTarget = target.sub(enemy.group.position);
      const distToTarget = toTarget.length();

      // Creeper: explode logic
      if (enemy.type === "creeper") {
        if (distToTarget < enemy.attackRange) {
          enemy.state = "exploding";
          enemy.explodeTimer += dt;
          // Flash
          const flash = Math.sin(enemy.explodeTimer * 18) > 0;
          (enemy.body.material as THREE.MeshLambertMaterial).color.setHex(flash ? 0xffffff : 0x3a9a3a);
          if (enemy.explodeTimer > 1.5) {
            this.explodeCreeper(enemy);
            toRemove.push(i);
            continue;
          }
        } else {
          enemy.state = "walk";
          enemy.explodeTimer = 0;
          (enemy.body.material as THREE.MeshLambertMaterial).color.setHex(ENEMY_CONFIGS.creeper.color);
        }
      }

      // Attack player if in range
      if (distToPlayer < enemy.attackRange && enemy.type !== "creeper" && now > enemy.nextAttack) {
        enemy.nextAttack = now + enemy.attackRate;
        const dmgMult = this.settings.difficulty === "easy" ? 0.6 : this.settings.difficulty === "hard" ? 1.5 : 1.0;
        this.takeDamage(Math.round(enemy.damage * dmgMult));
      }

      // Move toward target
      if (distToTarget > (enemy.type === "creeper" ? enemy.attackRange - 0.5 : 0.8)) {
        const dir = toTarget.normalize();
        enemy.group.position.addScaledVector(dir, enemy.speed * dt);
        enemy.group.rotation.y = Math.atan2(dir.x, dir.z);
      }

      // Leg animation
      enemy.movePhase += dt * enemy.speed * 3;
      enemy.group.children.forEach((c, idx) => {
        if (idx >= 2) (c as THREE.Mesh).rotation.x = Math.sin(enemy.movePhase + idx) * 0.4;
      });
    }

    for (let i = toRemove.length - 1; i >= 0; i--) {
      this.enemies.splice(toRemove[i], 1);
    }
  }

  private explodeCreeper(enemy: Enemy): void {
    this.audio.play("explosion", 1.0);
    this.scene.remove(enemy.group);
    enemy.alive = false;

    const blast = new THREE.PointLight(0xff6820, 8, 12);
    blast.position.copy(enemy.group.position);
    this.scene.add(blast);
    setTimeout(() => this.scene.remove(blast), 300);

    // AoE to player
    const distToPlayer = enemy.group.position.distanceTo(this.camera.position);
    if (distToPlayer < 6) {
      const falloff = 1 - distToPlayer / 6;
      this.takeDamage(Math.round(40 * falloff));
    }

    // Destroy nearby blocks
    const ep = enemy.group.position;
    for (let dx = -2; dx <= 2; dx++) {
      for (let dy = -1; dy <= 2; dy++) {
        for (let dz = -2; dz <= 2; dz++) {
          const wx = Math.floor(ep.x) + dx;
          const wy = Math.floor(ep.y) + dy;
          const wz = Math.floor(ep.z) + dz;
          const id = this.world.getBlock(wx, wy, wz);
          if (id !== "air" && id !== "obsidian") this.world.setBlock(wx, wy, wz, "air");
        }
      }
    }
    this.world.rebuildDirtyChunks();
    this.enemiesRemainingInWave--;
    this.score += ENEMY_CONFIGS.creeper.score;
    this.updateScoreHUD();
  }

  private updateSpawner(dt: number): void {
    if (this.spawnQueue.length === 0) return;
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      const next = this.spawnQueue.shift()!;
      this.spawnEnemy(next.type);
      this.spawnTimer = next.delay > 0 ? next.delay : 0;
    }
  }

  private updateTimers(dt: number): void {
    if (this.buildPhaseActive) {
      this.buildPhaseTimer -= dt;
      const remaining = Math.ceil(this.buildPhaseTimer);
      const el = document.getElementById("build-timer");
      if (el) el.textContent = `${remaining}s`;
      if (this.buildPhaseTimer <= 0) {
        this.buildPhaseActive = false;
        document.getElementById("build-panel")!.classList.remove("visible");
        this.startWave();
      }
    }
  }

  private takeDamage(amount: number): void {
    this.playerHealth = Math.max(0, this.playerHealth - amount);
    this.updateHealthHUD();
    if (this.playerHealth <= 0) this.endGame();
  }

  // ---------------------------------------------------------------------------
  // Game flow
  // ---------------------------------------------------------------------------
  private startGame(): void {
    this.gameState = "playing";
    this.round = 0;
    this.score = 0;
    this.playerHealth = this.playerMaxHealth;
    this.enemies.length = 0;
    this.spawnQueue = [];
    this.inventory.planks = 20;
    this.inventory.cobblestone = 10;
    this.inventory.stone = 5;
    this.inventory.glass = 5;

    document.getElementById("menu")!.classList.add("hidden");
    document.getElementById("gameover")!.classList.add("hidden");
    document.getElementById("hud")!.classList.add("visible");

    this.updateHealthHUD();
    this.updateScoreHUD();
    this.updateHotbar();
    this.updateBlockIndicator();

    // Start with a build phase so player can prepare
    this.round = 0;
    this.buildPhaseActive = true;
    this.buildPhaseTimer = this.buildPhaseDuration;
    document.getElementById("build-panel")!.classList.add("visible");
    this.showPhaseBanner("BUILD PHASE", "Fortify before the first wave!", 0x5d9e3a);
    this.enemiesRemainingInWave = 0;

    this.renderer.domElement.requestPointerLock();
  }

  private pauseGame(): void {
    this.gameState = "paused";
    document.getElementById("paused")!.classList.remove("hidden");
    document.exitPointerLock();
  }

  private resumeGame(): void {
    this.gameState = "playing";
    document.getElementById("paused")!.classList.add("hidden");
    this.renderer.domElement.requestPointerLock();
  }

  private endGame(): void {
    this.gameState = "gameover";
    document.getElementById("hud")!.classList.remove("visible");
    document.getElementById("build-panel")!.classList.remove("visible");
    document.getElementById("gameover")!.classList.remove("hidden");
    document.getElementById("go-score-val")!.textContent = this.score.toLocaleString();
    document.getElementById("go-rounds-val")!.textContent = String(this.round);
    document.exitPointerLock();
  }

  // ---------------------------------------------------------------------------
  // HUD
  // ---------------------------------------------------------------------------
  private setupHUD(): void {
    const hud = document.getElementById("hud")!;

    // Round info
    const roundInfo = document.createElement("div");
    roundInfo.id = "round-info";
    roundInfo.innerHTML = `<div id="round-label">WAVE</div><div id="round-number">—</div><div id="enemies-left"></div>`;
    hud.appendChild(roundInfo);

    // Health
    const healthBar = document.createElement("div");
    healthBar.id = "health-bar";
    healthBar.innerHTML = `<span class="health-icon">❤</span><div id="health-fill-wrap"><div id="health-fill"></div></div><div id="health-text">20</div>`;
    hud.appendChild(healthBar);

    // Score
    const scoreEl = document.createElement("div");
    scoreEl.id = "score-display";
    scoreEl.innerHTML = `<div id="score-label">SCORE</div><div id="score-value">0</div>`;
    hud.appendChild(scoreEl);

    // Crosshair
    const xhair = document.createElement("div");
    xhair.id = "crosshair";
    hud.appendChild(xhair);

    // Block indicator
    const blockInd = document.createElement("div");
    blockInd.id = "block-indicator";
    blockInd.innerHTML = `<div id="block-color-swatch"></div><span id="block-name-label">Planks</span>`;
    hud.appendChild(blockInd);

    // Hotbar
    const hotbar = document.createElement("div");
    hotbar.id = "hotbar";
    PLACEABLE_BLOCKS.forEach((id, i) => {
      const slot = document.createElement("div");
      slot.className = "hotbar-slot" + (i === 0 ? " active" : "");
      slot.dataset.block = id;
      slot.innerHTML = `<span class="slot-label">${BLOCK_DEFS[id].name}</span><span class="slot-count" id="slot-count-${id}">0</span>`;
      hotbar.appendChild(slot);
    });
    hud.appendChild(hotbar);

    // Kill feed
    const killFeed = document.createElement("div");
    killFeed.id = "kill-feed";
    hud.appendChild(killFeed);

    // Phase banner
    const banner = document.createElement("div");
    banner.id = "phase-banner";
    banner.innerHTML = `<div class="phase-title" id="phase-title"></div><div class="phase-subtitle" id="phase-subtitle"></div>`;
    hud.appendChild(banner);

    // Build panel
    const buildPanel = document.createElement("div");
    buildPanel.id = "build-panel";
    buildPanel.innerHTML = `<h3>Build Phase <span id="build-timer">30s</span></h3>`;
    PLACEABLE_BLOCKS.forEach((id) => {
      const opt = document.createElement("div");
      opt.className = "block-option";
      opt.dataset.block = id;
      const def = BLOCK_DEFS[id];
      const swatch = document.createElement("div");
      swatch.className = "block-swatch";
      swatch.style.background = `#${def.color.toString(16).padStart(6, "0")}`;
      opt.appendChild(swatch);
      opt.innerHTML += `<span class="block-name">${def.name}</span><span class="block-count" id="bp-count-${id}">0</span>`;
      opt.prepend(swatch);
      opt.addEventListener("click", () => {
        this.selectedBlock = id;
        this.updateHotbar();
        this.updateBlockIndicator();
        buildPanel.querySelectorAll(".block-option").forEach(el => el.classList.remove("selected"));
        opt.classList.add("selected");
      });
      buildPanel.appendChild(opt);
    });
    hud.appendChild(buildPanel);

    // Lock prompt
    const lockPrompt = document.createElement("div");
    lockPrompt.id = "lock-prompt";
    lockPrompt.className = "hidden";
    lockPrompt.innerHTML = `<p>Click to capture mouse</p>`;
    document.body.appendChild(lockPrompt);

    // Paused overlay
    const paused = document.createElement("div");
    paused.id = "paused";
    paused.className = "hidden";
    paused.innerHTML = `<h2>PAUSED</h2>`;
    document.body.appendChild(paused);
  }

  private setupMenu(): void {
    const menu = document.createElement("div");
    menu.id = "menu";
    menu.innerHTML = `
      <h1>CRAFTDEFENSE</h1>
      <p class="tagline">Build. Fortify. Survive.</p>
      <button class="menu-btn primary" id="btn-play">PLAY</button>
      <button class="menu-btn" id="btn-easy">Easy Mode</button>
      <button class="menu-btn" id="btn-hard">Hard Mode</button>
    `;
    document.body.appendChild(menu);

    const gameover = document.createElement("div");
    gameover.id = "gameover";
    gameover.className = "hidden";
    gameover.innerHTML = `
      <h2>GAME OVER</h2>
      <div class="go-score">Score: <span id="go-score-val">0</span> &nbsp;|&nbsp; Waves survived: <span id="go-rounds-val">0</span></div>
      <button class="menu-btn primary" id="btn-restart">PLAY AGAIN</button>
      <button class="menu-btn" id="btn-menu">MENU</button>
    `;
    document.body.appendChild(gameover);

    document.getElementById("btn-play")!.addEventListener("click", () => {
      this.settings.difficulty = "normal";
      this.audio.play("ui_click");
      this.startGame();
    });
    document.getElementById("btn-easy")!.addEventListener("click", () => {
      this.settings.difficulty = "easy";
      this.audio.play("ui_click");
      this.startGame();
    });
    document.getElementById("btn-hard")!.addEventListener("click", () => {
      this.settings.difficulty = "hard";
      this.audio.play("ui_click");
      this.startGame();
    });
    document.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).id === "btn-restart") { this.audio.play("ui_click"); this.startGame(); }
      if ((e.target as HTMLElement).id === "btn-menu") { this.audio.play("ui_click"); location.reload(); }
    });
  }

  private updateHealthHUD(): void {
    const pct = this.playerHealth / this.playerMaxHealth;
    document.getElementById("health-fill")!.style.width = `${pct * 100}%`;
    document.getElementById("health-text")!.textContent = String(this.playerHealth);
  }

  private updateScoreHUD(): void {
    document.getElementById("score-value")!.textContent = this.score.toLocaleString();
    document.getElementById("round-number")!.textContent = String(this.round);
    const alive = this.enemies.filter(e => e.alive && !e.dying).length;
    document.getElementById("enemies-left")!.textContent = alive > 0 ? `${alive} remaining` : "";
  }

  private updateHotbar(): void {
    PLACEABLE_BLOCKS.forEach((id, i) => {
      const slot = document.querySelector(`.hotbar-slot:nth-child(${i + 1})`);
      if (slot) slot.classList.toggle("active", id === this.selectedBlock);
      const countEl = document.getElementById(`slot-count-${id}`);
      if (countEl) countEl.textContent = String(this.inventory[id] ?? 0);
      const bpEl = document.getElementById(`bp-count-${id}`);
      if (bpEl) bpEl.textContent = String(this.inventory[id] ?? 0);
    });
  }

  private updateBlockIndicator(): void {
    const def = BLOCK_DEFS[this.selectedBlock];
    const swatch = document.getElementById("block-color-swatch")!;
    swatch.style.background = `#${def.color.toString(16).padStart(6, "0")}`;
    document.getElementById("block-name-label")!.textContent = def.name;
  }

  private showPhaseBanner(title: string, subtitle: string, _color: number): void {
    const banner = document.getElementById("phase-banner")!;
    document.getElementById("phase-title")!.textContent = title;
    document.getElementById("phase-subtitle")!.textContent = subtitle;
    banner.classList.add("visible");
    setTimeout(() => banner.classList.remove("visible"), 3000);
  }

  private showDamageNumber(worldPos: THREE.Vector3, amount: number, _isHeadshot: boolean): void {
    const projected = worldPos.clone().project(this.camera);
    if (projected.z > 1) return;
    const x = (projected.x * 0.5 + 0.5) * window.innerWidth;
    const y = (-projected.y * 0.5 + 0.5) * window.innerHeight;
    const el = document.createElement("div");
    el.className = "dmg-number";
    el.textContent = String(amount);
    el.style.left = `${x}px`;
    el.style.top  = `${y}px`;
    el.style.color = "#ff4444";
    document.getElementById("hud")!.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  private addKillFeedEntry(text: string): void {
    const feed = document.getElementById("kill-feed")!;
    const entry = document.createElement("div");
    entry.className = "kill-entry";
    entry.textContent = text;
    feed.prepend(entry);
    setTimeout(() => entry.remove(), 3500);
    while (feed.children.length > 4) feed.lastElementChild?.remove();
  }

  private updateRoundHUD(): void {
    document.getElementById("round-number")!.textContent = String(this.round);
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
  }
}

new App();
