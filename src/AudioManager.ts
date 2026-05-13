type SoundName =
  | "arrow" | "cannon_fire" | "ice_fire"
  | "hit" | "death"
  | "place" | "upgrade" | "sell"
  | "ui_click"
  | "wave_start" | "wave_complete" | "base_hit"
  | "explosion" | "victory"
  | "swing" | "bow_charge" | "arrow_release"
  | "block_break" | "block_place" | "pickup"
  | "eat" | "player_hurt" | "player_death"
  | "step_grass" | "step_stone" | "step_wood" | "step_dirt" | "step_sand";

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private uiGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  volume = { master: 0.7, effects: 1.0, ui: 0.8 };

  // Ambient chirp/cricket state
  private ambientTimer  = 0;
  private _isDaytime    = true;
  private _cricketNode: OscillatorNode | null = null;
  private _cricketGain: GainNode | null = null;

  private ensureCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain  = this.ctx.createGain();
      this.effectsGain = this.ctx.createGain();
      this.uiGain      = this.ctx.createGain();
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.18;
      this.effectsGain.connect(this.masterGain);
      this.uiGain.connect(this.masterGain);
      this.ambientGain.connect(this.masterGain);
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

  /**
   * Call from game loop. daylight in [0..1], where > 0.3 = day.
   * Schedules random bird chirps during day, cricket drone at night.
   */
  updateAmbient(dt: number, daylight: number): void {
    if (!this.ctx) return; // wait until audio context is initialized
    const ctx = this.ctx;
    const isDaytime = daylight > 0.25;

    // Switch between night cricket drone and day mode
    if (isDaytime !== this._isDaytime) {
      this._isDaytime = isDaytime;
      if (!isDaytime) {
        this.startCrickets(ctx);
      } else {
        this.stopCrickets();
      }
    }

    // Fade cricket gain with nightness
    if (this._cricketGain) {
      const cricketVol = Math.max(0, (0.25 - daylight) / 0.25) * 0.12;
      this._cricketGain.gain.setTargetAtTime(cricketVol, ctx.currentTime, 0.5);
    }

    // Random bird chirps during daytime
    if (isDaytime) {
      this.ambientTimer -= dt;
      if (this.ambientTimer <= 0) {
        this.ambientTimer = 2 + Math.random() * 4;
        this.spawnBirdChirp(ctx);
      }
    }
  }

  private spawnBirdChirp(ctx: AudioContext): void {
    const dest = this.ambientGain!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.06, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    g.connect(dest);

    // Vary bird pitch for natural feel
    const baseFreq = 2000 + Math.random() * 1500;
    const chirpCount = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < chirpCount; i++) {
      const t = ctx.currentTime + i * 0.08;
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq + Math.random() * 200, t);
      osc.frequency.linearRampToValueAtTime(baseFreq + 400 + Math.random() * 300, t + 0.04);
      og.gain.setValueAtTime(0.08, t);
      og.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
      osc.connect(og); og.connect(dest);
      osc.start(t); osc.stop(t + 0.08);
    }
  }

  private startCrickets(ctx: AudioContext): void {
    if (this._cricketNode) return;
    this._cricketGain = ctx.createGain();
    this._cricketGain.gain.value = 0;
    this._cricketGain.connect(this.ambientGain!);

    // Cricket = fast LFO-modulated oscillator at ~4kHz
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 4200;

    const lfo = ctx.createOscillator();
    lfo.type = "square";
    lfo.frequency.value = 18 + Math.random() * 4;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    osc.connect(this._cricketGain);
    osc.start();
    lfo.start();
    this._cricketNode = osc;
  }

  private stopCrickets(): void {
    if (this._cricketNode) {
      try { this._cricketNode.stop(); } catch { /* ignore */ }
      this._cricketNode = null;
    }
    this._cricketGain = null;
  }

  play(sound: SoundName, vol = 1.0): void {
    const ctx = this.ensureCtx();
    const isUI = sound === "ui_click" || sound === "upgrade" || sound === "sell";
    const dest = isUI ? this.uiGain! : this.effectsGain!;

    const gain = ctx.createGain();
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

    const tone = (freq: number, dur: number, type: OscillatorType = "sine", targetGain = vol) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type; osc.frequency.value = freq;
      g.gain.setValueAtTime(targetGain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(g); g.connect(dest);
      osc.start(); osc.stop(ctx.currentTime + dur + 0.05);
    };

    switch (sound) {
      case "arrow":
        tone(440, 0.05, "sawtooth"); noiseBurst(0.04, 1200, 0.02);
        break;
      case "cannon_fire":
        noiseBurst(0.5, 80, 0.3); tone(55, 0.4, "sawtooth");
        break;
      case "ice_fire":
        noiseBurst(0.12, 4000, 0.05); tone(880, 0.1, "sine", 0.3);
        break;
      case "hit":
        noiseBurst(0.1, 800, 0.04); tone(120, 0.08, "square", 0.5);
        break;
      case "death":
        noiseBurst(0.3, 200, 0.15); tone(80, 0.25, "sawtooth");
        break;
      case "place":
        noiseBurst(0.06, 600, 0.025);
        break;
      case "upgrade": {
        const freqs = [523, 659, 784];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const t = ctx.currentTime + i * 0.09;
          osc.type = "sine"; osc.frequency.value = f;
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime(vol, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.connect(g); g.connect(dest);
          osc.start(t); osc.stop(t + 0.12);
        });
        break;
      }
      case "sell":
        tone(523, 0.08, "sine"); tone(392, 0.12, "sine");
        break;
      case "ui_click":
        tone(880, 0.06, "sine");
        break;
      case "wave_start":
        tone(220, 0.15, "sawtooth"); tone(330, 0.2, "sawtooth");
        break;
      case "wave_complete": {
        const notes = [523, 659, 784, 1047];
        notes.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const t = ctx.currentTime + i * 0.1;
          osc.type = "sine"; osc.frequency.value = f;
          g.gain.setValueAtTime(0.001, t);
          g.gain.linearRampToValueAtTime(vol * 0.8, t + 0.03);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(g); g.connect(dest);
          osc.start(t); osc.stop(t + 0.25);
        });
        break;
      }
      case "base_hit":
        noiseBurst(0.2, 100, 0.1); tone(60, 0.3, "sawtooth");
        break;
      case "explosion":
        noiseBurst(0.5, 80, 0.3); tone(60, 0.4, "sawtooth");
        break;
      case "victory": {
        const chord = [523, 659, 784, 1047];
        chord.forEach(f => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = "sine"; osc.frequency.value = f;
          g.gain.setValueAtTime(vol * 0.5, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
          osc.connect(g); g.connect(dest);
          osc.start(); osc.stop(ctx.currentTime + 1.6);
        });
        break;
      }

      // ── FPS combat & interaction sounds ────────────────────────────────────
      case "swing":
        noiseBurst(0.08, 2000, 0.035);
        tone(200, 0.06, "sawtooth", 0.6);
        break;

      case "bow_charge":
        tone(330, 0.15, "sine", 0.3);
        tone(440, 0.1, "sine", 0.2);
        break;

      case "arrow_release":
        noiseBurst(0.05, 3000, 0.02);
        tone(660, 0.04, "sawtooth", 0.5);
        break;

      case "block_break":
        noiseBurst(0.18, 300, 0.08);
        tone(90, 0.12, "square", 0.4);
        break;

      case "block_place":
        noiseBurst(0.06, 500, 0.025);
        tone(160, 0.05, "square", 0.5);
        break;

      case "pickup":
        tone(880, 0.05, "sine", 0.5);
        tone(1047, 0.07, "sine", 0.4);
        break;

      case "eat":
        noiseBurst(0.12, 600, 0.05);
        tone(220, 0.08, "sine", 0.3);
        break;

      case "player_hurt":
        tone(180, 0.12, "sawtooth", 0.7);
        noiseBurst(0.08, 400, 0.04);
        break;

      case "player_death":
        noiseBurst(0.4, 150, 0.2);
        tone(100, 0.35, "sawtooth", 0.8);
        tone(60, 0.5, "sine", 0.5);
        break;

      // ── Footsteps ──────────────────────────────────────────────────────────
      case "step_grass": {
        // soft thud + rustle
        noiseBurst(0.07, 150 + Math.random() * 80, 0.035);
        noiseBurst(0.05, 2000 + Math.random() * 500, 0.02);
        break;
      }
      case "step_dirt": {
        noiseBurst(0.08, 120 + Math.random() * 60, 0.04);
        break;
      }
      case "step_stone": {
        // sharp click
        noiseBurst(0.06, 400 + Math.random() * 200, 0.025);
        tone(80 + Math.random() * 40, 0.04, "square", 0.25);
        break;
      }
      case "step_wood": {
        // hollow thud
        noiseBurst(0.07, 250 + Math.random() * 100, 0.03);
        tone(130 + Math.random() * 50, 0.05, "sine", 0.2);
        break;
      }
      case "step_sand": {
        // soft hiss
        noiseBurst(0.09, 3000 + Math.random() * 1000, 0.04);
        break;
      }
    }
  }
}
