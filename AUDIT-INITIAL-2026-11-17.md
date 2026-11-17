# MathLand — Initial repository audit

Date: 2026-11-17
Branch: codex/mathland-audit-2026-11-17

## Confirmed blocking issue: source layout and aliases disagree

The application entry point is at the repository root:
- `index.html` loads `/main.tsx`
- `main.tsx` imports `./App.tsx`

However, `vite.config.ts` maps `@` to `./src`, and `tsconfig.app.json` maps `@/*` to `src/*` and only includes `src`.

The fetched root-level `App.tsx` imports modules such as:
- `@/context/AppContext`
- `@/components/Layout`
- `@/pages/HomePage`

But the corresponding nested paths `context/AppContext.tsx`, `components/Layout.tsx`, and `pages/HomePage.tsx` were not found through the repository file API, while files named `AppContext.tsx`, `Layout.tsx`, and `HomePage.tsx` do exist at the repository root. This indicates a likely incomplete or flattened source tree, not just a Vite alias typo.

## Why this has not been auto-fixed yet

Changing the alias from `src` to the repository root alone would still leave imports pointing to nested folders that were not found. Moving files or rewriting all imports without a complete verified file tree could break the deployed project. No production files have been changed in this audit branch.

## Next required verification

1. Obtain a complete repository tree (or a ZIP of the current deployed source) to establish the intended folder structure.
2. Reconcile the actual paths with Vite aliases and TypeScript `paths`/ `include`.
3. Run `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build`.
4. Review the chapter/question data and browser behavior only after the project compiles.

## Other observations

- The project is a Vite + React + TypeScript app.
- `package.json` defines build, lint, and typecheck scripts.
- `index.html` declares Persian language and RTL direction.
- `AboutPage.tsx` displays the creator name and grade/class fields.
- The existing `REVIEW-REPORT-FA.txt` explicitly says full Vite build, typecheck, lint, and browser verification were not completed. Its listed checks should therefore not be treated as proof of a fully passing build.
