type SoundName =
  | "arrow" | "cannon_fire" | "ice_fire"
  | "hit" | "death"
  | "place" | "upgrade" | "sell"
  | "ui_click"
  | "wave_start" | "wave_complete" | "base_hit"
  | "explosion" | "victory";

export class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private effectsGain: GainNode | null = null;
  private uiGain: GainNode | null = null;
  volume = { master: 0.7, effects: 1.0, ui: 0.8 };

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
    }
  }
}
