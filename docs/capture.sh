#!/bin/zsh
# Regenerate README media from the installed workflow: one PNG per layout, plus a GIF of a query being typed.
# Captures Alfred's window by id, so nothing else is in frame. Needs Screen Recording permission for the terminal.
set -e
OUT=$(cd "$(dirname "$0")" && pwd); F=$(mktemp -d)
ALFRED='tell application id "com.runningwithcrayons.Alfred"'
Q='Hello 42'
layout() { osascript -e "$ALFRED to set configuration \"layout\" to value \"$1\" in workflow \"com.loginx.utils.nato\" exportable false"; }
show()   { osascript -e "$ALFRED to search \"nato $1\""; sleep 1; }
hide()   { osascript -e 'tell application "System Events" to key code 53'; sleep 0.5; }
shot()   { screencapture -x -o -l "$(osascript -l JavaScript "$OUT/alfred-window.js")" "$1"; }

for l in sequence perchar; do
  layout $l; show "$Q"; shot "$OUT/layout-$l.png"; hide
done

layout both; n=0
frame() { shot "$F/$(printf %04d $n).png"; n=$((n+1)); }
for ((i=1; i<=${#Q}; i++)); do show "${Q:0:$i}"; frame; done
for _ in {1..6}; do frame; done   # hold the final state
hide
# ffmpeg drops frames when input sizes change mid-stream, so pad every frame to the largest canvas first.
magick mogrify -background none -gravity North -extent "$(magick identify -format '%wx%h\n' "$F"/*.png | sort -t x -k2 -n | tail -1)" "$F"/*.png
ffmpeg -y -loglevel error -framerate 3 -pattern_type glob -i "$F/*.png" \
  -vf "split[a][b];[a]palettegen=reserve_transparent=1[p];[b][p]paletteuse=dither=bayer:bayer_scale=5" "$OUT/demo.gif"
rm -rf "$F"
