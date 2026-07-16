/* ============================================================================
 * server.js — All-in-one host for Family Feud cross-device play.
 *
 *   • Serves the static app (the repo root) over HTTP.
 *   • Relays game state between devices over WebSocket (path /ws), grouped by
 *     "room" code, so Host Control on one device drives the Board on another.
 *
 * Run it:
 *     npm install        (first time only — installs the 'ws' package)
 *     npm start          (or: node server/server.js)
 *
 * Then open the printed URL on BOTH devices (same Wi-Fi). Use the same room
 * code on each — Control on your laptop/phone, Board on the TV.
 *
 * Cloud deploy (Render/Railway/Fly/etc.): it listens on process.env.PORT.
 * ==========================================================================*/
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { WebSocketServer } = require('ws');

const ROOT = path.resolve(__dirname, '..');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json; charset=utf-8',
};

// ---- Static file server (safe path handling) --------------------------------
const server = http.createServer((req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath === '/') urlPath = '/index.html';
    // Resolve within ROOT; reject traversal.
    const filePath = path.normalize(path.join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) { res.writeHead(404); return res.end('Not found'); }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    });
  } catch (e) {
    res.writeHead(500); res.end('Server error');
  }
});

// ---- WebSocket relay --------------------------------------------------------
const wss = new WebSocketServer({ server, path: '/ws' });

const rooms = new Map();      // room -> Set<ws>
const lastState = new Map();  // room -> last state JSON string

function joinRoom(ws, room) {
  ws._room = room;
  if (!rooms.has(room)) rooms.set(room, new Set());
  rooms.get(room).add(ws);
  // Catch a newcomer up with the room's current state.
  if (lastState.has(room)) {
    try { ws.send(JSON.stringify({ type: 'state', state: JSON.parse(lastState.get(room)) })); } catch (e) {}
  }
}

function leaveRoom(ws) {
  const set = rooms.get(ws._room);
  if (set) { set.delete(ws); if (!set.size) rooms.delete(ws._room); }
}

wss.on('connection', (ws) => {
  ws._room = null;
  ws.on('message', (data) => {
    let msg; try { msg = JSON.parse(data.toString()); } catch (e) { return; }
    const room = (msg.room || ws._room || 'MAIN');
    if (msg.type === 'join') {
      joinRoom(ws, room);
    } else if (msg.type === 'state' && msg.state) {
      if (ws._room !== room) joinRoom(ws, room);
      lastState.set(room, JSON.stringify(msg.state));
      const set = rooms.get(room);
      if (set) {
        const out = JSON.stringify({ type: 'state', state: msg.state });
        for (const peer of set) {
          if (peer !== ws && peer.readyState === 1) { try { peer.send(out); } catch (e) {} }
        }
      }
    }
  });
  ws.on('close', () => leaveRoom(ws));
  ws.on('error', () => leaveRoom(ws));
});

// Keep-alive ping so idle connections (and some proxies) don't drop.
setInterval(() => {
  wss.clients.forEach((ws) => { if (ws.readyState === 1) { try { ws.ping(); } catch (e) {} } });
}, 25000);

// ---- Boot -------------------------------------------------------------------
server.listen(PORT, () => {
  const nets = os.networkInterfaces();
  const lan = [];
  for (const name of Object.keys(nets)) {
    for (const ni of nets[name] || []) {
      if (ni.family === 'IPv4' && !ni.internal) lan.push(ni.address);
    }
  }
  console.log('\n  🎪  TeamBuilding ROI — Family Feud server is live!\n');
  console.log('  On THIS computer:      http://localhost:' + PORT);
  lan.forEach((ip) => console.log('  On the same Wi-Fi:     http://' + ip + ':' + PORT + '   ← open this on the TV & phone'));
  console.log('\n  Host Control:  /control.html      Board:  /board.html');
  console.log('  Use the SAME room code on every device (Sync button in Control).\n');
});
