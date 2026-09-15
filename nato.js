#!/usr/bin/osascript -l JavaScript
ObjC.import('Foundation');
// Alfred script filter: string -> NATO phonetic sequence. Runs under osascript -l JavaScript.
const LETTERS = 'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' ');
const DIGITS = 'Zero One Two Three Four Five Six Seven Eight Nine'.split(' ');
const SYMBOLS = { ' ': 'Space', '-': 'Dash', '_': 'Underscore', '.': 'Dot', ',': 'Comma', '/': 'Slash', '\\': 'Backslash', '@': 'At', '#': 'Hash', '!': 'Bang', '?': 'Question', ':': 'Colon', ';': 'Semicolon', '+': 'Plus', '=': 'Equals', '*': 'Star', '&': 'Ampersand', '$': 'Dollar', '%': 'Percent', '(': 'Open-paren', ')': 'Close-paren', "'": 'Quote', '"': 'Double-quote' };

const word = c => {
  const u = c.toUpperCase();
  if (u >= 'A' && u <= 'Z') return LETTERS[u.charCodeAt(0) - 65];
  if (c >= '0' && c <= '9') return DIGITS[+c];
  return SYMBOLS[c] || c;
};

// Letters and digits get a glyph icon from icons/; anything else falls back to the workflow icon.
const icon = c => /[A-Z]/.test(c) ? `upper-${c}` : /[a-z]/.test(c) ? `lower-${c}` : /[0-9]/.test(c) ? `digit-${c}` : null;

const spell = s => [...s].map(c => ({ c, w: word(c), i: icon(c) }));

// Each variant is one output shape; the first is the default, the rest hang off modifier keys.
const VARIANTS = [
  { key: null,  fmt: p => p.map(x => x.w).join(' ') },
  { key: 'cmd', sub: 'Case-marked: UPPER for capitals', fmt: p => p.map(x => x.c !== x.c.toLowerCase() ? x.w.toUpperCase() : x.w.toLowerCase()).join(' ') },
  { key: 'alt', sub: 'One per line: H – Hotel',     fmt: p => p.map(x => `${x.c} – ${x.w}`).join('\n') },
];

const item = p => {
  const [main, ...mods] = VARIANTS.map(v => ({ ...v, arg: v.fmt(p) }));
  const i = p.length === 1 && p[0].i;
  return {
    ...(i && { icon: { path: `icons/${i}.png` } }),
    title: main.arg || 'Type text to spell out',
    subtitle: p.map(x => x.c).join(''),
    arg: main.arg,
    valid: p.length > 0,
    text: { copy: main.arg, largetype: main.arg },
    mods: Object.fromEntries(mods.map(m => [m.key, { arg: m.arg, subtitle: m.sub }])),
  };
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
