# Clear English

**A private English grammar and clarity checker that runs entirely in your browser.**

**[Try it live →](https://wzuri07.github.io/TMR/)**

![Clear English reviewing a passage](docs/screenshot.png)

Clear English reviews English text for common grammar, spelling and word-choice mistakes, then rewrites it for readability. It is built for *international* English: it does not force American or British spelling, so it is useful for non-native writers and mixed audiences. Everything is processed on your device; no text is ever sent to a server.

> The interface is in Spanish, since it was built for Spanish speakers writing in English.

## Features

- **One-click improve:** fixes frequent errors and replaces the text in place
- **Review mode:** lists suggestions without touching your text, so you can apply them one by one
- **Checks for:** subject–verb agreement, article usage, common misspellings, unnatural phrasing, redundancy, accidental repeated words, and overly long sentences
- **Private and offline:** no server, no account, no tracking
- **Light and dark themes,** with your choice remembered in the browser
- **Zero runtime dependencies:** plain HTML, CSS and JavaScript

## How it works

The checker in [`checker.js`](checker.js) is rule-based. Rules are grouped by type (spelling, agreement, articles, phrasing), and the rewrite runs as a pipeline of independent stages that can be switched on or off per call:

```js
improveText(text, { rewriteKnownPassages: false });
```

Stages: `normalizeFormatting` → `rewriteKnownPassages` → `grammarPasses` → `smoothRepeatedBecause` → `capitalizeSentences` → `ensureFinalPunctuation`.

Because it relies on patterns rather than understanding, clarity notes (such as passive voice or long sentences) are suggestions, not confirmed errors. It is a writing aid, not a replacement for a human proofreader.

## Run it locally

No build step. Clone the repo and open `index.html` in any modern browser:

```bash
git clone https://github.com/wzuri07/TMR.git
```

## Tests

The checker has a test suite using Node's built-in test runner (Node is only needed for tests, not for the app):

```bash
npm test
```

## Project structure

| File | Purpose |
|---|---|
| `index.html` | Page layout |
| `app.js` | UI logic, theme toggle, applying suggestions |
| `checker.js` | Grammar rules and the rewrite pipeline |
| `examples.js` | Demo passages, kept separate from the UI |
| `styles.css` | Light and dark themes |
| `test/` | Unit tests for the checker |

## Extending it

- Add a rule next to the others of its type in `checker.js`.
- Add demo text to `examples.js` without touching the interface.

## About the name

The repository is called **TMR** (Translator Machine-Reader), the broader idea behind it: making machine-translated and non-native English easier to read. Clear English is the first tool from that idea.
