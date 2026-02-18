# Developing on this Project

## Prerequisites
Node.js >= 18.

## Source Structure
- `lib/` — ES6+ source code
- `dist/` — Babel-compiled output (committed to repo)
- `bin/` — CLI entry point

## Building
```bash
npm install
npm run babel
```

This transpiles `lib/` and `bin/` into `dist/` using Babel.

## Creating Pull Requests
Run `npm run babel` to rebuild `dist/` before committing. Both `lib/` and `dist/` should be committed.
