#!/usr/bin/osascript -l JavaScript
// Alfred script filter: string -> NATO phonetic sequence. Runs on macOS's built-in JavaScript for Automation (macOS 10.14+).
const LETTERS = 'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' ');
const DIGITS = 'Zero One Two Three Four Five Six Seven Eight Nine'.split(' ');
const SYMBOLS = { ' ': 'Space', '\n': 'Newline', '\t': 'Tab', '-': 'Dash', '_': 'Underscore', '.': 'Dot', ',': 'Comma', '/': 'Slash', '\\': 'Backslash', '@': 'At', '#': 'Hash', '!': 'Bang', '?': 'Question', ':': 'Colon', ';': 'Semicolon', '+': 'Plus', '=': 'Equals', '*': 'Star', '&': 'Ampersand', '$': 'Dollar', '%': 'Percent', '(': 'Open-paren', ')': 'Close-paren', "'": 'Quote', '"': 'Double-quote' };

// One record per character: the source char, its code word, and (letters and digits only) a glyph icon from icons/.
const glyph = c => {
  if (/[A-Za-z]/.test(c)) return { c, w: LETTERS[c.toUpperCase().charCodeAt(0) - 65], i: `${c === c.toLowerCase() ? 'lower' : 'upper'}-${c}` };
  if (/[0-9]/.test(c)) return { c, w: DIGITS[+c], i: `digit-${c}` };
  return { c, w: SYMBOLS[c] || c };
};

// NFD splits accented letters into base letter + combining mark; dropping the marks spells "é" as Echo.
const spell = s => [...s.normalize('NFD')].filter(c => !/[̀-ͯ]/.test(c)).map(glyph);

// Each variant is one output shape; the first is the default, the rest hang off modifier keys.
const VARIANTS = [
  { key: null,  fmt: p => p.map(x => x.w).join(' ') },
  { key: 'cmd', sub: 'Case-marked: UPPER for capitals', fmt: p => p.map(x => x.c !== x.c.toLowerCase() ? x.w.toUpperCase() : x.w.toLowerCase()).join(' ') },
  { key: 'alt', sub: 'One per line: H – Hotel',     fmt: p => p.map(x => `${x.c} – ${x.w}`).join('\n') },
];

const item = p => {
  const [main, ...mods] = VARIANTS.map(v => ({ ...v, arg: v.fmt(p) }));
  const i = p.length === 1 && p[0].i;
  const out = {
    ...(i && { icon: { path: `icons/${i}.png` } }),
    title: main.arg || 'Type text to spell out',
    subtitle: p.map(x => x.c).join(''),
    arg: main.arg,
    valid: p.length > 0,
    text: { copy: main.arg, largetype: main.arg },
    mods: {},
  };
  for (const m of mods) out.mods[m.key] = { arg: m.arg, subtitle: m.sub };
  return out;
};

// Result layout, chosen in the workflow's configuration.
const LAYOUTS = {
  sequence: p => [item(p)],
  perchar:  p => p.map(x => item([x])),
  both:     p => [item(p), ...p.map(x => item([x]))],
};

function run(argv) {
  const q = argv[0] || '';
  const layout = $.NSProcessInfo.processInfo.environment.objectForKey('layout').js;
  const build = (q && LAYOUTS[layout]) || LAYOUTS.sequence;
  return JSON.stringify({ items: build(spell(q)) });
}
