# R2: Multi-Angle Audit — LankaVuz (Vuzopedia.ru + Shiksha + CollegeDekho → Sri Lanka)

**Source Inspected**: `https://vuzopedia.ru/` (captured at 1440×900 and 375×812 via REA `capture_browser_scenario`; Evidence IDs `ev_3c9e53ff60a839722f763e50c6cf3641ec20302f2176b1aa1d0370f3d67ea90a`, `ev_490a07123f82dca8be2a9747bfe5a0f4e8fdd84f2d76f14dee6c65f7ffff9d8f`) plus architecture patterns from `shiksha.com` (College Predictor, 4-Way Compare, Verified Campus Reviews & Q&A) and `collegedekho.com` (Career Compass RIASEC quiz, Common Application Form single-window backup counseling).

---

## 1. Pages / Screens & Purpose

| Source Screen | Original Purpose | Sri Lankan Vuzopedia (`LankaVuz`) Route & Purpose |
|---|---|---|
| **Homepage (`/`)** | High-density academic directory with sticky city selector, instant omni-search, 4-tab hero filter (`Условия`, `География`, `Сферы`, `Ваши ЕГЭ`), 6-step onboarding strip, and "Top Services" cards (EGE Calculator, Ded Vuzoped, Personal Plan, Calendar). | **`/` (Home Portal)**: Sticky 25-District Quota Switcher + Trilingual Switcher (`EN`/`සිං`/`தமிழ்`) + Instant `uni_code`/Course/University Search + 4-Tab Hero Discovery Bar (By Z-Score & A/L Subjects, By 21 State Universities, By 129 UGC Courses, By 12 Career Fields) + Quick Service Launchers. |
| **EGE Calculator (`/kalkulator-ege`) + Shiksha Predictor** | Accepts student exam subjects/scores and classifies programs by admission probability (`Есть шансы?`). | **`/predictor` (Z-Score + 3-Subject A/L Matcher)**: Accepts District, A/L Stream, 3 A/L Subjects + Grades (`A`,`B`,`C`,`S`), General English & Common General Test (`>=30%`), and official or estimated Z-score. Calls `match_eligible_programs` RPC and groups 276 `uni_code` options into **Safe (`>= +0.0500`)**, **Target (`-0.0500 to +0.0499`)**, and **Reach (`-0.2000 to -0.0501`)**, with explicit handling of `NQC` (`NULL`), `all_island_merit_only`, and `aptitude_test_required`. |
| **Personal Admission Plan (`/admission` / `Мой план`)** | Saves shortlisted programs and tracks admission priorities. | **`/my-plan` + Slide-Over Drawer (UGC `uni_code` Preference Simulator)**: Drag-and-drop preference ordering (`#1`, `#2`, `#3`...) with real-time **Preference Order Conflict Auditor** (warns when a lower-cutoff safety `uni_code` is placed above a higher-cutoff dream `uni_code`), 1-click **Auto-Optimize by Z-Score Priority**, Printable UGC Code Sheet export, and WhatsApp share. |
| **Compare Engine (`/compare` / Shiksha Compare)** | Side-by-side matrix comparing universities and degree specialties. | **`/compare` (4-Way Degree & University Comparator + IFSLS Bridge)**: Compares up to 4 state `uni_code` programs across District Z-score, All-Island range, Degree awarded, Duration, Medium (`E`/`S`/`T`), Intake seats, Subject prerequisites, and Aptitude test requirement, with a "Highlight Differences Only" toggle + **MOHE Interest-Free Student Loan (IFSLS) & TVEC NVQ Backup Bridge**. |
| **Professions & Ded Vuzoped (`/professii`, `/recommend`, CollegeDekho Career Compass & CAF)** | Career directory + Klimov/RIASEC psychometric recommender + single-form multi-institute inquiry. | **`/careers` & `/career-quiz` (Reverse Career-to-Degree Atlas + 3-Minute RIASEC/Klimov Quiz + 1-Click Backup Application Drawer)**: Maps Sri Lankan job roles & LKR salary ranges back to State UGC `uni_code`s and Non-State/IFSLS/NVQ pathways; includes the 12-question trilingual Career Compass quiz and 1-click multi-institute counseling/application form (`student_applications`). |
| **Institution & Course Profiles (`/vuz/:id`, `/spec/:id`) + Calendar (`/kalendar`)** | Detailed university/program pages, student reviews, Q&A, and admissions timeline. | **`/institutions/:code`, `/courses/:uni_code`, and `/calendar`**: 5-tab deep profile (Overview & Courses, 25-District Z-Score Matrix & Bar Chart, Eligibility & Subject Rules, Shiksha-style 5-Star Verified Student Reviews with `.ac.lk` verification & LKR boarding costs, Campus Ambassador Q&A) + Live Sri Lankan Admissions & Aptitude Test Calendar (`doenets.lk`, UGC Handbook, UOM/UVPA/Law aptitude tests, IFSLS windows). |

---

## 2. Features & User Flows

1. **Global 25-District Quota Context**: Selecting any of Sri Lanka's 25 administrative districts in the sticky header updates `React Context` + `localStorage` and immediately re-computes Z-score cutoffs, margins, and Safe/Target/Reach badges across every card on the site.
2. **Z-Score + 3-Subject Eligibility Flow**: Student selects Stream → picks 3 A/L subjects & grades → chooses official Z-score or grade-based Z-score estimator → views Safe/Target/Reach tabs → clicks `+ Add to My UGC Plan` or `⇄ Compare`.
3. **Preference Conflict Prevention Flow**: Student reorders `uni_code` items in `My Plan` → Conflict Auditor detects if `#N` has a lower district cutoff than `#(N+1)` → Student clicks `Auto-Optimize Order` or locks manual hometown preference → Exports PDF/Print sheet or shares via WhatsApp.
4. **State-to-Non-State & IFSLS Fallback Flow**: Student with a low Z-score or missed cutoff toggles "Non-State & Interest-Free Loan Options" → sees UGC/MOHE DAI/TVEC accredited degrees eligible for the MOHE Interest-Free Student Loan Scheme (IFSLS) → submits 1-Click Common Application Form to selected partner institutes.

---

## 3. Design Snapshot & Critique (`impeccable` Critique Mode)

Method: single-context inspection of live `vuzopedia.ru` 1440px and 375px captures (`ev_3c9e53ff60a839722f763e50c6cf3641ec20302f2176b1aa1d0370f3d67ea90a`).

### Observed Source Design (`vuzopedia.ru`)
- **Palette**: Dark navy top utility bar (`#0B1320`), pill-shaped category strip on cool light slate (`#EBF1F6`), deep blue gradient hero (`#105896` → `#0E75D0`), bright royal blue CTA (`#007BFF`), red notification counter pill (`#C91C1C`), light cyan-tinted service cards (`#F0F7FB`).
- **Typography**: Dense sans-serif UI (Roboto/Open Sans style), all-caps bold hero headline (`ПОСТУПИ В ВУЗ МЕЧТЫ`), compact 12–13px navigation pills.
- **Layout Patterns**:
  - Desktop (1440px): 3-tier header (Top segment switcher → Main dark nav with City/University bordered buttons and 12 nav links → Horizontal scrollable sphere pills), centered search hero with 4 filter triggers underneath, 6 numbered square step tiles, and a 6-card horizontal service grid.
  - Mobile (375px): Collapses into a compact dark header with `Выбрать город` / `Выбрать вуз` buttons and a fixed 5-item bottom navigation bar (`Подбор`, `Ваш план`, `Поиск`, `База знаний`, `Меню`).

### Nielsen Heuristics & Cognitive Load Critique of Source
- **Strengths**:
  1. **Immediate Location Scoping**: Putting the City/Region switcher in the top header and Step #1 tile makes geographic filtering effortless.
  2. **Mobile Bottom App Bar**: The 5-icon persistent bottom bar on 375px (`Подбор`, `Ваш план`, `Поиск`) turns a sprawling directory into an app-like experience.
  3. **Task-Oriented Service Cards**: "Ded Vuzoped", "EGE Calculator", and "My Plan" turn static tables into interactive decision tools.
- **Priority Issues to Fix in `LankaVuz`**:
  - **[P1] Header & Pill Overload (Cognitive Load)**: Vuzopedia's desktop header packs 12 nav items plus 20+ sphere pills above the fold, violating the ≤4 working-memory chunking rule. **Fix**: Consolidate top navigation into 5 clear destinations (`Predictor`, `Universities & Courses`, `Compare`, `Career Compass`, `Calendar`) plus the District Selector, Trilingual Switcher, and `My UGC Plan` drawer trigger.
  - **[P1] Generic Stock Illustration Aesthetic**: The cartoon clip-art service cards look dated and reduce institutional trust. **Fix**: Adopt an authoritative **Sri Lankan Academic & Civic Atlas** aesthetic — Deep Royal Blue (`#0F2942`), Ceylon Gold/Amber (`#D97706`) for primary CTAs and badges, Emerald (`#059669`) for Safe Chance indicators, crisp tabular numerals (`JetBrains Mono` / `Plus Jakarta Sans`), and structured data cards.

---

## 4. Motion Audit (`improve-animations` Read-Only Survey)

- **Observed Source Motion**: Vuzopedia uses abrupt instant state swaps on tabs/modals and standard CSS hover color shifts without easing tokens or layout transitions.
- **Motion Plan for `LankaVuz`**:
  - Define explicit CSS motion tokens (`--ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1)`, `--duration-fast: 150ms`, `--duration-normal: 220ms`).
  - Smooth slide-over drawer transition (`transform: translateX()`) for **My UGC Admission Plan** and **1-Click Backup Counseling Form**.
  - Instant, zero-latency filtering on high-frequency interactions (typing `uni_code`s, switching districts, toggling Safe/Target/Reach tabs).
  - Visual delta bar width transitions and drag-and-drop reorder feedback in the Preference Order Simulator.
  - Strictly respect `@media (prefers-reduced-motion: reduce)`.

---

## 5. Performance Baseline (`performance-optimization` Measurement)

Measured on `https://vuzopedia.ru/` via REA Chromium 156 controlled scenario (`ev_3c9e53ff60a839722f763e50c6cf3641ec20302f763e50c6cf3641ec20302f2176b1aa1d0370f3d67ea90a`):
- **Initial Navigation (`goto_start`)**: `21,544 ms` – `24,485 ms` total scenario duration (heavy server TTFB + third-party trackers + unbundled assets).
- **Accessibility Tree Payload**: `40,537 bytes` on homepage alone.
- **1440px Viewport Screenshot Size**: `473,544 bytes`.
- **Target Budgets for `LankaVuz`**:
  - Local/Edge Initial Load & Render: `< 1,500 ms`
  - Client-side District / Z-Score Recalculation (INP): `< 50 ms`
  - Supabase Egress Protection: In-memory + `sessionStorage` caching layer (`src/services/ugcDataService.ts`) with full local JSON fallback snapshot so repeat lookups cost `0 bytes` of network egress.

---

## 6. Code Health

- **Status**: N/A (Greenfield workspace at `c:\Users\DELL\Downloads\srilakan vuzopedia`; third-party reference sources only).

---

## 7. Unknowns & Environment Notes

1. **Supabase Credentials (`VITE_SUPABASE_URL` & `VITE_SUPABASE_ANON_KEY`)**: No `.env` file exists in the workspace yet. `src/services/ugcDataService.ts` will wire the full `@supabase/supabase-js` client (querying `institutions`, `courses`, `admission_options`, `historical_cutoffs`, `eligibility_rules`, `v_program_cutoffs`, and `supabase.rpc('match_eligible_programs')`, plus writing to `student_applications`, `campus_reviews`, and `qna_threads`) AND automatically fall back to a comprehensive, realistic Sri Lankan UGC dataset (all 25 districts, 21 state institutions, representative `uni_code`s across all streams including `NQC`, `aptitude_test_required`, and `all_island_merit_only` cases, plus SQL migration schema file `supabase/schema.sql`) when env vars are not set or offline.
