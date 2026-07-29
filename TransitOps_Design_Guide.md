# TransitOps — Design Guide
### Hand this file to Claude Code alongside the PRD. It is the single source of truth for every visual decision.

---

## 0. Design Thesis (read first, apply everywhere)

TransitOps is a **night-shift dispatch control room**, not a SaaS landing page. Every visual decision borrows from the real world of Indian road freight: asphalt, retro-reflective signage, license plates, dashed center-lines, and amber cab lights.

**The one-line brief for every screen:** *"Could a dispatcher at 2 AM read this in one glance and trust it?"*

**Explicitly banned (these read as AI-generated):**
- Inter, Roboto, Poppins, Space Grotesk, Manrope, or system-ui as the visible typeface
- Purple/violet/indigo gradients anywhere; any gradient text
- Glassmorphism, glow shadows, floating blob backgrounds
- Near-black `#000/#0a0a0a` background with a single acid-green or vermilion accent
- Emoji in UI labels or headings
- Generic hero copy ("Streamline your fleet operations effortlessly")
- Perfectly uniform 16px-gap card grids where every card is identical weight
- `rounded-2xl` on everything — border radius is a decision, not a default (see §4)

---

## 1. Typography — the Barlow system

Barlow's letterforms are derived from **highway signage and license plates** — this is the entire reason it's chosen. It is the product's voice.

| Role | Face | Weights | Usage |
|---|---|---|---|
| **Display / KPI numerals** | `Barlow Semi Condensed` | 600, 700 | Page titles, KPI numbers, empty-state headings. Condensed width = signage feel, saves horizontal space in dense tables |
| **Body / UI** | `Barlow` | 400, 500, 600 | Everything else: labels, table cells, buttons, form inputs |
| **Data / registry** | `Spline Sans Mono` | 400, 500 | Registration numbers, license numbers, trip IDs, odometer readings, currency amounts, timestamps. Always `font-variant-numeric: tabular-nums` |

```html
<!-- app/layout.tsx <head> -->
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Semi+Condensed:wght@600;700&family=Spline+Sans+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Type scale (rem):**

| Token | Size / line-height | Face | Use |
|---|---|---|---|
| `display` | 2.25 / 1.1, 700 | Barlow Semi Cond | Page title only, one per page |
| `kpi` | 2.5 / 1, 700 | Barlow Semi Cond | KPI card numbers |
| `h2` | 1.25 / 1.3, 600 | Barlow Semi Cond | Section/card headings, letter-spacing 0.01em |
| `body` | 0.9375 (15px) / 1.5, 400 | Barlow | Default. 15px, not 16 — denser, more instrument-like |
| `label` | 0.75 / 1.2, 600, uppercase, tracking 0.08em | Barlow | Form labels, table headers, KPI captions |
| `data` | 0.875 / 1.4, 500 | Spline Sans Mono | All numeric/ID cells |

**Rules:** Page titles are sentence case ("Trip dispatcher", not "Trip Dispatcher"). Table headers and form labels are the ONLY uppercase text. Never letter-space body text.

---

## 2. Color — "Asphalt & Signal" palette

**Dual theme.** Ships with both. Dark is default (dispatch rooms run dark); light is the daytime depot-office variant — warm off-white like printed logbook paper, never pure `#fff`. The two accents and all status colors stay identical across themes (they're tuned to pass contrast on both); only surfaces and ink swap.

### 2.1 Surfaces & text — DARK (default)

| Token | Hex | Use |
|---|---|---|
| `--bitumen` | `#191C21` | App background |
| `--panel` | `#22262D` | Cards, sidebar, tables |
| `--panel-raised` | `#2A2F38` | Modals, dropdowns, hover rows |
| `--hairline` | `#343A44` | Borders. 1px only, never 2px |
| `--ink` | `#E8EAED` | Primary text |
| `--ink-dim` | `#9AA3AF` | Secondary text, captions |
| `--ink-faint` | `#5C6470` | Placeholders, disabled |

### 2.1b Surfaces & text — LIGHT (daytime depot)

| Token | Hex | Use |
|---|---|---|
| `--bitumen` | `#EFEDE6` | App background — warm logbook paper, not white |
| `--panel` | `#F7F5EF` | Cards, sidebar, tables |
| `--panel-raised` | `#FFFFFF` | Modals, dropdowns, hover rows |
| `--hairline` | `#D8D3C7` | Borders. 1px only |
| `--ink` | `#20242B` | Primary text |
| `--ink-dim` | `#5B626C` | Secondary text, captions |
| `--ink-faint` | `#9AA0A8` | Placeholders, disabled |

### 2.2 The two accents (this is what avoids the "dark + one neon accent" AI tell)

| Token | Hex | Use |
|---|---|---|
| `--amber` (primary) | `#EFA435` | The cab-light amber. Primary buttons, active nav item, focus rings, links. **The only saturated color allowed at large sizes** |
| `--reflect` (secondary) | `#6FB1C6` | Retro-reflective sign blue. Selected filters, info states, chart secondary series, "Dispatched" status. Cool counterweight to amber — used small and sparingly |

### 2.3 Status semantics (fixed — never improvise)

| Status | Token | Hex | Applies to |
|---|---|---|---|
| Available / Completed / Open-for-work | `--go` | `#5BAE6E` | green sign-board green, slightly desaturated |
| On Trip / Dispatched / In-progress | `--reflect` | `#6FB1C6` | |
| In Shop / Draft / Warning / expiring ≤30d | `--caution` | `#D9A03F` | distinct from `--amber` by being duller |
| Suspended / Expired / Cancelled / Blocked | `--stop` | `#D96459` | brick red, not neon |
| Retired / Off Duty | `--ink-faint` | `#5C6470` | gray = out of play |

**Status badge spec:** background = color at 14% opacity, text = the color itself, 1px border = color at 30%, `border-radius: 4px`, `label` type style, 2px 8px padding. Never solid-fill badges.

### 2.4 Charts (Recharts)

Series order: `--reflect` → `--amber` → `--go` → `--stop` → `--ink-dim`. Grid lines `--hairline`, no chart backgrounds, no drop shadows, tooltips styled as `--panel-raised` with hairline border. Bars: `radius={[3,3,0,0]}`, `maxBarSize={36}`.

### 2.5 CSS variables block (paste into `globals.css`)

Accents, status colors, and radii are theme-independent — defined once. Surfaces/ink swap via `.dark` / `.light` on `<html>`.

```css
:root {
  /* shared across both themes */
  --amber:#EFA435; --reflect:#6FB1C6;
  --go:#5BAE6E; --caution:#D9A03F; --stop:#D96459;
  --radius-ctl:6px; --radius-card:10px;
}
.dark {           /* default */
  --bitumen:#191C21; --panel:#22262D; --panel-raised:#2A2F38; --hairline:#343A44;
  --ink:#E8EAED; --ink-dim:#9AA3AF; --ink-faint:#5C6470;
  --modal-shadow:0 16px 40px rgb(0 0 0 / 0.45);
}
.light {          /* daytime depot */
  --bitumen:#EFEDE6; --panel:#F7F5EF; --panel-raised:#FFFFFF; --hairline:#D8D3C7;
  --ink:#20242B; --ink-dim:#5B626C; --ink-faint:#9AA0A8;
  --modal-shadow:0 16px 40px rgb(31 36 43 / 0.18);
}
```

**Toggle:** default `<html class="dark">`; toggle swaps `dark`⇄`light`. Persist to `localStorage`, honor `prefers-color-scheme` on first load. Put the theme toggle in the top bar (small sun/moon lucide icon, `--ink-dim`) next to the user chip. Because every component already reads `var(--…)`, no component code changes — the swap is automatic.

**Per-theme adjustments (only these):**
- Status badges: keep the same formula (color at 14% bg / 30% border) — it reads correctly on both paper and asphalt.
- Amber primary button keeps `#1A1300` dark text in BOTH themes (amber is light enough that dark text wins either way).
- Modal shadow uses `--modal-shadow` (softer/warmer in light).
- Hazard-stripe and center-line motifs are unchanged — the accents are shared tokens.

---

## 3. The Signature Element — the Center-Line

One recurring motif makes the product unmistakable: the **dashed road center-line**, used in exactly three places (no more):

1. **Trip lifecycle stepper** (Trip Dispatcher page): Draft → Dispatched → Completed rendered as a horizontal dashed amber line (`border-top: 2px dashed var(--amber)`) with circular waypoint nodes. Completed segments solid, upcoming segments dashed at 40% opacity. Cancelled forks downward in `--stop`.
2. **Active nav item** in the sidebar: a 3px solid amber bar on the left edge — like a lane marker — instead of a filled pill background.
3. **Section dividers** on Reports: `border-top: 1px dashed var(--hairline)` instead of solid.

**Second signature: license-plate registration numbers.** Everywhere a vehicle registration number appears (tables, dropdowns, trip cards), render it as: `Spline Sans Mono 500`, `--panel-raised` background, 1px `--hairline` border, `border-radius: 3px`, `padding: 1px 6px`, letter-spacing `0.05em`. It reads as a plate. Do NOT apply this treatment to anything else.

---

## 4. Layout & Spatial System

- **Grid:** 8px base unit. Card padding 20px. Page gutter 24px (16px mobile).
- **Radii:** controls (buttons, inputs, badges) `6px`; cards/modals `10px`. Nothing else. No `rounded-full` except avatar.
- **Borders over shadows:** elevation comes from 1px hairline borders + background steps (`--bitumen` → `--panel` → `--panel-raised`). Only modals get a shadow: `0 16px 40px rgb(0 0 0 / 0.45)`.
- **App shell:** fixed 232px left sidebar (`--panel`, hairline right border) + 56px top bar (page title left, search center, user chip + role badge right). Content area max-width 1320px.
- **Density:** this is an ops tool. Table rows 44px. No 96px-tall spacious rows. White space lives BETWEEN sections (32px), not inside components.
- **Asymmetry rule:** never render a row of identical KPI cards. On the Dashboard, "Fleet Utilization" is the anchor card — 2× width with a thin amber top border (2px solid) — the remaining six KPIs are uniform. One card leads; this alone kills the "AI grid" look.

---

## 5. Component Specs (shadcn/ui overrides)

**Buttons**
- Primary: `--amber` bg, `#1A1300` text (dark text on amber — signage contrast), 600 weight, no shadow. Hover: brightness 108%. Active: translateY(1px).
- Secondary: transparent bg, 1px `--hairline` border, `--ink` text. Hover: `--panel-raised` bg.
- Destructive: outline style with `--stop` border/text; solid `--stop` only inside confirm dialogs.
- Never more than one primary button visible per view region.

**Inputs & selects:** `--panel` bg, 1px `--hairline`, focus = 1px `--amber` border + 3px amber ring at 20% opacity (`box-shadow: 0 0 0 3px rgb(239 164 53 / .2)`). Labels above, `label` type style. Validation errors: `--stop` text, 13px, below field, icon-free — the words carry it.

**Tables:** header row `--panel` bg with `label` type in `--ink-dim`; body rows hairline-separated; hover `--panel-raised`; numeric columns right-aligned in Spline Sans Mono; status column always LAST before actions. Zebra striping banned.

**Blocked-action feedback (the demo moment):** when a business rule blocks something (overweight cargo, expired license), show an inline panel above the submit button — `--stop` at 10% bg, 1px `--stop` border, and **left edge striped with a 4px hazard pattern**: `background: repeating-linear-gradient(45deg, var(--stop) 0 6px, transparent 6px 12px)` on a 4px-wide strip. Message format: fact → rule → remedy: *"Cargo 700 kg exceeds VAN-05 capacity of 500 kg. Reduce cargo or pick a higher-capacity vehicle."* This hazard-stripe panel appears ONLY for rule violations — it's the moment judges remember.

**Toasts:** bottom-right, `--panel-raised`, hairline border, 4px left border in status color, auto-dismiss 4s. Copy mirrors the action: button "Dispatch trip" → toast "Trip TR-007 dispatched".

**Empty states:** one Barlow Semi Condensed line + one action. *"No trips yet. Create the first one."* No illustrations, no sad-face icons.

**Icons:** lucide-react only, `size={16}` in tables/nav, `strokeWidth={1.75}`, always `--ink-dim` unless status-colored. Icons accompany text, never replace it (except table row actions with tooltips).

---

## 6. Motion (minimal, purposeful)

- Page transitions: none. Instant = trustworthy.
- Status flips (the demo's hero moment): when a badge changes (Available → On Trip), animate a 250ms crossfade + the row's background pulses once to the new status color at 8% opacity for 600ms. This makes automatic transitions VISIBLE to judges.
- KPI numbers: count-up over 500ms on first load only, `ease-out`.
- Modals: 150ms fade + 4px rise. Dropdowns: 100ms fade.
- Respect `prefers-reduced-motion: reduce` — disable all of the above.
- No skeleton shimmer waves; use static `--panel-raised` blocks that fade in.

---

## 7. Page-by-Page Specs (implements PRD §6 + mockup)

### 7.1 Login (`/login`)
Split layout. Left 42%: `--panel` panel with the wordmark "TransitOps" in Barlow Semi Condensed 700 + one line: *"Fleet, drivers, and dispatch on one board."* Below it, the four demo role accounts as clickable credential chips (fills the form on click — judges love this). Right 58%: the form on `--bitumen`. Error state: hazard-stripe panel (§5). No stock imagery, no illustration.

### 7.2 Dashboard (`/dashboard`)
Row 1 — KPI band: Fleet Utilization anchor card (2×, amber top border, big % in `kpi` type + a slim horizontal bar beneath showing on-trip/available/in-shop proportions) + 6 standard KPI cards (Active Vehicles, Available, In Maintenance, Active Trips, Pending Trips, Drivers On Duty). Number in `kpi` type, caption in `label` type BELOW the number.
Row 2 — filters (vehicle type / status / region) as secondary-style select trio, left-aligned.
Row 3 — two-column: left 60% "Recent trips" table (Trip ID mono, vehicle plate chip, driver, status badge, ETA); right 40% "Vehicle status" horizontal bar breakdown using status colors.

### 7.3 Vehicle Registry (`/vehicles`)
Toolbar: search (left) + type/status filters + primary "Add vehicle" (right). Table columns: Reg. no (plate chip) · Name/Model · Type · Capacity · Odometer (mono) · Acq. cost (mono, ₹) · Status badge · row actions. Add/Edit in a right-side sheet (not centered modal) — 420px, form stacked. Retire = confirm dialog with destructive outline.

### 7.4 Drivers & Safety (`/drivers`)
Same toolbar pattern. Columns: Driver · License no (mono) · Category · Expiry · Contact · Safety score · Status. **Expiry cell logic:** expired → `--stop` text + "EXPIRED" suffix; ≤30 days → `--caution` text + "in Nd"; else plain. Safety score: number + 40px micro-bar (`--go` ≥85, `--caution` 70–84, `--stop` <70). Status toggle chips row above table (Available / On Trip / Off Duty / Suspended) act as quick filters. Rule note under the table in `--ink-dim` 13px: *"Expired license or suspended status blocks trip assignment."*

### 7.5 Trip Dispatcher (`/trips`)
Two columns. Left 40% — "Create trip" card: source, destination, vehicle select (**only Available vehicles**, each option shows plate chip + capacity), driver select (only eligible), cargo weight, planned distance. Live capacity readout under the weight field: within limit → `--ink-dim` *"Within VAN-05 capacity (500 kg)"*; exceeded → hazard-stripe panel + disabled primary button. Right 60% — "Live board": stacked trip cards, each with the center-line stepper (§3), route as *"Gandhinagar Depot → Ahmedabad Hub"*, plate chip + driver, status badge, contextual action (Dispatch / Complete / Cancel). Complete opens a small modal: final odometer, fuel consumed, revenue.

### 7.6 Maintenance (`/maintenance`)
Left 40%: "Log service record" form (vehicle select, service type, cost, date, status). Right 60%: service log table. Under the form, a static two-line state diagram in `--ink-dim` with center-line styling: `Available ──create log──▶ In Shop` / `In Shop ──close log──▶ Available`. Note: *"In-shop vehicles are removed from the dispatch pool."*

### 7.7 Fuel & Expenses (`/expenses`)
Two tabs (underline-style tabs, amber active underline — not pill tabs): "Fuel logs" and "Other expenses". Each: toolbar + table, amounts right-aligned mono with ₹. Sticky footer bar on the section: *"Total operational cost (auto) = fuel + maintenance"* with the sum in `kpi`-sized mono. Log fuel / Add expense via right-side sheet.

### 7.8 Reports & Analytics (`/reports`)
Row 1: four metric cards — Fuel efficiency (km/l), Fleet utilization %, Operational cost (₹), Vehicle ROI % — each shows the formula beneath in 12px `--ink-dim` mono (e.g. `ROI = (revenue − (maint + fuel)) / acq. cost`). Showing formulas signals rigor to judges.
Row 2: monthly cost/revenue bar chart (left 55%) + "Top costliest vehicles" horizontal bars (right 45%).
Toolbar right: secondary "Export CSV" button. Dashed section dividers (§3).

### 7.9 Settings & RBAC (`/settings`)
Left: general prefs (depot name, currency ₹ INR, distance unit km). Right: read-only RBAC matrix table — roles × modules with ✓ / "View" / — cells. This screen proves RBAC visually. Fleet Manager only.

---

## 8. Voice & Microcopy

- Sentence case everywhere except `label`-style headers.
- Buttons name the outcome: "Dispatch trip", "Close record", "Export CSV" — never "Submit", "OK", "Confirm".
- Errors = fact → rule → remedy (see §5). Never "Oops" or "Something went wrong".
- Numbers always carry units: `500 kg`, `8.4 km/l`, `₹34,070`, `1,42,000 km` (Indian digit grouping for ₹).
- Timestamps: `05 Jul 2026, 14:32` — no relative "2 hours ago" in tables.

---

## 9. Accessibility & Quality Floor (non-negotiable)

- All text ≥ 4.5:1 contrast on its surface (the palette above passes; verify if you adjust).
- Focus visible on every interactive element (amber ring spec, §5) — keyboard-walk the whole demo once.
- Status is never color-alone: badges carry text, expiry cells carry words.
- Hit targets ≥ 40px. Tables scroll horizontally on mobile inside the card; sidebar collapses to icon rail < 1024px, top-bar hamburger < 768px.
- `<html lang="en">`, real `<button>`/`<label>` elements, `aria-live="polite"` on the toast container so status flips are announced.

---

## 10. Claude Code Build Checklist

1. Install fonts (§1), paste CSS variables (§2.5), map them into `tailwind.config.ts` (`colors: { bitumen: 'var(--bitumen)', ... }`, `fontFamily: { display: [...], body: [...], mono: [...] }`).
2. Build primitives first: `StatusBadge`, `PlateChip`, `KpiCard`, `HazardPanel`, `LifecycleStepper`, `DataTable`, `SideSheet` — every page composes these.
3. Then pages in PRD execution order. Reuse — do not restyle per page.
4. Before finishing each page, self-check against §0's banned list and: one primary button per region? Registration numbers in plate chips? Numeric columns mono + right-aligned? Focus ring works?
