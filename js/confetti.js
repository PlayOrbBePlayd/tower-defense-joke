/* confetti.js — lightweight canvas confetti burst. */
(function (global) {
  'use strict';
  function fire(canvas, opts) {
    opts = opts || {};
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(global.devicePixelRatio || 1, 2);
    canvas.width = innerWidth * DPR; canvas.height = innerHeight * DPR;
    ctx.scale(DPR, DPR);
    const colors = opts.colors || ['#ffc21c', '#4f7bff', '#ffffff', '#ff6b6b', '#3ce88a'];
    const N = opts.count || 180;
    const parts = [];
    for (let i = 0; i < N; i++) {
      parts.push({
        x: innerWidth / 2 + (Math.random() - .5) * 200,
        y: innerHeight / 2 + (Math.random() - .5) * 60,
        vx: (Math.random() - .5) * 14,
        vy: Math.random() * -16 - 4,
        g: .35 + Math.random() * .2,
        s: 6 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .3,
        c: colors[(Math.random() * colors.length) | 0],
        life: 0, max: 120 + Math.random() * 60,
      });
    }
    let raf;
    function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      let alive = false;
      for (const p of parts) {
        if (p.life > p.max) continue;
        alive = true;
        p.life++; p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.rot += p.vr;
        const a = Math.max(0, 1 - p.life / p.max);
        ctx.save(); ctx.globalAlpha = a; ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(tick);
      else ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
    cancelAnimationFrame(raf); tick();
  }
  global.Confetti = { fire };
})(window);
