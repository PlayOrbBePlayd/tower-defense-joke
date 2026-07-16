/* control.js — host dashboard. Writes to Store; the Board reacts. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const S = () => Store.get();

  // unlock audio on first gesture
  ['click', 'keydown'].forEach((e) => addEventListener(e, () => Sound.unlock(), { once: true }));

  function toast(msg) {
    const t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), 1600);
  }

  /* ---------------- Top bar ---------------- */
  $('openBoard').onclick = () => {
    window.open('board.html', 'ff_board', 'width=1280,height=760');
  };
  $('modeTabs').querySelectorAll('button').forEach((b) => {
    b.onclick = () => switchPanel(b.dataset.mode);
  });
  function switchPanel(mode) {
    $('modeTabs').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.mode === mode));
    $('mainPanel').classList.toggle('hidden', mode === 'fast');
    $('fastPanel').classList.toggle('hidden', mode !== 'fast');
    // also switch the board to match
    Store.patch((s) => { s.boardMode = mode; });
    Sound.click();
  }

  /* ---------------- Sidebar ---------------- */
  $('toLogo').onclick = () => { Store.patch((s) => { s.boardMode = 'logo'; }); syncTabs(); };
  $('toMain').onclick = () => { Store.patch((s) => { s.boardMode = 'main'; }); switchPanel('main'); };
  $('toFast').onclick = () => { Store.patch((s) => { s.boardMode = 'fast'; }); switchPanel('fast'); };
  $('celebrate').onclick = () => { Store.fx('confetti'); toast('🎊 Celebration!'); };
  $('resetAll').onclick = () => {
    if (confirm('Reset ALL scores, rounds and fast money to a clean slate? (Questions & branding are kept.)')) {
      Store.patch((s) => {
        s.teams.forEach((t) => (t.score = 0));
        s.main.strikes = 0; s.main.bank = 0; s.main.awardTeam = null; s.main.activeTeam = null;
        s.main.showStrikeBig = false;
        s.fast.p1 = Store.emptyFast(); s.fast.p2 = Store.emptyFast();
        s.fast.showTotals = false; s.fast.timerLabel = '';
        Store.initRound();
      });
      toast('Board reset');
    }
  };
  $('toggleSound').onclick = () => {
    Store.patch((s) => { s.sound = s.sound === false ? true : false; });
    const on = S().sound !== false;
    $('toggleSound').textContent = on ? '🔊 Sound: On' : '🔇 Sound: Off';
    Sound.setEnabled(on);
  };

  /* ---------------- MAIN GAME ---------------- */
  function renderTeams() {
    const s = S();
    const row = $('teamsRow');
    row.innerHTML = s.teams.map((t, i) => `
      <div class="team-card panel" style="padding:12px">
        <input class="tname" data-team="${i}" value="${escAttr(t.name)}" />
        <div class="sc" id="sc${i}">${t.score}</div>
        <div class="sc-row">
          <button class="btn ghost sm" data-adj="${i}" data-d="-1">−1</button>
          <button class="btn ghost sm" data-adj="${i}" data-d="-5">−5</button>
          <button class="btn blue sm" data-adj="${i}" data-d="5">+5</button>
          <button class="btn blue sm" data-adj="${i}" data-d="10">+10</button>
        </div>
        <button class="btn ghost sm ${s.main.activeTeam === i ? 'active-team' : ''}" data-active="${i}" style="margin-top:8px;width:100%">${s.main.activeTeam === i ? '★ On the board' : 'Set active'}</button>
      </div>`).join('');
    row.querySelectorAll('.tname').forEach((inp) => {
      inp.oninput = () => Store.patch((s) => { s.teams[+inp.dataset.team].name = inp.value; });
    });
    row.querySelectorAll('[data-adj]').forEach((b) => {
      b.onclick = () => { Store.patch((s) => { s.teams[+b.dataset.adj].score = Math.max(0, s.teams[+b.dataset.adj].score + +b.dataset.d); }); Sound.click(); };
    });
    row.querySelectorAll('[data-active]').forEach((b) => {
      b.onclick = () => Store.patch((s) => { s.main.activeTeam = +b.dataset.active; });
    });
  }

  function renderQuestionSelect() {
    const s = S();
    const sel = $('qSelect');
    sel.innerHTML = s.questions.main.map((q, i) => `<option value="${i}" ${i === s.main.questionIndex ? 'selected' : ''}>${i + 1}. ${escHtml(q.q).slice(0, 60)}</option>`).join('');
    sel.onchange = () => setQuestion(+sel.value);
  }
  function setQuestion(i) {
    Store.patch((s) => {
      s.main.questionIndex = Math.max(0, Math.min(s.questions.main.length - 1, i));
      Store.initRound();
      s.main.showStrikeBig = false;
    });
    renderMain();
  }
  $('prevQ').onclick = () => setQuestion(S().main.questionIndex - 1);
  $('nextQ').onclick = () => setQuestion(S().main.questionIndex + 1);

  function renderMain() {
    const s = S();
    const q = s.questions.main[s.main.questionIndex];
    $('qPreview').textContent = q ? q.q : '(no question)';
    // answers
    const list = $('ansList');
    if (q) {
      list.innerHTML = q.answers.map((a, i) => `
        <div class="ans-ctrl ${s.main.revealed[i] ? 'revealed' : ''}" data-i="${i}">
          <div class="idx">${i + 1}</div>
          <div class="txt">${escHtml(a.text)}</div>
          <div class="pt">${a.points}</div>
          <button class="btn ${s.main.revealed[i] ? 'ghost' : 'green'} sm" data-reveal="${i}">${s.main.revealed[i] ? 'Hide' : 'Reveal'}</button>
        </div>`).join('');
      list.querySelectorAll('[data-reveal]').forEach((b) => {
        b.onclick = () => toggleReveal(+b.dataset.reveal);
      });
    } else {
      list.innerHTML = '<p class="hint">No questions yet — add some in the Editor.</p>';
    }
    // strikes
    renderStrikeDots();
    $('bankAmt').textContent = s.main.bank;
    // active team buttons refresh
    document.querySelectorAll('[data-active]').forEach((b) => {
      const i = +b.dataset.active;
      b.classList.toggle('active-team', s.main.activeTeam === i);
      b.textContent = s.main.activeTeam === i ? '★ On the board' : 'Set active';
    });
    document.querySelectorAll('.sc').forEach((el, i) => { if (s.teams[i]) el.textContent = s.teams[i].score; });
  }

  function toggleReveal(i) {
    const s = S();
    const q = s.questions.main[s.main.questionIndex];
    if (!q) return;
    const nowReveal = !s.main.revealed[i];
    Store.patch((st) => {
      st.main.revealed[i] = nowReveal;
      // recompute bank from revealed answers
      st.main.bank = q.answers.reduce((t, a, idx) => t + (st.main.revealed[idx] ? +a.points : 0), 0);
    });
    renderMain();
  }

  function renderStrikeDots() {
    const s = S();
    $('strikeDots').innerHTML = [0, 1, 2].map((i) => `<div class="strike-dot ${i < s.main.strikes ? 'on' : ''}">✕</div>`).join('');
  }
  $('strikeBtn').onclick = () => addStrike();
  function addStrike() {
    Store.patch((s) => {
      s.main.strikes = Math.min(3, s.main.strikes + 1);
      s.main.strikeFlash = (s.main.strikeFlash || 0) + 1;
      if (s.main.strikes >= 3) s.main.showStrikeBig = true;
    });
    renderStrikeDots();
    if (S().main.strikes >= 3) setTimeout(() => Store.patch((s) => { s.main.showStrikeBig = false; }), 2500);
  }
  $('clearStrikes').onclick = () => { Store.patch((s) => { s.main.strikes = 0; s.main.showStrikeBig = false; }); renderStrikeDots(); };
  $('bigStrike').onclick = () => {
    Store.patch((s) => { s.main.strikes = 3; s.main.strikeFlash = (s.main.strikeFlash || 0) + 1; s.main.showStrikeBig = true; });
    renderStrikeDots();
    setTimeout(() => Store.patch((s) => { s.main.showStrikeBig = false; }), 2500);
  };

  $('revealAll').onclick = () => {
    const q = S().questions.main[S().main.questionIndex]; if (!q) return;
    Store.patch((s) => { s.main.revealed = q.answers.map(() => true); s.main.bank = q.answers.reduce((t, a) => t + +a.points, 0); });
    renderMain();
  };
  $('hideAll').onclick = () => {
    Store.patch((s) => { s.main.revealed = s.main.revealed.map(() => false); s.main.bank = 0; });
    renderMain();
  };
  $('awardT0').onclick = () => award(0);
  $('awardT1').onclick = () => award(1);
  function award(team) {
    const bank = S().main.bank;
    Store.patch((s) => { s.teams[team].score += bank; s.main.awardTeam = team; s.main.activeTeam = team; });
    Store.fx('confetti');
    toast(`Awarded ${bank} to ${S().teams[team].name}!`);
    renderMain();
  }
  $('newRound').onclick = () => {
    Store.patch((s) => { Store.initRound(); s.main.showStrikeBig = false; });
    renderMain();
    toast('New round ready');
  };

  /* ---------------- FAST MONEY ---------------- */
  let fmPlayer = 1;
  $('fmP1').onclick = () => setFmPlayer(1);
  $('fmP2').onclick = () => setFmPlayer(2);
  function setFmPlayer(p) {
    fmPlayer = p;
    $('fmP1').className = 'btn ' + (p === 1 ? 'blue' : 'ghost');
    $('fmP2').className = 'btn ' + (p === 2 ? 'blue' : 'ghost');
    $('fmP1').textContent = 'Player 1' + (p === 1 ? ' (on board)' : '');
    $('fmP2').textContent = 'Player 2' + (p === 2 ? ' (on board)' : '');
    Store.patch((s) => { s.fast.playerView = p; });
    renderFast();
  }

  function fmData() { return fmPlayer === 2 ? S().fast.p2 : S().fast.p1; }

  function renderFast() {
    const s = S();
    const data = fmData();
    const rows = $('fmRows');
    // suggestions pooled from all fast questions' answers
    const pool = [];
    s.questions.fast.forEach((q) => q.answers.forEach((a) => pool.push(a)));
    rows.innerHTML = data.map((item, i) => `
      <div class="fm-row" data-i="${i}">
        <div class="idx">${i + 1}</div>
        <div class="fm-suggest">
          <input type="text" class="answer" data-i="${i}" placeholder="Answer ${i + 1}" value="${escAttr(item.answer)}" autocomplete="off" />
          <div class="fm-suggest-list hidden" data-list="${i}"></div>
        </div>
        <input type="number" class="points" data-i="${i}" placeholder="pts" value="${item.points || ''}" />
        <button class="btn ${item.revealed ? 'ghost' : 'green'} sm" data-rev="${i}">${item.revealed ? 'Hide' : 'Reveal'}</button>
      </div>`).join('');

    rows.querySelectorAll('input.answer').forEach((inp) => {
      inp.oninput = () => { updateFm(+inp.dataset.i, { answer: inp.value }); showSuggest(+inp.dataset.i, inp.value, pool); };
      inp.onblur = () => setTimeout(() => hideSuggest(+inp.dataset.i), 180);
      inp.onfocus = () => showSuggest(+inp.dataset.i, inp.value, pool);
    });
    rows.querySelectorAll('input.points').forEach((inp) => {
      inp.oninput = () => updateFm(+inp.dataset.i, { points: +inp.value || 0 });
    });
    rows.querySelectorAll('[data-rev]').forEach((b) => {
      b.onclick = () => { const i = +b.dataset.rev; updateFm(i, { revealed: !fmData()[i].revealed }); Sound.flip(); renderFast(); };
    });
    $('fmTotal').textContent = fastTotal();
  }

  function showSuggest(i, val, pool) {
    const box = document.querySelector(`[data-list="${i}"]`);
    if (!box) return;
    const v = (val || '').toLowerCase();
    const matches = pool.filter((a) => a.text.toLowerCase().includes(v)).slice(0, 6);
    if (!matches.length) { box.classList.add('hidden'); return; }
    box.innerHTML = matches.map((a) => `<div data-t="${escAttr(a.text)}" data-p="${a.points}"><span>${escHtml(a.text)}</span><b>${a.points}</b></div>`).join('');
    box.classList.remove('hidden');
    box.querySelectorAll('div').forEach((d) => {
      d.onmousedown = () => {
        updateFm(i, { answer: d.dataset.t, points: +d.dataset.p });
        box.classList.add('hidden'); renderFast();
      };
    });
  }
  function hideSuggest(i) { const box = document.querySelector(`[data-list="${i}"]`); if (box) box.classList.add('hidden'); }

  function updateFm(i, patch) {
    Store.patch((s) => {
      const arr = fmPlayer === 2 ? s.fast.p2 : s.fast.p1;
      Object.assign(arr[i], patch);
    });
    $('fmTotal').textContent = fastTotal();
  }
  function fastTotal() {
    const s = S();
    const a = s.fast.p1.reduce((t, x) => t + (x.revealed ? +x.points || 0 : 0), 0);
    const b = s.fast.p2.reduce((t, x) => t + (x.revealed ? +x.points || 0 : 0), 0);
    return a + b;
  }

  $('fmRevealAll').onclick = () => { Store.patch((s) => { (fmPlayer === 2 ? s.fast.p2 : s.fast.p1).forEach((x) => x.revealed = true); }); Sound.flip(); renderFast(); };
  $('fmHideAll').onclick = () => { Store.patch((s) => { (fmPlayer === 2 ? s.fast.p2 : s.fast.p1).forEach((x) => x.revealed = false); }); renderFast(); };
  $('fmToggleTotal').onclick = () => Store.patch((s) => { s.fast.showTotals = !s.fast.showTotals; });
  $('fmWin').onclick = () => { Store.fx('confetti'); toast('🎉 Winner!'); };

  // timer
  let timerInt = null;
  $('fmStart').onclick = () => {
    const secs = +$('fmTimerSet').value || 20;
    Store.patch((s) => { s.fast.timerSeconds = secs; s.fast.timerMax = secs; s.fast.timerRunning = true; s.fast.timerLabel = $('fmLabel').value || 'PLAYER ' + fmPlayer; });
    clearInterval(timerInt);
    timerInt = setInterval(() => {
      const cur = S().fast.timerSeconds;
      if (cur <= 0) { clearInterval(timerInt); Sound.timeUp(); Store.patch((s) => { s.fast.timerRunning = false; }); return; }
      Store.patch((s) => { s.fast.timerSeconds = cur - 1; });
      if (cur - 1 <= 5 && cur - 1 > 0) Sound.click();
    }, 1000);
  };
  $('fmStop').onclick = () => { clearInterval(timerInt); Store.patch((s) => { s.fast.timerRunning = false; }); };
  $('fmReset').onclick = () => { clearInterval(timerInt); const secs = +$('fmTimerSet').value || 20; Store.patch((s) => { s.fast.timerSeconds = secs; s.fast.timerMax = secs; s.fast.timerRunning = false; }); };
  $('fmLabel').oninput = () => Store.patch((s) => { s.fast.timerLabel = $('fmLabel').value; });

  /* ---------------- Keyboard shortcuts ---------------- */
  addEventListener('keydown', (e) => {
    if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (S().boardMode !== 'main' && $('fastPanel').classList.contains('hidden') === false) return;
    if (e.key >= '1' && e.key <= '8') {
      const i = +e.key - 1;
      const q = S().questions.main[S().main.questionIndex];
      if (q && i < q.answers.length) { toggleReveal(i); }
    } else if (e.key.toLowerCase() === 'x') { addStrike(); }
    else if (e.key === ' ') { e.preventDefault(); revealNext(); }
    else if (e.key.toLowerCase() === 'c') { Store.fx('confetti'); }
  });
  function revealNext() {
    const s = S(); const q = s.questions.main[s.main.questionIndex]; if (!q) return;
    const i = s.main.revealed.findIndex((r) => !r);
    if (i >= 0) toggleReveal(i);
  }

  /* ---------------- sync from other windows ---------------- */
  function syncTabs() {
    const s = S();
    $('modeTabs').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.mode === s.boardMode));
    $('mainPanel').classList.toggle('hidden', s.boardMode === 'fast');
    $('fastPanel').classList.toggle('hidden', s.boardMode !== 'fast');
  }

  Store.subscribe(() => { renderMain(); renderStrikeDots(); $('fmTotal').textContent = fastTotal(); });

  function boot() {
    renderTeams();
    renderQuestionSelect();
    renderMain();
    renderFast();
    setFmPlayer(1);
    syncTabs();
    const on = S().sound !== false;
    $('toggleSound').textContent = on ? '🔊 Sound: On' : '🔇 Sound: Off';
    $('fmTimerSet').value = S().fast.timerMax || 20;
    Theme.apply();
  }

  /* ---------------- utils ---------------- */
  function escHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function escAttr(str) { return escHtml(str).replace(/"/g, '&quot;'); }

  document.addEventListener('DOMContentLoaded', boot);
  boot();
})();
