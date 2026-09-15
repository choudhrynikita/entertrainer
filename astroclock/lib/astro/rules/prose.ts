/**
 * Human-voice prose helpers — WhatsApp-clear, not chart-mechanic.
 */

const BANNED_BODY =
  /\b(star-texture|pada\s*\d|personal spotlight|when\s+\w+\s+is in the link|kinder form|subplot|gochaara|lagnesha|natal\s+\w+\s+is|transit\s+\w+\s+is\s+(oppose|conjunct|square|trine|sextile)|adds an? (initiatory|stabilising|effortful|ripening)|ripening completion|initiatory spark)\b/i;

const ASPECT_SLANG =
  /\b(oppose|conjunct|sextile|square|trine)\b/i;

/** Profile / summary slogans that produce nonsense when stitched */
const BANNED_PROFILE_SLANG =
  /\b(rising ruler|lights? up|long road|negotiate daily|neither should win|appearance and feeling|\bmask\b|road show|mood should\s*[—–-]|braid|sediment|witness|curriculum|colour how you think|outer style invests|meet the world by climbing|personal theme is lit|colour the exchange|sky-link|sideways knowing|already know some things sideways|chapter flavour|treat it as weather|appetite for the new turns into a private research|flowing easily|set the weather)/i;

/** Banned patterns that must not appear in user-visible body copy */
export const BANNED_PROSE_PATTERNS: RegExp[] = [
  /unusual remedy/i,
  /activating the same area as your/i,
  /\byour\s+(Rahu|Ketu|Sun|Moon|Mars|Mercury|Jupiter|Venus|Saturn)\s+story\b/i,
  
  BANNED_BODY,
  BANNED_PROFILE_SLANG,
  /\d+(\.\d+)?°/, // raw degrees in body
  /\b(applying|separating)\b/i,
  /\b(HRS|harmonic resonance)\b/i,
  /\bhouse-\d+\b/i, // prefer life labels over house-N
];

export function hasBannedProse(text: string): boolean {
  return BANNED_PROSE_PATTERNS.some((re) => re.test(text));
}

export function findBannedHits(text: string): string[] {
  const hits: string[] = [];
  for (const re of BANNED_PROSE_PATTERNS) {
    const m = text.match(re);
    if (m) hits.push(m[0]);
  }
  if (ASPECT_SLANG.test(text) && /\b(natal|transit)\b/i.test(text)) {
    const m = text.match(ASPECT_SLANG);
    if (m) hits.push(`aspect-slang:${m[0]}`);
  }
  return hits;
}

/** Ensure a fragment ends with sentence punctuation */
export function ensureSentence(text: string): string {
  let t = text.trim().replace(/\s+/g, ' ');
  if (!t) return '';
  // Capitalize
  t = t.charAt(0).toUpperCase() + t.slice(1);
  if (!/[.!?…]$/.test(t)) t += '.';
  return t;
}

/** Soft scrub of mechanic leftovers that slipped through */
export function scrubMechanic(text: string): string {
  let t = text;
  t = t.replace(/\bStar-texture\s+\w+:\s*/gi, '');
  t = t.replace(/\b\w+\s+pada\s+[1-4]\s+adds[^.!?]*[.!?]?/gi, '');
  t = t.replace(/\bPersonal spotlight:\s*/gi, '');
  t = t.replace(/\bWhen\s+\w+\s+is in the link[,:]?\s*/gi, '');
  t = t.replace(/\bkinder form[^.!?]*[.!?]?/gi, '');
  t = t.replace(/\bsubplot\b/gi, 'chapter');
  t = t.replace(/\btransit\s+(\w+)\s+is\s+oppose\s+your\s+natal\s+(\w+)/gi,
    '$1 sitting across from your $2');
  t = t.replace(/\btransit\s+(\w+)\s+is\s+conjunct\s+your\s+natal\s+(\w+)/gi,
    '$1 meeting your $2 closely');
  t = t.replace(/\btransit\s+(\w+)\s+is\s+square\s+your\s+natal\s+(\w+)/gi,
    '$1 pressing on your $2');
  t = t.replace(/\btransit\s+(\w+)\s+is\s+trine\s+your\s+natal\s+(\w+)/gi,
    '$1 working smoothly with your $2');
  t = t.replace(/\btransit\s+(\w+)\s+is\s+sextile\s+your\s+natal\s+(\w+)/gi,
    '$1 gently supporting your $2');
  t = t.replace(/\(\d+(\.\d+)?°[^)]*\)/g, '');
  t = t.replace(/\b(applying|separating)\b/gi, '');
  // Clean dangling artifacts from scrub
  t = t.replace(/\bThis link is\s*[—–-]?\s*/gi, 'This link is close — ');
  t = t.replace(/\bThe\.\s*/g, '');
  t = t.replace(/\s{2,}/g, ' ').trim();
  t = t.replace(/\s+([,.])/g, '$1');
  return t;
}

export function joinSentences(parts: string[]): string {
  return parts
    .map((p) => ensureSentence(scrubMechanic(p)))
    .filter(Boolean)
    .join(' ');
}

export function paragraphsFromSentences(
  sentences: string[],
  perPara = 3,
  maxChars = 1200,
): string {
  const clean = sentences
    .map((s) => ensureSentence(scrubMechanic(s)))
    .filter((s) => s.length > 8);
  const paras: string[] = [];
  for (let i = 0; i < clean.length; i += perPara) {
    paras.push(clean.slice(i, i + perPara).join(' '));
  }
  let out = paras.join('\n\n');
  if (out.length > maxChars) {
    const cut = out.slice(0, maxChars);
    const last = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'));
    out = last > maxChars * 0.4 ? cut.slice(0, last + 1).trim() : cut.trim() + '…';
  }
  return out;
}

/** Everyday labels for aspect types in body copy */
export function aspectLifeVerb(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('conjunct')) return 'mixing closely with';
  if (l.includes('sextile')) return 'gently cooperating with';
  if (l.includes('square')) return 'creating friction with';
  if (l.includes('trine')) return 'working smoothly with';
  if (l.includes('oppose')) return 'sitting across from';
  return 'linking with';
}
