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

    // Header — event mode repurposes the two pods for LEADER + ROUND readout.
    const pod0 = document.getElementById('pod0'), pod1 = document.getElementById('pod1');
    if (s.event.on) {
      const ranked = rankedTeams(s);
      const leader = ranked[0];
      document.getElementById('t0name').textContent = '🏆 ' + (leader ? leader.name : '—');
      document.getElementById('t0score').textContent = leader ? leader.score : 0;
      document.getElementById('t1name').textContent = 'ROUND';
      document.getElementById('t1score').textContent = s.event.round + '/' + s.event.totalRounds;
      pod0.classList.remove('active'); pod1.classList.remove('active');
    } else {
      document.getElementById('t0name').textContent = s.teams[0].name;
      document.getElementById('t1name').textContent = s.teams[1].name;
      document.getElementById('t0score').textContent = s.teams[0].score;
      document.getElementById('t1score').textContent = s.teams[1].score;
      pod0.classList.toggle('active', s.main.activeTeam === 0 && s.boardMode === 'main');
      pod1.classList.toggle('active', s.main.activeTeam === 1 && s.boardMode === 'main');
    }

    // One-shot effects (confetti / fanfare) broadcast from control
    if (s._fx && s._fx.id !== prev.fxId) {
      prev.fxId = s._fx.id;
      handleFx(s._fx);
    }

    // Mode routing
    if (s.boardMode === 'intro') renderIntro(s);
    else if (s.boardMode === 'outro') renderOutro(s);
    else if (s.boardMode === 'main') renderMain(s);
    else if (s.boardMode === 'fast') renderFast(s);
    else if (s.boardMode === 'leaderboard') renderLeaderboard(s);
    else if (s.boardMode === 'matchup') renderMatchup(s);
    else if (s.boardMode === 'question') renderQuestion(s);
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

  /* ---------------- INTRO REVEAL (show open) ---------------- */
  // Full-screen 8-second hype sequence: spinning light rays, chasing marquee
  // bulbs, screen flashes, the title slamming in, and the client-name banner.
  // Replays whenever control bumps introId.
  function renderIntro(s) {
    if (prev.boardMode === 'intro' && prev.introId === s.introId) return;
    prev.boardMode = 'intro';
    prev.introId = s.introId;
    stage.innerHTML = introHtml(s);
    Theme.apply();

    // Soundtrack + confetti choreographed to the countdown (0-3s) and the
    // slams that follow. Each cue re-checks the mode so nothing fires if the
    // host cuts the intro short.
    const cue = (ms, fn) => setTimeout(() => { if (Store.get().boardMode === 'intro') fn(); }, ms);
    Sound.flip();                      // 3
    cue(1000, () => Sound.flip());     // 2
    cue(2000, () => Sound.flip());     // 1
    cue(3000, () => Sound.fanfare());  // curtains up
    cue(3950, () => Sound.ding());
    cue(4850, () => {
      Sound.fanfare();
      const t = Store.get().theme;
      Confetti.fire(confettiCanvas, { colors: [t.accent, t.primary, '#ffffff', '#3ce88a'], count: 240 });
    });
    cue(6650, () => {
      Sound.reveal();
      const t = Store.get().theme;
      Confetti.fire(confettiCanvas, { colors: [t.accent, '#ffffff'], count: 160 });
    });
  }

  function introHtml(s) {
    const client = s.clientName || 'YOUR TEAM';
    const title = (s.theme.title || 'FAMILY FEUD');
    const parts = title.split(' ');
    const last = parts.pop();
    const first = parts.join(' ');
    const bulbs = '<span class="b"></span>'.repeat(18);
    return `
      <div class="intro-screen">
        <div class="intro-rays"></div>
        <div class="intro-flash f1"></div>
        <div class="intro-flash f2"></div>
        <div class="intro-bulbs top">${bulbs}</div>
        <div class="intro-bulbs bottom">${bulbs}</div>
        <div class="intro-count"><span>3</span><span>2</span><span>1</span></div>
        <div class="intro-ready">GET READY FOR</div>
        <div class="intro-brand">TEAMBUILDING ROI</div>
        <div class="intro-title">${escapeHtml(first)} <span class="accent">${escapeHtml(last)}!</span></div>
        <div class="intro-client"><small>PRESENTED FOR</small>${escapeHtml(client)}</div>
      </div>`;
  }

  /* ---------------- OUTRO (show close, balloons falling) ---------------- */
  function renderOutro(s) {
    if (prev.boardMode === 'outro' && prev.outroId === s.outroId) return;
    prev.boardMode = 'outro';
    prev.outroId = s.outroId;

    const colors = [s.theme.accent, s.theme.primary, '#ff6b8a', '#7ee6a5', '#8aa6ff', '#ffe08a', '#ff9e5e'];
    let balloons = '';
    for (let i = 0; i < 26; i++) {
      const left = 2 + Math.random() * 92;
      const dur = 7 + Math.random() * 5;
      const delay = Math.random() * 6;
      const size = 0.7 + Math.random() * 0.6;
      const c = colors[i % colors.length];
      balloons += `<span class="balloon" style="left:${left.toFixed(1)}%;--bc:${c};animation-duration:${dur.toFixed(1)}s;animation-delay:${delay.toFixed(1)}s;--bs:${size.toFixed(2)}"></span>`;
    }

    const client = s.clientName || 'YOUR TEAM';
    stage.innerHTML = `
      <div class="outro-screen">
        <div class="intro-rays"></div>
        <div class="balloon-layer">${balloons}</div>
        <div class="outro-title">THANKS FOR<br/>PLAYING<span class="accent">!</span></div>
        <div class="outro-sub">TEAMBUILDING ROI · ${escapeHtml(s.theme.title || 'FAMILY FEUD')}</div>
        <div class="intro-client outro-client"><small>WITH OUR FRIENDS AT</small>${escapeHtml(client)}</div>
      </div>`;
    Theme.apply();

    const cue = (ms, fn) => setTimeout(() => { if (Store.get().boardMode === 'outro') fn(); }, ms);
    Sound.fanfare();
    cue(400, () => {
      const t = Store.get().theme;
      Confetti.fire(confettiCanvas, { colors: [t.accent, t.primary, '#ffffff', '#ff6b8a'], count: 240 });
    });
    cue(1800, () => {
      Sound.reveal();
      const t = Store.get().theme;
      Confetti.fire(confettiCanvas, { colors: [t.accent, '#ffffff', '#7ee6a5'], count: 150 });
    });
  }

  /* ---------------- FACE-OFF: MATCHUP + QUESTION screens ---------------- */
  // The two teams facing off this round: event.matchups[round-1], with safe
  // fallbacks to the first two teams.
  function currentMatchup(s) {
    const m = (s.event.matchups || [])[(s.event.round || 1) - 1] || [];
    const a = Number.isInteger(m[0]) && s.teams[m[0]] ? m[0] : 0;
    let b = Number.isInteger(m[1]) && s.teams[m[1]] ? m[1] : (s.teams[1] ? 1 : 0);
    if (b === a && s.teams.length > 1) b = a === 0 ? 1 : 0;
    return [a, b];
  }

  function renderMatchup(s) {
    const [a, b] = currentMatchup(s);
    const key = s.event.round + '|' + s.teams[a].name + '|' + s.teams[b].name;
    if (prev.boardMode !== 'matchup' || prev.matchupKey !== key) {
      stage.innerHTML = `
        <div class="matchup-screen">
          <div class="mu-round">ROUND ${s.event.on ? s.event.round : ''}</div>
          <div class="mu-teams">
            <div class="mu-team a">${escapeHtml(s.teams[a].name)}</div>
            <div class="mu-vs">VS</div>
            <div class="mu-team b">${escapeHtml(s.teams[b].name)}</div>
          </div>
          <div class="mu-hint">HANDS ON BUZZERS!</div>
        </div>`;
      prev.boardMode = 'matchup';
      prev.matchupKey = key;
      Sound.ding();
    }
    Theme.apply();
  }

  function renderQuestion(s) {
    const q = s.questions.main[s.main.questionIndex];
    const [a, b] = currentMatchup(s);
    const fo = s.event.faceoff || {};
    const key = s.main.questionIndex + '|' + fo.buzzed + '|' + fo.control + '|' + s.event.round;
    if (prev.boardMode !== 'question' || prev.questionKey !== key) {
      let status;
      if (fo.control != null && s.teams[fo.control]) {
        status = `<div class="qs-status control">★ ${escapeHtml(s.teams[fo.control].name)} HAS CONTROL!</div>`;
      } else if (fo.buzzed != null && s.teams[fo.buzzed]) {
        status = `<div class="qs-status buzzed">🔔 ${escapeHtml(s.teams[fo.buzzed].name)} BUZZED IN!</div>`;
      } else {
        status = `<div class="qs-status waiting">HANDS ON BUZZERS…</div>`;
      }
      stage.innerHTML = `
        <div class="question-screen">
          <div class="qs-round">${s.event.on ? 'ROUND ' + s.event.round + ' · ' : ''}FACE-OFF</div>
          <div class="qs-text">${escapeHtml(q ? q.q : '')}</div>
          ${status}
        </div>`;
      // Sound cues on transitions
      if (prev.boardMode === 'question') {
        if (fo.buzzed != null && prev.foBuzzed == null) Sound.buzzIn();
        if (fo.control != null && prev.foControl == null) Sound.ding();
      }
      prev.foBuzzed = fo.buzzed; prev.foControl = fo.control;
      prev.boardMode = 'question';
      prev.questionKey = key;
    }
    Theme.apply();
  }

  /* ---------------- LEADERBOARD (event mode) ---------------- */
  function rankedTeams(s) {
    return s.teams.map((t, i) => ({ name: t.name, score: t.score, i }))
      .sort((a, b) => b.score - a.score || a.i - b.i);
  }

  function renderLeaderboard(s) {
    const ranked = rankedTeams(s);
    const isFinal = !!s.event.showFinal;
    const key = JSON.stringify(ranked.map((t) => [t.name, t.score])) + '|' + isFinal + '|' + s.event.round + '|' + s.event.totalRounds;
    if (prev.lbKey !== key || prev.boardMode !== 'leaderboard') {
      const title = isFinal ? 'FINAL STANDINGS'
        : (s.event.round > s.event.totalRounds ? 'FINAL STANDINGS' : 'LEADERBOARD');
      const sub = isFinal ? '🎉 CONGRATULATIONS! 🎉'
        : `ROUND ${Math.min(s.event.round, s.event.totalRounds)} OF ${s.event.totalRounds}`;
      const medals = ['gold', 'silver', 'bronze'];
      const rows = ranked.map((t, idx) => `
        <div class="lb-row ${idx < 3 ? 'top ' + medals[idx] : ''} ${isFinal && idx === 0 ? 'champ' : ''}">
          <span class="lb-rank">${idx + 1}</span>
          <span class="lb-name">${escapeHtml(t.name)}</span>
          <span class="lb-score">${t.score}</span>
        </div>`).join('');
      stage.innerHTML = `
        <div class="lb-wrap ${isFinal ? 'is-final' : ''}">
          <div class="lb-title">${title}</div>
          <div class="lb-sub">${sub}</div>
          <div class="lb-list ${ranked.length <= 7 ? 'single' : ''}" style="--rows:${ranked.length <= 7 ? ranked.length : Math.ceil(ranked.length / 2)}">${rows}</div>
        </div>`;
      prev.boardMode = 'leaderboard';
      prev.lbKey = key;
      if (isFinal && prev.finalFired !== key) {
        prev.finalFired = key;
        Confetti.fire(confettiCanvas, { colors: [s.theme.accent, s.theme.primary, '#ffffff', '#3ce88a'], count: 260 });
        Sound.fanfare();
      }
    }
    Theme.apply();
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

    // Face-off control chip (who owns the board this round)
    const chip = stage.querySelector('.control-chip');
    if (chip) {
      const c = s.event.faceoff ? s.event.faceoff.control : null;
      if (c != null && s.teams[c]) { chip.textContent = '★ ' + s.teams[c].name + ' HAS CONTROL'; chip.classList.remove('hidden'); }
      else chip.classList.add('hidden');
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
      <div class="control-chip hidden"></div>
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

  // Cross-device sync indicator (only visible when a server connection is in play)
  if (window.Sync) {
    const chip = document.getElementById('boardSync');
    Sync.onStatus((status, st) => {
      if (status === 'off') { chip.classList.remove('show'); return; }
      chip.classList.add('show');
      const label = { connecting: 'Connecting…', live: 'Live · Room ' + (st ? st.room : ''), retry: 'Reconnecting…' }[status] || status;
      chip.innerHTML = `<span class="d ${status}"></span>${label}`;
    });
  }

  Store.subscribe(render);
  document.addEventListener('DOMContentLoaded', render);
  render();
})();
