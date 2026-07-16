# TeamBuilding ROI — Family Feud 🎪

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

> **Same computer, two windows** works with zero setup (sync uses the browser's
> `BroadcastChannel` + `localStorage`). To control the Board from a **different
> device** — a phone or a second laptop — see **Cross-device play** below.

---

## Cross-device play (control from another device) 🔗

Driving the venue TV from your phone/laptop needs a small **server** running,
because a browser can't talk directly to another device. Two easy options:

### Option A — Local server at the venue (best for on-site, no accounts)
```bash
npm install      # first time only
npm start
```
The console prints a `http://<your-ip>:3000` address. Open that URL on **both**
the TV (Board) and your controller device (Control), on the **same Wi-Fi**. In
Control, click the **🔗 Cross-device Sync** chip, set a **room code** (any word),
and hit **Connect** on each device. Use **Copy Board link** to send the TV a
ready-made link. Done — one device drives the other in real time.

### Option B — Free cloud server (best for remote/hybrid, get a public link)
Deploy the included server to Render's free tier (no credit card):
1. Push this repo to your GitHub (already done).
2. On [render.com](https://render.com): **New → Blueprint**, pick this repo, **Apply**.
   It reads `render.yaml` and gives you a public `https://…onrender.com` URL.
3. Open that URL on any device, anywhere, with the same room code.

> **How sync picks a target:** when the app is opened *from the game server* it
> auto-connects. You can also override with `?room=CODE&sync=wss://host/ws` in the
> URL, or via the Sync dialog. Opened as plain static files (e.g. GitHub Pages) it
> stays same-device unless you point it at a server.

---

## Deploy the static app to GitHub Pages 🌐

For same-device use and as a shareable frontend, publish to GitHub Pages:

- A workflow is included at `.github/workflows/pages.yml`. Once these changes are
  on the **`main`** branch, open **Actions → Deploy to GitHub Pages → Run**, or
  just push to `main`. It publishes to
  `https://<your-user>.github.io/tower-defense-joke/`.
- If Pages isn't enabled yet, the workflow enables it automatically on first run
  (Settings → Pages will then show the live URL).

> GitHub Pages is **static only** — it serves the app but does **not** run the
> WebSocket server. Same-device play works from Pages; for cross-device, pair it
> with Option A or B above (enter the server address in the Sync dialog).

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

## The show-open intro & outro 🎬🎈

Kick off every event with a **3-2-1 countdown** (giant glowing digits with
tick sounds) followed by an 8-second full-screen reveal — spinning spotlight
rays, chasing marquee bulbs, screen strobes, "TEAMBUILDING ROI / FAMILY FEUD!"
slamming in with confetti and fanfares, then a gold banner with the client's
name.

- In **Host Control**, type the **Client name** at the top of the sidebar
  (it saves instantly and also lives in Branding), then hit **🎬 PLAY INTRO!**
- The board counts down, plays the reveal, and then **stays up** — lights
  flashing, title pulsing — until you press the same button (now **⏹ CLOSE
  INTRO**) or switch screens.

Close the event with **🎈 Play Outro** — "THANKS FOR PLAYING!" slams in over a
sky of balloons drifting down with confetti, plus the client's name in a gold
banner. It keeps playing until you switch screens (perfect as the crowd leaves).

## The face-off flow — matchup, buzzer race, play or pass 🔔

Each round can open exactly like the TV show. The **FACE-OFF strip** at the top
of Host Control's Main Game panel walks you through it:

1. **1 · Matchup** — the board shows "ROUND X: Team A **VS** Team B" with the two
   teams sliding in. Which teams play each round is set in the **Event tab →
   Round matchups** editor (a pair of dropdowns per round).
2. **2 · Question** — the board shows JUST the question, huge, with "HANDS ON
   BUZZERS…" flashing. The two players race to buzz in.
3. **Buzzed first** — tap whichever team hit the buzzer first (the two buttons are
   pre-labeled with this round's teams). The board announces "🔔 TEAM BUZZED IN!".
4. After their guess, hit **▶ PLAY** (they keep the board) or **⤿ PASS** (the other
   team takes it). The board announces "★ TEAM HAS CONTROL!".
5. **3 · Reveal Board** — the answer board appears with a green "has control" chip,
   and you run the round as usual.

The **↺** button resets the face-off, and **Next Round** clears it automatically.
Use **◀ Prev Round / Next Round ▶** in the award bar to step the round (and its
question) in either direction — scores are never touched by stepping.

## Running a big event — many teams, many rounds 🏆

For a large game (e.g. **12 teams across 10 rounds**), use **Event / Tournament mode**
in Host Control (the **Event** tab):

1. **Set up once:** flip **Event mode ON**, set the number of **Teams** (e.g. 12) and
   **Total rounds** (e.g. 10), then type each team's name in the roster. Names and
   scores appear on the board **leaderboard** live.
2. **Between rounds** the board shows the **Leaderboard** (all teams ranked, top-3 in
   gold/silver/bronze). Use **Show Leaderboard** anytime.
3. **Play a round:** go to **Main Game**, pick/reveal the question as usual, then in the
   award bar **tap the team that won** to bank that round's points to them. (Tap is
   locked after awarding so you can't double-count.)
4. **Next Round ▶** advances the round counter, loads the next question, clears the
   board, and pops the leaderboard back up — cumulative scores are kept.
5. **After the last round**, hit **Show Final Standings** for the champion reveal with
   confetti. 🎉

Scoring is flexible: tap a team to add the round's board points, or adjust any score
directly in the roster (± buttons or type a value) to match your house rules — one
winner per round, multiple teams scoring, or head-to-head within a round all work.

To go back to a classic 2-team head-to-head game, just turn **Event mode OFF**.

**Starting a brand-new game:** the sidebar's **⚠ Reset Everything** performs a
full factory reset — scores, teams, matchups, questions, and branding all return
to defaults. It's password-protected (ask TeamBuilding ROI for the reset
password) so it can't be triggered accidentally mid-event.

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
js/               store, sync (WebSocket), audio, theme, board, control, editor, settings, data
server/server.js  Node server: serves the app + relays cross-device sync
assets/fonts/     Self-hosted web fonts (no network needed)
package.json      npm start → runs the server
render.yaml       One-click cloud deploy of the server
```

## How sync works

`js/store.js` holds one shared state object. Every window persists it to
`localStorage` and broadcasts changes over a `BroadcastChannel` — so windows in
the **same browser** update in real time with no server, fully offline.

`js/sync.js` adds an **optional WebSocket layer** for **different devices**. When
present, each change is also relayed through `server/server.js` to everyone in the
same room code, and late-joining screens are caught up to the current state on
connect. Turn it on from the **🔗 Cross-device Sync** dialog in Host Control.
