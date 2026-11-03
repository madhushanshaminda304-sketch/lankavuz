# Pipeline State — LankaVuz (Sri Lankan Vuzopedia)

- **pipeline**: `remake`
- **mode**: `auto`
- **profile**: `webapp`
- **idea**: Build "LankaVuz" — the Sri Lankan equivalent of Vuzopedia.ru combined with high-converting discovery, comparison, and counseling mechanics from CollegeDekho and Shiksha, wired to Supabase (`institutions`, `courses`, `admission_options`, `historical_cutoffs`, `eligibility_rules`, `v_program_cutoffs`, `match_eligible_programs` RPC) and optimized for Cloudflare Pages.

## Keep List (from R3 User Confirmation)
1. **Keep (All 6 Playbook Prompts + Mobile Bottom App Bar)**:
   - Prompt 1: Global 25-District Quota Switcher (persisted in Context + `localStorage`), Instant `uni_code`/Course/Institution Search, Trilingual Switcher (`EN` | `සිං` | `தமிழ்`), `My UGC Plan` Counter Pill, 4-Tab Hero Discovery Bar (By Z-Score & A/L Subjects, By 21 State Universities, By 129 UGC Courses, By 12 Career Fields), and Supabase Edge Caching + Offline Snapshot Fallback (`src/services/ugcDataService.ts`).
   - Prompt 2: Z-Score + 3-Subject A/L Predictor (`/predictor`) with Safe (`>= +0.0500`), Target (`-0.0500` to `+0.0499`), and Reach (`-0.2000` to `-0.0501`) classification, Grade-based Z-Score Estimator toggle, and explicit handling of `NQC` (`min_z_score IS NULL`), `all_island_merit_only`, and `aptitude_test_required`.
   - Prompt 3: My UGC Admission Plan & Preference Order Conflict Simulator (`/my-plan` + slide-over drawer) with reordering, real-time Conflict Warning Banner when `#N` cutoff < `#(N+1)` cutoff, 1-click Auto-Optimize by Z-Score Priority, manual hometown lock, Printable UGC Code Sheet, and WhatsApp share.
   - Prompt 4: 4-Way Comparison Engine (`/compare`) with "Highlight Differences Only" toggle + popular presets, and the State + Private / MOHE Interest-Free Student Loan Scheme (IFSLS) & TVEC NVQ Backup Bridge with accreditation badges.
   - Prompt 5: Reverse Career-to-Degree Atlas (`/careers`) with LKR salary ranges, 3-Minute 12-question RIASEC + Klimov Career Compass Quiz (`/career-quiz`) generating a 360° Roadmap, and 1-Click Common Application / Counseling Drawer (`student_applications`).
   - Prompt 6: 5-Tab Institution & Course Deep Profiles (Overview, 25-District Cutoff Matrix & Bar Chart, Eligibility Rules, Shiksha-style 5-star Verified `.ac.lk` Reviews with LKR hostel cost, Campus Ambassador Q&A) + Live Sri Lankan Admissions & Aptitude Test Calendar (`/calendar`).
2. **Change / Drop**:
   - Replace Vuzopedia's 12-item header & 20-pill clutter with a clean 5-link navigation + 4-Tab Hero Discovery Bar + Trilingual Switcher.
   - Upgrade Vuzopedia's clip-art cards to high-density Sri Lankan academic data cards with tabular Z-score delta bars and NQC / Aptitude / All-Island Merit badges.
3. **Target Stack**: React 19 + TypeScript + Vite + Tailwind CSS + `@supabase/supabase-js` + `sessionStorage`/memory cache + full offline Sri Lankan UGC dataset & `supabase/schema.sql`.
4. **Vibe / Aesthetic**: *Sri Lankan Academic & Civic Atlas* — Deep Royal Blue (`#0F2942`), Ceylon Gold/Amber (`#D97706`), Emerald (`#059669`) for Safe Chance, Slate-50 canvas, `Plus Jakarta Sans` + `JetBrains Mono` tabular numerals.

## Ordered Migration & Implementation Plan (R4 / Phase 3)
- [x] **Task 1 (Scaffold, Design System Tokens & Core Domain Logic + TDD Tests)**:
  - Initialized Vite + React 19 + TypeScript + Tailwind CSS + Vitest project (`package.json`, `vite.config.ts`, `tsconfig.json`).
  - Created `src/styles/tokens.css` (Phase 5 Design System: primitive → semantic → component tokens, Hallmark stamp, reduced-motion rules, tabular numerals).
  - Created `supabase/schema.sql` with exact tables, `v_program_cutoffs` view, and `match_eligible_programs` PL/pgSQL RPC function.
  - Implemented and unit-tested pure domain functions in `src/lib/ugcLogic.ts` (`classifyProgramMatch`, `auditPreferenceOrder`, `optimizePreferenceOrder`, `estimateZScoreFromGrades`, `checkSubjectEligibility`) with Vitest (`src/lib/__tests__/ugcLogic.test.ts` — 7/7 passing).
- [x] **Task 2 (Supabase Data Layer, Edge Cache, Offline UGC Snapshot & Global Context)**:
  - Created `src/data/sriLankaUgcSnapshot.ts` containing all 25 administrative districts, all 21 UGC state institutions (`UOC` through `SVIAS`), 16 courses & 45 `uni_code` options across all streams with district cutoffs (`QUALIFIED` and `NQC`), non-state IFSLS/TVEC programs, career atlas roles, verified reviews, Q&A threads, and 2026/2027 admissions calendar events.
  - Created `src/services/ugcDataService.ts` wired to `@supabase/supabase-js` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) with `sessionStorage` + in-memory caching and seamless offline fallback.
  - Created `src/context/AppContext.tsx` managing Global 25-District selection (`localStorage`), Trilingual i18n (`EN` | `සිං` | `தமிழ்`), `My UGC Plan` list (with lock flags), `Compare` basket (up to 4 `uni_code`s), and 1-Click Backup Application Drawer state.
- [x] **Task 3 (Prompt 1 & Prompt 2 — Global Header, 4-Tab Hero Discovery & Z-Score + 3-Subject Predictor)**:
  - Built Sticky Utility Header (`src/components/GlobalHeader.tsx`) with 25-District Modal Switcher, Instant Autocomplete Search for `uni_code`/Course/University, Trilingual Switcher, `My UGC Plan` Counter Pill, and Mobile 375px Bottom Nav.
  - Built 4-Tab Hero Discovery Bar (`src/components/HomeDiscoveryView.tsx`) and `src/components/ProgramChanceCard.tsx`.
  - Built `/predictor` (`src/components/PredictorView.tsx`) with Stream, 3 A/L Subjects & Grades, General English, Common General Test (`>=30%`), Official vs. Estimated Z-Score toggle, Safe/Target/Reach tabs, visual Z-score delta bar, and `NQC` / `Aptitude Test` / `All-Island Merit` badges.
- [x] **Task 4 (Prompt 3 & Prompt 4 — My UGC Plan Preference Simulator, 4-Way Comparator & IFSLS Bridge)**:
  - Built `/my-plan` (`src/components/PreferenceSimulatorView.tsx`) & Slide-Over Drawer with reordering (`Move Up/Down`), inline **⚠️ Preference Order Conflict Auditor**, 1-click **Auto-Optimize by Z-Score Priority**, manual hometown lock, Printable UGC Code Sheet view, and WhatsApp share.
  - Built `/compare` (`src/components/CompareEngineView.tsx`) with "Highlight Differences Only" toggle, popular presets, and the **State + Non-State / MOHE IFSLS Interest-Free Loan & TVEC NVQ Bridge** with official accreditation badges.
- [x] **Task 5 (Prompt 5 & Prompt 6 — Career Atlas, RIASEC Quiz, 1-Click CAF Form, 5-Tab Institution/Course Profiles & Admissions Calendar)**:
  - Built `/careers` & `/career-quiz` (`src/components/CareerAtlasAndQuizView.tsx` — Reverse Career-to-Degree Atlas with LKR salary bands + 12-question RIASEC + Klimov assessment generating a personalized 360° Higher Education Roadmap).
  - Built the 1-Click Backup Application / Counseling Drawer (`student_applications` inside `src/components/GlobalHeader.tsx`).
  - Built the 5-Tab Institution & Course Profile View and `/calendar` (`src/components/ProfileAndCalendarView.tsx`).

## Remake Checklist
- [x] **R0: Setup & safety**
- [x] **R1: Identify source** — Captured `https://vuzopedia.ru/` into `.pipeline/before/vuzopedia-1440.png` and `.pipeline/before/vuzopedia-375.png`.
- [x] **R2: Multi-angle audit** — Recorded in `.pipeline/findings.md`.
- [x] **R3: Keep / Change / Drop** — User confirmed all 4 selections via `ask_question`.
- [x] **R4: Migration plan** — Recorded in `.pipeline/spec.md` and mapped every Keep item to Tasks 1–5.
- [x] **R5: Rebuild (Site Pipeline Phase 4–13)**
  - [x] Phase 4: Design direction (Defined in `.pipeline/spec.md`)
  - [x] Phase 5: Design system (`src/styles/tokens.css`)
  - [x] Phase 6: Build UI (`src/App.tsx`, `src/components/*`, verified at `375px`, `768px`, `1440px`)
  - [x] Phase 7: Build backend & Supabase service layer (`supabase/schema.sql`, `src/services/ugcDataService.ts`)
  - [x] Phase 8: Motion & polish (`cubic-bezier(0.22, 1, 0.36, 1)`, `.interactive-surface:active { transform: scale(0.97) }`, `@media (prefers-reduced-motion: reduce)`)
  - [x] Phase 9: Stress & accessibility (WCAG AA contrast, `:focus-visible`, `tabular-nums`, explicit `NQC` handling, responsive header verified at `375px`/`768px`)
  - [x] Phase 10: Test (`npx vitest run` — 7/7 tests passing, `npm run build` — 0 TypeScript/Vite errors)
  - [x] Phase 11: Harden (No hardcoded secrets, parameterized RPC calls, regex validation on Sri Lankan phone numbers & `.ac.lk` emails, RLS policies in `supabase/schema.sql`)
  - [x] Phase 12: Review & simplify (Deduplicated imports, fixed 375px/768px header spacing, clean component boundaries)
  - [x] Phase 13: Ship prep (`.env.example`, `public/_redirects`, `public/robots.txt`)
- [x] **R6: Compare & regression** — Captured `.pipeline/after/lankavuz-1440.png`, `.pipeline/after/lankavuz-768.png`, `.pipeline/after/lankavuz-375.png` and compared load times and Keep items.
- [x] **R7: Report** — Completed.

## Phase 13 Pre-Launch Checklist & Proposed Commit Message
- [x] Production build (`tsc -b && vite build`) passes with 0 errors (`dist/assets/index-UTlYOk4O.js`: `110.65 kB` gzip; `dist/assets/index-DvG-8hzm.css`: `8.61 kB` gzip).
- [x] Unit & regression tests (`npx vitest run`) pass (`7/7` passing).
- [x] Cloudflare Pages SPA routing configured (`public/_redirects`, `public/robots.txt`) and `.env.example` documented.
- **Proposed Conventional Commit Message** (not executed without approval):
  `feat: build LankaVuz Sri Lankan UGC 25-district Z-score atlas, preference conflict simulator, and IFSLS loan bridge`

## Unresolved
- None.

## Change 2026-11-03: UGC Handbook Alignment & Antigravity Upgrade (Prompts 1–4)
- **triage**: Size M | Types: `bug`, `feature`, `upgrade`
- **safety**: Branch `change/ugc-audit-upgrade` created from clean `main` (commit `054e52e`).
- **baseline**: Vitest `7/7` passing; production build clean (`0` errors); baseline screenshots in `.pipeline/after/`.

### Slices
- [x] **Slice 1 (Prompt 1)**: Fix Official 1–25 UGC District Order & Bidirectional Supabase Row Normalizer in `ugcDataService.ts` / `sriLankaUgcSnapshot.ts`.
- [x] **Slice 2 (Prompt 2)**: Align all `uni_code` letters & institution codes to official UGC handbook standards across `sriLankaUgcSnapshot.ts`, `AppContext.tsx`, `CompareEngineView.tsx`, `ProfileAndCalendarView.tsx`, and tests.
- [x] **Slice 3 (Prompt 3)**: Enforce official UGC eligibility rules (Suspended courses `is_suspended`, Special O/L badge `requires_ol_special`, 125 preference cap, and registered post submission checklist).
- [x] **Slice 4 (Prompt 4)**: Implement deep-link URL hash routing (`#predictor`, `#course/008G`, `#institution/UOM`), interactive 1–5 star rating selectors, and filtered Reviews/Q&A.
- [x] **Verification**: `npx vitest run` (8/8 passing) + `npm run build` (clean 0-error Vite/TypeScript build).


## Change 2026-11-03: LankaVuz v2.0 — Private Universities, Welcome Animation & Z-Score Predictor Upgrade
- **triage**: Size M | Types: `feature`, `upgrade`, `motion`, `content`
- **safety**: Branch `change/v2-private-welcome-predictor` created from clean `main` (commit `7aba302`).
- **baseline**: Vitest `8/8` passing; `npm run build` clean (`0` errors).

### Slices
- [x] **Slice 1 (Prompt 1)**: Removed inaccurate `estimateZScoreFromGrades` and upgraded Predictor to dual modes: "I Have My Official Z-Score" (`official_z`) and "A/L Results Pending — Explore by 3-Subject Combination" (`subject_explorer`) with target district benchmarks and aptitude test alerts.
- [x] **Slice 2 (Prompt 2)**: Built Functional First-Visit Welcome Curtain (`src/components/WelcomeSplashModal.tsx`) with 3-tap personalization (Language, District, Journey Stage), animated stat counter, curtain lift exit, and `Quick Setup` replay button in `GlobalHeader.tsx`.
- [x] **Slice 3 (Prompt 3)**: Built Dedicated "Private, Foreign-Affiliated & Non-State Universities Hub" (`/private-unis` route, `src/components/PrivateUniversitiesView.tsx`, `PRIVATE_AND_ALTERNATIVE_PROGRAMS` dataset across Tiers 2, 3, and 4, and `private_programs` table in `supabase/schema.sql`).
- [x] **Slice 4 (Prompt 4)**: Built interactive "4-Year Degree Cost, IFSLS Loan Repayment & Salary ROI Calculator" widget (`src/components/DegreeRoiCalculator.tsx`) and integrated into `CompareEngineView.tsx` and `PrivateUniversitiesView.tsx`.
- [x] **Verification**: `npx vitest run` (8/8 passing) + `npm run build` (zero errors, 5.69s).

## Change 2026-11-03: Zero-Prediction, Direct Private Apply & Ultra-Advanced Filter Playbook
- **triage**: Size M | Types: `feature`, `upgrade`, `content`
- **safety**: Branch `change/zero-prediction-advanced-filter` created from clean `main` (commit `c9c1b54`).
- **baseline**: Vitest `8/8` passing; `npm run build` clean (`0` errors).

### Slices
- [x] **Slice 1 (Prompt 1)**: Completely removed all Z-score & admission probability predictions (`Safe / Target / Reach`), updated `classifyProgramMatch` to factual comparison (`ABOVE_LAST_CUTOFF`, `BELOW_LAST_CUTOFF`, `CUTOFF_ONLY`, `NQC`), updated `ProgramChanceCard.tsx`, renamed "Predictor" to "Course & Cutoff Finder" across the app (`I18N_DICT`, titles, nav, CTAs), and updated unit tests (8/8 passed).
- [x] **Slice 2 (Prompt 2)**: Removed `SingleWindowCafDrawer` popup completely, expanded `NON_STATE_IFSLS_PATHWAYS` in `sriLankaUgcSnapshot.ts` with rich filter metadata and exact official URLs for 14 verified programs, and wired direct external apply buttons (`Apply on {abbr} Official Page ↗`, `Official Program Page ↗`, `MOHE 0% Loan Portal ↗`).
- [x] **Slice 3 (Prompt 3)**: Built the Ultra-Advanced 3-Layer Filter & Discovery Engine in `PredictorView.tsx` (8 preset pills, 15-second guided wizard, 12-category sticky left sidebar with live counts `(N)`, active filter chips with remove, Card Grid vs Compact Cutoff & Fee Table view toggle, multi-sort, zero splash curtain) and updated `HomeDiscoveryView.tsx`.
- [x] **Verification**: `npx vitest run` (8/8 passed) + `npm run build` (clean 0-error build in 6.29s).
