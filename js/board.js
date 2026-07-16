/* board.js — renders the audience display from Store state. Read-only:
 * it never writes state, only reacts. */
(function () {
  'use strict';

  const stage = document.getElementById('stage');
  const strikesLayer = document.getElementById('strikesLayer');
  const flashHost = document.getElementById('flashHost');
  const confettiCanvas = document.getElementById('confetti');

  let prev = { revealedKey: '', boardMode: '', strikeFlash: 0, fxId: null, awardTeam: null, strikes: -1, fastKey: '' };

  // Unlock audio on first interaction (board is usually clicked/fullscreened).
  ['click', 'keydown'].forEach((e) => addEventListener(e, () => Sound.unlock(), { once: true }));

  // F = fullscreen toggle on the board display.
  addEventListener('keydown', (e) => {
    if (e.key === 'f' || e.key === 'F') {
      if (!document.fullscreenElement) {
        const el = document.documentElement;
        if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  });

  function money(n) { return '$' + (n || 0); }

  function render() {
    const s = Store.get();
    Sound.setEnabled(s.sound !== false);

    // Header scores
    document.getElementById('t0name').textContent = s.teams[0].name;
    document.getElementById('t1name').textContent = s.teams[1].name;
    document.getElementById('t0score').textContent = s.teams[0].score;
    document.getElementById('t1score').textContent = s.teams[1].score;
    document.getElementById('pod0').classList.toggle('active', s.main.activeTeam === 0 && s.boardMode === 'main');
    document.getElementById('pod1').classList.toggle('active', s.main.activeTeam === 1 && s.boardMode === 'main');

    // One-shot effects (confetti / fanfare) broadcast from control
    if (s._fx && s._fx.id !== prev.fxId) {
      prev.fxId = s._fx.id;
      handleFx(s._fx);
    }

    // Mode routing
    if (s.boardMode === 'main') renderMain(s);
    else if (s.boardMode === 'fast') renderFast(s);
    else renderLogo(s);

    // Strikes big overlay (3 strikes) + single flash on each wrong answer
    renderStrikes(s);
  }

  function handleFx(fx) {
    if (fx.type === 'confetti') {
      const t = Store.get().theme;
      Confetti.fire(confettiCanvas, { colors: [t.accent, t.primary, '#ffffff', '#3ce88a'] });
      Sound.fanfare();
    } else if (fx.type === 'fanfare') {
      Sound.fanfare();
    } else if (fx.type === 'strikeSound') {
      Sound.strike();
    }
  }

  /* ---------------- LOGO / IDLE ---------------- */
  function renderLogo(s) {
    const key = (s.theme.title || '') + '|' + (s.theme.subtitle || '');
    if (prev.boardMode !== 'logo' || prev.logoKey !== key) {
      stage.innerHTML = logoHtml(s);
      prev.boardMode = 'logo';
      prev.logoKey = key;
    }
    Theme.apply();
  }
  function logoHtml(s) {
    const title = (s.theme.title || 'FAMILY FEUD');
    const parts = title.split(' ');
    const last = parts.pop();
    const first = parts.join(' ');
    return `
      <div class="logo-screen">
        <div class="brand-logo" data-brand-logo></div>
        <div class="big-title">${escapeHtml(first)} <span class="accent">${escapeHtml(last)}</span></div>
        <div class="sub" data-brand-subtitle>${escapeHtml(s.theme.subtitle || '')}</div>
        <div class="marquee">${'<span class="bulb"></span>'.repeat(9)}</div>
      </div>`;
  }

  /* ---------------- MAIN GAME ---------------- */
  function renderMain(s) {
    const q = s.questions.main[s.main.questionIndex];
    if (!q) { renderLogo(s); return; }
    const revealedKey = s.main.questionIndex + '|' + s.main.revealed.join('') + '|' + s.main.showQuestion + '|' + s.main.bank + '|' + s.main.awardTeam;

    if (prev.boardMode !== 'main' || prev.revealedKeyStruct !== structKey(s, q)) {
      stage.innerHTML = mainHtml(s, q);
      prev.boardMode = 'main';
      prev.revealedKeyStruct = structKey(s, q);
      prev.revealedKey = '';
    }

    // Question banner
    const banner = stage.querySelector('.q-banner');
    if (banner) {
      banner.textContent = q.q;
      banner.classList.toggle('dim', !s.main.showQuestion);
    }

    // Bank chip
    const bank = stage.querySelector('.bank-chip .amt');
    if (bank) bank.textContent = s.main.bank;

    // Reveal slats
    const slats = stage.querySelectorAll('.slat[data-i]');
    slats.forEach((el) => {
      const i = +el.dataset.i;
      const nowRevealed = !!s.main.revealed[i];
      const was = el.classList.contains('revealed');
      el.classList.toggle('revealed', nowRevealed);
      if (nowRevealed && !was && prev.revealedKey !== '') {
        el.classList.add('pop');
        setTimeout(() => el.classList.remove('pop'), 550);
        if (i === 0) Sound.ding(); else Sound.reveal();
      }
    });
    prev.revealedKey = revealedKey;
  }

  function structKey(s, q) {
    return s.main.questionIndex + '|' + q.answers.length;
  }

  function mainHtml(s, q) {
    const n = q.answers.length;
    const twoCol = n > 5;
    const cells = q.answers.map((a, i) => `
      <div class="slat" data-i="${i}">
        <div class="slat-inner">
          <div class="slat-face slat-front"><div class="num">${i + 1}</div></div>
          <div class="slat-face slat-back">
            <span class="rank">${i + 1}</span>
            <span class="ans">${escapeHtml(a.text)}</span>
            <span class="pts">${a.points}</span>
          </div>
        </div>
      </div>`).join('');
    return `
      <div class="q-banner">${escapeHtml(q.q)}</div>
      <div class="board-frame">
        <div class="bank-chip"><small>ROUND BANK</small><span class="amt">${s.main.bank}</span></div>
        <div class="slat-grid ${twoCol ? 'two-col' : ''}" style="grid-template-rows: repeat(${twoCol ? Math.ceil(n / 2) : n}, 1fr);">
          ${cells}
        </div>
      </div>`;
  }

  /* ---------------- STRIKES ---------------- */
  function renderStrikes(s) {
    const showBig = s.boardMode === 'main' && s.main.strikes >= 3 && s.main.showStrikeBig;
    strikesLayer.classList.toggle('show', !!showBig);
    if (showBig && prev.strikes < 3) strikesLayer.innerHTML = '<span class="x">✕</span><span class="x">✕</span><span class="x">✕</span>';

    // Single flash whenever strikeFlash increments
    if (s.main.strikeFlash !== prev.strikeFlash) {
      if (prev.strikeFlash !== 0 || s.main.strikeFlash > 0) flashStrike(s.main.strikes);
      prev.strikeFlash = s.main.strikeFlash;
    }
    prev.strikes = s.main.strikes;
  }
  function flashStrike(count) {
    const wrap = document.createElement('div');
    wrap.className = 'strike-flash';
    const xs = Math.max(1, Math.min(3, count || 1));
    wrap.innerHTML = '<span class="x">' + '✕'.repeat(xs) + '</span>';
    flashHost.appendChild(wrap);
    Sound.strike();
    setTimeout(() => wrap.remove(), 950);
  }

  /* ---------------- FAST MONEY ---------------- */
  function renderFast(s) {
    const f = s.fast;
    const pl = f.playerView === 2 ? f.p2 : f.p1;
    const key = JSON.stringify(pl.map((x) => [x.answer, x.points, x.revealed]))
      + '|' + f.playerView + '|' + f.showTotals + '|' + fastTotal(s) + '|' + f.timerLabel;

    if (prev.boardMode !== 'fast' || prev.fastStruct !== f.playerView + '|' + f.timerLabel) {
      stage.innerHTML = fastHtml(s);
      prev.boardMode = 'fast';
      prev.fastStruct = f.playerView + '|' + f.timerLabel;
      prev.fastKey = '';
    }

    // total
    const totEl = stage.querySelector('.fast-total .amt');
    if (totEl) totEl.textContent = fastTotal(s);
    const totBox = stage.querySelector('.fast-total');
    if (totBox) totBox.classList.toggle('hidden', !f.showTotals);

    // rows
    const rows = stage.querySelectorAll('.fast-row');
    rows.forEach((row, i) => {
      const item = pl[i];
      const ansEl = row.querySelector('.fa-ans');
      const ptsEl = row.querySelector('.fa-pts');
      ansEl.textContent = item.answer || '';
      ptsEl.textContent = item.points || 0;
      const wasShown = row.classList.contains('show');
      const showText = item.revealed;
      const showPts = item.revealed;
      row.classList.toggle('show', showText);
      // reveal points slightly after text for the classic effect
      if (showPts && !row.classList.contains('show-pts')) {
        setTimeout(() => row.classList.add('show-pts'), 260);
      } else if (!showPts) {
        row.classList.remove('show-pts');
      }
      if (showText && !wasShown && prev.fastKey !== '') Sound.flip();
    });
    prev.fastKey = key;

    // timer ring
    updateTimerRing(s);
  }

  function fastTotal(s) {
    const a = s.fast.p1.reduce((t, x) => t + (x.revealed ? +x.points || 0 : 0), 0);
    const b = s.fast.p2.reduce((t, x) => t + (x.revealed ? +x.points || 0 : 0), 0);
    return a + b;
  }

  function fastHtml(s) {
    const f = s.fast;
    const rows = Array.from({ length: 5 }, (_, i) => `
      <div class="fast-row" data-i="${i}">
        <span class="fa-num">${i + 1}</span>
        <span class="fa-ans"></span>
        <span class="fa-pts">0</span>
      </div>`).join('');
    const label = f.timerLabel ? `<div class="fast-timer" id="ftimer"><svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="8"/><circle id="tRing" cx="50" cy="50" r="44" fill="none" stroke="var(--c-accent)" stroke-width="8" stroke-linecap="round" stroke-dasharray="276" stroke-dashoffset="0"/></svg><div class="t-num" id="tNum">${f.timerSeconds}</div></div>` : '';
    return `
      <div class="fast-root">
        ${label}
        <div class="fast-title">FAST MONEY — ${escapeHtml(f.timerLabel || 'FINAL ROUND')}</div>
        <div class="fast-total ${f.showTotals ? '' : 'hidden'}"><small>TOTAL</small><span class="amt">${fastTotal(s)}</span></div>
        <div class="fast-grid">${rows}</div>
      </div>`;
  }

  function updateTimerRing(s) {
    const ring = document.getElementById('tRing');
    const num = document.getElementById('tNum');
    const timer = document.getElementById('ftimer');
    if (!ring || !num) return;
    const total = s.fast.timerMax || s.fast.timerSeconds || 20;
    const cur = s.fast.timerSeconds;
    const frac = Math.max(0, Math.min(1, cur / total));
    ring.style.strokeDashoffset = (276 * (1 - frac)).toFixed(1);
    num.textContent = cur;
    if (timer) timer.classList.toggle('warn', cur <= 5);
  }

  /* ---------------- utils ---------------- */
  function escapeHtml(str) {
    return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  Store.subscribe(render);
  document.addEventListener('DOMContentLoaded', render);
  render();
})();
