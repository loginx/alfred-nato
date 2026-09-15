#!/bin/zsh
# Golden tests: run the script filter and compare against expected output.
set -e
cd "$(dirname "$0")"
nato() { osascript -l JavaScript nato.js "$1" | /usr/bin/plutil -extract "$2" raw -o - -; }
check() { [[ "$1" == "$2" ]] && echo ok || { echo "got:  $1"; echo "want: $2"; exit 1; }; }

check "$(nato 'Hi 2-b!' items.0.arg)" 'Hotel India Space Two Dash Bravo Bang'
check "$(nato 'café' items.0.arg)" 'Charlie Alfa Foxtrot Echo'
check "$(nato $'a\tb\r\nc' items.0.arg)" 'Alfa Tab Bravo Newline Charlie'
check "$(nato 'ﬁ①' items.0.arg)" 'Foxtrot India One'
check "$(layout=perchar nato '👋🏽🇨🇦' items)" 2
check "$(nato 'aB' items.0.mods.cmd.arg)" 'alfa BRAVO'
check "$(nato 'H' items.0.icon.path)" 'icons/upper-H.png'
check "$(layout=both nato 'ab' items)" 3
