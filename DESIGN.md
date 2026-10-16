---
name: guestbook.ekel.dev
description: Public guestbook for ekel.dev plus an admin moderation dashboard; one quiet panel of messages.
colors:
  page: "oklch(0.985 0.003 255)"
  surface: "oklch(1 0 0)"
  raised: "oklch(0.96 0.005 255)"
  hover: "oklch(0.955 0.008 255)"
  ink: "oklch(0.21 0.02 260)"
  muted: "oklch(0.5 0.02 258)"
  divider: "oklch(0.915 0.008 255)"
  input: "oklch(0.89 0.01 255)"
  accent: "oklch(0.51 0.2 268)"
  accent-ink: "oklch(0.99 0 0)"
  danger: "oklch(0.6 0.21 25)"
  danger-ink: "oklch(0.5 0.19 25)"
  page-dark: "oklch(0.16 0.01 260)"
  surface-dark: "oklch(0.195 0.012 260)"
  raised-dark: "oklch(0.24 0.012 260)"
  hover-dark: "oklch(0.25 0.014 260)"
  ink-dark: "oklch(0.95 0.005 255)"
  muted-dark: "oklch(0.7 0.015 258)"
  divider-dark: "oklch(0.28 0.014 260)"
  input-dark: "oklch(0.32 0.014 260)"
  accent-dark: "oklch(0.7 0.15 270)"
  accent-ink-dark: "oklch(0.16 0.01 260)"
  danger-dark: "oklch(0.66 0.2 25)"
  danger-ink-dark: "oklch(0.78 0.14 25)"
typography:
  display:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
    fontFeature: "'cv11', 'ss01'"
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.025em"
    fontFeature: "'cv11', 'ss01', 'tnum'"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.43
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'cv11', 'ss01'"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
    fontFeature: "'cv11', 'ss01', 'tnum'"
  column-head:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  row-y: "16px"
  lg: "16px"
  row-x: "20px"
  xl: "24px"
  2xl: "40px"
  3xl: "56px"
components:
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  panel-header:
    typography: "{typography.title}"
    padding: "12px 20px"
  message-row:
    padding: "16px 20px"
  avatar:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    size: "28px"
  count-pill:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.muted}"
    rounded: "{rounded.full}"
    typography: "{typography.label}"
  nav-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.sm}"
    padding: "6px 10px"
  button-outline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    rounded: "{rounded.md}"
  empty-state:
    padding: "56px 24px"
---

# Design System: guestbook.ekel.dev

## Overview

**Creative North Star: "The Quiet Ledger"**

The guestbook shares its look with the ekel.dev status page (`../uptime`). Cool neutrals tinted toward blue (hue 255, chroma under 0.02) carry the whole surface. White panels sit on a near-white ground, separated by 1px hairlines and a soft two-layer shadow. Indigo marks the one primary action, links and focus. Red marks destructive actions. Everything else stays neutral.

The signature is one panel of messages: a "Messages" header with a count pill, then one row per message with a small neutral avatar, the author, a date and the text. The page reads top to bottom in a single 48rem column, and the dashboard widens to 64rem for its table.

Light and dark follow the system preference on first visit. The header toggle overrides it, sets `data-theme` on `<html>` and saves the choice in `localStorage` (`guestbook-theme`). Dark mode keeps the same roles with lifted lightness, a cool near-black ground (L 0.16) and heavier shadows.

The retired "Open House" look (a saturated blue welcome card, sticky two-column hero, Geist type, pill buttons) is the anti-reference.

**Key Characteristics:**
- Cool blue-tinted neutrals; white panels on a near-white ground.
- Indigo for the primary action, links and focus only; red for destructive actions only.
- Inter with `cv11`, `ss01` and tabular numerals on counts and dates.
- 1px hairlines and soft ambient shadows; 10px panels, 8px buttons.
- A single centred column with a sticky translucent header.

## Colors

All tokens live in `src/styles/globals.css` as `--gb-*` variables and map onto HeroUI's theme variables (`--background`, `--surface`, `--accent`, `--danger`, `--field-*` and the rest).

### Primary
- **Indigo** (`accent`): The "Write a message" button, the selected dashboard tab, links, focus rings, caret and the selection tint (22% alpha). Used once per view as a fill.

### Danger
- **Red** (`danger`, `danger-ink`): Delete buttons, "Delete all messages", field errors and destructive alert dialogs. `danger-ink` is the text-weight version for labels on light grounds.

### Neutral
- **Frost Ground** (`page`): Page canvas; the sticky header uses it at 85% alpha with a 12px backdrop blur.
- **Ink** (`ink`): Primary text, headings, author names, numbers.
- **Panel White** (`surface`): The message panel, the stats panel, the moderation table, outline buttons, fields, dialogs.
- **Mist** (`raised`, `hover`): Avatars, the count pill, the hover wash on nav links and table rows.
- **Slate Whisper** (`muted`): Secondary text, dates, labels, column heads, inactive nav, empty states.
- **Hairline** (`divider`): Every panel border, row separator, header and footer rule. `input` is one step darker for field strokes and scrollbar thumbs.

### Named Rules
**The One Accent Rule.** Indigo fills at most one control per view. Avatars, pills and backgrounds stay neutral; decorative colour and tinted sections have no place here.

**The Red Means Delete Rule.** Red appears only on actions that remove data and on errors.

## Typography

**Font:** Inter via `next/font/google` (fallback ui-sans-serif, system-ui), exposed as `--font-inter` on `:root` from `src/pages/_app.tsx`.

**Character:** One neutral grotesque at small sizes with alternate glyphs (`cv11` single-storey a, `ss01` open digits). Hierarchy comes from weight and muted colour, not from size jumps.

### Hierarchy
- **Display** (600, 1.5rem rising to 1.75rem above 640px, tight tracking): "Guestbook", "Dashboard" and error page headings. One per page.
- **Headline** (600, 1.25rem, tabular): Dashboard stat values.
- **Title** (600, 0.875rem): Panel headers ("Messages"); section headings in the dashboard step up to 1rem.
- **Body** (400-500, 0.875rem, line-height 1.6): Message text, author names (500), nav, prose.
- **Label** (500, 0.75rem, muted): Dates, stat labels, the count pill, result counts.
- **Column head** (500, 0.6875rem, muted, sentence case): Table header row only.

### Named Rules
**The Tabular Numbers Rule.** Counts, stats and dates set with `tabular-nums`.

**The Sentence-Case Rule.** Labels and headings stay sentence case at normal tracking. No uppercase eyebrows.

## Layout

A single centred column: 48rem on the guestbook, 64rem on the dashboard, set by `--page-w` on `.guestbook-viewport` and `.dashboard-viewport`. Side padding is 24px, 16px at 640px and below. The header, main column and footer share the same width.

The page intro opens 56px below the header (40px on mobile): heading and one-line description left, actions right, wrapping onto their own line when space runs out. The notice alert sits between the intro and the panel. The footer sits 64px below content behind a hairline.

At 640px and below: the brand domain and admin name hide, intro actions stretch to full width, message dates move under the author, the dashboard table swaps for a stacked record panel, and the search field takes the full row.

## Elevation & Depth

Mostly flat with one ambient shadow. Panels carry `--gb-shadow-panel`: a tight contact shadow plus a soft blurred drop (`0 1px 2px oklch(0.2 0.02 260 / 0.04), 0 4px 12px -4px oklch(0.2 0.02 260 / 0.06)`; dark: `0 1px 2px oklch(0 0 0 / 0.3), 0 6px 16px -6px oklch(0 0 0 / 0.4)`). The sticky header gets depth from translucency and blur, not a shadow. Dialogs use HeroUI's own overlay shadow.

### Named Rules
**The Soft Edge Rule.** Shadows stay diffuse and low-alpha; no hard offsets, no heavy borders.

## Shapes

Panels use 10px. Buttons use 8px (one global override on `.button`, icon-only buttons keep HeroUI's shape). Nav links and inline hover targets use 6px. Avatars and the count pill are full circles. The brand mark is a 28px rounded square with a hairline ring.

## Components

All controls are HeroUI v3 (`@heroui/react`). Restyle through the `--gb-*` tokens and the few class overrides in `globals.css`, not per-component props.

### Buttons
- **Primary:** indigo fill; only "Write a message" and dialog submit buttons.
- **Outline (main use):** Panel White ground, hairline border, ink text. Sign-in, retry, cancel and "Return to guestbook".
- **Ghost:** the theme toggle and "Sign out" in the header.
- **Tertiary / danger:** row Edit and Delete actions in moderation; delete text uses `danger-ink`.
- Small size (`size="sm"`) everywhere outside dialogs.

### Navigation
Sticky 56px header, translucent frost ground with backdrop blur and a bottom hairline. Brand mark plus "guestbook" in ink and ".ekel.dev" in muted, then right-aligned actions: Dashboard link (admins only), theme toggle, Sign out. The dashboard adds a divider and a muted "Admin" label after the brand, and the signed-in name before the toggle.

### Message panel (signature)
One panel. Header: "Messages" title and a count pill. Rows: 28px neutral avatar with the author's initial, `@username` (500), date (label, muted, right-aligned), then the message with `pre-wrap` at a 70ch measure. Admins see a small Delete action under the text that opens a confirm dialog. Loading, error (with Try again) and empty states render inside the panel at 56px by 24px.

### Dashboard
Heading and intro with a "View guestbook" nav link. A stats panel splits into three hairline-divided cells (label over headline value). Secondary tabs switch between Messages and Contributors, each with a heading, search field, bulk delete and a result count above a panelled table. On mobile the table becomes a stacked record panel.

### Dialogs
HeroUI `Modal` for writing and editing messages; HeroUI `AlertDialog` with the danger icon for every delete. Cancel is outline, the confirming action is primary or danger.

## Do's and Don'ts

### Do:
- **Do** build new containers as Panel White, 10px radius, 1px Hairline, panel shadow.
- **Do** keep one indigo fill per view and reserve red for deletion and errors.
- **Do** set counts and dates with tabular numerals.
- **Do** keep transitions at 150-200ms on colour only, and respect `prefers-reduced-motion` (globals.css already zeroes durations).
- **Do** keep this page visually in step with `../uptime`; change both when the shared look changes.

### Don't:
- **Don't** bring back the saturated blue welcome card or tinted section backgrounds.
- **Don't** use pill-shaped buttons or tinted `secondary` buttons for neutral actions; use outline.
- **Don't** colour avatars by user; they stay neutral.
- **Don't** add uppercase letterspaced eyebrows or oversized display type.
- **Don't** add page-load animations or decorative effects (the old `react-bits` components are unused).
