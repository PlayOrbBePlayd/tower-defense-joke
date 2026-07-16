/* audio.js — Self-contained WebAudio sound engine. No external files.
 * Classic game-show cues: reveal ding, strike buzzer, applause-ish swell,
 * round-win fanfare, and a fast-money "flip" tick. */
(function (global) {
  'use strict';
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      try { ctx = new (global.AudioContext || global.webkitAudioContext)(); }
      catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function tone(freq, start, dur, type, gain) {
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + start;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.25, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g); g.connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  function noise(start, dur, gain, filterFreq) {
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + start;
    const len = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, len, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain();
    g.gain.setValueAtTime(gain || 0.2, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const f = c.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = filterFreq || 1200; f.Q.value = 0.8;
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(t0); src.stop(t0 + dur);
  }

  const Sound = {
    setEnabled(v) { enabled = v; },
    isEnabled() { return enabled; },
    unlock() { ac(); }, // call from a user gesture

    // Correct answer reveal — bright ascending "ding-ding!"
    reveal() {
      if (!enabled) return;
      tone(660, 0, 0.12, 'triangle', 0.3);
      tone(880, 0.09, 0.22, 'triangle', 0.32);
      tone(1320, 0.16, 0.3, 'sine', 0.18);
    },

    // Big correct chime (top answer)
    ding() {
      if (!enabled) return;
      tone(523, 0, 0.5, 'sine', 0.28);
      tone(659, 0, 0.5, 'sine', 0.24);
      tone(784, 0, 0.6, 'sine', 0.22);
      tone(1046, 0.02, 0.7, 'sine', 0.16);
    },

    // Wrong answer — classic double buzzer
    strike() {
      if (!enabled) return;
      tone(160, 0, 0.28, 'sawtooth', 0.34);
      tone(120, 0, 0.32, 'square', 0.24);
      noise(0, 0.3, 0.12, 700);
    },

    // Round won — rising fanfare
    fanfare() {
      if (!enabled) return;
      const notes = [523, 659, 784, 1046, 1318];
      notes.forEach((f, i) => tone(f, i * 0.11, 0.45, 'triangle', 0.26));
      tone(1568, 0.55, 0.7, 'sine', 0.2);
      noise(0.5, 0.5, 0.06, 5000);
    },

    // Fast-money flip / tick
    flip() {
      if (!enabled) return;
      tone(440, 0, 0.06, 'square', 0.18);
      tone(880, 0.03, 0.08, 'triangle', 0.14);
    },

    // Timer end
    timeUp() {
      if (!enabled) return;
      tone(392, 0, 0.6, 'sawtooth', 0.3);
      tone(196, 0.05, 0.7, 'square', 0.22);
    },

    // Soft UI click
    click() {
      if (!enabled) return;
      tone(660, 0, 0.04, 'square', 0.08);
    },
  };

  global.Sound = Sound;
})(window);
