---
{
  "name": "Guestbook — Open House",
  "description": "Readable conversation and precise moderation in blue and neutral light/dark surfaces.",
  "colors": {
    "page-light": "oklch(0.985 0 0)",
    "surface-light": "oklch(1 0 0)",
    "raised-light": "oklch(0.96 0 0)",
    "ink-light": "oklch(0.21 0.006 285)",
    "muted-light": "oklch(0.48 0.008 285)",
    "divider-light": "oklch(0.9 0.004 285)",
    "accent-light": "oklch(0.546 0.245 262.9)",
    "accent-soft-light": "oklch(0.95 0.025 262)",
    "danger-light": "oklch(0.55 0.22 25)",
    "welcome-light": "oklch(0.49 0.215 263)",
    "welcome-ink-light": "oklch(1 0 0)",
    "accent-foreground-light": "white",
    "danger-foreground-light": "white",
    "page-dark": "oklch(0.17 0.004 285)",
    "surface-dark": "oklch(0.205 0.004 285)",
    "raised-dark": "oklch(0.25 0.005 285)",
    "ink-dark": "oklch(0.96 0 0)",
    "muted-dark": "oklch(0.72 0.008 285)",
    "divider-dark": "oklch(0.33 0.006 285)",
    "accent-dark": "oklch(0.707 0.165 254.6)",
    "accent-soft-dark": "oklch(0.28 0.065 263)",
    "danger-dark": "oklch(0.68 0.19 25)",
    "welcome-dark": "oklch(0.38 0.15 263)",
    "accent-foreground-dark": "oklch(0.19 0.045 263)",
    "danger-foreground-dark": "oklch(0.17 0 0)",
    "welcome-ink-dark": "oklch(1 0 0)"
  },
  "typography": {
    "display": {
      "fontFamily": "Geist Sans, sans-serif",
      "fontSize": "clamp(32px, 3.4vw, 44px)",
      "fontWeight": 600,
      "lineHeight": 1.14,
      "letterSpacing": "-0.035em"
    },
    "headline": {
      "fontFamily": "Geist Sans, sans-serif",
      "fontSize": "clamp(26px, 3vw, 34px)",
      "fontWeight": 600,
      "lineHeight": 1.3,
      "letterSpacing": "-0.035em"
    },
    "title": {
      "fontFamily": "Geist Sans, sans-serif",
      "fontSize": "24px",
      "fontWeight": 600,
      "lineHeight": 1.3,
      "letterSpacing": "-0.03em"
    },
    "body": {
      "fontFamily": "Geist Sans, sans-serif",
      "fontSize": "15px",
      "fontWeight": 400,
      "lineHeight": 1.6
    },
    "author": {
      "fontFamily": "Geist Sans, sans-serif",
      "fontSize": "14px",
      "fontWeight": 650
    },
    "metadata": {
      "fontFamily": "Geist Sans, sans-serif",
      "fontSize": "12px"
    }
  },
  "rounded": {
    "base": "0.625rem",
    "welcome-action": "9px",
    "brand-mark": "10px",
    "table": "12px",
    "welcome": "16px",
    "avatar": "50%"
  },
  "spacing": {
    "control": "8px",
    "compact": "12px",
    "item": "16px",
    "cell": "20px",
    "mobile-gutter": "24px",
    "record": "28px",
    "section": "36px",
    "public-gutter": "40px",
    "admin-gutter": "48px",
    "public-section": "64px"
  },
  "components": {
    "welcome-panel-light": {
      "backgroundColor": "{colors.welcome-light}",
      "textColor": "{colors.welcome-ink-light}",
      "rounded": "{rounded.welcome}",
      "padding": "36px"
    },
    "welcome-panel-dark": {
      "backgroundColor": "{colors.welcome-dark}",
      "textColor": "{colors.welcome-ink-dark}",
      "rounded": "{rounded.welcome}",
      "padding": "36px"
    },
    "button-primary-light": {
      "backgroundColor": "{colors.accent-light}",
      "textColor": "{colors.accent-foreground-light}"
    },
    "button-primary-dark": {
      "backgroundColor": "{colors.accent-dark}",
      "textColor": "{colors.accent-foreground-dark}"
    },
    "button-welcome": {
      "backgroundColor": "{colors.welcome-ink-light}",
      "textColor": "{colors.welcome-light}",
      "rounded": "{rounded.welcome-action}",
      "width": "100%"
    },
    "table-light": {
      "backgroundColor": "{colors.surface-light}",
      "rounded": "{rounded.table}"
    },
    "input-light": {
      "backgroundColor": "{colors.surface-light}",
      "textColor": "{colors.ink-light}",
      "padding": "8px 12px"
    },
    "avatar-light": {
      "backgroundColor": "{colors.accent-soft-light}",
      "textColor": "{colors.accent-light}",
      "rounded": "{rounded.avatar}",
      "size": "38px"
    }
  }
}
---

# Design System: Guestbook — Open House

## Overview

**Creative North Star: "Open House"**

Open House makes personal conversation feel welcoming and moderation feel clear. Blue provides a recognizable point of arrival; neutral surfaces carry reading, searching, and decisions. The self-hosted Geist family and familiar HeroUI v3 controls connect the public guestbook and administrator workspace.

Density follows the task: generous message spacing supports reading, while aligned rows and compact metadata support moderation. Theme changes preserve these relationships through semantic CSS variables. The implemented identity uses typography, tone, and borders without decorative imagery.

**Key Characteristics:**
- Blue welcome surface and neutral reading areas.
- Flat, separated content with restrained rounded containers.
- One type family with clear headings and quiet metadata.
- Responsive records and explicit destructive actions.

## Colors

The primary blue is informed by ReUI; near-neutral surfaces keep conversation legible. Frontmatter values are normative and copied from `src/styles/globals.css`; `-light` and `-dark` identify theme counterparts.

### Primary
- **Welcome Blue:** `welcome-*` anchors the invitation surface, with `welcome-ink-*` for its text and inverted actions.
- **Action Blue:** `accent-*` identifies primary actions, selected tabs, focus, and links; `accent-soft-*` supports the wordmark and avatars.

### Neutral
- **Paper / Charcoal:** `page-*` is the canvas, `surface-*` the table or overlay, and `raised-*` the table header or secondary layer.
- **Reading Ink:** `ink-*` carries primary text; `muted-*` carries descriptions and metadata; `divider-*` separates content.
- **Danger:** `danger-*` marks destructive actions and errors. HeroUI receives these through its semantic variables, including theme-specific foregrounds.

**The Semantic Theme Rule.** Use the shared semantic variables so both themes preserve the same hierarchy.

## Typography

**Display and body:** self-hosted Geist Sans via `next/font/local` in `src/pages/_app.tsx`; the build supplies the generated family name. Geist Mono is loaded only for preformatted code, not for dates or counts.

The frontmatter records the desktop display, dashboard headline, feed title, body, author, and metadata roles. On narrow screens the welcome heading becomes 36px, the dashboard heading 28px, the feed heading 22px, and message text 14px. Counts use tabular numerals. Message body text uses a relaxed line-height of 1.75 and preserves intentional line breaks; public reading width is capped at 70ch, table previews at 65ch.

## Layout

The public container is capped at 1200px with 40px side gutters. Its desktop grid uses `minmax(280px, 0.85fr) minmax(0, 1.45fr)`, a 64px gap, and a sticky welcome panel 32px from the viewport top. The dashboard is capped at 1360px with 48px gutters. Both headers remain in document flow.

At 1000px and below, the public gap reduces to 36px and dashboard gutters to 32px. At 760px and below, both use 24px gutters: the public layout stacks, the welcome panel loses sticky positioning, and admin tables become divided records. Search occupies its own full-width row and management tools wrap. Summary metrics remain three columns with reduced padding. The document owns scrolling; the feed has no independent scroll region.

## Elevation & Depth

The page is flat by default. Dividers, neutral fill, and spacing establish hierarchy; the welcome panel supplies the strongest color area. Custom table rows explicitly remove shadows. HeroUI retains its field and overlay treatment, including blurred backdrops for admin dialogs; use the library's tokens rather than inventing a separate shadow scale.

**The Reading Surface Rule.** Separate messages with spacing and dividers; reserve bounded surfaces for the welcome panel, tables, fields, and overlays.

## Shapes

The frontmatter captures the reused local radius values. Welcome panels are softly rounded, table containers are tighter, and avatars are circular. Welcome actions override HeroUI's default button shape with their own radius. Other buttons retain the installed HeroUI shape and sizing; the root base radius does not redefine every component.

## Components

### Buttons

Use HeroUI v3 `Button` with primary, secondary, tertiary, danger, or danger-soft variants as implemented. Welcome actions are full-width inverted buttons. Destructive table actions remain labeled; the bulk action reads “Delete all messages” and uses danger-soft, while the final confirmation uses danger. Pending and disabled feedback remains owned by HeroUI.

The library supplies hover, focus, and press behavior. Shared keyboard focus uses a 2px accent outline with a 4px offset. Reduced-motion mode disables smooth scrolling and reduces animation and transition durations to 0.01ms.

### Fields

Use HeroUI Input, TextArea, TextField, and Label. Search has a programmatic label even when visually hidden. Message fields retain validation and visible error text. The public form permits up to 500 characters; editor forms preserve the draft on failure.

### Navigation

A compact wordmark and theme toggle link the surfaces. The theme toggle announces the next mode. Admin section tabs use a blue selected state and adjacent counts. Domain suffix and admin brand detail hide on mobile to preserve space.

### Welcome panel and message records

The welcome panel combines a simple line icon, heading, introduction, and full-width action stack. The feed uses initials avatars, author/date metadata, wrapped message text, and bottom dividers. Mobile puts date below author. This is a content record, not a nested card.

### Moderation and dialogs

Summary metrics form one bordered strip. Tables have a raised header, a neutral surface, and subtle row hover. Mobile renders separate readable records with the same actions. Confirmation dialogs name the affected messages and permanence; contributor removal concerns messages grouped by email. Loading, error, empty, and access-denied states retain clear text and recovery navigation where implemented.

## Do's and Don'ts

### Do
- Do use the semantic light/dark colors from src/styles/globals.css.
- Do use HeroUI v3 controls and preserve their accessible labels, focus, and pending states.
- Do keep author names, dates, and message content readable when text wraps.
- Do describe exactly which messages a destructive action removes.

### Don't
- Don't restore the retired animated background or nested summary-card composition.
- Don't fabricate published messages, contributor activity, or chart data.
- Don't imply that deleting contributor messages deletes their authentication account.
- Don't use color as the only indication of an error or destructive action.
