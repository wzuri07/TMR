# AGENTS.md

Guide for coding agents (and humans) working on Clear English (repo: TMR).

## Setup

None. The app is plain HTML, CSS and JavaScript with zero dependencies. Open `index.html` in a browser.
Node.js 20+ is only needed for the tests.

## Commands

| Task | Command |
|---|---|
| Tests | `npm test` (Node's built-in runner, no install step) |
| Run the app | open `index.html` |

CI runs the tests on every push and pull request (`.github/workflows/ci.yml`).
The live demo is served by GitHub Pages from `main`.

## Layout

- `checker.js` — all grammar rules and the rewrite pipeline. Works in the browser (global `InternationalEnglishChecker`) and in Node (`module.exports`); keep both.
- `app.js` — UI only: theme, rendering findings, applying suggestions.
- `examples.js` — demo passages.
- `test/checker.test.js` — tests for `checker.js`.

## Rules

- Keep zero runtime dependencies and no build step.
- Nothing leaves the browser: no network calls, no analytics.
- Any text from the user or from findings that goes into `innerHTML` must pass through `escapeHtml`.
- New rule → add it next to rules of its type in `checker.js` and add a test that shows it firing and not firing.
- Clarity notes (passive voice, long sentences) are suggestions: `actionable: false`, no invented replacement.
- The interface text is Spanish; code, comments and docs are English.
