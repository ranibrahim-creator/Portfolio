# shadcn design system

Canonical UI system for **every product in this portfolio**. Do not invent a parallel palette, type scale, or component kit.

Source of truth:
- Tokens: `app/globals.css`, `tailwind.config.ts`
- Registry: `components.json` (style `radix-nova`, icons Lucide, CSS variables)
- Primitives: `components/ui/*`
- This file: visual and usage rules

When adding UI, reuse existing tokens and shadcn primitives. New hex values are not allowed unless this file is updated first.

## Stack

- Next.js App Router + Tailwind CSS
- shadcn/ui (Radix Nova) — add components with `npx shadcn@latest add <name>`
- Icons: Lucide
- Font: Inter via `--font-sans`
- Dark mode: `class` strategy (`next-themes`). Dark is the default.

## Tokens (dark)

| Role | Token | Value |
| --- | --- | --- |
| Page background | `background` | `#000000` |
| Card / elevated surface | `surface`, `card` | `#171B24` |
| Border / hairline | `border`, `input` | `#2A3040` |
| Primary text | `foreground` | `#FFFFFF` |
| Secondary text | `muted`, `muted-foreground` | `#8B909C` |
| Accent (charts, remaining, highlights) | `accent`, `ring` | `#FF9F0A` |
| Accent hover | `accent-hover` | `#E88C00` |
| Accent on-color | `accent-foreground` | `#000000` |
| Destructive / warning | `destructive`, `warning` | `#E24B4A` |
| Data A (sky) | `protein`, `chart-2` | `#64D2FF` |
| Data B (orange) | `carbs`, `chart-1` | `#FF9F0A` |
| Data C (magenta) | `fat`, `chart-3` | `#BF5AF2` |

Light theme lives on `:root` in `app/globals.css`. Page and card must never share the same background value.

## Tailwind usage

Use semantic classes, not raw hex:

```
bg-background  bg-surface  bg-card
text-foreground  text-muted
border-border
bg-accent  text-accent  hover:bg-accent-hover
bg-warning  text-warning
bg-protein  bg-carbs  bg-fat
```

Primary actions in dark mode are **white fill, black text** (`bg-white text-black hover:bg-neutral-200`), not orange fills. Orange is for data, selection rings, and highlights.

## Shape, type, motion

- Radius: `rounded-xl` (12px). `--radius: 0.75rem`.
- Control height: `h-12` for buttons, inputs, selects, icon buttons, and avatars.
- Type: Inter. Tabular numerals on counts (`tabular-nums`).
- Motion: 150–200ms, `ease-out`. No bounce.
- Layout: mobile-first. Product shells may use `max-w-[480px]`; marketing pages may go wider. Do not mix ad-hoc max widths inside a product.

## Spacing and sizing (4px grid)

Use **4 / 8 / 12 / 16 / 24 / 32 / 48** only (`1 2 3 4 6 8 12`). Do not use `5` (20px) or other off-scale steps for layout.

| Use | Size | Class |
| --- | --- | --- |
| Page gutter | 24 | `px-6` |
| Page top | 24 | `pt-6` |
| Page bottom (tab bar) | 128 | `pb-32` |
| Card / sheet / dialog padding | 24 | `p-6` |
| Header → content, section → section | 24 | `mb-6` / `mt-6` |
| Gap between sibling cards | 16 | `space-y-4` / `gap-4` / `mt-4` |
| Stack inside a card | 16 | `space-y-4` |
| Label → control | 8 | `space-y-2` / `mt-2` |
| List row gap | 8 | `space-y-2` |
| Inline cluster | 12 | `gap-3` |
| Control / icon button | 48 | `h-12` / `h-12 w-12` |
| Nested icon inside an `h-12` field | 32 | `h-8 w-8` |
| Hero mark | 64 | `h-16 w-16` |

Toggles may stay compact (`h-7`). Chart internals may use `h-2` tracks. Do not mix `p-5`, `px-5`, `h-9`, `h-10`, `h-11`, or `h-14` in product UI.

## Components

1. Check `components/ui` before creating a primitive.
2. If it is a shadcn component, add it with `npx shadcn@latest add <name>` — do not hand-roll a parallel Button, Dialog, Select, Tabs, Switch, Sheet, or Input.
3. Compose product UI from those primitives plus Tailwind tokens.
4. Do not copy styles from other apps. Match this system.

Existing primitives: `button`, `input`, `label`, `select`, `switch`, `tabs`, `dialog`, `sheet`.

## Mentioning this system

In any chat in this repo you can say **“use the shadcn design system”**. Agents also load `.cursor/rules/shadcn-design-system.mdc` on every conversation, so the system applies even if it is not mentioned.
