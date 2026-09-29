class SoundManager {
  private ctx: AudioContext | null = null;
  private bgmPlaying = false;
  private bgmTimer: number | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Balloon pop sound
  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.6, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.09);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio fallback
    }
  }

  // Tactile button / card click
  playClick() {
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio fallback
    }
  }

  // Candle blow wind swoosh
  playBlow() {
    try {
      this.init();
      if (!this.ctx) return;
      // White noise buffer for wind/breath sound
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.2;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(150, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + 0.4);
    } catch {
      // Audio fallback
    }
  }

  // Cheerful chime / fanfare
  playWin() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine';
        const start = this.ctx.currentTime + idx * 0.09;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch {
      // Audio fallback
    }
  }

  // Celestial sparkle chime
  playSparkle() {
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [784, 988, 1175, 1568];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + i * 0.07);
        osc.stop(this.ctx.currentTime + i * 0.07 + 0.3);
      });
    } catch {
      // Audio fallback
    }
  }

  // Gentle music-box birthday song synth
  toggleBirthdayMelody(enable: boolean) {
    if (!enable) {
      this.bgmPlaying = false;
      if (this.bgmTimer) {
        window.clearTimeout(this.bgmTimer);
        this.bgmTimer = null;
      }
      return;
    }

    if (this.bgmPlaying) return;
    this.init();
    this.bgmPlaying = true;

    // Melody notes for "Happy Birthday to you"
    // Solfege: G4, G4, A4, G4, C5, B4 ...
    const melody: Array<{ note: number; dur: number }> = [
      { note: 392.00, dur: 0.3 }, // G4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 440.00, dur: 0.5 }, // A4
      { note: 392.00, dur: 0.5 }, // G4
      { note: 523.25, dur: 0.5 }, // C5
      { note: 493.88, dur: 0.9 }, // B4

      { note: 392.00, dur: 0.3 }, // G4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 440.00, dur: 0.5 }, // A4
      { note: 392.00, dur: 0.5 }, // G4
      { note: 587.33, dur: 0.5 }, // D5
      { note: 523.25, dur: 0.9 }, // C5

      { note: 392.00, dur: 0.3 }, // G4
      { note: 392.00, dur: 0.2 }, // G4
      { note: 783.99, dur: 0.5 }, // G5
      { note: 659.25, dur: 0.5 }, // E5
      { note: 523.25, dur: 0.5 }, // C5
      { note: 493.88, dur: 0.5 }, // B4
      { note: 440.00, dur: 0.8 }, // A4

      { note: 698.46, dur: 0.3 }, // F5
      { note: 698.46, dur: 0.2 }, // F5
      { note: 659.25, dur: 0.5 }, // E5
      { note: 523.25, dur: 0.5 }, // C5
      { note: 587.33, dur: 0.5 }, // D5
      { note: 523.25, dur: 1.1 }, // C5
    ];

    const playSequence = () => {
      if (!this.bgmPlaying || !this.ctx) return;
      let timeOffset = this.ctx.currentTime + 0.1;

      melody.forEach((item) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Celesta/music box bell quality
        osc.type = 'sine';
        osc.frequency.setValueAtTime(item.note, timeOffset);

        gain.gain.setValueAtTime(0.12, timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.0001, timeOffset + item.dur * 0.95);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(timeOffset);
        osc.stop(timeOffset + item.dur);

        timeOffset += item.dur;
      });

      const totalDuration = melody.reduce((acc, curr) => acc + curr.dur, 0);
      this.bgmTimer = window.setTimeout(() => {
        if (this.bgmPlaying) {
          playSequence();
        }
      }, (totalDuration + 2.5) * 1000);
    };

    playSequence();
  }
}

export const sound = new SoundManager();
