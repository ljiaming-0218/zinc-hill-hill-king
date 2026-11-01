export class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;

  unlock() {
    if (!this.ctx) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.gain.value = this.muted ? 0 : 0.22;
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : 0.22;
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, slide = 0) {
    if (!this.ctx || !this.master || this.muted) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(48, freq + slide), t + dur);
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.connect(amp);
    amp.connect(this.master);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  shoot() {
    this.tone(740, 0.05, "square", 0.05, -420);
  }

  hit() {
    this.tone(240, 0.06, "square", 0.05, -80);
  }

  explode() {
    this.tone(130, 0.22, "sawtooth", 0.08, -80);
  }

  hurt() {
    this.tone(180, 0.16, "triangle", 0.08, -100);
  }

  pickup() {
    this.tone(523, 0.07, "square", 0.05);
    window.setTimeout(() => this.tone(784, 0.09, "square", 0.05), 70);
  }

  wave() {
    this.tone(392, 0.1, "sine", 0.05);
    window.setTimeout(() => this.tone(587, 0.14, "sine", 0.05), 90);
  }

  warn() {
    this.tone(96, 0.26, "sawtooth", 0.07, -28);
    window.setTimeout(() => this.tone(144, 0.18, "square", 0.045), 140);
  }
}
