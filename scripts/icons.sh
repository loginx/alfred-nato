#!/bin/zsh
# Render one glyph icon per letter (both cases) and digit into icons/.
set -e
cd "$(dirname "$0")/.."
font='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
mkdir -p icons
glyph() { magick -size 256x256 xc:none -fill '#1f3a5f' -draw 'roundrectangle 8,8 248,248 48,48' \
  -fill white -font "$font" -pointsize 180 -gravity center -annotate +0+0 "$1" "icons/$2.png"; }
for c in {A..Z}; do glyph $c upper-$c; glyph ${c:l} lower-${c:l}; done
for d in {0..9}; do glyph $d digit-$d; done
