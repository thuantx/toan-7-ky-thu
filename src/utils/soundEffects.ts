import confetti from 'canvas-confetti';

// Sound effect synthesizer using Web Audio API (zero external asset loading, zero latency, works 100% offline)
class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    try {
      const saved = localStorage.getItem('toan7_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  private getAudioContext(): AudioContext | null {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    try {
      localStorage.setItem('toan7_sound_enabled', String(enabled));
    } catch {}
  }

  public toggle(): boolean {
    this.setEnabled(!this.soundEnabled);
    return this.soundEnabled;
  }

  // Play crisp, cheerful success chime (C5 -> E5 -> G5 -> C6)
  public playCorrect(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const notes = [
        { freq: 523.25, time: 0.00, duration: 0.15 }, // C5
        { freq: 659.25, time: 0.08, duration: 0.15 }, // E5
        { freq: 783.99, time: 0.16, duration: 0.18 }, // G5
        { freq: 1046.50, time: 0.24, duration: 0.35 } // C6
      ];

      notes.forEach(({ freq, time, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // warm, pleasant bell chime
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + duration);
      });
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }

  // Play gentle, soft descending tone for incorrect answer
  public playIncorrect(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }
  }
}

export const soundManager = new SoundManager();

// Celebration mini fireworks burst when answering correctly
export function triggerMiniFireworks(xRatio: number = 0.5, yRatio: number = 0.45) {
  try {
    // Burst 1: Core fireworks bloom
    confetti({
      particleCount: 45,
      spread: 60,
      startVelocity: 30,
      origin: { x: xRatio, y: yRatio },
      colors: ['#10b981', '#f59e0b', '#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6'],
      ticks: 160,
      gravity: 1.1,
      scalar: 0.9,
      disableForReducedMotion: true,
    });

    // Burst 2: Micro sparkling stars slightly delayed
    setTimeout(() => {
      confetti({
        particleCount: 25,
        angle: 60,
        spread: 55,
        startVelocity: 25,
        origin: { x: Math.max(0.2, xRatio - 0.15), y: yRatio + 0.05 },
        colors: ['#fbbf24', '#34d399', '#60a5fa'],
        shapes: ['circle'],
        scalar: 0.7,
        ticks: 120,
      });

      confetti({
        particleCount: 25,
        angle: 120,
        spread: 55,
        startVelocity: 25,
        origin: { x: Math.min(0.8, xRatio + 0.15), y: yRatio + 0.05 },
        colors: ['#fbbf24', '#f43f5e', '#a855f7'],
        shapes: ['circle'],
        scalar: 0.7,
        ticks: 120,
      });
    }, 120);
  } catch (err) {
    console.warn('Confetti error:', err);
  }
}
