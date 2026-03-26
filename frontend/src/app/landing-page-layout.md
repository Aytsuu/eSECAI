## Role
You are an expert frontend developer and UI/UX designer. Your role is to build a responsive and informative landing page with unique animation. Follow the specifications in landing-page-layout.md and the information to display in the esecai.pdf document. 

## Code snippet
```typescriptreact

"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

export default function RootPage() {
  return (
      <div className="flex justify-between a items-center mx-auto max-w-5xl py-6">
        <span className="font-bold">eSECAI</span>
        <ul className="flex gap-6">
          <li>Home</li>
          <li>Services</li>
          <li>Stories</li>
          <li>Pricing</li>
        </ul>

        <div className="flex items-center gap-4">
          <span 
            onClick={() => {
              window.open("https://github.com/Aytsuu/eSECAI", "_blank")
            }}
            className="cursor-pointer"
          >
            <Github />
          </span>

          <Link href="authentication/login">
            <Button className="rounded-full cursor-pointer">
            Start Classes
          </Button>
          </Link>
        </div>
      </div>
  );
}

```

**Additional** 
* User framer motion for animation 
* When nav is clicked it should scroll the its corresponding details(scroll should be smooth) 
* Make sure it is on dark mode.

# eSECAI — Landing Page Layout & Design Specification

> This document defines the visual language, layout rules, component patterns,
> and interaction behavior for the eSECAI landing page. Any developer or designer
> reproducing this interface must follow these rules precisely to maintain
> consistency across the design system.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Radius System](#4-spacing--radius-system)
5. [Global Layout Rules](#5-global-layout-rules)
6. [Background & Atmosphere](#6-background--atmosphere)
7. [Navigation](#7-navigation)
8. [Section Anatomy](#8-section-anatomy)
9. [Components](#9-components)
10. [Animations & Interactions](#10-animations--interactions)
11. [Responsive Rules](#11-responsive-rules)
12. [Page Section Order](#12-page-section-order)
13. [Do's and Don'ts](#13-dos-and-donts)

---

## 1. Design Philosophy

The eSECAI interface is built around one guiding idea: **a dark, product-led UI that looks like it belongs inside a serious software tool, not a marketing brochure.** It earns trust through precision — sharp edges, measured whitespace, and a restrained color palette where every accent has a reason.

**Core aesthetic keywords:** dark-minimal · product-led · technical · precise · Vercel-inspired

**Tone principles:**
- Dense but not cluttered. Information has breathing room.
- Confident but not flashy. Animations exist to orient, not entertain.
- Accent color is a signal, not decoration.
- Default to **Dark Mode**.

---

## 2. Color Tokens

The project uses **Tailwind CSS v4** with CSS variables defined in `globals.css`. We use a mix of **OKLCH** and **Hex** values.

### Theme Variables

| Variable       | Dark Value (Default) | Role                                      |
|----------------|----------------------|-------------------------------------------|
| `--background` | `#1A1A1A`            | Page base — the deepest layer             |
| `--foreground` | `oklch(0.985 0 0)`   | Primary text color (White)                |
| `--card`       | `#1A1A1A`            | Card background                           |
| `--primary`    | `oklch(0.922 0 0)`   | Primary action background (White in dark) |
| `--secondary`  | `oklch(0.269 0 0)`   | Secondary backgrounds                     |
| `--muted`      | `oklch(0.269 0 0)`   | Muted backgrounds                         |
| `--border`     | `oklch(0.269 0 0)`   | Borders (derived from muted)              |
| `--input`      | `oklch(0.269 0 0)`   | Form inputs                               |

### Usage Rule
Always use **Tailwind utility classes** (`bg-background`, `text-foreground`, `border-border`) rather than hardcoding hex values.

---

## 3. Typography

eSECAI uses the **Geist** font family, optimized for legibility and code.

### Font Families

| Role           | Family             | Variable              | Source          |
|----------------|--------------------|-----------------------|-----------------|
| Body / UI      | **Geist Sans**     | `var(--font-geist-sans)` | `next/font/google` |
| Code / Mono    | **Geist Mono**     | `var(--font-geist-mono)` | `next/font/google` |

### Usage in Tailwind
- Standard Text: `font-sans`
- Monospace / Technical Data: `font-mono`

### Type Scale (Tailwind)

| Element          | Class                             | Weight          |
|------------------|-----------------------------------|-----------------|
| Hero H1          | `text-5xl md:text-6xl`            | `font-bold`     |
| Section H2       | `text-3xl md:text-4xl`            | `font-bold`     |
| H3               | `text-xl`                         | `font-semibold` |
| Body copy        | `text-base`                       | `font-normal`   |
| Small / Meta     | `text-sm`                         | `font-medium`   |

---

## 4. Spacing & Radius System

### Border Radius
Defined in `globals.css` as `--radius: 0.625rem` (approx 10px).

| Token      | Value       | Tailwind Utility | Usage                                    |
|------------|-------------|------------------|------------------------------------------|
| `--radius` | `0.625rem`  | `rounded-lg`     | Cards, Inputs, Modals                    |
| Pill       | `9999px`    | `rounded-full`   | Buttons (`Start Classes`), Badges        |

### Layout Constraints
- **Max Width**: `max-w-5xl` (1024px) or `max-w-7xl` (1280px) for wider sections.
- **Section Padding**: `py-24` (6rem) for standard sections, `py-32` for Hero.
- **Component Gap**: `gap-4` (1rem) or `gap-6` (1.5rem) as standard.

---

## 5. Global Layout Rules

- **Framework**: Next.js 15+ (App Router).
- **Styling**: Tailwind CSS v4.
- **Icons**: `lucide-react`.

```css
/* globals.css */
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... mapped variables ... */
}
```

- **Reset**: Tailwind's preflight handles the reset.
- **Dark Mode**: Forced or System default via `next-themes` (`ThemeProvider`).

---

## 6. Background & Atmosphere

- The application uses a "deep dark" background (`#1A1A1A`).
- **Grids & Dots**: Subtle background patterns (dots/grid) can be used with low opacity to give a technical feel.
- **No Heavy Gradients**: Avoid large, colorful blobs. Keep it clean and monochromatic.

---

## 7. Navigation

The navigation bar should be minimal and floating or fixed at the top.

- **Layout**: Flexbox `justify-between`.
- **Links**: Simple text links (`text-muted-foreground` -> hover: `text-foreground`).
- **CTA**: "Start Classes" button is distinct, typically `rounded-full`.
- **Socials**: GitHub icon (`lucide-react`) linking to repository.

Example structure (from `page.tsx`):
```tsx
<div className="flex justify-between items-center mx-auto max-w-5xl py-6">
  <Logo />
  <NavLinks />
  <Actions />
</div>
```

---

## 8. Section Anatomy

Each landing page section should follow this structure:

1.  **Container**: `max-w-5xl mx-auto px-6`
2.  **Header**: `mb-12 text-center` or `mb-8 text-left`
3.  **Content**: Grid or Flex layout identifying the feature/value.

---

## 9. Components

We use **Shadcn UI** components customized for our theme.

### Buttons (`components/ui/button.tsx`)
- **Primary**: Solid white (in dark mode) text on black.
- **Secondary/Ghost**: Used for "Log in" or secondary actions.
- **Shape**: `rounded-md` for standard UI, `rounded-full` for high-emphasis marketing CTAs.

### Cards (`components/ui/card.tsx`)
- Background: `bg-card` (same as main bg or slightly lighter).
- Border: `border border-border`.
- Shadow: Minimal or none (`shadow-sm`).

---

## 10. Animations & Interactions

- **Library**: `tailwindcss-animate` (via `tw-animate-css` in v4).
- **Hover States**: `transition-colors duration-200`.
- **Entrance**: Simple fade-ins (`animate-in fade-in slide-in-from-bottom-4`).
- **Scroll**: Smooth scrolling enabled globally (`html { scroll-behavior: smooth }`).

---

## 11. Responsive Rules

- **Mobile First**: Write classes like `flex-col md:flex-row`.
- **Breakpoints**:
    - `sm`: 640px
    - `md`: 768px
    - `lg`: 1024px
    - `xl`: 1280px
- **Padding**: Ensure `px-4` or `px-6` on mobile containers to prevent edge-to-edge text.

---

## 12. Page Section Order (Proposed)

1.  **Hero**: Headline, Subheadline, "Start Classes" CTA, Social Proof.
2.  **Features**: Grid of capabilities (AI Activity checking, Real-time analysis).
3.  **How it Works**: Simple 3-step visualization.
4.  **Pricing/Plans**: (If applicable) Simple cards.
5.  **Footer**: Links, Copyright, GitHub link.

---

## 13. Do's and Don'ts

### Do
- Use **Tailwind variables** (`bg-background`, `text-primary`).
- Use **Geist** font classes (`font-sans`, `font-mono`).
- Use **Lucide React** icons.
- Keep the layout within `max-w-5xl`.

### Don't
- **Don't** hardcode hex values like `#000` or `#FFF`.
- **Don't** use `px` values for font sizes; use `text-lg`, `text-xl`.
- **Don't** use drop-shadows that are too diffused; keep them tight or remove them.
- **Don't** use gradients on text unless it's the main H1.