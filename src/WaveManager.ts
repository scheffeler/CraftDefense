import type { EnemyTypeName, WaveConfig } from "./types";
import { WAVE_CONFIGS } from "./config/waves";

interface SpawnEntry {
  type: EnemyTypeName;
  gate: "north" | "south";
  delay: number;
}

/** Procedurally generate an endless wave config for waves beyond the scripted ones. */
function generateEndlessConfig(waveNum: number): WaveConfig {
  // Scale factor grows with each wave beyond 10
  const n = waveNum - WAVE_CONFIGS.length; // n=1 for wave 11, n=2 for wave 12, ...
  const scale = 1 + n * 0.15;

  const goblinCount  = Math.round(10 * scale);
  const orcCount     = Math.round(4  * scale);
  const trollCount   = Math.min(6, 1 + Math.floor(n / 3));
  const creeperCount = Math.min(4, Math.floor(n / 4));
  const eliteOrc     = n >= 3 ? Math.round(2 * (1 + n * 0.1)) : 0;

  const groups: WaveConfig["groups"] = [
    { type: "goblin", count: goblinCount, spawnInterval: Math.max(0.6, 1.8 / scale), gate: "north" },
    { type: "orc",    count: orcCount,    spawnInterval: Math.max(1.0, 2.2 / scale), gate: "south" },
    { type: "troll",  count: trollCount,  spawnInterval: 3.5, gate: "north" },
  ];
  if (creeperCount > 0) groups.push({ type: "creeper", count: creeperCount, spawnInterval: 5.0, gate: "north" });
  if (eliteOrc > 0)     groups.push({ type: "orc",     count: eliteOrc,     spawnInterval: 2.0, gate: "south" });

  // Every 5 endless waves (15, 20, 25...) spawn a mini-boss (uruk captain at reduced HP)
  if (n % 5 === 0) {
    groups.push({ type: "uruk_captain", count: 1, spawnInterval: 0, gate: "north" });
  }

  const bonusGold = Math.round(100 * scale);
  return { wave: waveNum, groups, bonusGold };
}

export class WaveManager {
  private currentWave       = 0;
  private spawnQueue: SpawnEntry[] = [];
  private spawnTimer        = 0;
  private activeEnemyCount  = 0;
  private waveActive        = false;
  private _betweenWaveTimer = 0;
  private _endless          = false;

  readonly betweenWaveDuration = 120; // seconds between waves

  onWaveComplete: (wave: number, bonusGold: number) => void = () => {};
  /** Called each second during the build phase so the UI can show a countdown. */
  onBetweenWaveTick: (secondsLeft: number) => void = () => {};

  get wave():        number  { return this.currentWave; }
  get isActive():    boolean { return this.waveActive; }
  get totalWaves():  number  { return WAVE_CONFIGS.length; }
  get isEndless():   boolean { return this._endless; }
  get timeUntilNextWave(): number { return Math.ceil(this._betweenWaveTimer); }
  get isBetweenWaves(): boolean {
    return !this.waveActive &&
      this.currentWave > 0 &&
      (this._endless || this.currentWave < WAVE_CONFIGS.length) &&
      this._betweenWaveTimer > 0;
  }

  startWave(spawn: (type: EnemyTypeName, gate: "north" | "south") => void): void {
    if (this.waveActive || (!this._endless && this.currentWave >= WAVE_CONFIGS.length)) return;
    this.currentWave++;
    this.waveActive = true;
    this.activeEnemyCount = 0;
    this._betweenWaveTimer = 0;

    const cfg = this.currentWave <= WAVE_CONFIGS.length
      ? WAVE_CONFIGS[this.currentWave - 1]
      : generateEndlessConfig(this.currentWave);

    this.spawnQueue = [];

    let cumDelay = 0;
    for (const group of cfg.groups) {
      for (let i = 0; i < group.count; i++) {
        this.spawnQueue.push({
          type: group.type,
          gate: group.gate ?? "north",
          delay: cumDelay,
        });
        cumDelay += group.spawnInterval;
        this.activeEnemyCount++;
      }
    }

    this.spawnTimer = 0;
    this._spawn = spawn;
  }

  /** Activate endless mode — allows wave generation beyond the scripted set. */
  enableEndless(): void {
    this._endless = true;
    this._betweenWaveTimer = this.betweenWaveDuration;
  }

  private _spawn: (type: EnemyTypeName, gate: "north" | "south") => void = () => {};
  private _tickAccum = 0;

  update(dt: number): void {
    if (this.waveActive) {
      this.spawnTimer += dt;
      while (
        this.spawnQueue.length > 0 &&
        this.spawnQueue[0].delay <= this.spawnTimer
      ) {
        const entry = this.spawnQueue.shift()!;
        this._spawn(entry.type, entry.gate);
      }
    } else if (this._betweenWaveTimer > 0) {
      const prev = this._betweenWaveTimer;
      this._betweenWaveTimer = Math.max(0, this._betweenWaveTimer - dt);
      // Fire tick callback once per second
      this._tickAccum += dt;
      if (this._tickAccum >= 1) {
        this._tickAccum -= 1;
        this.onBetweenWaveTick(this.timeUntilNextWave);
      }
      if (prev > 0 && this._betweenWaveTimer === 0) {
        this.onBetweenWaveTick(0);
      }
    }
  }

  onEnemyEliminated(): void {
    this.activeEnemyCount = Math.max(0, this.activeEnemyCount - 1);
    if (
      this.activeEnemyCount === 0 &&
      this.spawnQueue.length === 0 &&
      this.waveActive
    ) {
      this.waveActive = false;
      const cfg = this.currentWave <= WAVE_CONFIGS.length
        ? WAVE_CONFIGS[this.currentWave - 1]
        : generateEndlessConfig(this.currentWave);
      const isLast = !this._endless && this.isLastWave();
      this._betweenWaveTimer = isLast ? 0 : this.betweenWaveDuration;
      this.onWaveComplete(this.currentWave, cfg.bonusGold);
    }
  }

  isLastWave(): boolean {
    return !this._endless && this.currentWave >= WAVE_CONFIGS.length;
  }

  reset(): void {
    this.currentWave      = 0;
    this.spawnQueue       = [];
    this.spawnTimer       = 0;
    this.activeEnemyCount = 0;
    this.waveActive       = false;
    this._betweenWaveTimer = 0;
    this._tickAccum       = 0;
    this._endless         = false;
  }
}
