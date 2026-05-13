import type { EnemyTypeName } from "./types";
import { WAVE_CONFIGS } from "./config/waves";

interface SpawnEntry {
  type: EnemyTypeName;
  delay: number;
}

export class WaveManager {
  private currentWave = 0;
  private spawnQueue: SpawnEntry[] = [];
  private spawnTimer = 0;
  private activeEnemyCount = 0;
  private waveActive = false;

  onWaveComplete: (wave: number, bonusGold: number) => void = () => {};

  get wave(): number { return this.currentWave; }
  get isActive(): boolean { return this.waveActive; }
  get totalWaves(): number { return WAVE_CONFIGS.length; }

  startWave(spawn: (type: EnemyTypeName) => void): void {
    if (this.waveActive || this.currentWave >= WAVE_CONFIGS.length) return;
    this.currentWave++;
    this.waveActive = true;
    this.activeEnemyCount = 0;

    const cfg = WAVE_CONFIGS[this.currentWave - 1];
    this.spawnQueue = [];

    let cumDelay = 0;
    for (const group of cfg.groups) {
      for (let i = 0; i < group.count; i++) {
        this.spawnQueue.push({ type: group.type, delay: cumDelay });
        cumDelay += group.spawnInterval;
        this.activeEnemyCount++;
      }
    }

    this.spawnTimer = 0;
    this._spawn = spawn;
  }

  private _spawn: (type: EnemyTypeName) => void = () => {};

  update(dt: number): void {
    if (!this.waveActive || this.spawnQueue.length === 0) return;
    this.spawnTimer += dt;

    while (this.spawnQueue.length > 0 && this.spawnQueue[0].delay <= this.spawnTimer) {
      const entry = this.spawnQueue.shift()!;
      this._spawn(entry.type);
    }
  }

  onEnemyEliminated(): void {
    this.activeEnemyCount = Math.max(0, this.activeEnemyCount - 1);
    if (this.activeEnemyCount === 0 && this.spawnQueue.length === 0 && this.waveActive) {
      this.waveActive = false;
      const cfg = WAVE_CONFIGS[this.currentWave - 1];
      this.onWaveComplete(this.currentWave, cfg.bonusGold);
    }
  }

  isLastWave(): boolean {
    return this.currentWave >= WAVE_CONFIGS.length;
  }

  reset(): void {
    this.currentWave = 0;
    this.spawnQueue = [];
    this.spawnTimer = 0;
    this.activeEnemyCount = 0;
    this.waveActive = false;
  }
}
