/* settings.js — branding: client name, titles, logo, colors, profiles. */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const S = () => Store.get();
  function toast(m) { const t = $('toast'); t.textContent = m; t.classList.add('show'); clearTimeout(t._to); t._to = setTimeout(() => t.classList.remove('show'), 1500); }

  const SWATCHES = [
    { key: 'primary', label: 'Board / Primary' },
    { key: 'accent', label: 'Accent / Gold' },
    { key: 'deep', label: 'Background' },
    { key: 'strike', label: 'Strike (X)' },
    { key: 'text', label: 'Text' },
  ];

  const PRESETS = [
    { name: 'Classic', primary: '#1746c9', accent: '#ffc21c', deep: '#050b2e', strike: '#e23b3b', text: '#ffffff' },
    { name: 'Emerald', primary: '#0f8a5f', accent: '#ffd447', deep: '#04231a', strike: '#e23b3b', text: '#ffffff' },
    { name: 'Crimson', primary: '#b1122e', accent: '#ffcf4d', deep: '#2a0410', strike: '#111111', text: '#ffffff' },
    { name: 'Royal Purple', primary: '#5b2bd6', accent: '#ffb02e', deep: '#150a35', strike: '#ff4d6d', text: '#ffffff' },
    { name: 'Sunset', primary: '#e8611b', accent: '#ffd23f', deep: '#2a0d08', strike: '#c9184a', text: '#ffffff' },
    { name: 'Teal Night', primary: '#0d9aa8', accent: '#f9c80e', deep: '#02222a', strike: '#ef476f', text: '#ffffff' },
    { name: 'Slate Pro', primary: '#3652ad', accent: '#e0e7ff', deep: '#0c1230', strike: '#ff5964', text: '#ffffff' },
    { name: 'Neon', primary: '#7b2ff7', accent: '#00e5ff', deep: '#0a0320', strike: '#ff2d95', text: '#ffffff' },
  ];

  function renderSwatches() {
    const t = S().theme;
    $('swatches').innerHTML = SWATCHES.map((sw) => `
      <div class="swatch">
        <label>${sw.label}</label>
        <div class="pick">
          <input type="color" data-c="${sw.key}" value="${t[sw.key] || '#000000'}" />
          <input type="text" data-ct="${sw.key}" value="${t[sw.key] || ''}" />
        </div>
      </div>`).join('');
    $('swatches').querySelectorAll('input[type=color]').forEach((inp) => {
      inp.oninput = () => setColor(inp.dataset.c, inp.value);
    });
    $('swatches').querySelectorAll('input[data-ct]').forEach((inp) => {
      inp.oninput = () => { if (/^#[0-9a-f]{6}$/i.test(inp.value)) setColor(inp.dataset.ct, inp.value); };
    });
  }
  function setColor(key, val) {
    Store.patch((s) => { s.theme[key] = val; });
    Theme.apply();
    // sync sibling inputs
    const c = document.querySelector(`input[type=color][data-c="${key}"]`);
    const tx = document.querySelector(`input[data-ct="${key}"]`);
    if (c) c.value = val; if (tx) tx.value = val;
  }

  function renderPresets() {
    $('presets').innerHTML = PRESETS.map((p, i) => `
      <div class="preset" title="${p.name}" data-p="${i}"
        style="background: linear-gradient(135deg, ${p.primary} 0 50%, ${p.accent} 50% 100%)"></div>`).join('');
    $('presets').querySelectorAll('.preset').forEach((el) => {
      el.onclick = () => {
        const p = PRESETS[+el.dataset.p];
        Store.patch((s) => { Object.assign(s.theme, { primary: p.primary, accent: p.accent, deep: p.deep, strike: p.strike, text: p.text }); });
        Theme.apply(); renderSwatches(); toast(p.name + ' applied');
      };
    });
  }

  /* ---- titles ---- */
  function bindText(id, key) {
    const el = $(id);
    el.value = S().theme[key] || (key === 'title' ? '' : '');
    el.oninput = () => { Store.patch((s) => { s.theme[key] = el.value; }); Theme.apply(); syncPreviewTitle(); };
  }
  $('clientName').value = S().clientName || '';
  $('clientName').oninput = () => Store.patch((s) => { s.clientName = $('clientName').value; });

  function syncPreviewTitle() {
    const title = S().theme.title || 'FAMILY FEUD';
    const parts = title.split(' '); const last = parts.pop();
    $('mpT').textContent = parts.join(' '); $('mpT2').textContent = last;
  }

  /* ---- logo ---- */
  const drop = $('logoDrop');
  drop.onclick = () => $('logoFile').click();
  drop.ondragover = (e) => { e.preventDefault(); drop.style.borderColor = 'var(--c-accent)'; };
  drop.ondragleave = () => { drop.style.borderColor = ''; };
  drop.ondrop = (e) => { e.preventDefault(); drop.style.borderColor = ''; if (e.dataTransfer.files[0]) loadLogo(e.dataTransfer.files[0]); };
  $('logoFile').onchange = (e) => { if (e.target.files[0]) loadLogo(e.target.files[0]); };
  $('logoClear').onclick = () => { Store.patch((s) => { s.theme.logo = ''; }); Theme.apply(); renderLogo(); toast('Logo removed'); };

  function loadLogo(file) {
    if (file.size > 2_500_000) { alert('Please use an image under 2.5MB.'); return; }
    const r = new FileReader();
    r.onload = () => { Store.patch((s) => { s.theme.logo = r.result; }); Theme.apply(); renderLogo(); toast('Logo updated'); };
    r.readAsDataURL(file);
  }
  function renderLogo() {
    const logo = S().theme.logo;
    const prev = $('logoPreview');
    if (logo) { prev.style.backgroundImage = `url("${logo}")`; prev.classList.add('show'); drop.classList.add('has'); $('logoHint').textContent = 'Click to replace.'; }
    else { prev.classList.remove('show'); drop.classList.remove('has'); $('logoHint').innerHTML = 'Click or drop an image (PNG/JPG/SVG).<br/>Shown on every board &amp; screen.'; }
  }

  /* ---- profiles ---- */
  function renderProfiles() {
    const list = $('profilesList');
    const ps = S().profiles || [];
    list.innerHTML = ps.length ? ps.map((p, i) => `
      <div class="profile-item">
        <div class="brand-logo" style="width:34px;height:34px;${p.theme.logo ? `background-image:url('${p.theme.logo}');background-color:#fff` : ''}"></div>
        <div class="pl">${escHtml(p.name)}<div style="font-size:11px;color:#8b9bd0">${(p.questions ? (p.questions.main.length + p.questions.fast.length) : 0)} questions</div></div>
        <button class="btn blue sm" data-load="${i}">Load</button>
        <button class="btn red sm" data-del="${i}">✕</button>
      </div>`).join('') : '<p class="hint" style="color:#8b9bd0">No saved profiles yet.</p>';
    list.querySelectorAll('[data-load]').forEach((b) => {
      b.onclick = () => {
        const p = S().profiles[+b.dataset.load];
        if (!confirm('Load profile “' + p.name + '”? This replaces the current theme & questions.')) return;
        Store.patch((s) => {
          s.theme = JSON.parse(JSON.stringify(p.theme));
          s.clientName = p.clientName || p.name;
          if (p.questions) s.questions = JSON.parse(JSON.stringify(p.questions));
        });
        Theme.apply(); boot(); toast('Loaded ' + p.name);
      };
    });
    list.querySelectorAll('[data-del]').forEach((b) => {
      b.onclick = () => { Store.patch((s) => { s.profiles.splice(+b.dataset.del, 1); }); renderProfiles(); };
    });
  }
  $('saveProfile').onclick = () => {
    const name = ($('profileName').value || S().clientName || 'Client').trim();
    Store.patch((s) => {
      s.profiles = s.profiles || [];
      s.profiles.push({
        name,
        clientName: s.clientName,
        theme: JSON.parse(JSON.stringify(s.theme)),
        questions: JSON.parse(JSON.stringify(s.questions)),
      });
    });
    $('profileName').value = ''; renderProfiles(); toast('Profile saved');
  };

  /* ---- full config export/import ---- */
  $('exportAll').onclick = () => {
    const cfg = { theme: S().theme, clientName: S().clientName, questions: S().questions, teams: S().teams, profiles: S().profiles };
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = (S().clientName || 'family-feud').replace(/\s+/g, '-').toLowerCase() + '-config.json'; a.click();
    toast('Config exported');
  };
  $('importAll').onclick = () => $('importAllFile').click();
  $('importAllFile').onchange = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const cfg = JSON.parse(r.result);
        Store.patch((s) => {
          if (cfg.theme) s.theme = Object.assign({}, s.theme, cfg.theme);
          if (cfg.clientName) s.clientName = cfg.clientName;
          if (cfg.questions) s.questions = cfg.questions;
          if (cfg.teams) s.teams = cfg.teams;
          if (cfg.profiles) s.profiles = cfg.profiles;
        });
        Theme.apply(); boot(); toast('Config imported');
      } catch (err) { alert('Invalid config: ' + err.message); }
    };
    r.readAsText(file); e.target.value = '';
  };

  function escHtml(str) { return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

  function boot() {
    bindText('title', 'title');
    bindText('subtitle', 'subtitle');
    $('clientName').value = S().clientName || '';
    renderSwatches();
    renderPresets();
    renderLogo();
    renderProfiles();
    syncPreviewTitle();
    Theme.apply();
  }

  document.addEventListener('DOMContentLoaded', boot);
  boot();
})();
