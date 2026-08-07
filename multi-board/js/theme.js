/* theme.js — Applies the current theme (colors + logo + titles) to any page.
 * Reads from Store and re-applies on every state change. */
(function (global) {
  'use strict';

  function hexToRgb(hex) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : [0, 0, 0];
  }
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    const f = (c) => Math.max(0, Math.min(255, Math.round(c + amt)));
    return `rgb(${f(r)},${f(g)},${f(b)})`;
  }
  function rgba(hex, a) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r},${g},${b},${a})`;
  }

  function apply(theme) {
    const t = theme || (global.Store && Store.get().theme) || {};
    const root = document.documentElement.style;
    root.setProperty('--c-primary', t.primary || '#1746c9');
    root.setProperty('--c-primary-lt', shade(t.primary || '#1746c9', 45));
    root.setProperty('--c-primary-dk', shade(t.primary || '#1746c9', -55));
    root.setProperty('--c-accent', t.accent || '#ffc21c');
    root.setProperty('--c-accent-dk', shade(t.accent || '#ffc21c', -60));
    root.setProperty('--c-deep', t.deep || '#050b2e');
    root.setProperty('--c-deep-lt', shade(t.deep || '#050b2e', 28));
    root.setProperty('--c-text', t.text || '#ffffff');
    root.setProperty('--c-strike', t.strike || '#e23b3b');
    root.setProperty('--c-primary-glow', rgba(t.accent || '#ffc21c', 0.55));
    root.setProperty('--c-primary-a30', rgba(t.primary || '#1746c9', 0.30));

    // Titles / logos anywhere they're used
    document.querySelectorAll('[data-brand-title]').forEach((el) => {
      el.textContent = t.title || 'FAMILY FEUD';
    });
    document.querySelectorAll('[data-brand-subtitle]').forEach((el) => {
      el.textContent = t.subtitle || '';
    });
    document.querySelectorAll('[data-brand-logo]').forEach((el) => {
      if (t.logo) {
        el.style.backgroundImage = `url("${t.logo}")`;
        el.classList.add('has-logo');
      } else {
        el.style.backgroundImage = '';
        el.classList.remove('has-logo');
      }
    });
    const cn = document.querySelector('[data-client-name]');
    if (cn && global.Store) cn.textContent = Store.get().clientName || '';
  }

  global.Theme = { apply, shade, rgba, hexToRgb };

  if (global.Store) {
    Store.subscribe(() => apply());
    document.addEventListener('DOMContentLoaded', () => apply());
  }
})(window);
