# 💖 RENE BATERBONIA 💖

A troll site for the alpha bois. **Best viewed on mobile.**

Plain HTML / CSS / JS. No build step, no dependencies, no framework. Just open it.

UI copy is in **Waray-Waray**. The decorative phrases are left exactly as given.

## Live

GitHub Pages: `https://kewnric.github.io/troll/`

(Enable it under **Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`**.)

## What's inside

| # | Section | Interaction |
|---|---------|-------------|
| 1 | **rene baterbonia** | heart-masked photo, tap to swap faces (every 6th one is cursed) |
| 2 | **ano jay?** | whack-a-mole, 15 seconds, cursed faces cost you −2 |
| 3 | **tara mamatron** | vertical reels feed with the two videos, swipe + tap to unmute |
| 4 | **galawgaw** | draggable sticker board, double-tap to spin, tidy button that fails |
| 5 | **tara gala** | swipe deck — ← ano erp / open erp → — always ends in a match |
| 6 | **ML ML** | lose-streak counter that refuses to let you win |
| 7 | **suntukay** | tap-fight with HP bars and POW text |
| 8 | **alpha bois** | full gallery + lightbox |
| — | footer | all the phrases, `16. ???` jumpscare, and a `bubuton kanak` button that runs away |

Plus: fake notifications, heart trail on every tap, floating ERP modal, and a marquee that never stops.

## Sound

Every interaction has a cartoon sound effect — boing, slide whistle, sad trombone,
coin, punch, buzzer, and yes, a fart on the runaway button.

There are **no audio files**. `assets/js/sfx.js` synthesizes all 17 sounds with the
Web Audio API (oscillators, filtered noise, envelopes), so there is nothing to
download, nothing to license, and no extra requests. If the browser has no Web
Audio support the site just stays silent.

The 🔊 button above the ERP button mutes everything; the choice is remembered in
`localStorage`. Audio only starts after the first tap, per mobile autoplay rules.
Add or retune sounds in the `SOUNDS` object in `assets/js/sfx.js`.

## Structure

```
index.html
assets/
  css/style.css
  js/app.js
  img/pic01..pic20      (photos)
  vid/vid1.mp4 vid2.mp4 (videos)
```

Everything uses relative paths, so it works from any subpath — GitHub Pages, a subfolder, or straight off the filesystem.

## Local preview

```bash
python -m http.server 8899
```

then open `http://localhost:8899`. (Open `index.html` directly and the videos still work, but a server is closer to the real thing.)

## Editing

- **Phrases** — `PHRASES` array at the top of `assets/js/app.js`. Everything (marquee, footer chips, random shouts, floating words) reads from it.
- **Photos** — drop files in `assets/img/` and add them to the `IMGS` list. `FACES`, `CURSED`, `MOLES`, `STICKERS` and `DECK` pick from there.
- **Colors** — the `:root` block at the top of `assets/css/style.css`.

---

no rights reserved · tara ya 💞
