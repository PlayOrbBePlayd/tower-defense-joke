/* ============================================================================
 * store.js — Single source of truth for the whole app.
 *
 * The Control dashboard, the Board display, the Editor and the Branding page
 * are separate windows/tabs. They share ONE state object that lives in
 * localStorage and is broadcast between windows in real time.
 *
 * Sync strategy (belt & braces so it works when served OR opened as files):
 *   - localStorage        -> persistence + cross-window `storage` events
 *   - BroadcastChannel    -> instant same-origin cross-window messaging
 *
 * Any window can `Store.patch(...)` and every other window sees it immediately.
 * ==========================================================================*/
(function (global) {
  'use strict';

  const LS_KEY = 'ff_state_v5';
  const CHANNEL = 'family-feud-live';
  // 8 fast-money answer slots per player — one per speed-round question category.
  const FAST_SLOTS = 8;

  // ---- Default content ------------------------------------------------------
  const DEFAULT_THEME = {
    title: 'FAMILY FEUD',
    subtitle: 'TEAMBUILDING ROI EDITION',
    logo: '',                 // dataURL, optional
    primary: '#1746c9',       // board blue
    accent: '#ffc21c',        // gold
    deep: '#050b2e',          // deep background
    text: '#ffffff',
    strike: '#e23b3b',
  };

  const DEFAULT_STATE = {
    v: 5,
    clientName: 'TeamBuilding ROI',
    theme: clone(DEFAULT_THEME),

    // Show-open intro reveal: bump introId to (re)play it on the board.
    introId: 0,
    // Show-close outro (balloons): bump outroId to (re)play it.
    outroId: 0,

    teams: [
      { name: 'TEAM 1', score: 0 },
      { name: 'TEAM 2', score: 0 },
    ],

    // ---- Event / tournament mode (many teams, multiple rounds, leaderboard) ----
    event: {
      on: false,
      totalRounds: 10,
      round: 1,
      showFinal: false,        // show the FINAL STANDINGS screen
      // Which two teams face off each round: matchups[roundIdx] = [teamA, teamB]
      matchups: [],
      // Buzzer face-off for the current round
      faceoff: { buzzed: null, control: null },   // team indices
    },

    // ---- Main game round ----
    main: {
      questionIndex: 0,
      revealed: [],            // bool[] per answer
      strikes: 0,              // 0..3
      strikeFlash: 0,          // increments to trigger the big red X flash
      bank: 0,                 // accumulated points this round
      activeTeam: null,        // 0 | 1 | null (highlighted team)
      awardTeam: null,         // team the bank was awarded to (for animation)
      showQuestion: true,
    },

    // ---- Fast money / final round ----
    fast: {
      active: false,
      questionIndex: 0,        // which speed-round question is being asked
      playerView: 1,           // which player's answers are shown on board (1|2)
      // per-player: array of {answer, points, revealed} — 5 slots each
      p1: emptyFast(),
      p2: emptyFast(),
      timerSeconds: 20,
      timerRunning: false,
      timerLabel: '',
      showTotals: false,
      revealAll: false,
    },

    // ---- Jeopardy opener round ----
    jeop: {
      active: null,            // null | {c, r, showAnswer:false}
      used: {},                // {"c:r": true}
      awardSign: 1,            // +1 award / -1 deduct
    },

    // ---- Which mode the BOARD is currently showing ----
    boardMode: 'logo',         // 'logo' | 'main' | 'fast'

    // ---- Content library ----
    questions: {
      main: [],                // {q, answers:[{text,points}]}
      fast: [],                // {q, answers:[{text,points}]}  (answers = ranked responses)
      jeopardy: { categories: [] },   // see js/data.js for the clue shape
    },

    // ---- Saved client branding+content profiles ----
    profiles: [],

    // signalling
    _rev: 0,
    _fx: null,                 // one-shot effect: {type, id}
  };

  function emptyFast() {
    return Array.from({ length: FAST_SLOTS }, () => ({ answer: '', points: 0, revealed: false }));
  }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  // ---- State load / seed ----------------------------------------------------
  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return migrate(parsed);
      }
    } catch (e) { /* ignore */ }
    const seeded = clone(DEFAULT_STATE);
    seeded.questions = global.FF_DEFAULT_QUESTIONS
      ? clone(global.FF_DEFAULT_QUESTIONS)
      : { main: [], fast: [] };
    initRound(seeded);
    return seeded;
  }

  function migrate(s) {
    // Ensure all top-level keys exist (forward-compat with older saves).
    const base = clone(DEFAULT_STATE);
    const merged = Object.assign({}, base, s);
    merged.theme = Object.assign({}, base.theme, s.theme || {});
    merged.main = Object.assign({}, base.main, s.main || {});
    merged.fast = Object.assign({}, base.fast, s.fast || {});
    merged.event = Object.assign({}, base.event, s.event || {});
    merged.jeop = Object.assign({}, base.jeop, s.jeop || {});
    merged.teams = s.teams && s.teams.length ? s.teams : base.teams;
    if (!s.questions || !s.questions.main || !s.questions.main.length) {
      merged.questions = global.FF_DEFAULT_QUESTIONS
        ? clone(global.FF_DEFAULT_QUESTIONS) : base.questions;
    }
    // Older saves predate the Jeopardy bank — seed it from defaults.
    if (!merged.questions.jeopardy && global.FF_DEFAULT_QUESTIONS) {
      merged.questions.jeopardy = clone(global.FF_DEFAULT_QUESTIONS.jeopardy);
    }
    if (!Array.isArray(merged.main.revealed)) merged.main.revealed = [];
    // Pad older saves' fast-money slots up to the current count (5 -> 8).
    ['p1', 'p2'].forEach((k) => {
      if (!Array.isArray(merged.fast[k])) merged.fast[k] = [];
      while (merged.fast[k].length < FAST_SLOTS) {
        merged.fast[k].push({ answer: '', points: 0, revealed: false });
      }
    });
    return merged;
  }

  // Set up a fresh main-round reveal array sized to the current question.
  function initRound(s) {
    const q = s.questions.main[s.main.questionIndex];
    const n = q ? q.answers.length : 0;
    s.main.revealed = Array.from({ length: n }, () => false);
    s.main.strikes = 0;
    s.main.bank = 0;
    s.main.awardTeam = null;
  }

  // ---- Cross-window sync ----------------------------------------------------
  let channel = null;
  try { channel = new BroadcastChannel(CHANNEL); } catch (e) { channel = null; }

  const listeners = new Set();
  let syncSend = null;   // set by the optional WebSocket layer (js/sync.js)

  function persist() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {}
  }

  function emit() {
    listeners.forEach((fn) => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  function broadcast() {
    persist();
    if (channel) {
      try { channel.postMessage({ type: 'state', state: state }); } catch (e) {}
    }
    if (syncSend) {
      try { syncSend(state); } catch (e) {}
    }
  }

  if (channel) {
    channel.onmessage = (ev) => {
      if (ev.data && ev.data.type === 'state') {
        state = ev.data.state;
        emit();
      }
    };
  }

  // Fallback for browsers/file:// where BroadcastChannel is unavailable.
  global.addEventListener('storage', (ev) => {
    if (ev.key === LS_KEY && ev.newValue) {
      try {
        state = JSON.parse(ev.newValue);
        emit();
      } catch (e) {}
    }
  });

  // ---- Public API -----------------------------------------------------------
  const Store = {
    get() { return state; },

    // Merge a shallow patch object into state (deep for known nested keys),
    // bump revision, persist, broadcast, and notify local listeners.
    patch(mutator) {
      if (typeof mutator === 'function') {
        mutator(state);
      } else if (mutator && typeof mutator === 'object') {
        deepMerge(state, mutator);
      }
      state._rev = (state._rev || 0) + 1;
      broadcast();
      emit();
    },

    // Fire a one-shot visual/audio effect on all boards (confetti, fanfare…).
    fx(type, payload) {
      state._fx = { type, payload: payload || null, id: (state._rev || 0) + 1 + Math.floor(performance.now()) };
      Store.patch(() => {});
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },

    reset() {
      const fresh = clone(DEFAULT_STATE);
      fresh.questions = global.FF_DEFAULT_QUESTIONS
        ? clone(global.FF_DEFAULT_QUESTIONS) : { main: [], fast: [] };
      initRound(fresh);
      state = fresh;
      Store.patch(() => {});
    },

    initRound() { initRound(state); },
    emptyFast,

    // Grow/shrink the team roster to exactly n teams, preserving existing
    // names & scores. New teams get sensible default names.
    setTeamCount(n) {
      n = Math.max(1, Math.min(24, n | 0));
      const t = state.teams;
      while (t.length < n) t.push({ name: 'TEAM ' + (t.length + 1), score: 0 });
      if (t.length > n) t.length = n;
    },

    DEFAULT_THEME,
    LS_KEY,

    // ---- Hooks for the optional WebSocket sync layer (js/sync.js) ----
    // Register a sender that pushes state to the network on every change.
    setSyncSender(fn) { syncSend = fn; },
    // Apply state received from the network (does NOT re-broadcast → no loops).
    applyRemote(remoteState) {
      if (!remoteState) return;
      state = remoteState;
      persist();
      emit();
    },
  };

  function deepMerge(target, src) {
    for (const k in src) {
      if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k])) {
        if (!target[k] || typeof target[k] !== 'object') target[k] = {};
        deepMerge(target[k], src[k]);
      } else {
        target[k] = src[k];
      }
    }
  }

  global.Store = Store;
})(window);
