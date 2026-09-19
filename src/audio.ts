// Web Audio API Synthesizer & Web Speech Synthesis Engine

class AudioManager {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private isBgmEnabled = false;
  private isSfxEnabled = true;
  private bgmTimer: number | null = null;
  private bgmStep = 0;

  private initContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Toggle BGM
  public toggleBgm(): boolean {
    this.isBgmEnabled = !this.isBgmEnabled;
    if (this.isBgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.isBgmEnabled;
  }

  public getBgmEnabled(): boolean {
    return this.isBgmEnabled;
  }

  public toggleSfx(): boolean {
    this.isSfxEnabled = !this.isSfxEnabled;
    return this.isSfxEnabled;
  }

  public getSfxEnabled(): boolean {
    return this.isSfxEnabled;
  }

  // Cozy Cafe BGM Generator (Gentle Lofi Chords & Melody)
  public startBgm() {
    if (this.isBgmPlaying) return;
    try {
      this.initContext();
      this.isBgmPlaying = true;
      this.bgmStep = 0;
      this.scheduleBgmLoop();
    } catch {
      // Audio context might need user interaction
    }
  }

  public stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      window.clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  private scheduleBgmLoop() {
    if (!this.isBgmPlaying || !this.isBgmEnabled || !this.ctx || !this.bgmGain) return;

    // Cozy Jazz Chords (Frequency arrays for Cmaj7 -> Am7 -> Dm7 -> G7)
    const chords = [
      // Fmaj7: F3, A3, C4, E4
      [174.61, 220.0, 261.63, 329.63],
      // Em7: E3, G3, B3, D4
      [164.81, 196.0, 246.94, 293.66],
      // Dm7: D3, F3, A3, C4
      [146.83, 174.61, 220.0, 261.63],
      // Cmaj7: C3, E3, G3, B3
      [130.81, 164.81, 196.0, 246.94],
    ];

    const melodies = [
      [523.25, 659.25], // C5, E5
      [493.88, 587.33], // B4, D5
      [440.0, 523.25],  // A4, C5
      [392.0, 493.88],  // G4, B4
    ];

    const currentChord = chords[this.bgmStep % chords.length];
    const currentMelody = melodies[this.bgmStep % melodies.length];
    const now = this.ctx.currentTime;

    // Play chord pad
    currentChord.forEach((freq, idx) => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650 + idx * 80, now);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.028, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + 2.3);
    });

    // Gentle cafe bell melody
    setTimeout(() => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const mNow = this.ctx.currentTime;
      currentMelody.forEach((mFreq, mIdx) => {
        if (!this.ctx || !this.bgmGain) return;
        const mOsc = this.ctx.createOscillator();
        const mGain = this.ctx.createGain();
        mOsc.type = 'triangle';
        mOsc.frequency.setValueAtTime(mFreq, mNow + mIdx * 0.4);

        mGain.gain.setValueAtTime(0.001, mNow + mIdx * 0.4);
        mGain.gain.linearRampToValueAtTime(0.02, mNow + mIdx * 0.4 + 0.05);
        mGain.gain.exponentialRampToValueAtTime(0.0001, mNow + mIdx * 0.4 + 0.7);

        mOsc.connect(mGain);
        mGain.connect(this.bgmGain);
        mOsc.start(mNow + mIdx * 0.4);
        mOsc.stop(mNow + mIdx * 0.4 + 0.75);
      });
    }, 700);

    this.bgmStep++;
    this.bgmTimer = window.setTimeout(() => {
      this.scheduleBgmLoop();
    }, 2400); // 2.4s per chord measure
  }

  // SFX: Soft Click
  public playClick() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // SFX: Sizzle (Frying sound)
  public playSizzle() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.8);
    } catch {
      // ignore
    }
  }

  // SFX: Food Ready (Pleasant Oven Chime)
  public playReady() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      [1046.5, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.15, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

        osc.connect(gain);
        if (this.sfxGain) gain.connect(this.sfxGain);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // SFX: Food Served (Coins / Register Bell)
  public playServe() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      [880, 1174.66, 1760].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

        osc.connect(gain);
        if (this.sfxGain) gain.connect(this.sfxGain);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.4);
      });
    } catch {
      // ignore
    }
  }

  // SFX: Burnt (Alert thud)
  public playBurnt() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(110, now + 0.3);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // ignore
    }
  }

  // SFX: Quiz Correct (Triumphant Major Arpeggio)
  public playQuizCorrect() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.15, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        if (this.sfxGain) gain.connect(this.sfxGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // ignore
    }
  }

  // SFX: Quiz Wrong (Gentle soft boing)
  public playQuizWrong() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      if (this.sfxGain) gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.32);
    } catch {
      // ignore
    }
  }

  // SFX: Booster / Magic Sound
  public playBooster() {
    if (!this.isSfxEnabled) return;
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      [659.25, 830.61, 987.77, 1318.51].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0.14, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);

        osc.connect(gain);
        if (this.sfxGain) gain.connect(this.sfxGain);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } catch {
      // ignore
    }
  }

  // Web Speech Synthesis API: Speak Customer Order
  public speakOrder(phraseEn: string, pitch = 1.0, onEnd?: () => void) {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(phraseEn);
      utterance.lang = 'en-US';
      utterance.rate = 0.95;
      utterance.pitch = Math.min(1.6, Math.max(0.7, pitch));

      // Try to find a sweet female English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => (v.lang.startsWith('en') || v.lang.includes('US') || v.lang.includes('GB')) && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }
}

export const audioManager = new AudioManager();
