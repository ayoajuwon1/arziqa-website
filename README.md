# Arziqa Website

Commodity infrastructure for Nigeria. Storage, processing, and export services to reduce post-harvest losses and connect Nigerian farmers to global markets.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **Lucide React** (icons)

## Brand Guidelines

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#1B4332` | Dark green - headers, backgrounds, nav |
| Primary Light | `#2D6A4F` | Lighter green - gradients, accents |
| Accent | `#C9A84C` | Gold - CTAs, highlights, interactive |
| Accent Hover | `#B8963F` | Darker gold - hover states |
| Background | `#FAFAF7` | Off-white page backgrounds |
| Card BG | `#F5F2EB` | Warm card backgrounds |
| Text Primary | `#1A1A1A` | Body text |
| Text Secondary | `#6B7280` | Supporting text |
| Border | `#E8E5DE` | Subtle borders |

### Typography

- **Display:** Playfair Display (serif) - headings, brand name
- **Body:** Inter (sans-serif) - body text, UI
- **Mono:** System monospace - stats, data

### Design Principles

- White backgrounds, no dark mode
- Mercury-inspired light UI
- Rounded corners (`20px` bento radius)
- Gradient placeholders (replace with real photography)
- Scroll-triggered animations via Framer Motion

## Pages

- `/` - Homepage with hero, image grid (full/overview toggle), capabilities, stats, news, CTA
- `/about` - Company story, team, advisory board
- `/hubs` - Hub map and location cards
- `/investors` - Gated access request form
- `/contact` - Contact form and info

## Project Structure

```
app/
  layout.tsx          Root layout with fonts, nav, footer
  page.tsx            Homepage
  about/page.tsx      About page
  hubs/page.tsx       Hubs page
  investors/page.tsx  Investor gate
  contact/page.tsx    Contact form
components/
  Navbar.tsx          Sticky transparent-to-white nav
  ViewToggle.tsx      Full view / Overview pill toggle
  ViewContext.tsx      React context for view state
  Hero.tsx            Full-screen hero with gradient
  FadeIn.tsx          Reusable scroll-triggered fade-in
  ImageGrid.tsx       Cinematic grid with two display modes
  Counter.tsx         Animated number counter
  StatsSection.tsx    Key statistics with counters
  CapabilitiesGrid.tsx  2x4 icon grid
  HubMap.tsx          SVG Nigeria map with hub dots
  NewsCards.tsx       Article card row
  Footer.tsx          Site footer
```

## Deploy

Deploy on [Vercel](https://vercel.com) for the best Next.js experience.
