# Project memory

## Product intent & audience

- **Product:** MathLand (سرزمین ریاضی نهم) — a bilingual Persian educational website for Iranian Grade 9 mathematics.
- **Audience:** Grade 9 math students; also presented as a school project to a math teacher.
- **Goal:** Make Grade 9 math easier/enjoyable via interactive learning, practice, and assessment.
- **Features:** Home, 8 chapter pages, online exam system, practice center, calculator, math game, progress dashboard, about page.
- **Auth:** No login/registration; no paid APIs or backend; localStorage for persistence.

## Brand personality & voice

- Premium, modern, professional educational product — not a basic school assignment.
- UI voice: Persian (Farsi), formal but friendly educational tone.
- Math notation: Latin variables and English numerals only; never Persian math letters.

## Visual design & UX direction

- **Layout:** Full RTL throughout; Vazirmatn Persian font; responsive desktop/tablet/mobile.
- **Palette:** Navy, purple, blue, white; gradient backgrounds; rounded cards with subtle shadows.
- **Typography:** Professional hierarchy; Persian text RTL, math expressions LTR.
- **Components:** Reusable, well-organized; Lucide icons; original CSS/SVG MathLand logo.
- **Motion:** Smooth, lightweight animations.
- **Theming:** Dark and light mode toggle (persisted).
- **Math rendering:** KaTeX chosen for expressions; custom `MathExpr` component (renamed from `Math` to avoid shadowing global `Math`).
- **Avoid:** Cookie-cutter designs, placeholder content, decorative-only features, `eval()`.

## Decisions, constraints & rationale

- Stack: Vite + React + TypeScript + Tailwind CSS + Lucide React + KaTeX.
- Import alias `@/` maps to `src/`.
- Calculator: safe expression evaluator via shunting-yard algorithm (no `eval()`).
- Exam: scored out of 20; question bank ≥20 (currently 24); one-question-at-a-time; timer; randomized order; weak-chapter detection; retake support.
- Progress persisted in localStorage (exams, practice, games, points, settings).
- Tailwind: avoid dynamic class names via template literals (compiler can't see them) — use static class strings or safelisting.
- React hooks: never call hooks inside event handlers/callbacks (e.g., `useApp()` inside onClick) — call at top level.
- About page: creator name is editable; do not invent creator identity.
- Build and typecheck both pass; app is production-ready.

## Open questions & assumptions

- Content accuracy assumed for Grade 9 Iranian textbook chapters; avoid inventing formulas or textbook claims.
- No real student data (no backend); all progress is local per browser.
- No authentication means progress is not portable across devices/browsers.