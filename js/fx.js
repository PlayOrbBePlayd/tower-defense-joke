/* fx.js — party-grade visual effects for the board: smoke machine, bouncing
 * lasers, and a UFO flyby. Canvas effects share one manager/rAF loop so they
 * can overlap cleanly. All effects are one-shot and clean up after themselves. */
(function (global) {
  'use strict';

  let canvas = null, ctx = null, raf = 0;
  const active = [];   // [{draw(now) -> boolean alive}]

  function ensureCanvas() {
    if (!canvas) {
      canvas = document.getElementById('fx');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'fx';
        canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:59;';
        document.body.appendChild(canvas);
      }
    }
    const DPR = Math.min(global.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * DPR;
    canvas.height = innerHeight * DPR;
    ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function add(effect) {
    ensureCanvas();
    active.push(effect);
    if (!raf) raf = requestAnimationFrame(loop);
  }

  function loop(now) {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = active.length - 1; i >= 0; i--) {
      if (!active[i].draw(now)) active.splice(i, 1);
    }
    if (active.length) raf = requestAnimationFrame(loop);
    else { raf = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }

  /* ---- 💨 SMOKE: pours in from all four corners toward the center for 3s.
   * Thick & heavy at the edges, thinning out as it approaches the middle. ---- */
  function smoke() {
    const W = innerWidth, H = innerHeight, cx = W / 2, cy = H / 2;
    const maxD = Math.hypot(cx, cy);
    const corners = [[0, 0], [W, 0], [0, H], [W, H]];
    const parts = [];
    for (let i = 0; i < 260; i++) {
      const c = corners[i % 4];
      const ang = Math.atan2(cy - c[1], cx - c[0]) + (Math.random() - 0.5) * 1.15;
      const sp = (130 + Math.random() * 170) / 1000;          // px per ms
      parts.push({
        x: c[0] + (Math.random() - 0.5) * 90, y: c[1] + (Math.random() - 0.5) * 90,
        vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
        r: 55 + Math.random() * 95, delay: Math.random() * 650, seed: Math.random() * 7,
      });
    }
    const t0 = performance.now(), DUR = 3000;
    add({
      draw(now) {
        const t = now - t0;
        if (t > DUR) return false;
        const fade = t < 2100 ? 1 : 1 - (t - 2100) / 900;
        for (const p of parts) {
          const lt = t - p.delay; if (lt < 0) continue;
          const x = p.x + p.vx * lt, y = p.y + p.vy * lt + Math.sin(lt / 320 + p.seed) * 16;
          const d = Math.hypot(x - cx, y - cy);
          // opacity scales with distance from center: heavy outside, thin inside
          const density = Math.max(0, Math.min(1, (d / maxD - 0.1) / 0.9));
          const a = 0.17 * density * fade;
          if (a <= 0.004) continue;
          const grow = p.r * (1 + lt / 2100);
          const g = ctx.createRadialGradient(x, y, 0, x, y, grow);
          g.addColorStop(0, `rgba(214,222,240,${a})`);
          g.addColorStop(1, 'rgba(214,222,240,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(x, y, grow, 0, 7); ctx.fill();
        }
        return true;
      },
    });
  }

  /* ---- ⚡ LASERS: neon beams ricocheting off the screen edges for 3s. ---- */
  function lasers() {
    const W = innerWidth, H = innerHeight;
    const colors = ['#ff2d95', '#00e5ff', '#3cff5e', '#ffe600', '#a26bff', '#ff6b35'];
    const beams = colors.map((c) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (0.55 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1),
      vy: (0.55 + Math.random() * 0.5) * (Math.random() < 0.5 ? -1 : 1),
      c, trail: [],
    }));
    const t0 = performance.now(), DUR = 3000;
    let last = t0;
    add({
      draw(now) {
        const t = now - t0, dt = Math.min(34, now - last); last = now;
        if (t > DUR) return false;
        const fade = t < 2400 ? 1 : 1 - (t - 2400) / 600;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.lineCap = 'round';
        for (const b of beams) {
          b.x += b.vx * dt; b.y += b.vy * dt;
          if (b.x < 0) { b.x = 0; b.vx *= -1; } else if (b.x > W) { b.x = W; b.vx *= -1; }
          if (b.y < 0) { b.y = 0; b.vy *= -1; } else if (b.y > H) { b.y = H; b.vy *= -1; }
          b.trail.push({ x: b.x, y: b.y });
          if (b.trail.length > 24) b.trail.shift();
          for (let i = 1; i < b.trail.length; i++) {
            ctx.globalAlpha = (i / b.trail.length) * 0.9 * fade;
            ctx.strokeStyle = b.c; ctx.lineWidth = 3.5;
            ctx.shadowColor = b.c; ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.moveTo(b.trail[i - 1].x, b.trail[i - 1].y);
            ctx.lineTo(b.trail[i].x, b.trail[i].y);
            ctx.stroke();
          }
          ctx.globalAlpha = fade;
          ctx.fillStyle = '#fff'; ctx.shadowColor = b.c; ctx.shadowBlur = 22;
          ctx.beginPath(); ctx.arc(b.x, b.y, 4.5, 0, 7); ctx.fill();
        }
        ctx.restore();
        return true;
      },
    });
  }

  /* ---- 🛸 UFO: cruises across the top, pulls a mid-air flip, flies on. ---- */
  function ufo() {
    const old = document.querySelector('.fx-ufo');
    if (old) old.remove();
    const el = document.createElement('div');
    el.className = 'fx-ufo';
    el.innerHTML = '<span class="ship">🛸</span><span class="beam"></span>';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4300);
  }

  global.FX = { smoke, lasers, ufo };
})(window);
