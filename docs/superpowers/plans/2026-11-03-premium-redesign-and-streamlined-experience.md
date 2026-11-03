# LankaVuz Premium Redesign & Streamlined Experience Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform LankaVuz from a dense academic cutoff directory into a prestigious, high-aesthetic higher education decision platform with an Editorial Tech visual identity, streamlined 4-hub navigation with ⌘K search, consolidated badge hierarchy, a live interactive landing hero, a floating comparison/plan dock, and a print-ready UGC preference report.

**Architecture:** Refine Tailwind tokens and CSS system in `tokens.css` for an Editorial Tech Prestige aesthetic (obsidian navy, champagne gold, hairline borders, glassmorphism). Restructure application navigation into 4 unified hubs with a global `⌘K` search palette. Consolidate card badges to 2 primary anchors, decluttering visual noise. Add a persistent floating bottom tray for compare/plan actions and a print-optimized UGC preference order PDF sheet.

**Tech Stack:** React 19, Vite 6, Tailwind CSS v4, Lucide React, TypeScript 5.7, Vitest.

---

## Global Constraints

- Preserve 100% factual cutoff accuracy: No Safe/Target/Reach probability speculation.
- Zero splash curtains or blocking modals on initial page load.
- All district ordering adheres to official 1–25 UGC district IDs.
- External application links for private/non-state campuses must open in `target="_blank" rel="noopener noreferrer"`.
- Responsive design: Full desktop and mobile support across all screens.
- Zero TypeScript (`tsc -b`) or build errors; all unit tests in `ugcLogic.test.ts` must pass.

---

## Tasks

### Task 1: Design Tokens & Editorial Tech Prestige Styling
- [ ] Update `src/styles/tokens.css` with refined obsidian navy (`#081220`, `#0C1A30`), champagne gold (`#D4AF37`, `#F59E0B`), warm amber, crisp card surfaces, and subtle hairline border tokens.
- [ ] Add `.glass-panel` and `.glass-dock` utility classes for floating trays and navigation bars.
- [ ] Add dedicated `@media print` rules for clean, ink-friendly printable reports (hiding headers, footers, interactive buttons).
- [ ] Verify styling compilation via `npm run build`.

### Task 2: Streamlined 4-Hub Navigation & ⌘K Quick Command Palette
- [ ] In `src/context/AppContext.tsx` and `src/App.tsx`, restructure top routes into 4 core hubs:
  1. `finder` / `predictor`: Course & Cutoff Finder (State UGC + Private/IFSLS)
  2. `my-plan`: My UGC Preference Order & Conflict Auditor
  3. `campus-hub`: University & Campus Directory (combines 21 state universities, private campuses, and admissions calendar)
  4. `careers`: Career Compass & Degree ROI (Career Atlas, RIASEC/Klimov quiz, and 4-Year Tuition/Salary ROI Calculator)
- [ ] Build global `⌘K` / `Ctrl+K` Command Palette in `src/components/GlobalHeader.tsx` allowing instant search across uni_codes, courses, and universities with keyboard shortcuts (`Esc` to close, arrow keys or click to navigate).
- [ ] Update header styling to a sleek glassmorphic bar with active indicator pills and district badge.

### Task 3: Interactive Landing Strategy Deck & Archetype Doors
- [ ] In `src/components/HomeDiscoveryView.tsx`, overhaul the hero banner into an interactive strategy deck.
- [ ] Place a live 3-input quick-check bar above the fold:
  `[Select District ▼]  [Select Stream ▼]  [Official Z-Score (Optional)]  →  [Explore Cutoffs]`
- [ ] Add 3 high-aesthetic entry door cards:
  - 🏛️ *State University Aspirant (Z-Score & 25-District Quota Cutoffs)*
  - 💰 *0% Upfront Govt Loan (MOHE IFSLS 14 Verified Degrees)*
  - 🌏 *Direct Private / Foundation (UK & Australian Degrees)*
- [ ] Prune redundant duplicate cards and promotional clutter.

### Task 4: Card Decluttering & Smart Visual Hierarchy
- [ ] In `src/components/ProgramChanceCard.tsx` and `src/components/PredictorView.tsx`, consolidate badge clutter:
  - Anchor 1: Authority badge (`🏛️ State UGC`, `💰 MOHE 0% Loan`, `🎓 State Non-UGC`, or `🌏 Foreign Degree`)
  - Anchor 2: High-contrast tabular 2024/25 Cutoff Pill (`📊 Colombo: 1.6210`, `🌐 All-Island: 1.5420`, or `⚪ Cutoff: NQC`)
- [ ] Move secondary specs (medium, duration, proposed intake, aptitude test notes) into an elegant, clean secondary row or expandable details drawer.
- [ ] Add smooth hover elevation (`shadow-[0_8px_30px_rgba(15,41,66,0.08)]`) and prominent "+ Plan" and "Compare" toggles.

### Task 5: Floating Multi-Compare & Plan Action Dock
- [ ] Create `src/components/FloatingActionDock.tsx`.
- [ ] Dock at the bottom center of the viewport (`fixed bottom-5 inset-x-0 mx-auto z-40 max-w-lg`).
- [ ] Animate into view with smooth transition when `compareList.length > 0` or `planEntries.length > 0`.
- [ ] Display active counts and instant action buttons:
  - `Compare (N) →` opens side-by-side comparison modal or navigates to compare view.
  - `My Plan (N) →` opens preference simulator drawer.
  - Clear / reset button.

### Task 6: Printable & Official UGC Preference Report Export
- [ ] In `src/components/PreferenceSimulatorView.tsx`, add an **"Export / Print Official Preference Order"** button.
- [ ] Design a clean, official printable document view styled like the UGC admission handbook submission schedule:
  - Student Quota District, A/L Stream, Index & Z-Score header.
  - Ranked numbered list (Preference 1..N): Uni Code, Course Name, Institution, Medium, 2024/25 Cutoff, and Conflict Status.
  - UGC Postal Registration Submission Checklist (printed application confirmation, certifying signatures, postal slip attachment reminder).
- [ ] Add print trigger `window.print()` with clean `@media print` styles.

### Task 7: Verification & Build
- [ ] Run `npx vitest run` to ensure all 8/8 tests pass.
- [ ] Run `npx tsc -b` to guarantee 0 TypeScript errors.
- [ ] Run `npm run build` to verify clean production bundle output.
- [ ] Commit and push to `origin/main`.
