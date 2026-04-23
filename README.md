# Caveman Compression — Web UI

A browser-based UI for the [caveman-compression](https://github.com/wilpel/caveman-compression) project by **William Peltomäki**.

**Strip grammar. Keep facts. Save tokens.**

🔗 **Live:** https://caveman-compress.vercel.app

Built by [**shahzad-35**](https://github.com/shahzad-35) as a front-end on top of the original Python project. This UI ships a JavaScript port of the NLP-based compressor (`caveman_compress_nlp.py`). Everything runs client-side — no server, no API key, no tracking.

---

## Features

- Paste text, get caveman-compressed output instantly
- Live token count and reduction percentage
- **Diff view** — see exactly which words got stripped
- Four sample texts to try one-click
- Copy-to-clipboard button
- Runs entirely in the browser (no backend)

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy

This is a static Next.js site — deploys cleanly to **Vercel**, **Netlify**, or **Cloudflare Pages** with zero config.

**Vercel (one-click):**
1. Push this repo to GitHub.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Click **Deploy**.

**Vercel CLI:**
```bash
npm install -g vercel
vercel
```

## How the compression works

See the upstream [SPEC.md](https://github.com/wilpel/caveman-compression/blob/main/SPEC.md) for the full ruleset.

Short version: remove what an LLM can reliably reconstruct (articles, auxiliary verbs, filler adverbs, common connectives); keep what it cannot (numbers, names, technical terms, constraints).

Expected reduction: **15–30%** on English text, matching the Python NLP reference implementation.

## Project structure

```
app/
  layout.js     # Root layout + Google Fonts
  page.js       # Main UI
  globals.css   # Styles (stone-tablet aesthetic)
lib/
  compress.js   # JS port of caveman_compress_nlp.py
```

## Credits

- Original Python project: [wilpel/caveman-compression](https://github.com/wilpel/caveman-compression) by William Peltomäki
- JS port + Web UI: [shahzad-35](https://github.com/shahzad-35)

## License

MIT — same as the upstream project.