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
    const isFast = mode === 'fast', isEvent = mode === 'event', isJeop = mode === 'jeopardy';
    $('mainPanel').classList.toggle('hidden', isFast || isEvent || isJeop);
    $('fastPanel').classList.toggle('hidden', !isFast);
    $('eventPanel').classList.toggle('hidden', !isEvent);
    $('jeopPanel').classList.toggle('hidden', !isJeop);
    if (isJeop) renderJpGrid();
    // Players never see a game board just from clicking into a game:
    // - "Family Feud" opens on the FEUD TITLE page until play/pass has decided
    //   control (mid-round it returns to the live board).
    // - "Jeopardy" opens on the JEOPARDY TITLE page unless a clue or Final
    //   Jeopardy is already live.
    // The host starts each game explicitly (face-off strip / Show Board).
    Store.patch((s) => {
      let bm = isEvent ? 'leaderboard' : mode;
      if (mode === 'main' && (!s.event.faceoff || s.event.faceoff.control == null)) bm = 'feud-title';
      if (mode === 'jeopardy' && !s.jeop.active && !(s.jeop.final && s.jeop.final.stage)) bm = 'jeopardy-title';
      if (mode === 'fast') {
        const live = s.fast.p1.some((a) => a.revealed) || s.fast.p2.some((a) => a.revealed)
          || s.fast.showTotals || s.fast.timerRunning;
        if (!live) bm = 'fast-title';
      }
      s.boardMode = bm;
    });
    if (isEvent) buildRoster();
    Sound.click();
  }

  /* ---------------- Sidebar ---------------- */
  // Show-open intro: 3-2-1 countdown + reveal, then it STAYS on screen
  // (lights flashing, title throbbing) until the host closes it — the same
  // button toggles between PLAY and CLOSE.
  $('ctlClientName').value = S().clientName || '';
  $('ctlClientName').oninput = () => Store.patch((s) => { s.clientName = $('ctlClientName').value; });
  $('playIntro').onclick = () => {
    if (S().boardMode === 'intro') {
      Store.patch((s) => { s.boardMode = 'logo'; });
      syncTabs();
      toast('Intro closed');
    } else {
      Store.patch((s) => { s.boardMode = 'intro'; s.introId = (s.introId || 0) + 1; });
      toast('🎬 3-2-1… intro rolling — press again to close');
    }
    updateIntroBtn();
  };
  function updateIntroBtn() {
    $('playIntro').textContent = S().boardMode === 'intro' ? '⏹ CLOSE INTRO' : '🎬 PLAY INTRO! (3-2-1)';
  }

  // Show-close outro: balloons fall until the host switches screens.
  $('playOutro').onclick = () => {
    Store.patch((s) => { s.boardMode = 'outro'; s.outroId = (s.outroId || 0) + 1; });
    toast('🎈 Outro playing — balloons away!');
    updateIntroBtn();
  };

  $('toLogo').onclick = () => { Store.patch((s) => { s.boardMode = 'logo'; }); syncTabs(); };
  $('toJeopardy').onclick = () => switchPanel('jeopardy');
  $('toMain').onclick = () => { Store.patch((s) => { s.boardMode = 'main'; }); switchPanel('main'); };
  $('toFast').onclick = () => { Store.patch((s) => { s.boardMode = 'fast'; }); switchPanel('fast'); };
  $('celebrate').onclick = () => { Store.fx('confetti'); toast('🎊 Celebration!'); };
  $('fxSmoke').onclick = () => { Store.fx('smoke'); toast('💨 Smoke machine!'); };
  $('fxLasers').onclick = () => { Store.fx('lasers'); toast('⚡ Laser show!'); };
  $('fxUfo').onclick = () => { Store.fx('ufo'); toast('🛸 UFO inbound!'); };
  // Save / load the ENTIRE game (questions, images, branding, teams,
  // scores, round progress) as a portable .json file — email or USB it
  // to another laptop and Load it there to pick up exactly where you left off.
  $('saveGame').onclick = () => {
    const s = S();
    const stamp = new Date().toISOString().slice(0, 10);
    const client = (s.clientName || 'game').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'game';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(s)], { type: 'application/json' }));
    a.download = `game-show-roundup-${client}-${stamp}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    toast('💾 Saved! Send the file to any laptop and use Load Game there');
  };
  $('loadGame').onclick = () => $('loadGameFile').click();
  $('loadGameFile').onchange = (e) => {
    const f = e.target.files[0]; e.target.value = '';
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      let obj;
      try { obj = JSON.parse(r.result); } catch (_) { obj = null; }
      if (!obj || typeof obj !== 'object' || !obj.questions || !obj.teams) {
        alert('That file is not a valid saved game.'); return;
      }
      if (!confirm('Load this saved game?\n\nIt REPLACES everything currently on this laptop — questions, branding, teams, scores and round progress.')) return;
      localStorage.setItem(Store.LS_KEY, JSON.stringify(obj));
      location.reload();
    };
    r.readAsText(f);
  };

  // Factory reset — wipes EVERYTHING back to defaults (scores, teams,
  // matchups, questions, branding, client name) for a brand-new game.
  // Password-protected so it can't be hit by accident mid-event.
  $('resetAll').onclick = () => {
    const pw = prompt('⚠ FULL RESET — this wipes scores, teams, matchups, questions and branding back to defaults.\n\nEnter the reset password to continue:');
    if (pw === null) return;                      // cancelled
    if (pw.trim() !== 'TBROI') { alert('Incorrect password — nothing was reset.'); return; }
    Store.reset();
    // Reload so every control rebuilds cleanly from the fresh state.
    location.reload();
  };
  $('toggleSound').onclick = () => {
    Store.patch((s) => { s.sound = s.sound === false ? true : false; });
    const on = S().sound !== false;
    $('toggleSound').textContent = on ? '🔊 Sound: On' : '🔇 Sound: Off';
    Sound.setEnabled(on);
  };

  /* ---------------- FAMILY FEUD ---------------- */
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
    Store.patch((s) => { Store.initRound(); s.main.showStrikeBig = false; s.event.faceoff = { buzzed: null, control: null }; });
    renderMain();
    toast('New round ready');
  };

  /* ---------------- FAST MONEY ---------------- */
  // Title page / countdown / board — same show-open flow as Jeopardy. The
  // countdown slams the title and HOLDS until the host shows the board.
  $('fmTitleBtn').onclick = () => {
    Store.patch((s) => { s.boardMode = 'fast-title'; });
    toast('🏷 Fast Money title page up');
  };
  $('fmCountdown').onclick = () => {
    Store.patch((s) => { s.boardMode = 'fast-title'; s.fast.countdownId = (s.fast.countdownId || 0) + 1; });
    toast('🎬 3-2-1… holds on the title until you press Show Fast Money');
  };
  $('fmShowBoard').onclick = () => {
    Store.patch((s) => { s.boardMode = 'fast'; });
    toast('▶ Fast Money board up!');
  };

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

  // Speed-round question navigation — the board shows the selected question.
  function setFastQ(i) {
    Store.patch((s) => {
      s.fast.questionIndex = Math.max(0, Math.min(s.questions.fast.length - 1, i));
    });
    renderFast();
  }
  $('fmPrevQ').onclick = () => setFastQ((S().fast.questionIndex || 0) - 1);
  $('fmNextQ').onclick = () => setFastQ((S().fast.questionIndex || 0) + 1);
  $('fmQSelect').onchange = () => setFastQ(+$('fmQSelect').value);

  function renderFast() {
    const s = S();
    const data = fmData();
    const rows = $('fmRows');

    // question picker + preview
    const qi = s.fast.questionIndex || 0;
    $('fmQSelect').innerHTML = s.questions.fast.map((q, i) =>
      `<option value="${i}" ${i === qi ? 'selected' : ''}>${i + 1}. ${escHtml(q.q).slice(0, 60)}</option>`).join('');
    const curQ = s.questions.fast[qi];
    $('fmQPreview').textContent = curQ ? curQ.q : '(no speed-round questions — add some in the Editor)';

    // suggestions: the current question's answers first, then the rest
    const pool = [];
    if (curQ) curQ.answers.forEach((a) => pool.push(a));
    s.questions.fast.forEach((q, i) => { if (i !== qi) q.answers.forEach((a) => pool.push(a)); });
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

  // Full Fast Money reset: both players' answers, totals, timer, back to Q1.
  $('fmResetRound').onclick = () => {
    if (!confirm('Reset Fast Money? This clears BOTH players\' answers, hides totals, resets the timer, and returns to question 1.')) return;
    clearInterval(timerInt);
    const secs = +$('fmTimerSet').value || 20;
    Store.patch((s) => {
      s.fast.p1 = Store.emptyFast();
      s.fast.p2 = Store.emptyFast();
      s.fast.showTotals = false;
      s.fast.questionIndex = 0;
      s.fast.timerSeconds = secs;
      s.fast.timerMax = secs;
      s.fast.timerRunning = false;
    });
    renderFast();
    toast('↺ Fast Money reset — fresh round');
  };

  /* ---------------- JEOPARDY (opener round) ---------------- */
  function jpData() { return S().questions.jeopardy || { categories: [] }; }

  function renderJpGrid() {
    const J = jpData(); const s = S();
    const g = $('jpGrid');
    const cols = Math.max(1, J.categories.length);
    g.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    const rows = J.categories.length ? Math.max(...J.categories.map((c) => c.clues.length)) : 0;
    let html = J.categories.map((c) => `<div class="h" title="${escAttr(c.name)}">${escHtml(c.name)}</div>`).join('');
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const clue = J.categories[c] && J.categories[c].clues[r];
        if (!clue) { html += '<span></span>'; continue; }
        const k = c + ':' + r;
        const used = s.jeop.used[k];
        const live = s.jeop.active && s.jeop.active.c === c && s.jeop.active.r === r;
        html += `<button class="${used ? 'used' : ''} ${live ? 'live' : ''}" data-jp="${k}">${clue.dd ? '◆ ' : ''}${clue.value}</button>`;
      }
    }
    g.innerHTML = html || '<p class="hint">No Jeopardy categories yet — add some in the Editor.</p>';
    g.querySelectorAll('button[data-jp]').forEach((b) => { b.onclick = () => openJpClue(b.dataset.jp); });
    updateJpCluePanel();
    updateJpFinalPanel();
  }

  function openJpClue(k) {
    const [c, r] = k.split(':').map(Number);
    jpResetTimer();
    Store.patch((s) => { s.jeop.active = { c, r, showAnswer: false }; s.jeop.final = { stage: null }; s.boardMode = 'jeopardy'; });
    Sound.flip();
    renderJpGrid();
  }

  function jpAnswerText(clue) {
    if (clue.type === 'mc') return 'ABCD'[+clue.answer] + ' — ' + ((clue.choices || [])[+clue.answer] || '');
    if (clue.type === 'tf') return clue.answer ? 'TRUE' : 'FALSE';
    return String(clue.answer || '');
  }

  function updateJpCluePanel() {
    const s = S(); const act = s.jeop.active; const panel = $('jpClueCtl');
    const J = jpData();
    const cat = act && J.categories[act.c];
    const clue = cat && cat.clues[act.r];
    if (!act || !clue) { panel.classList.add('hidden'); return; }
    panel.classList.remove('hidden');
    const typeLabel = { mc: 'Multiple choice', tf: 'True / False', text: 'Type-in' }[clue.type] || clue.type;
    $('jpCat').textContent = cat.name + ' · ' + clue.value + ' · ' + typeLabel + (clue.dd ? ' · ◆ DAILY DOUBLE' : '');
    $('jpQ').textContent = clue.q;
    $('jpA').textContent = '✔ ' + jpAnswerText(clue);
    // Daily Double: award/deduct uses the wager instead of the tile value.
    $('jpWagerWrap').style.display = clue.dd ? '' : 'none';
    const clueKey = act.c + ':' + act.r;
    if (clue.dd && $('jpWager').dataset.clue !== clueKey) {
      $('jpWager').value = clue.value;
      $('jpWager').dataset.clue = clueKey;
    }
    const stake = clue.dd ? (+$('jpWager').value || clue.value) : clue.value;
    $('jpVal').textContent = (s.jeop.awardSign < 0 ? '−' : '+') + stake;
    $('jpSignPlus').classList.toggle('on', s.jeop.awardSign >= 0);
    $('jpSignMinus').classList.toggle('on', s.jeop.awardSign < 0);
    $('jpReveal').disabled = !!act.showAnswer;
    $('jpAward').innerHTML = s.teams.map((t, i) =>
      `<button class="ea-team" data-i="${i}"><span class="nm">${escHtml(t.name)}</span><span class="s">${t.score}</span></button>`).join('');
    $('jpAward').querySelectorAll('.ea-team').forEach((b) => { b.onclick = () => jpAwardTeam(+b.dataset.i); });
  }

  function jpAwardTeam(i) {
    const s = S(); const act = s.jeop.active; if (!act) return;
    const cat = jpData().categories[act.c]; const clue = cat && cat.clues[act.r]; if (!clue) return;
    const stake = clue.dd ? (+$('jpWager').value || +clue.value || 0) : (+clue.value || 0);
    const delta = (s.jeop.awardSign < 0 ? -1 : 1) * stake;
    Store.patch((st) => { st.teams[i].score = Math.max(0, st.teams[i].score + delta); });
    if (delta >= 0) Sound.reveal(); else Sound.strike();
    toast((delta >= 0 ? '+' : '') + delta + ' → ' + s.teams[i].name);
    updateJpCluePanel();
  }

  $('jpReveal').onclick = () => { Store.patch((s) => { if (s.jeop.active) s.jeop.active.showAnswer = true; }); updateJpCluePanel(); };
  $('jpSignPlus').onclick = () => { Store.patch((s) => { s.jeop.awardSign = 1; }); updateJpCluePanel(); };
  $('jpSignMinus').onclick = () => { Store.patch((s) => { s.jeop.awardSign = -1; }); updateJpCluePanel(); };
  $('jpDone').onclick = () => {
    Store.patch((s) => { const a = s.jeop.active; if (a) s.jeop.used[a.c + ':' + a.r] = true; s.jeop.active = null; });
    Sound.click(); renderJpGrid();
  };
  $('jpBack').onclick = () => { Store.patch((s) => { s.jeop.active = null; }); renderJpGrid(); };
  $('jpWager').oninput = () => updateJpCluePanel();
  $('jpTitleBtn').onclick = () => {
    Store.patch((s) => { s.boardMode = 'jeopardy-title'; s.jeop.active = null; s.jeop.final = { stage: null }; });
    toast('🏷 Jeopardy title page up');
  };
  // Countdown plays 3-2-1 + title slam on the TITLE page, then HOLDS there
  // until the host explicitly shows the board.
  $('jpCountdown').onclick = () => {
    Store.patch((s) => { s.boardMode = 'jeopardy-title'; s.jeop.active = null; s.jeop.final = { stage: null }; s.jeop.countdownId = (s.jeop.countdownId || 0) + 1; });
    toast('🎬 3-2-1… holds on the title until you press Show Board');
  };
  $('jpShowBoard').onclick = () => {
    Store.patch((s) => { s.boardMode = 'jeopardy'; s.jeop.active = null; s.jeop.final = { stage: null }; });
    toast('▶ Jeopardy board revealed!');
  };
  $('jpSweep').onclick = () => {
    Store.patch((s) => { s.boardMode = 'jeopardy'; s.jeop.active = null; s.jeop.final = { stage: null }; s.jeop.sweepId = (s.jeop.sweepId || 0) + 1; });
    toast('🎥 Category sweep rolling!');
  };

  /* ---- 30-second clue clock ---- */
  let jpTimerInt = null;
  function jpStartTimer() {
    clearInterval(jpTimerInt);
    Store.patch((s) => { s.jeop.timerSec = 30; s.jeop.timerMax = 30; s.jeop.timerRun = true; });
    jpTimerInt = setInterval(() => {
      const cur = S().jeop.timerSec;
      if (cur <= 0) { clearInterval(jpTimerInt); Store.patch((s) => { s.jeop.timerRun = false; }); return; }
      Store.patch((s) => { s.jeop.timerSec = cur - 1; });
    }, 1000);
  }
  function jpResetTimer() {
    clearInterval(jpTimerInt);
    Store.patch((s) => { s.jeop.timerRun = false; s.jeop.timerSec = s.jeop.timerMax = 30; });
  }
  $('jpTimerBtn').onclick = () => { jpStartTimer(); toast('⏱ 30 seconds!'); };
  $('jpTimerStop').onclick = () => { jpResetTimer(); };
  $('jfTimer').onclick = () => { jpStartTimer(); toast('⏱ 30 seconds!'); };

  /* ---- Final Jeopardy ---- */
  function jfClue() { return jpData().final || {}; }

  $('jpFinalBtn').onclick = () => {
    jpResetTimer();
    Store.patch((s) => {
      s.boardMode = 'jeopardy'; s.jeop.active = null;
      s.jeop.final = { stage: 'category' };
      s.jeop.finalWagers = s.jeop.finalWagers || {};
      s.jeop.finalApplied = {};
    });
    updateJpFinalPanel();
    toast('🏆 Final Jeopardy — collect those wagers!');
  };
  $('jfStage1').onclick = () => { Store.patch((s) => { s.jeop.final.stage = 'category'; }); updateJpFinalPanel(); };
  $('jfStage2').onclick = () => { Store.patch((s) => { s.jeop.final.stage = 'clue'; }); updateJpFinalPanel(); };
  $('jfStage3').onclick = () => { jpResetTimer(); Store.patch((s) => { s.jeop.final.stage = 'answer'; }); updateJpFinalPanel(); };
  $('jfExit').onclick = () => {
    jpResetTimer();
    Store.patch((s) => { s.jeop.final = { stage: null }; });
    updateJpFinalPanel(); renderJpGrid();
  };

  function updateJpFinalPanel() {
    const s = S(); const fin = s.jeop.final || {};
    const panel = $('jpFinal');
    panel.classList.toggle('hidden', !fin.stage);
    if (!fin.stage) return;
    $('jpClueCtl').classList.add('hidden');   // final replaces the clue panel
    const F = jfClue();
    $('jfQ').textContent = (F.category ? F.category + ' — ' : '') + (F.q || '(set the Final Jeopardy clue in the Editor)');
    $('jfA').textContent = '✔ ' + jpAnswerText(F);
    ['jfStage1', 'jfStage2', 'jfStage3'].forEach((id, i) => {
      const stageName = ['category', 'clue', 'answer'][i];
      $(id).classList.toggle('on', fin.stage === stageName);
    });
    // wager rows
    $('jfWagers').innerHTML = s.teams.map((t, i) => {
      const applied = (s.jeop.finalApplied || {})[i];
      const w = (s.jeop.finalWagers || {})[i];
      return `<div class="jf-row">
        <span class="nm">${escHtml(t.name)}<b>${t.score}</b></span>
        <input type="number" min="0" placeholder="wager" value="${w != null ? w : ''}" data-jfw="${i}" ${applied ? 'disabled' : ''} />
        <button class="btn green sm" data-jfok="${i}" ${applied ? 'disabled' : ''}>✓</button>
        <button class="btn red sm" data-jfno="${i}" ${applied ? 'disabled' : ''}>✗</button>
        <span class="res ${applied === 'win' ? 'win' : applied === 'loss' ? 'loss' : ''}">${applied === 'win' ? 'WON' : applied === 'loss' ? 'LOST' : ''}</span>
      </div>`;
    }).join('');
    $('jfWagers').querySelectorAll('[data-jfw]').forEach((inp) => {
      inp.onchange = () => Store.patch((st) => { st.jeop.finalWagers[+inp.dataset.jfw] = Math.max(0, +inp.value || 0); });
    });
    $('jfWagers').querySelectorAll('[data-jfok]').forEach((b) => { b.onclick = () => jfApply(+b.dataset.jfok, true); });
    $('jfWagers').querySelectorAll('[data-jfno]').forEach((b) => { b.onclick = () => jfApply(+b.dataset.jfno, false); });
  }

  function jfApply(i, won) {
    const s = S();
    const w = Math.max(0, +((s.jeop.finalWagers || {})[i]) || 0);
    Store.patch((st) => {
      st.teams[i].score = Math.max(0, st.teams[i].score + (won ? w : -w));
      st.jeop.finalApplied[i] = won ? 'win' : 'loss';
    });
    if (won) Sound.reveal(); else Sound.strike();
    toast((won ? '+' : '−') + w + ' → ' + s.teams[i].name);
    updateJpFinalPanel();
  }
  $('jpResetBoard').onclick = () => {
    if (!confirm('Reset the Jeopardy board? All tiles come back (team scores are kept).')) return;
    Store.patch((s) => { s.jeop.used = {}; s.jeop.active = null; });
    renderJpGrid(); toast('Jeopardy board reset');
  };

  /* ---------------- FACE-OFF flow (matchup → question → play/pass) ---------------- */
  // The two teams facing off this round (from event.matchups, safe fallbacks).
  function foTeams() {
    const s = S();
    const m = (s.event.matchups || [])[(s.event.round || 1) - 1] || [];
    const a = Number.isInteger(m[0]) && s.teams[m[0]] ? m[0] : 0;
    let b = Number.isInteger(m[1]) && s.teams[m[1]] ? m[1] : (s.teams[1] ? 1 : 0);
    if (b === a && s.teams.length > 1) b = a === 0 ? 1 : 0;
    return [a, b];
  }

  $('foTitle').onclick = () => { Store.patch((s) => { s.boardMode = 'feud-title'; }); syncTabs(); Sound.click(); };
  $('foMatchup').onclick = () => { Store.patch((s) => { s.boardMode = 'matchup'; }); syncTabs(); Sound.click(); };
  $('foQuestion').onclick = () => { Store.patch((s) => { s.boardMode = 'question'; }); syncTabs(); Sound.click(); };
  $('foBuzzA').onclick = () => buzz(0);
  $('foBuzzB').onclick = () => buzz(1);
  function buzz(side) {
    const [a, b] = foTeams();
    const team = side === 0 ? a : b;
    Store.patch((s) => { s.event.faceoff = { buzzed: team, control: null }; });
    Sound.buzzIn();
    toast('🔔 ' + S().teams[team].name + ' buzzed in first!');
    updateFaceoffUI();
  }
  $('foPlay').onclick = () => decide(true);
  $('foPass').onclick = () => decide(false);
  function decide(play) {
    const s = S(); const fo = s.event.faceoff || {};
    if (fo.buzzed == null) return;
    const [a, b] = foTeams();
    const other = fo.buzzed === a ? b : a;
    const control = play ? fo.buzzed : other;
    Store.patch((st) => { st.event.faceoff.control = control; st.main.activeTeam = control; });
    Sound.ding();
    toast((play ? '▶ PLAY' : '⤿ PASS') + ' — ' + s.teams[control].name + ' takes the board!');
    updateFaceoffUI();
  }
  $('foBoard').onclick = () => { Store.patch((s) => { s.boardMode = 'main'; }); syncTabs(); Sound.click(); };
  $('foReset').onclick = () => {
    Store.patch((s) => { s.event.faceoff = { buzzed: null, control: null }; s.main.activeTeam = null; });
    updateFaceoffUI(); toast('Face-off reset');
  };

  function updateFaceoffUI() {
    const s = S(); const [a, b] = foTeams(); const fo = s.event.faceoff || {};
    const ba = $('foBuzzA'), bb = $('foBuzzB');
    ba.textContent = s.teams[a] ? s.teams[a].name : 'Team A';
    bb.textContent = s.teams[b] ? s.teams[b].name : 'Team B';
    ba.classList.toggle('buzzed', fo.buzzed === a);
    bb.classList.toggle('buzzed', fo.buzzed === b);
    ba.classList.toggle('controlled', fo.control === a);
    bb.classList.toggle('controlled', fo.control === b);
    const decided = fo.control != null;
    $('foPlay').disabled = fo.buzzed == null || decided;
    $('foPass').disabled = fo.buzzed == null || decided;
  }

  /* ---- Round matchup editor (Event panel) ---- */
  let muSig = '';
  function renderMatchupEditor() {
    const s = S(); const n = s.event.totalRounds;
    const opts = (sel) => ['<option value="-1">—</option>']
      .concat(s.teams.map((t, i) => `<option value="${i}" ${sel === i ? 'selected' : ''}>${escHtml(t.name)}</option>`)).join('');
    $('evMatchups').innerHTML = Array.from({ length: n }, (_, r) => {
      const m = (s.event.matchups || [])[r] || [-1, -1];
      return `<div class="ev-mu ${s.event.round === r + 1 ? 'current' : ''}"><span class="r">R${r + 1}</span>
        <select data-mu="${r}:0">${opts(m[0])}</select><span class="v">vs</span>
        <select data-mu="${r}:1">${opts(m[1])}</select></div>`;
    }).join('');
    $('evMatchups').querySelectorAll('select').forEach((sel) => {
      sel.onchange = () => {
        const [r, side] = sel.dataset.mu.split(':').map(Number);
        Store.patch((st) => {
          if (!Array.isArray(st.event.matchups)) st.event.matchups = [];
          while (st.event.matchups.length < st.event.totalRounds) st.event.matchups.push([-1, -1]);
          st.event.matchups[r][side] = +sel.value;
        });
        updateFaceoffUI();
      };
    });
  }
  // Rebuild only when relevant state changed and no dropdown is being used.
  function maybeRenderMatchups() {
    const s = S();
    const sig = [s.event.round, s.event.totalRounds, s.teams.map((t) => t.name).join('§'), JSON.stringify(s.event.matchups)].join('|');
    if (sig === muSig) return;
    if ($('evMatchups').contains(document.activeElement)) return;
    muSig = sig;
    renderMatchupEditor();
  }

  /* ---------------- Cross-device sync UI ---------------- */
  const syncModal = $('syncModal');
  $('syncBtn').onclick = () => {
    if (window.Sync) {
      $('syncRoom').value = Sync.getRoom();
      $('syncUrl').value = Sync.getUrl() || '';
    }
    syncModal.classList.add('show');
  };
  $('syncClose').onclick = () => syncModal.classList.remove('show');
  syncModal.onclick = (e) => { if (e.target === syncModal) syncModal.classList.remove('show'); };
  $('syncApply').onclick = () => {
    if (!window.Sync) return;
    Sync.configure($('syncUrl').value, $('syncRoom').value);
    toast('Connecting…');
  };
  $('syncBoardLink').onclick = () => {
    const room = ($('syncRoom').value || 'MAIN').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const base = location.origin + location.pathname.replace(/[^/]*$/, '') + 'board.html';
    const url = base + '?room=' + room + (Sync && Sync.getUrl() ? '&sync=' + encodeURIComponent(Sync.getUrl()) : '');
    navigator.clipboard && navigator.clipboard.writeText(url);
    $('syncState').textContent = 'Board link copied: ' + url;
    toast('Board link copied');
  };

  function paintSync(status, st) {
    const dot = $('syncDot'), label = $('syncLabel'), sstate = $('syncState');
    dot.className = 'dot-live ' + status;
    const map = { off: 'Same-device', connecting: 'Connecting…', live: 'Live · ' + (st ? st.room : ''), retry: 'Reconnecting…' };
    label.textContent = map[status] || status;
    if (sstate) {
      const msgs = {
        off: 'Not using a server. Multiple windows on THIS browser still sync automatically. To control another device, enter a server address and room, then Connect.',
        connecting: 'Connecting to ' + (st.url || '') + ' …',
        live: '✅ Connected to room “' + st.room + '”. Any device on this server + room is now in sync.',
        retry: '⚠️ Lost connection to ' + (st.url || '') + ' — retrying automatically…',
      };
      sstate.textContent = msgs[status] || '';
    }
  }
  if (window.Sync) Sync.onStatus(paintSync);

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
    const isJp = s.boardMode === 'jeopardy' || s.boardMode === 'jeopardy-title';
    const isFm = s.boardMode === 'fast' || s.boardMode === 'fast-title';
    const tab = s.boardMode === 'leaderboard' ? 'event'
      : (s.boardMode === 'matchup' || s.boardMode === 'question' || s.boardMode === 'feud-title') ? 'main'
      : isJp ? 'jeopardy'
      : isFm ? 'fast'
      : s.boardMode;
    $('modeTabs').querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.mode === tab));
    $('mainPanel').classList.toggle('hidden', isFm || s.boardMode === 'leaderboard' || isJp);
    $('fastPanel').classList.toggle('hidden', !isFm);
    $('eventPanel').classList.toggle('hidden', s.boardMode !== 'leaderboard');
    $('jeopPanel').classList.toggle('hidden', !isJp);
  }

  Store.subscribe(() => {
    renderMain(); renderStrikeDots(); $('fmTotal').textContent = fastTotal(); updateEventUI();
    updateIntroBtn();
    if (!$('jeopPanel').classList.contains('hidden')) renderJpGrid();
    const cn = $('ctlClientName');
    if (cn && document.activeElement !== cn) cn.value = S().clientName || '';
  });

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
    initEvent();
    buildRoster();
    updateEventUI();
    updateIntroBtn();
    Theme.apply();
  }

  /* ---------------- EVENT / TOURNAMENT ---------------- */
  let rosterCount = -1;

  function initEvent() {
    const s = S();
    $('evOn').checked = s.event.on;
    // Pre-fill a sensible event size (12) when still on the classic 2-team default.
    $('evTeams').value = (s.event.on || s.teams.length > 2) ? s.teams.length : 12;
    $('evRounds').value = s.event.totalRounds;
    $('evRound').value = s.event.round;

    $('evOn').onchange = () => {
      const on = $('evOn').checked;
      Store.patch((st) => {
        st.event.on = on;
        if (on) {
          Store.setTeamCount(Math.max(2, +$('evTeams').value || 12));
          st.event.round = 1; st.event.showFinal = false;
          st.boardMode = 'leaderboard';
        }
      });
      $('evTeams').value = S().teams.length;
      buildRoster(); updateEventUI(); syncTabs();
      toast(on ? 'Event mode ON' : 'Event mode off');
    };
    $('evTeams').onchange = () => { Store.patch(() => Store.setTeamCount(+$('evTeams').value || 12)); buildRoster(); updateEventUI(); };
    $('evRounds').onchange = () => { Store.patch((st) => { st.event.totalRounds = Math.max(1, +$('evRounds').value || 10); }); updateEventUI(); };
    $('evRound').onchange = () => { Store.patch((st) => { st.event.round = Math.max(1, +$('evRound').value || 1); }); updateEventUI(); };
    $('evPrevRound').onclick = () => { Store.patch((st) => { st.event.round = Math.max(1, st.event.round - 1); }); $('evRound').value = S().event.round; updateEventUI(); };
    $('evNextRound').onclick = () => { Store.patch((st) => { st.event.round = Math.min(st.event.totalRounds, st.event.round + 1); }); $('evRound').value = S().event.round; updateEventUI(); };

    $('evShowLb').onclick = () => { Store.patch((st) => { st.boardMode = 'leaderboard'; st.event.showFinal = false; }); syncTabs(); };
    $('evShowFinal').onclick = () => { Store.patch((st) => { st.boardMode = 'leaderboard'; st.event.showFinal = true; }); syncTabs(); Store.fx('confetti'); };
    $('evSortNames').onclick = () => { Store.patch((st) => { st.teams.sort((a, b) => a.name.localeCompare(b.name)); }); buildRoster(); updateEventUI(); };
    $('evResetScores').onclick = () => {
      if (!confirm('Reset ALL team scores to 0 and go back to Round 1?')) return;
      Store.patch((st) => { st.teams.forEach((t) => (t.score = 0)); st.event.round = 1; st.event.showFinal = false; Store.initRound(); });
      $('evRound').value = 1; buildRoster(); updateEventUI(); toast('Scores reset');
    };

    // Event award bar actions (in Main panel)
    $('eaNext').onclick = eventNextRound;
    $('eaPrev').onclick = eventPrevRound;
    $('eaLeaderboard').onclick = () => { Store.patch((st) => { st.boardMode = 'leaderboard'; st.event.showFinal = false; }); syncTabs(); };
  }

  // Build the roster editor (only on structural change — preserves input focus otherwise).
  function buildRoster() {
    const s = S();
    const rankOf = rankMap(s);
    $('evRoster').innerHTML = s.teams.map((t, i) => `
      <div class="ev-team">
        <span class="rk" id="evrk${i}">${rankOf[i]}</span>
        <input class="nm" data-i="${i}" value="${escAttr(t.name)}" />
        <div class="sc-wrap">
          <button class="mini" data-dec="${i}">−</button>
          <input class="v" type="number" data-i="${i}" value="${t.score}" />
          <button class="mini" data-inc="${i}">+</button>
        </div>
      </div>`).join('');
    $('evRoster').querySelectorAll('input.nm').forEach((inp) => {
      inp.oninput = () => Store.patch((st) => { st.teams[+inp.dataset.i].name = inp.value; });
    });
    $('evRoster').querySelectorAll('input.v').forEach((inp) => {
      inp.oninput = () => Store.patch((st) => { st.teams[+inp.dataset.i].score = Math.max(0, +inp.value || 0); });
    });
    $('evRoster').querySelectorAll('[data-dec]').forEach((b) => {
      b.onclick = () => { Store.patch((st) => { const t = st.teams[+b.dataset.dec]; t.score = Math.max(0, t.score - 5); }); refreshRoster(); };
    });
    $('evRoster').querySelectorAll('[data-inc]').forEach((b) => {
      b.onclick = () => { Store.patch((st) => { st.teams[+b.dataset.inc].score += 5; }); refreshRoster(); };
    });
    rosterCount = s.teams.length;
  }

  // Update scores/ranks without rebuilding (keeps focus while typing).
  function refreshRoster() {
    const s = S();
    const rankOf = rankMap(s);
    s.teams.forEach((t, i) => {
      const rk = document.getElementById('evrk' + i); if (rk) rk.textContent = rankOf[i];
      const v = document.querySelector('#evRoster input.v[data-i="' + i + '"]');
      if (v && document.activeElement !== v) v.value = t.score;
    });
  }

  function rankMap(s) {
    const ranked = s.teams.map((t, i) => ({ i, score: t.score })).sort((a, b) => b.score - a.score || a.i - b.i);
    const m = {}; ranked.forEach((t, idx) => { m[t.i] = idx + 1; }); return m;
  }

  function eventAward(i) {
    const s = S();
    if (s.main.awardTeam != null) { toast('Already awarded — press Next Round'); return; }
    const bank = s.main.bank;
    Store.patch((st) => { st.teams[i].score += bank; st.main.awardTeam = i; });
    Store.fx('confetti');
    toast('+' + bank + ' → ' + s.teams[i].name);
    updateEventUI();
  }

  function eventNextRound() {
    Store.patch((s) => {
      s.event.round = Math.min(s.event.totalRounds, s.event.round + 1);
      s.main.questionIndex = Math.min(s.questions.main.length - 1, s.main.questionIndex + 1);
      Store.initRound();
      s.main.showStrikeBig = false;
      s.event.faceoff = { buzzed: null, control: null };   // fresh buzzer race
      s.main.activeTeam = null;
      s.boardMode = 'leaderboard';
    });
    $('evRound').value = S().event.round;
    renderMain(); refreshRoster(); updateEventUI(); syncTabs();
    toast('Round ' + S().event.round + ' — leaderboard up');
  }

  // Rewind one round: steps the round counter and question back, clears the
  // face-off, and shows the leaderboard. Scores are untouched — adjust them
  // in the roster if a round needs to be un-awarded.
  function eventPrevRound() {
    Store.patch((s) => {
      s.event.round = Math.max(1, s.event.round - 1);
      s.main.questionIndex = Math.max(0, s.main.questionIndex - 1);
      Store.initRound();
      s.main.showStrikeBig = false;
      s.event.faceoff = { buzzed: null, control: null };
      s.main.activeTeam = null;
      s.boardMode = 'leaderboard';
    });
    $('evRound').value = S().event.round;
    renderMain(); refreshRoster(); updateEventUI(); syncTabs();
    toast('Rewound to Round ' + S().event.round);
  }

  // Show/refresh event UI: award bar in Main, classic controls hidden in event mode.
  function updateEventUI() {
    const s = S();
    const on = s.event.on;
    // Classic 2-team controls hide in event mode
    $('teamsRow').classList.toggle('hidden', on);
    $('awardT0').classList.toggle('hidden', on);
    $('awardT1').classList.toggle('hidden', on);
    // Event award bar (lives in Main panel)
    const bar = $('eventAwardBar');
    bar.classList.toggle('hidden', !on);
    if (on) {
      $('eaRound').textContent = 'Round ' + s.event.round + ' of ' + s.event.totalRounds;
      $('eaBank').textContent = s.main.bank;
      const awarded = s.main.awardTeam;
      if (rosterCount !== s.teams.length || $('eaGrid').childElementCount !== s.teams.length) buildAwardGrid();
      $('eaGrid').querySelectorAll('.ea-team').forEach((btn) => {
        const i = +btn.dataset.i;
        btn.querySelector('.s').textContent = s.teams[i].score;
        btn.querySelector('.nm').textContent = s.teams[i].name;
        btn.classList.toggle('just-won', awarded === i);
        btn.disabled = awarded != null;
        btn.style.opacity = (awarded != null && awarded !== i) ? '.5' : '1';
      });
      refreshRoster();
    }
    // keep setup fields in step
    if (document.activeElement !== $('evRound')) $('evRound').value = s.event.round;
    // face-off strip + matchup editor stay current on every state change
    updateFaceoffUI();
    maybeRenderMatchups();
  }

  function buildAwardGrid() {
    const s = S();
    $('eaGrid').innerHTML = s.teams.map((t, i) => `
      <button class="ea-team" data-i="${i}"><span class="nm">${escHtml(t.name)}</span><span class="s">${t.score}</span></button>`).join('');
    $('eaGrid').querySelectorAll('.ea-team').forEach((b) => { b.onclick = () => eventAward(+b.dataset.i); });
    rosterCount = s.teams.length;
  }

  /* ---------------- utils ---------------- */
  function escHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function escAttr(str) { return escHtml(str).replace(/"/g, '&quot;'); }

  document.addEventListener('DOMContentLoaded', boot);
  boot();
})();
