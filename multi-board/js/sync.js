/* ============================================================================
 * sync.js — Optional real-time sync across DIFFERENT devices / browsers.
 *
 * Same-browser windows already sync via BroadcastChannel (store.js). This layer
 * adds a WebSocket connection so the Host Control on one device can drive the
 * Board on another device (e.g. a laptop controlling the venue TV, or a phone).
 *
 * Connection target, in priority order:
 *   1. ?sync=wss://host/path  in the URL         (explicit override)
 *   2. window.FF_WS_URL                          (set before this script)
 *   3. localStorage 'ff_ws_url'                  (saved in the Sync dialog)
 *   4. Auto: if the page is served over http(s) by our own server, use
 *      ws(s)://<same-host>/ws  — so running `npm start` "just works".
 *   (file:// with no override → no WebSocket; BroadcastChannel still works.)
 *
 * A "room" code groups a Control + Board together. Default room is MAIN, or set
 * ?room=CODE. Everyone in the same room + server stays in sync.
 * ========================================================================== */
(function (global) {
  'use strict';

  const params = new URLSearchParams(location.search);
  const role = global.FF_SYNC_ROLE || 'reader';   // 'writer' (control/editor) | 'reader' (board)

  function getRoom() {
    return (params.get('room') || localStorage.getItem('ff_room') || 'MAIN')
      .toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || 'MAIN';
  }

  function resolveUrl() {
    const p = params.get('sync');
    if (p) { localStorage.setItem('ff_ws_url', p); return p; }
    if (global.FF_WS_URL) return global.FF_WS_URL;
    const saved = localStorage.getItem('ff_ws_url');
    if (saved) return saved;
    if (location.protocol === 'http:' || location.protocol === 'https:') {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${proto}//${location.host}/ws`;
    }
    return null; // file:// with no override
  }

  const state = {
    room: getRoom(),
    url: resolveUrl(),
    ws: null,
    status: 'off',      // off | connecting | live | retry
    attempts: 0,
    lastSentJson: '',
    statusCbs: new Set(),
  };

  function setStatus(s) {
    state.status = s;
    state.statusCbs.forEach((fn) => { try { fn(s, state); } catch (e) {} });
  }

  const Sync = {
    get state() { return state; },
    onStatus(fn) { state.statusCbs.add(fn); fn(state.status, state); return () => state.statusCbs.delete(fn); },
    getRoom() { return state.room; },
    getUrl() { return state.url; },
    isEnabled() { return !!state.url; },

    // Point at a new server URL and/or room and reconnect.
    configure(url, room) {
      if (url !== undefined) {
        state.url = url ? url.trim() : null;
        if (state.url) localStorage.setItem('ff_ws_url', state.url);
        else localStorage.removeItem('ff_ws_url');
      }
      if (room) { state.room = room.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12) || 'MAIN'; localStorage.setItem('ff_room', state.room); }
      reconnect();
    },
    reconnect,
  };

  function reconnect() {
    try { if (state.ws) { state.ws.onclose = null; state.ws.close(); } } catch (e) {}
    state.ws = null;
    Store.setSyncSender(null);
    connect();
  }

  function connect() {
    state.url = state.url || resolveUrl();
    if (!state.url) { setStatus('off'); return; }
    setStatus(state.attempts ? 'retry' : 'connecting');
    let ws;
    try { ws = new WebSocket(state.url); } catch (e) { scheduleRetry(); return; }
    state.ws = ws;

    ws.onopen = () => {
      state.attempts = 0;
      setStatus('live');
      ws.send(JSON.stringify({ type: 'join', room: state.room, role }));
      // Writers publish their current state so late-joining boards catch up.
      if (role === 'writer') {
        state.lastSentJson = JSON.stringify(Store.get());
        ws.send(JSON.stringify({ type: 'state', room: state.room, state: Store.get() }));
      }
      // From now on, every local change is pushed to the network.
      Store.setSyncSender((st) => {
        if (ws.readyState !== 1) return;
        const json = JSON.stringify(st);
        if (json === state.lastSentJson) return;   // avoid echo storms
        state.lastSentJson = json;
        ws.send(JSON.stringify({ type: 'state', room: state.room, state: st }));
      });
    };

    ws.onmessage = (ev) => {
      let msg; try { msg = JSON.parse(ev.data); } catch (e) { return; }
      if (msg.type === 'state' && msg.state) {
        state.lastSentJson = JSON.stringify(msg.state); // don't bounce it back
        Store.applyRemote(msg.state);
      }
    };

    ws.onclose = () => { Store.setSyncSender(null); scheduleRetry(); };
    ws.onerror = () => { try { ws.close(); } catch (e) {} };
  }

  function scheduleRetry() {
    if (!state.url) { setStatus('off'); return; }
    setStatus('retry');
    state.attempts++;
    const delay = Math.min(15000, 800 * Math.pow(1.6, Math.min(state.attempts, 8)));
    clearTimeout(state._retry);
    state._retry = setTimeout(connect, delay);
  }

  global.Sync = Sync;
  // Kick off after the store exists.
  if (global.Store) connect();
  else document.addEventListener('DOMContentLoaded', () => { if (global.Store) connect(); });
})(window);
