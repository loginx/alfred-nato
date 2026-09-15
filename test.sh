#!/bin/zsh
# Golden test: run the script filter and compare the default arg.
set -e
cd "$(dirname "$0")"
got=$(osascript -l JavaScript nato.js 'Hi 2-b!' | /usr/bin/plutil -extract items.0.arg raw -o - -)
want='Hotel India Space Two Dash Bravo Bang'
[[ "$got" == "$want" ]] && echo ok || { echo "got:  $got"; echo "want: $want"; exit 1; }
n=$(layout=both osascript -l JavaScript nato.js 'ab' | /usr/bin/plutil -extract items raw -o - -)
[[ "$n" == 3 ]] && echo ok || { echo "both items: $n, want 3"; exit 1; }
