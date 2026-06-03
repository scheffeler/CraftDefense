import type { EnemyTypeName, WaveConfig } from "./types";
import { WAVE_CONFIGS, generateEndlessWave } from "./config/waves";

interface SpawnEntry {
  type: EnemyTypeName;
  gate: "north" | "south";
  delay: number;
}

export class WaveManager {
  private currentWave       = 0;
  private spawnQueue: SpawnEntry[] = [];
  private spawnTimer        = 0;
  private activeEnemyCount  = 0;
  private waveActive        = false;
  private _betweenWaveTimer = 0;
  private _endless          = false;
  private _currentCfg: WaveConfig | null = null;

  readonly betweenWaveDuration = 120; // seconds between waves

  onWaveComplete: (wave: number, bonusGold: number) => void = () => {};
  /** Called each second during the build phase so the UI can show a countdown. */
  onBetweenWaveTick: (secondsLeft: number) => void = () => {};

  get wave():        number  { return this.currentWave; }
  get isActive():    boolean { return this.waveActive; }
  /** Returns Infinity in endless mode so the HUD can show "∞". */
  get totalWaves():  number  { return this._endless ? Infinity : WAVE_CONFIGS.length; }
  get isEndless():   boolean { return this._endless; }
  /** Alias for Game.ts callers that use isEndlessMode. */
  get isEndlessMode(): boolean { return this._endless; }
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

    this._currentCfg = this.currentWave <= WAVE_CONFIGS.length
      ? WAVE_CONFIGS[this.currentWave - 1]
      : generateEndlessWave(this.currentWave);

    this.spawnQueue = [];

    let cumDelay = 0;
    for (const group of this._currentCfg.groups) {
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
      const bonusGold = this._currentCfg?.bonusGold ?? 0;
      const isLast = !this._endless && this.isLastWave();
      this._betweenWaveTimer = isLast ? 0 : this.betweenWaveDuration;
      this.onWaveComplete(this.currentWave, bonusGold);
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
    this._currentCfg      = null;
  }
}
