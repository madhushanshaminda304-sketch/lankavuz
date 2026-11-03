# LankaVuz — Sri Lankan State University & Degree Atlas

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**LankaVuz** is the Sri Lankan equivalent of [Vuzopedia](https://vuzopedia.ru/) combined with high-converting discovery, comparison, and counseling mechanics from CollegeDekho and Shiksha, tailor-made for Sri Lankan G.C.E. Advanced Level students and the University Grants Commission (UGC) admission system.

Pre-wired for **Supabase PostgreSQL** (`institutions`, `courses`, `admission_options`, `historical_cutoffs`, `eligibility_rules`, `v_program_cutoffs`, `match_eligible_programs` RPC) and optimized for deployment on **Cloudflare Pages** or **Vercel**.

---

## 🌟 Key Features

1. **Global 25-District Quota Switcher & Trilingual Support**
   - Instant switching between all 25 administrative districts (`#1 Colombo` to `#25 Monaragala`) respecting Sri Lanka's 55% district quota formula.
   - Trilingual UI support (`English`, `සිංහල`, `தமிழ்`).
   - In-memory & `sessionStorage` edge caching with full offline snapshot fallback.

2. **Z-Score + 3-Subject A/L Matcher & Predictor (`/predictor`)**
   - Precise chance tier classification:
     - **Safe**: Margin $\ge +0.0500$
     - **Target**: Margin between $-0.0500$ and $+0.0499$
     - **Reach**: Margin between $-0.2000$ and $-0.0501$
   - Official vs. Grade-based Z-score estimation toggle.
   - Subject-specific prerequisites check and Common General Test validation ($\ge 30\%$).
   - Explicit handling of `NQC` (No Qualified Candidates — `NULL` cutoffs never coerced to zero), `All-Island Merit Only`, and `Aptitude Test Required` programs.

3. **My UGC Plan & Preference Order Conflict Simulator (`/my-plan`)**
   - Reorder university choices with real-time **⚠️ Preference Order Conflict Audit** (alerts students if a lower-cutoff safety course sits above a higher-cutoff dream course).
   - 1-Click **Auto-Optimize by Z-Score Priority** with manual hometown lock overrides.
   - Printable UGC Code Sheet view and direct WhatsApp sharing.

4. **4-Way Comparison Engine (`/compare`) & IFSLS Bridge**
   - Side-by-side comparison of up to 4 degree programs with "Highlight Differences Only" toggle.
   - Integrated **State + Non-State / MOHE Interest-Free Student Loan Scheme (IFSLS) & TVEC NVQ Bridge** with verified accreditation badges (`✅ UGC Recognized`, `✅ MOHE DAI`, `💰 IFSLS Govt Loan Eligible`).

5. **Reverse Career-to-Degree Atlas & Holland RIASEC Quiz (`/careers`)**
   - Search by career path with local Sri Lankan starting & 3–5 year salary benchmarks (LKR).
   - 3-Minute 12-question RIASEC + Klimov Career Compass assessment generating a personalized 360° Higher Education Roadmap.
   - 1-Click Backup Application / Counseling Drawer (`student_applications`).

6. **5-Tab Institution & Course Deep Profiles + Admissions Calendar (`/calendar`)**
   - 5 comprehensive tabs: Overview & Courses, 25-District Cutoff Matrix & Bar Chart, Eligibility Rules, Verified `.ac.lk` Student Reviews (with hostel costs), and Campus Ambassador Q&A.
   - Live Sri Lankan Admissions & Aptitude Test Calendar.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/madhushanshaminda304-sketch/lankavuz.git
cd lankavuz

# Install dependencies
npm install

# Start local development server
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

### Running Tests
```bash
npm run test
# or
npx vitest run
```

---

## 🗄️ Database Setup (Supabase)

The repository includes a ready-to-use DDL script in `supabase/schema.sql`.

To link a Supabase project:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Populate `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Run the SQL script from `supabase/schema.sql` inside the Supabase SQL Editor.

*(Note: If Supabase credentials are not provided, LankaVuz operates in offline mode using the embedded 25-district Sri Lankan snapshot.)*

---

## 📂 Project Structure

```
├── .pipeline/              # Audit findings, specs, and before/after screenshots
├── public/                 # Static assets, robots.txt, and _redirects
├── src/
│   ├── components/         # UI views (Header, Predictor, Simulator, Compare, etc.)
│   ├── context/            # React Context for global state (District, Plan, Cart)
│   ├── data/               # 25-District UGC Snapshot data & institutional records
│   ├── lib/                # Pure domain logic & algorithms (Z-score calculation, conflicts)
│   ├── services/           # Supabase client & cached data services
│   ├── styles/             # Design system tokens and styling
│   ├── App.tsx             # Main routing & application layout
│   └── main.tsx            # React application entry point
├── supabase/
│   └── schema.sql          # Complete PostgreSQL schema, views, and RPC functions
├── .env.example            # Sample environment variables
├── package.json
└── vite.config.ts
```

---

## 📄 License
MIT License.
