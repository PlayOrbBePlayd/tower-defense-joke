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
    // Live question counts on the tabs
    const q = S().questions;
    $('tabs').querySelector('[data-t="main"]').textContent = `Family Feud (${q.main.length})`;
    $('tabs').querySelector('[data-t="fast"]').textContent = `Speed Round (${q.fast.length})`;
    const J = q.jeopardy || { categories: [] };
    const per = J.categories.length ? Math.max(...J.categories.map((c) => c.clues.length)) : 0;
    $('tabs').querySelector('[data-t="jeopardy"]').textContent = `Jeopardy (${J.categories.length}×${per})`;

    // The Jeopardy bank has its own structure & renderer.
    $('addQ').classList.toggle('hidden', tab === 'jeopardy');
    if (tab === 'jeopardy') { renderJeopardyEditor(); return; }

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

  /* ---------------- JEOPARDY editor ---------------- */
  function J() { return S().questions.jeopardy || { categories: [] }; }

  function renderJeopardyEditor() {
    const cats = J().categories;
    const per = cats.length ? Math.max(...cats.map((c) => c.clues.length)) : 5;
    $('list').innerHTML = `
      <div class="panel q-card">
        <div class="je-config">
          <label class="fld" style="margin:0">Categories</label>
          <input type="number" id="jeCats" min="1" max="8" value="${cats.length || 5}" />
          <label class="fld" style="margin:0">Clues per category</label>
          <input type="number" id="jePer" min="1" max="8" value="${per || 5}" />
          <span class="sum">Answer formats per clue: multiple choice (default), true/false, or type-in. Values default to row × 100.</span> <span class="sum" id="jeDdCount"></span>
        </div>
      </div>` + jeFinalCard() + cats.map((c, ci) => jeCatCard(c, ci)).join('');

    $('jeCats').onchange = () => resizeJeop(+$('jeCats').value || 5, +$('jePer').value || 5);
    $('jePer').onchange = () => resizeJeop(+$('jeCats').value || 5, +$('jePer').value || 5);

    updateDdCount();

    // One delegated handler covers every clue field.
    $('list').querySelectorAll('[data-je]').forEach((el) => {
      el.onchange = el.oninput = () => {
        const p = el.dataset.je.split(':');
        const kind = p[0], ci = +p[1], ri = +p[2];
        if (kind === 'dd' && el.checked) {
          const count = J().categories.reduce((t, c) => t + c.clues.filter((x) => x.dd).length, 0);
          if (count >= 5) { el.checked = false; toast('Max 5 daily doubles'); return; }
        }
        Store.patch((s) => {
          // Final Jeopardy fields (f-prefixed kinds)
          if (kind[0] === 'f') {
            const F = s.questions.jeopardy.final = s.questions.jeopardy.final
              || { category: '', q: '', type: 'mc', choices: ['', '', '', ''], answer: 0 };
            if (kind === 'fcat') F.category = el.value;
            else if (kind === 'fq') F.q = el.value;
            else if (kind === 'fchoice') { if (!Array.isArray(F.choices)) F.choices = ['', '', '', '']; F.choices[+p[3]] = el.value; }
            else if (kind === 'fansmc') F.answer = +el.value;
            else if (kind === 'fanstf') F.answer = el.value === 'true';
            else if (kind === 'fanstext') F.answer = el.value;
            else if (kind === 'ftype') {
              F.type = el.value;
              if (F.type === 'mc') { if (!Array.isArray(F.choices)) F.choices = ['', '', '', '']; if (typeof F.answer !== 'number') F.answer = 0; }
              else if (F.type === 'tf') { if (typeof F.answer !== 'boolean') F.answer = true; }
              else if (typeof F.answer !== 'string') F.answer = '';
            }
            return;
          }
          const cat = s.questions.jeopardy.categories[ci]; if (!cat) return;
          if (kind === 'catname') { cat.name = el.value; return; }
          const clue = cat.clues[ri]; if (!clue) return;
          if (kind === 'q') clue.q = el.value;
          else if (kind === 'val') clue.value = +el.value || 0;
          else if (kind === 'choice') { if (!Array.isArray(clue.choices)) clue.choices = ['', '', '', '']; clue.choices[+p[3]] = el.value; }
          else if (kind === 'ansmc') clue.answer = +el.value;
          else if (kind === 'anstf') clue.answer = el.value === 'true';
          else if (kind === 'anstext') clue.answer = el.value;
          else if (kind === 'dd') clue.dd = el.checked;
          else if (kind === 'type') {
            clue.type = el.value;
            if (clue.type === 'mc') { if (!Array.isArray(clue.choices)) clue.choices = ['', '', '', '']; if (typeof clue.answer !== 'number') clue.answer = 0; }
            else if (clue.type === 'tf') { if (typeof clue.answer !== 'boolean') clue.answer = true; }
            else if (typeof clue.answer !== 'string') clue.answer = '';
          }
        });
        if (el.dataset.je.startsWith('type:') || el.dataset.je.startsWith('ftype:')) renderJeopardyEditor();  // swap answer inputs
        if (el.dataset.je.startsWith('dd:')) updateDdCount();
      };
      if (el.tagName === 'SELECT') el.oninput = null;   // avoid double-fire on selects
    });
    bindImgButtons();
  }

  function updateDdCount() {
    const n = J().categories.reduce((t, c) => t + c.clues.filter((x) => x.dd).length, 0);
    const el = $('jeDdCount');
    if (el) el.textContent = `◆ Daily doubles: ${n}/5`;
  }

  /* ---- Optional per-clue images ---- */
  // Everything lives in browser storage (~5MB total), so uploads are
  // downscaled to ~1100px JPEG before saving. 'f' targets Final Jeopardy.
  function jeImgControls(clue, target) {
    return `<span class="je-imgwrap">
      ${clue.img ? `<img class="je-thumb" src="${clue.img}" alt="" />` : ''}
      <button type="button" class="btn ghost sm" data-jeimg="${target}" title="${clue.img ? 'Replace the image' : 'Add an image to this clue (optional)'}">🖼${clue.img ? ' ✎' : ' ＋'}</button>
      ${clue.img ? `<button type="button" class="btn ghost sm" data-jeimgx="${target}" title="Remove image">✕</button>` : ''}
    </span>`;
  }

  let imgTarget = null;
  const imgInput = document.createElement('input');
  imgInput.type = 'file'; imgInput.accept = 'image/*'; imgInput.style.display = 'none';
  document.body.appendChild(imgInput);
  imgInput.onchange = () => {
    const f = imgInput.files[0]; imgInput.value = '';
    if (f && imgTarget) loadClueImage(f, imgTarget);
  };

  function bindImgButtons() {
    $('list').querySelectorAll('[data-jeimg]').forEach((b) => {
      b.onclick = () => { imgTarget = b.dataset.jeimg; imgInput.click(); };
    });
    $('list').querySelectorAll('[data-jeimgx]').forEach((b) => {
      b.onclick = () => {
        const t = b.dataset.jeimgx;
        Store.patch((s) => {
          if (t === 'f') { if (s.questions.jeopardy.final) delete s.questions.jeopardy.final.img; }
          else {
            const [c, r] = t.split(':').map(Number);
            const cl = s.questions.jeopardy.categories[c] && s.questions.jeopardy.categories[c].clues[r];
            if (cl) delete cl.img;
          }
        });
        renderJeopardyEditor();
        toast('Image removed');
      };
    });
  }

  function loadClueImage(file, target) {
    if (file.size > 8_000_000) { alert('Please use an image under 8MB.'); return; }
    const r = new FileReader();
    r.onload = () => {
      const im = new Image();
      im.onload = () => {
        // Downscale to a projector-friendly size and compress.
        const MAX = 1100;
        const scale = Math.min(1, MAX / Math.max(im.width, im.height));
        const cv = document.createElement('canvas');
        cv.width = Math.max(1, Math.round(im.width * scale));
        cv.height = Math.max(1, Math.round(im.height * scale));
        const cx = cv.getContext('2d');
        cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height);
        cx.drawImage(im, 0, 0, cv.width, cv.height);
        let url = cv.toDataURL('image/jpeg', 0.8);
        if (url.length > 500_000) url = cv.toDataURL('image/jpeg', 0.6);
        // Browser storage holds the whole game (~5MB) — refuse before it breaks.
        if (JSON.stringify(Store.get()).length + url.length > 4_300_000) {
          alert('Not enough room for this image — storage is nearly full. Remove some other clue images or use a smaller one.');
          return;
        }
        Store.patch((s) => {
          if (target === 'f') {
            s.questions.jeopardy.final = s.questions.jeopardy.final
              || { category: '', q: '', type: 'mc', choices: ['', '', '', ''], answer: 0 };
            s.questions.jeopardy.final.img = url;
          } else {
            const [c, ri] = target.split(':').map(Number);
            const cl = s.questions.jeopardy.categories[c] && s.questions.jeopardy.categories[c].clues[ri];
            if (cl) cl.img = url;
          }
        });
        renderJeopardyEditor();
        toast('🖼 Image added — it shows with the clue on the board');
      };
      im.onerror = () => alert('Could not read that image file.');
      im.src = r.result;
    };
    r.readAsDataURL(file);
  }

  function jeFinalCard() {
    const F = J().final || { category: '', q: '', type: 'mc', choices: ['', '', '', ''], answer: 0 };
    const t = F.type || 'mc';
    const typeSel = `<select data-je="ftype:0:0">
      <option value="mc" ${t === 'mc' ? 'selected' : ''}>Multiple choice</option>
      <option value="tf" ${t === 'tf' ? 'selected' : ''}>True / False</option>
      <option value="text" ${t === 'text' ? 'selected' : ''}>Type-in</option></select>`;
    let ans = '';
    if (t === 'mc') {
      ans = `<div class="je-ans">` +
        (F.choices || ['', '', '', '']).map((ch, i) =>
          `<input type="text" data-je="fchoice:0:0:${i}" value="${escAttr(ch)}" placeholder="Choice ${'ABCD'[i]}" />`).join('') +
        `<select data-je="fansmc:0:0">${[0, 1, 2, 3].map((i) =>
          `<option value="${i}" ${+F.answer === i ? 'selected' : ''}>✔ ${'ABCD'[i]}</option>`).join('')}</select></div>`;
    } else if (t === 'tf') {
      ans = `<div class="je-ans tf1"><select data-je="fanstf:0:0">
        <option value="true" ${F.answer === true ? 'selected' : ''}>Correct answer: TRUE</option>
        <option value="false" ${F.answer === false ? 'selected' : ''}>Correct answer: FALSE</option></select></div>`;
    } else {
      ans = `<div class="je-ans text1"><input type="text" data-je="fanstext:0:0" value="${escAttr(String(F.answer || ''))}" placeholder="Correct answer (host judges)" /></div>`;
    }
    return `<div class="panel q-card" style="border:2px solid var(--c-accent)">
      <div class="q-top">
        <span class="qnum">🏆</span>
        <input type="text" class="qtext" data-je="fcat:0:0" value="${escAttr(F.category || '')}" placeholder="Final Jeopardy category…" />
      </div>
      <div class="je-clue" style="grid-template-columns:170px 1fr auto">
        ${typeSel}
        <input type="text" data-je="fq:0:0" value="${escAttr(F.q || '')}" placeholder="The Final Jeopardy clue…" />
        ${jeImgControls(F, 'f')}
        ${ans}
      </div>
      <div class="sum">Teams lock in secret wagers before this clue is shown. Run it from Host Control → Jeopardy → 🏆 Final Jeopardy.</div>
    </div>`;
  }

  function jeCatCard(c, ci) {
    const clues = c.clues.map((clue, ri) => {
      const t = clue.type || 'mc';
      const typeSel = `<select data-je="type:${ci}:${ri}">
        <option value="mc" ${t === 'mc' ? 'selected' : ''}>Multiple choice</option>
        <option value="tf" ${t === 'tf' ? 'selected' : ''}>True / False</option>
        <option value="text" ${t === 'text' ? 'selected' : ''}>Type-in</option></select>`;
      let ans = '';
      if (t === 'mc') {
        ans = `<div class="je-ans">` +
          (clue.choices || ['', '', '', '']).map((ch, i) =>
            `<input type="text" data-je="choice:${ci}:${ri}:${i}" value="${escAttr(ch)}" placeholder="Choice ${'ABCD'[i]}" />`).join('') +
          `<select data-je="ansmc:${ci}:${ri}">${[0, 1, 2, 3].map((i) =>
            `<option value="${i}" ${+clue.answer === i ? 'selected' : ''}>✔ ${'ABCD'[i]}</option>`).join('')}</select></div>`;
      } else if (t === 'tf') {
        ans = `<div class="je-ans tf1"><select data-je="anstf:${ci}:${ri}">
          <option value="true" ${clue.answer === true ? 'selected' : ''}>Correct answer: TRUE</option>
          <option value="false" ${clue.answer === false ? 'selected' : ''}>Correct answer: FALSE</option></select></div>`;
      } else {
        ans = `<div class="je-ans text1"><input type="text" data-je="anstext:${ci}:${ri}" value="${escAttr(String(clue.answer || ''))}" placeholder="Correct answer (host judges responses)" /></div>`;
      }
      return `<div class="je-clue">
        <input type="number" data-je="val:${ci}:${ri}" value="${clue.value}" title="Value" />
        ${typeSel}
        <input type="text" data-je="q:${ci}:${ri}" value="${escAttr(clue.q)}" placeholder="Clue / question…" />
        <label class="je-dd" title="Daily Double (max 5)"><input type="checkbox" data-je="dd:${ci}:${ri}" ${clue.dd ? 'checked' : ''} /> ◆ DD</label>
        ${jeImgControls(clue, ci + ':' + ri)}
        ${ans}
      </div>`;
    }).join('');
    return `<div class="panel q-card">
      <div class="q-top">
        <span class="qnum">${ci + 1}</span>
        <input type="text" class="qtext" data-je="catname:${ci}" value="${escAttr(c.name)}" placeholder="Category name…" />
      </div>
      ${clues}
    </div>`;
  }

  // Grow/shrink the board, preserving everything that overlaps.
  function resizeJeop(cats, per) {
    cats = Math.max(1, Math.min(8, cats));
    per = Math.max(1, Math.min(8, per));
    Store.patch((s) => {
      const Jq = s.questions.jeopardy;
      while (Jq.categories.length < cats) Jq.categories.push({ name: 'Category ' + (Jq.categories.length + 1), clues: [] });
      Jq.categories.length = cats;
      Jq.categories.forEach((c) => {
        while (c.clues.length < per) c.clues.push({ q: '', type: 'mc', choices: ['', '', '', ''], answer: 0, value: (c.clues.length + 1) * 100, dd: false });
        c.clues.length = per;
      });
      // board layout changed — clear used/active so stale keys can't linger
      s.jeop.used = {}; s.jeop.active = null;
    });
    render();
    toast(`Board is now ${cats} × ${per}`);
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
        Store.patch((s) => { const keep = s.questions.jeopardy; s.questions = data; if (!s.questions.jeopardy) s.questions.jeopardy = keep || { categories: [] }; });
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
