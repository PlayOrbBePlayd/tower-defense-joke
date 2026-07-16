# Family Feud — Survey Showdown 🎪

A polished, browser-based **Family Feud–style game** built for live events. It runs
as a pair of screens that stay in perfect sync:

- **🎛️ Host Control** — the operator's dashboard. Reveal answers, ring in strikes,
  score teams, and run the Fast Money round.
- **📺 Board** — the big audience display for a TV or projector. It only ever shows
  what the host wants it to.

Everything is static HTML/CSS/JS — **no server, no build step, no dependencies.**
Fonts and sounds are bundled, so it works fully offline once loaded.

---

## Quick start

Open **`index.html`** in a browser (or host the folder anywhere — GitHub Pages,
a USB stick, a local web server). From the launcher:

1. Click **Host Control** — this is your command center.
2. Click **Open Board** — drag that window onto your TV/projector and press
   **`F`** for fullscreen.
3. That's it. Anything you do in Control appears instantly on the Board.

> **Two devices?** Host Control and Board can also run on two different computers
> **on the same browser profile / same machine**, since sync uses the browser's
> `BroadcastChannel` + `localStorage`. For two separate machines, mirror/extend
> your display or run both windows on the machine driving the projector.

---

## The two game modes

### 1. Main Game (standard round)
- Pick a question; up to 8 ranked answers start hidden.
- **Reveal** answers as contestants guess (click, or press keys **`1`–`8`**, or
  **`Space`** to reveal the next-highest remaining answer).
- **Strike** wrong answers (button or **`X`**) — a big red ✕ flashes on the board;
  three strikes shows the triple-✕.
- The **Round Bank** adds up automatically. When a team wins the round, hit
  **Award → Team** and the bank is added to their score (with confetti 🎉).

### 2. Fast Money (final / long round)
- Two players, five questions each. Type each answer + point value (with
  autocomplete from your saved answers), then reveal them one at a time.
- Built-in **timer ring**, **running total**, duplicate flagging, and a
  **Celebrate Win** button.

---

## Customization

### Questions — `Editor` (`editor.html`)
- Full create / edit / reorder / duplicate / delete for both Main and Fast Money banks.
- Point totals are validated toward 100 for survey-style questions.
- **Export / Import JSON** to back up or share question sets.
- **Restore Samples** brings back the built-in demo questions.

### Branding per client — `Branding` (`settings.html`)
- **Logo:** drag-and-drop or pick an image — it appears on every screen and board.
- **Colors:** eight ready-made presets, or fine-tune Primary / Accent / Background /
  Strike / Text with a live preview.
- **Titles:** set the board title, tagline, and client name.
- **Client Profiles:** save the current logo + colors + questions as a named profile,
  and reload any client in one click.
- **Export / Import full config** for a complete, portable client package.

---

## Keyboard shortcuts (Host Control)

| Key | Action |
|-----|--------|
| `1`–`8` | Reveal / hide that answer |
| `Space` | Reveal next-highest answer |
| `X` | Add a strike |
| `C` | Confetti + fanfare |
| `F` | Fullscreen (on the **Board** window) |

---

## Files

```
index.html        Launcher hub
control.html      Host dashboard
board.html        Audience display
editor.html       Question editor
settings.html     Branding & theming
css/              Styles (app, board, control)
js/               store (sync), audio, theme, board, control, editor, settings, data
assets/fonts/     Self-hosted web fonts (no network needed)
```

## How sync works

`js/store.js` holds one shared state object. Every window persists it to
`localStorage` and broadcasts changes over a `BroadcastChannel`, so the Control,
Board, Editor, and Branding windows all update in real time. Nothing leaves the
browser — refresh-safe and fully offline.
