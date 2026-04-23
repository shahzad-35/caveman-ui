// JS port of caveman_compress_nlp.py
// Uses `compromise` for sentence segmentation and POS tagging.
// Matches the original Python/spaCy behavior as closely as possible.

import nlp from 'compromise';

// Filler adverbs to strip (from the original Python script)
const FILLER_ADVERBS = new Set([
  'very', 'really', 'quite', 'extremely', 'incredibly', 'absolutely',
  'totally', 'completely', 'utterly', 'highly', 'particularly',
  'especially', 'truly', 'actually', 'basically', 'essentially',
]);

// Coordinating conjunctions to strip
const STRIP_CONJUNCTIONS = new Set(['and', 'or']);

// Auxiliary / "be" verbs to strip (spaCy AUX equivalent)
const AUX_VERBS = new Set([
  'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'having',
  'do', 'does', 'did', 'doing', 'done',
  'will', 'would', 'shall', 'should', 'may', 'might', 'must', 'can', 'could',
  "'s", "'re", "'ve", "'d", "'ll", "'m",
]);

// Determiners (the, a, an, this, that, these, those, etc.)
const DETERMINERS = new Set([
  'the', 'a', 'an', 'this', 'that', 'these', 'those',
  'my', 'your', 'his', 'her', 'its', 'our', 'their',
  'some', 'any', 'no', 'every', 'each', 'all', 'both', 'either', 'neither',
  'much', 'many', 'few', 'several',
]);

// Common English stop words (superset — matches spaCy's behavior broadly)
const STOP_WORDS = new Set([
  'i', 'me', 'we', 'us', 'you', 'he', 'him', 'she', 'her', 'it', 'they', 'them',
  'what', 'which', 'who', 'whom', 'whose',
  'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from',
  'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how',
  'so', 'than', 'too', 'also',
  'as', 'if', 'because', 'while', 'although', 'though',
  'but', 'however', 'therefore', 'thus', 'hence',
  'just', 'only', 'own', 'same', 'such',
  // Pronouns and possessives already listed above
  "i'm", "you're", "he's", "she's", "it's", "we're", "they're",
  "i've", "you've", "we've", "they've",
  "i'll", "you'll", "he'll", "she'll", "we'll", "they'll",
  "i'd", "you'd", "he'd", "she'd", "we'd", "they'd",
  "isn't", "aren't", "wasn't", "weren't",
  "hasn't", "haven't", "hadn't",
  "doesn't", "don't", "didn't",
  "won't", "wouldn't", "shouldn't", "can't", "cannot", "couldn't",
  'not',
]);

// Punctuation we keep (important in technical text)
const KEEP_PUNCT = new Set(['-', '/', ':', '%', '$', '€', '£']);

// Rough token estimator — matches the Python script (chars / 4)
export function countTokens(text) {
  return Math.floor((text || '').trim().length / 4);
}

function shouldKeepToken(term) {
  const text = (term.text || '').trim();
  if (!text) return false;

  const lower = text.toLowerCase();
  const tags = term.tags || [];

  // Always keep numbers, proper nouns, and any token containing digits
  if (/\d/.test(text)) return true;
  if (tags.includes('ProperNoun') || tags.includes('Acronym')) return true;

  // Strip pure punctuation unless it's in our keep list
  const stripped = text.replace(/[^\w]/g, '');
  if (!stripped) {
    return KEEP_PUNCT.has(text);
  }

  // Strip stop words
  if (STOP_WORDS.has(lower)) return false;

  // Strip determiners
  if (DETERMINERS.has(lower)) return false;

  // Strip auxiliary/modal verbs
  if (AUX_VERBS.has(lower)) return false;
  if (tags.includes('Auxiliary') || tags.includes('Modal') || tags.includes('Copula')) {
    return false;
  }

  // Strip filler adverbs
  if (FILLER_ADVERBS.has(lower)) return false;

  // Strip coordinating conjunctions (and, or)
  if (STRIP_CONJUNCTIONS.has(lower)) return false;
  if (tags.includes('Conjunction') && STRIP_CONJUNCTIONS.has(lower)) return false;

  // Keep everything else: nouns, main verbs, adjectives, adverbs-of-substance
  return true;
}

export function compressText(text) {
  if (!text || !text.trim()) return '';

  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  const compressed = [];

  for (const sentence of sentences) {
    const sDoc = nlp(sentence);
    const terms = sDoc.terms().json({ normal: true });

    const kept = [];
    for (const term of terms) {
      if (shouldKeepToken(term)) {
        // Use the original cased text, not the normalized version
        kept.push(term.text.replace(/[.,;!?]+$/, ''));
      }
    }

    if (kept.length) {
      compressed.push(kept.join(' ') + '.');
    }
  }

  let result = compressed.join(' ');

  // Fix spaces introduced around hyphens by tokenizer (e.g. "32- year- old" -> "32-year-old")
  result = result.replace(/(\w)-\s+(\w)/g, '$1-$2');
  // Collapse accidental double spaces
  result = result.replace(/\s{2,}/g, ' ');
  // Re-capitalize the first letter after every sentence break
  result = result.replace(/(^|\.\s+)([a-z])/g, (_, pre, ch) => pre + ch.toUpperCase());

  return result.trim();
}

export function decompressNotice() {
  // The original Python script's "decompress" just re-capitalizes.
  // Real decompression needs an LLM — we don't offer it here.
  return null;
}

export function getStats(original, compressed) {
  const origChars = original.length;
  const compChars = compressed.length;
  const origTokens = countTokens(original);
  const compTokens = countTokens(compressed);
  const reduction = origTokens > 0
    ? ((origTokens - compTokens) / origTokens) * 100
    : 0;
  return {
    origChars,
    compChars,
    origTokens,
    compTokens,
    reduction: Math.max(0, reduction),
  };
}
