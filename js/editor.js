/* editor.js — CRUD for question banks (main + fast). Autosaves to Store. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const S = () => Store.get();
  let tab = 'main';

  function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), 1500); }

  $('tabs').querySelectorAll('button').forEach((b) => {
    b.onclick = () => { tab = b.dataset.t; $('tabs').querySelectorAll('button').forEach((x) => x.classList.toggle('active', x === b)); render(); };
  });

  function bank() { return S().questions[tab]; }

  function render() {
    const list = $('list');
    const qs = bank();
    list.innerHTML = qs.map((q, qi) => qCard(q, qi)).join('') || '<p class="sum">No questions yet. Click “Add Question”.</p>';

    // wire question text
    list.querySelectorAll('.qtext').forEach((inp) => {
      inp.oninput = () => Store.patch((s) => { s.questions[tab][+inp.dataset.q].q = inp.value; });
    });
    // answer text + points
    list.querySelectorAll('.ans-text').forEach((inp) => {
      inp.oninput = () => Store.patch((s) => { s.questions[tab][+inp.dataset.q].answers[+inp.dataset.a].text = inp.value; });
    });
    list.querySelectorAll('.ans-pts').forEach((inp) => {
      inp.oninput = () => { Store.patch((s) => { s.questions[tab][+inp.dataset.q].answers[+inp.dataset.a].points = +inp.value || 0; }); updateSum(+inp.dataset.q); };
    });
    // add / remove answer
    list.querySelectorAll('[data-addans]').forEach((b) => {
      b.onclick = () => { Store.patch((s) => { s.questions[tab][+b.dataset.addans].answers.push({ text: '', points: 0 }); }); render(); };
    });
    list.querySelectorAll('[data-delans]').forEach((b) => {
      b.onclick = () => { const [qi, ai] = b.dataset.delans.split(':').map(Number); Store.patch((s) => { s.questions[tab][qi].answers.splice(ai, 1); }); render(); };
    });
    // move answer up/down
    list.querySelectorAll('[data-move]').forEach((b) => {
      b.onclick = () => { const [qi, ai, dir] = b.dataset.move.split(':'); moveAns(+qi, +ai, +dir); };
    });
    // question actions
    list.querySelectorAll('[data-delq]').forEach((b) => {
      b.onclick = () => { if (confirm('Delete this question?')) { Store.patch((s) => { s.questions[tab].splice(+b.dataset.delq, 1); }); render(); } };
    });
    list.querySelectorAll('[data-dupq]').forEach((b) => {
      b.onclick = () => { Store.patch((s) => { const q = s.questions[tab][+b.dataset.dupq]; s.questions[tab].splice(+b.dataset.dupq + 1, 0, JSON.parse(JSON.stringify(q))); }); render(); };
    });
    list.querySelectorAll('[data-mvq]').forEach((b) => {
      b.onclick = () => { const [qi, dir] = b.dataset.mvq.split(':').map(Number); moveQ(qi, dir); };
    });
    list.querySelectorAll('[data-sortq]').forEach((b) => {
      b.onclick = () => { Store.patch((s) => { s.questions[tab][+b.dataset.sortq].answers.sort((x, y) => y.points - x.points); }); render(); };
    });
  }

  function qCard(q, qi) {
    const total = q.answers.reduce((t, a) => t + (+a.points || 0), 0);
    const warn = tab === 'main' && (total < 95 || total > 105);
    const answers = q.answers.map((a, ai) => `
      <div class="ans-edit">
        <input type="text" class="ans-text" data-q="${qi}" data-a="${ai}" value="${escAttr(a.text)}" placeholder="Answer ${ai + 1}" />
        <input type="number" class="ans-pts" data-q="${qi}" data-a="${ai}" value="${a.points}" placeholder="pts" />
        <div style="display:flex;gap:4px">
          <button class="btn ghost sm" data-move="${qi}:${ai}:-1" title="Up">▲</button>
          <button class="btn ghost sm" data-move="${qi}:${ai}:1" title="Down">▼</button>
          <button class="btn red sm" data-delans="${qi}:${ai}" title="Delete">✕</button>
        </div>
      </div>`).join('');
    return `
      <div class="panel q-card">
        <div class="q-top">
          <span class="qnum">${qi + 1}</span>
          <input type="text" class="qtext" data-q="${qi}" value="${escAttr(q.q)}" placeholder="Question text…" />
        </div>
        ${answers}
        <div class="q-actions">
          <button class="btn green sm" data-addans="${qi}">＋ Answer</button>
          <button class="btn ghost sm" data-sortq="${qi}">Sort by points</button>
          <span class="spacer" style="flex:1"></span>
          <button class="btn ghost sm" data-mvq="${qi}:-1">▲ Move up</button>
          <button class="btn ghost sm" data-mvq="${qi}:1">▼ Move down</button>
          <button class="btn ghost sm" data-dupq="${qi}">Duplicate</button>
          <button class="btn red sm" data-delq="${qi}">Delete</button>
        </div>
        <div class="sum ${warn ? 'warn' : ''}" data-sum="${qi}">Total points: ${total}${tab === 'main' ? ' / 100' : ''}${warn ? ' ⚠' : ''}</div>
      </div>`;
  }

  function updateSum(qi) {
    const q = bank()[qi]; if (!q) return;
    const total = q.answers.reduce((t, a) => t + (+a.points || 0), 0);
    const el = document.querySelector(`[data-sum="${qi}"]`);
    if (el) { const warn = tab === 'main' && (total < 95 || total > 105); el.textContent = `Total points: ${total}${tab === 'main' ? ' / 100' : ''}${warn ? ' ⚠' : ''}`; el.classList.toggle('warn', warn); }
  }
  function moveAns(qi, ai, dir) {
    const ni = ai + dir; const arr = bank()[qi].answers; if (ni < 0 || ni >= arr.length) return;
    Store.patch((s) => { const a = s.questions[tab][qi].answers; const t = a[ai]; a[ai] = a[ni]; a[ni] = t; }); render();
  }
  function moveQ(qi, dir) {
    const ni = qi + dir; const arr = bank(); if (ni < 0 || ni >= arr.length) return;
    Store.patch((s) => { const a = s.questions[tab]; const t = a[qi]; a[qi] = a[ni]; a[ni] = t; }); render();
  }

  $('addQ').onclick = () => {
    Store.patch((s) => { s.questions[tab].push({ q: 'New question…', answers: [{ text: '', points: 0 }, { text: '', points: 0 }, { text: '', points: 0 }] }); });
    render(); toast('Question added');
    window.scrollTo(0, document.body.scrollHeight);
  };

  $('exportBtn').onclick = () => {
    const data = JSON.stringify(S().questions, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'family-feud-questions.json'; a.click();
    toast('Exported JSON');
  };
  $('importBtn').onclick = () => $('importFile').click();
  $('importFile').onchange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!data.main || !data.fast) throw new Error('Missing main/fast arrays');
        Store.patch((s) => { s.questions = data; });
        render(); toast('Imported ' + (data.main.length + data.fast.length) + ' questions');
      } catch (err) { alert('Invalid file: ' + err.message); }
    };
    r.readAsText(file); e.target.value = '';
  };
  $('restoreBtn').onclick = () => {
    if (confirm('Replace ALL questions with the built-in samples?')) {
      Store.patch((s) => { s.questions = JSON.parse(JSON.stringify(window.FF_DEFAULT_QUESTIONS)); });
      render(); toast('Samples restored');
    }
  };

  function escHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function escAttr(str) { return escHtml(str).replace(/"/g, '&quot;'); }

  document.addEventListener('DOMContentLoaded', render);
  render();
})();
