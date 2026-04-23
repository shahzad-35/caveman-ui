'use client';

import { useMemo, useState, useCallback } from 'react';
import { compressText, getStats } from '../lib/compress.js';

const SAMPLES = [
  {
    label: 'System prompt',
    text: "You are a helpful AI assistant designed to provide accurate and concise responses to user queries. When answering questions, you should always prioritize clarity and correctness over speed. If you are uncertain about any information, you must explicitly state your uncertainty rather than guessing. Break complex problems into smaller, manageable steps and explain your reasoning clearly."
  },
  {
    label: 'Resume',
    text: "I am John Smith, a 32-year-old Senior Software Engineer at a large enterprise software company based in San Francisco, California. I have over 8 years of experience in backend development, distributed systems, and database optimization. Throughout my career, I have successfully designed and implemented scalable microservices that handle 50 million requests daily."
  },
  {
    label: 'API docs',
    text: 'To authenticate with our API, you need to include your API key in the Authorization header of every request. The API key should be prefixed with the word "Bearer" followed by a space. If authentication fails, the server will return a 401 Unauthorized status code along with an error message explaining what went wrong.'
  },
  {
    label: 'Reasoning',
    text: "First, I need to understand what the user is asking for. They want to calculate the optimal route between two cities considering both distance and traffic conditions. Let me break this down into steps. Step one: I should identify the starting city and the destination city. Step two: I should retrieve current traffic data for all possible routes."
  },
];

export default function Home() {
  const [input, setInput] = useState(SAMPLES[0].text);
  const [diffMode, setDiffMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const compressed = useMemo(() => compressText(input), [input]);
  const stats = useMemo(() => getStats(input, compressed), [input, compressed]);

  const copyOutput = useCallback(async () => {
    if (!compressed) return;
    try {
      await navigator.clipboard.writeText(compressed);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }, [compressed]);

  const loadSample = useCallback((text) => {
    setInput(text);
  }, []);

  const clear = useCallback(() => setInput(''), []);

  // Build the diff-view of the input: strike out words that got removed.
  const diffNodes = useMemo(() => {
    if (!input) return null;
    const keptSet = new Set(
      compressed
        .toLowerCase()
        .split(/\s+/)
        .map((w) => w.replace(/[^\w-]/g, ''))
        .filter(Boolean)
    );
    const tokens = input.match(/(\s+|[^\s]+)/g) || [];
    return tokens.map((t, i) => {
      if (/^\s+$/.test(t)) return <span key={i}>{t}</span>;
      const clean = t.toLowerCase().replace(/[^\w-]/g, '');
      const kept = clean && keptSet.has(clean);
      return (
        <span key={i} className={kept ? 'kept' : 'struck'}>
          {t}
        </span>
      );
    });
  }, [input, compressed]);

  return (
    <main className="min-h-screen relative" style={{ zIndex: 2 }}>
      {/* Header */}
      <header className="border-b border-[#2a2320]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-6 md:py-8 flex items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <div className="w-3 h-3 rounded-full bg-stone-ochre shadow-[0_0_18px_rgba(201,123,60,0.6)]" />
            <h1 className="carved text-xl md:text-2xl tracking-[0.15em] text-stone-bone">
              Caveman<span className="text-stone-ochre">·</span>Compress
            </h1>
          </div>
          <a
            href="https://github.com/wilpel/caveman-compression"
            target="_blank"
            rel="noreferrer"
            className="text-xs md:text-sm mono text-stone-ash hover:text-stone-bone transition-colors"
          >
            source ↗
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-12 md:pt-20 pb-10 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
          <div className="md:col-span-8">
            <p className="mono uppercase text-[11px] tracking-[0.3em] text-stone-ochre mb-5">
              Lossless semantic compression for LLM contexts
            </p>
            <h2 className="chisel text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-stone-bone">
              Strip grammar.<br />
              <span className="text-stone-ochre">Keep facts.</span><br />
              <span className="text-stone-ash italic">Save tokens.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:pb-4">
            <p className="text-stone-ash leading-relaxed max-w-sm">
              LLMs are excellent at filling linguistic gaps. Remove only what they can reliably reconstruct.
              Paste text, get caveman. Runs entirely in your browser.
            </p>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-8">
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          <StatBlock label="Original" value={stats.origTokens} unit="tokens" />
          <StatBlock label="Compressed" value={stats.compTokens} unit="tokens" accent />
          <StatBlock
            label="Reduction"
            value={stats.reduction.toFixed(1)}
            unit="%"
            big
          />
        </div>
      </section>

      {/* Input/Output tablets */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* INPUT */}
          <div className="tablet rounded-sm">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2e2724]">
              <div className="flex items-center gap-3">
                <span className="carved text-[11px] tracking-[0.25em] text-stone-ash">Input</span>
                <span className="mono text-[11px] text-stone-ash/60">
                  {stats.origChars} chars
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setDiffMode(!diffMode)}
                  className={`mono text-[11px] tracking-wider uppercase px-2 py-1 rounded-sm border ${
                    diffMode
                      ? 'border-stone-ochre/60 text-stone-ochre bg-stone-ochre/10'
                      : 'border-[#3a332f] text-stone-ash hover:text-stone-bone hover:border-[#4a413c]'
                  }`}
                  title="Highlight removed words"
                >
                  diff
                </button>
                <button
                  onClick={clear}
                  className="mono text-[11px] tracking-wider uppercase text-stone-ash hover:text-stone-bone"
                  disabled={!input}
                >
                  clear
                </button>
              </div>
            </div>
            {diffMode ? (
              <div className="p-5 h-[340px] md:h-[420px] overflow-auto scroll leading-relaxed text-[15px]">
                {diffNodes || <span className="text-stone-ash/50">Nothing to diff yet.</span>}
              </div>
            ) : (
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your verbose text here…"
                spellCheck={false}
                className="w-full h-[340px] md:h-[420px] bg-transparent text-stone-bone p-5 resize-none focus:outline-none placeholder-stone-ash/40 leading-relaxed text-[15px]"
              />
            )}
          </div>

          {/* OUTPUT */}
          <div className="tablet rounded-sm relative">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2e2724]">
              <div className="flex items-center gap-3">
                <span className="carved text-[11px] tracking-[0.25em] text-stone-ochre">Caveman</span>
                <span className="mono text-[11px] text-stone-ash/60">
                  {stats.compChars} chars
                </span>
              </div>
              <button
                onClick={copyOutput}
                disabled={!compressed}
                className={`mono text-[11px] tracking-wider uppercase px-2 py-1 rounded-sm border ${
                  compressed
                    ? 'border-stone-ochre/60 text-stone-ochre hover:bg-stone-ochre/10'
                    : 'border-[#3a332f] text-stone-ash/40 cursor-not-allowed'
                }`}
              >
                {copied ? 'copied' : 'copy'}
              </button>
            </div>
            <div className="p-5 h-[340px] md:h-[420px] overflow-auto scroll leading-relaxed text-[15px] text-stone-bone">
              {compressed || (
                <span className="text-stone-ash/50">Output appears here.</span>
              )}
            </div>
          </div>
        </div>

        {/* Samples */}
        <div className="mt-8">
          <p className="mono text-[11px] tracking-[0.25em] uppercase text-stone-ash mb-3">
            try a sample
          </p>
          <div className="flex flex-wrap gap-2">
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => loadSample(s.text)}
                className="text-sm px-3 py-1.5 rounded-sm border border-[#3a332f] text-stone-ash hover:text-stone-bone hover:border-stone-ochre/60 hover:bg-stone-ochre/5"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[#2a2320]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24">
          <p className="mono uppercase text-[11px] tracking-[0.3em] text-stone-ochre mb-8">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
            <div>
              <h3 className="chisel text-3xl md:text-4xl mb-5 text-stone-bone">
                Remove the predictable.
              </h3>
              <p className="text-stone-ash leading-relaxed">
                Grammar, articles, auxiliary verbs, filler adverbs, connectives — anything an LLM
                can reconstruct from context without loss of meaning.
              </p>
              <ul className="mt-5 space-y-1 text-stone-ash/80 text-sm mono">
                <li>— "a", "the", "is", "are", "was"</li>
                <li>— "therefore", "however", "because"</li>
                <li>— "very", "really", "quite", "essentially"</li>
              </ul>
            </div>
            <div>
              <h3 className="chisel text-3xl md:text-4xl mb-5 text-stone-ochre">
                Keep what matters.
              </h3>
              <p className="text-stone-ash leading-relaxed">
                Numbers. Names. Dates. Technical terms. Constraints. The unpredictable
                load-bearing information that carries the actual meaning.
              </p>
              <ul className="mt-5 space-y-1 text-stone-ash/80 text-sm mono">
                <li>— facts, numbers, proper nouns</li>
                <li>— "O(log n)", "99.9% uptime"</li>
                <li>— "Stockholm", "medium-large"</li>
              </ul>
            </div>
          </div>

          <div className="mt-16 border border-[#2e2724] rounded-sm p-6 md:p-8 bg-[#1f1a18]">
            <p className="mono text-[11px] uppercase tracking-[0.25em] text-stone-ash mb-4">
              example
            </p>
            <p className="text-stone-ash mb-3 leading-relaxed">
              <span className="struck">In order to</span> optimize <span className="struck">the</span>{' '}
              database query performance, <span className="struck">we should</span> consider
              implementing <span className="struck">an</span> index <span className="struck">on the</span>{' '}
              frequently accessed columns.
            </p>
            <p className="text-stone-bone leading-relaxed">
              → Optimize database query performance. Consider implementing index frequently accessed columns.
            </p>
            <p className="mono text-[11px] uppercase tracking-[0.25em] text-stone-ochre mt-4">
              ~30% reduction, zero meaning lost
            </p>
          </div>
        </div>
      </section>

      {/* When to use */}
      <section className="border-t border-[#2a2320]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.3em] text-stone-moss mb-4">
              good for
            </p>
            <ul className="space-y-3 text-stone-bone">
              <li>LLM reasoning &amp; thinking blocks</li>
              <li>Token-constrained context windows</li>
              <li>RAG knowledge bases</li>
              <li>Internal documentation</li>
              <li>Step-by-step instructions</li>
            </ul>
          </div>
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.3em] text-stone-rust mb-4">
              avoid for
            </p>
            <ul className="space-y-3 text-stone-bone">
              <li>User-facing content</li>
              <li>Marketing copy</li>
              <li>Legal documents</li>
              <li>Emotional communication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2a2320]">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs mono text-stone-ash">
          <p>
            UI by{' '}
            <a
              href="https://github.com/shahzad-35"
              target="_blank"
              rel="noreferrer"
              className="text-stone-bone hover:text-stone-ochre underline decoration-dotted underline-offset-4"
            >
              shahzad-35
            </a>
            {' · '}
            Based on{' '}
            <a
              href="https://github.com/wilpel/caveman-compression"
              target="_blank"
              rel="noreferrer"
              className="text-stone-ochre hover:text-stone-bone underline decoration-dotted underline-offset-4"
            >
              caveman-compression
            </a>{' '}
            by William Peltomäki · MIT
          </p>
          <p className="text-stone-ash/60">NLP method — runs in your browser · no server, no tracking</p>
        </div>
      </footer>
    </main>
  );
}

function StatBlock({ label, value, unit, big, accent }) {
  return (
    <div
      key={`${value}-${unit}`}
      className={`tablet rounded-sm p-4 md:p-6 chisel-in ${
        big ? 'md:py-7' : ''
      }`}
    >
      <p className="mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-stone-ash mb-2">
        {label}
      </p>
      <p className="flex items-baseline gap-2">
        <span
          className={`chisel ${big ? 'text-5xl md:text-6xl' : 'text-3xl md:text-4xl'} ${
            accent ? 'text-stone-ochre' : big ? 'text-stone-bone' : 'text-stone-bone'
          }`}
        >
          {value}
        </span>
        <span className="mono text-xs text-stone-ash">{unit}</span>
      </p>
    </div>
  );
}