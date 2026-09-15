# NATO Spell

Spell any string out in the NATO phonetic alphabet from Alfred.

## Usage

`nato hi 2` → `Hotel India Space Two`. Enter copies the result.

* <kbd>⌘</kbd> Case-marked: `hotel INDIA` (UPPER for capitals)
* <kbd>⌥</kbd> One character per line: `H – Hotel`
* <kbd>⌘</kbd><kbd>L</kbd> Large Type

Set the Hotkey to spell out selected text from any application.

## Settings

| Setting | Default | Description |
|---|---|---|
| Keyword | `nato` | Trigger keyword |
| Layout | One string | One string, one result per character, or both (full string first) |

## Install

Download `NATO.alfredworkflow` from Releases and double-click. No runtime dependencies: the script filter runs on macOS's built-in JavaScript for Automation.

## Contributing

PR titles follow [Conventional Commits](https://www.conventionalcommits.org) and become the squash commit. [release-please](https://github.com/googleapis/release-please) keeps a release PR open with the changelog and next version; merging it tags the release and attaches the built `.alfredworkflow`.

## Build

```bash
make alfredworkflow
```
