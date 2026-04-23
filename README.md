# Caveman Compression — Web UI

A browser-based UI for [caveman-compression](https://github.com/wilpel/caveman-compression) by William Peltomäki. Paste text, get the caveman-compressed version, see token savings live.

**Strip grammar. Keep facts. Save tokens.**

This UI ships a JavaScript port of the NLP-based compressor (the `caveman_compress_nlp.py` script). Everything runs client-side — no server, no API key, no tracking.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploy to Vercel (free, one click)

The fastest path:

1. Push this folder to a GitHub repo.
2. Go to [vercel.com/new](https://vercel.com/new), import the repo.
3. Click **Deploy**. No env vars needed. Done.

Alternatively, from the CLI:

```bash
npm install -g vercel
vercel
```

It's a static Next.js site (no serverless functions), so it will also deploy cleanly to **Netlify**, **Cloudflare Pages**, or **GitHub Pages** (if you run `next export` first).

## How the compression works

See the upstream [SPEC.md](https://github.com/wilpel/caveman-compression/blob/main/SPEC.md). In short: remove anything an LLM can reliably reconstruct (articles, auxiliary verbs, filler adverbs, common connectives), keep everything it cannot (numbers, names, technical terms, constraints).

Expected reduction: 15–30% for English text, matching the Python NLP reference.

## Project structure

```
app/
  layout.js     # Root layout + fonts
  page.js       # Main UI
  globals.css   # Styles (stone-tablet aesthetic)
lib/
  compress.js   # JS port of caveman_compress_nlp.py
```

## License

MIT (matching upstream).
