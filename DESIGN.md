# Guestbook Design System

## 1. Atmosphere & Identity

A personal guestbook and focused admin workspace with a calm, readable interface. Keep the existing dark identity, use ReUI's blue primary with cool zinc-like surfaces, and carry the same palette through the guestbook, dashboard, dialogs, and status states. HeroUI provides the interactive components; semantic CSS tokens keep both color modes consistent.

## 2. Color

| Role | Token | Value | Usage |
|---|---|---|---|
| Role | Token | Light | Dark |
|---|---|---|---|
| Page | `--gb-page` | `oklch(0.98 0.006 255)` | `oklch(0.16 0.025 255)` |
| Surface | `--gb-surface` | `oklch(1 0 0)` | `oklch(0.2 0.028 255)` |
| Raised surface | `--gb-raised` | `oklch(0.95 0.012 255)` | `oklch(0.25 0.032 255)` |
| Primary ink | `--gb-ink` | `oklch(0.23 0.035 255)` | `oklch(0.96 0.012 255)` |
| Secondary ink | `--gb-muted` | `oklch(0.52 0.035 255)` | `oklch(0.73 0.025 255)` |
| Divider | `--gb-divider` | `oklch(0.87 0.022 255)` | `oklch(0.36 0.03 255)` |
| Primary | `--gb-accent` | Tailwind/ReUI blue 600 | Tailwind/ReUI blue 500 |
| Danger | `--gb-danger` | `oklch(0.68 0.19 25)` | `oklch(0.68 0.19 25)` |

Map HeroUI's accent and focus tokens to the blue primary. Use danger only for destructive actions. Keep state meaning in labels and text as well as color. The user can switch themes from the guestbook and admin surfaces; save the choice for the next visit.

## 3. Typography

- Primary: existing self-hosted Geist Sans.
- Mono: existing self-hosted Geist Mono, used for dates and counts.
- Display: 32/38px, weight 650, tight tracking; dashboard title only.
- Heading: 20/28px, weight 600.
- Body: 14/22px, weight 400; controls and table content stay at least 14px.
- Label: 12/18px, weight 550.

## 4. Spacing & Layout

- Base unit: 4px. Use 8px control gaps, 16px cell/card padding, 24px panel padding, and 32px section gaps.
- Content maximum: 1440px; fluid gutters from 16px to 40px.
- Breakpoints: 640px, 768px, 1024px, 1280px.
- The page scroll owns vertical movement. The compact header remains in document flow; tables scroll with the page and never create a second horizontal primary-content viewport.
- Summary cards use an intrinsic grid and collapse to one column on narrow screens.

## 5. Components

### Public guestbook
- Structure: brand heading, sign-in or create-message action, recent-message feed, and concise footer.
- States: loading, error, empty, populated, create pending, and delete feedback.
- Accessibility: semantic message articles, labelled controls, announced status feedback, and keyboard-operable modal.
- Layout: constrained reading width; message list scrolls independently on tall screens and becomes full-width on mobile.
- Motion: preserve the blue-tinted Liquid Ether background behind opaque surfaces.

### Dashboard shell
- Structure: header, page title and action, summary strip, section navigation, active management panel.
- Variants: users, messages.
- States: loading, error with retry, empty, populated.
- Accessibility: semantic header/main/nav; active section announced; full keyboard access.
- Motion: no decorative motion; use HeroUI's state feedback.
- Layout: stack and intrinsic grid; document is the scroll owner.

### Management table
- Structure: labelled search, result count, semantic table, row actions.
- Variants: users and guestbook messages.
- States: searching, empty, pending mutation, error, populated.
- Accessibility: caption or labelled region, scoped column headers, labelled row actions, visible focus.
- Motion: none beyond control feedback.
- Layout: table becomes stacked records below the narrow breakpoint; no page-level horizontal scroll.

### Edit and destructive action
- Structure: labelled form or explicit confirmation, cancel and submit actions.
- Variants: edit message, delete message, delete user, delete all messages.
- States: idle, pending, success, error.
- Accessibility: native form semantics, confirmation text names the affected record, pending action disabled.
- Motion: standard HeroUI overlay transition only.
- Layout: modal content constrained to viewport; document remains the page scroll owner.

## 6. Motion & Interaction

- Hover/press: 120ms ease-out; panel transitions: 200ms ease-in-out.
- Async actions disable their control immediately. Confirm mutations in place or with a toast; preserve the entered edit value on failure.
- Respect `prefers-reduced-motion`; do not use ambient motion inside the admin workspace.

## 7. Depth & Surfaces

- Use one quiet surface lift: page canvas, panel surface, raised control surface.
- Panels use a subtle neutral edge and soft shadow; avoid nested borders and accent-colored outlines.
- Keep the existing animated background behind the page, with opaque dashboard surfaces preserving text contrast.
- Radius scale: 8px controls, 12px panels, 16px overlays.

## 8. Accessibility Constraints & Accepted Debt

- Target WCAG 2.2 AA, with at least 4.5:1 body text contrast, visible keyboard focus, labelled controls, and reduced-motion support.
- User deletion removes all guestbook messages attached to that email; the confirmation must state this consequence.
- No new accessibility debt accepted.
