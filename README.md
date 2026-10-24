# Jnros Logistics website

Next.js 16 (App Router), TypeScript, Tailwind CSS 4. Animation: GSAP 3.15 (ScrollTrigger, SplitText, ScrambleText, MotionPath) via `@gsap/react`, Lenis smooth scrolling, and Framer Motion for the mobile menu, lightbox, project filters, form feedback and page transitions. There is no backend: the quote form opens WhatsApp with the details filled in.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (every page is static)
```

## Deploy

Push to a Git repository and import it in Vercel. No configuration is needed.

Optional: set `NEXT_PUBLIC_SITE_URL` (for example `https://jnroslogistics.com`) so canonical URLs, the sitemap and robots.txt use the right domain. It defaults to `https://jnroslogistics.com`.

## Editing content

All copy and data live in [`lib/data.ts`](lib/data.ts): contact details, image URLs, the 16 solutions and services, stats, the route map destinations, the five "How we work" steps and the project photos.

- **Stats** (150+, 10+, 40+, 500+) are placeholders. Confirm them before launch.
- **Projects:** every photo comes from one job, the BH50M mining fleet moved by barge, grouped by stage (Loading, Lashing, Transit). Add new projects to `projectPhotos` / `featuredWork` as they're documented.
- **Route map:** destinations are in `network.routes`. City positions come from [`lib/world-map.ts`](lib/world-map.ts), which was generated with [dotted-map](https://github.com/NTag/dotted-map) together with `public/world-dots.svg`. Regenerate both to add a city.
- **Social links:** Facebook, Instagram and YouTube have empty `href`s because the current site has no URLs for them. Add a URL and the icon appears in the footer.
- **Logo:** add `public/logo.png`. The header and footer pick it up on the next build, and show a "JNROS LOGISTICS" wordmark until then. The logo sits on a small white plate because it is navy on white.

## Typography

Every text size comes from one scale, defined as theme tokens at the top of [`app/globals.css`](app/globals.css). To resize type, change it there, not in components.

| Token | Size (phone → max) | Used for |
| --- | --- | --- |
| `text-hero` | clamp(2rem, 4.5vw, 3.75rem) | Hero and sub-page H1 |
| `text-h2` | clamp(1.75rem, 3vw, 2.5rem) | Section headings |
| `text-h3` | clamp(1.125rem, 1.5vw, 1.375rem) | Card and sub headings |
| `text-eyebrow` | 0.75rem, 0.15em tracking | Eyebrow labels (uppercase) |
| `text-base` | 1rem, line-height 1.7 | Body |
| `text-sm` | 0.875rem | Small / meta |
| `text-nav` | 0.875rem, 0.08em tracking | Header nav (uppercase) |
| `text-button` | 0.875rem, 0.1em tracking | Buttons (uppercase, 14px × 28px padding) |
| `text-stat` | clamp(2rem, 4vw, 3rem) | Odometers, map counters |
| `text-marquee` | clamp(2rem, 5vw, 4rem) | Marquee, outlined step numbers |
| `text-wordmark` | clamp(4rem, 14vw, 10rem) | Footer wordmark, 404 number |

Headings are weight 600, line-height 1.1 and −0.01em tracking. Paragraphs are capped at `max-w-prose`, and sections use `py-14 md:py-20`.

## How the animation system is organised

| Piece | Where |
| --- | --- |
| Plugin registration, shared media queries | [`lib/gsap.ts`](lib/gsap.ts) |
| Lenis + ScrollTrigger sync, scroll progress bar, grid fade-in | [`components/SmoothScroll.tsx`](components/SmoothScroll.tsx) |
| Page transitions | [`components/PageTransition.tsx`](components/PageTransition.tsx) and [`app/template.tsx`](app/template.tsx) |
| Custom cursor (`data-cursor="view"` / `"drag"` on any element) | [`components/Cursor.tsx`](components/Cursor.tsx) |
| Section titles (accent line, scrambled eyebrow, masked lines) | [`components/SplitReveal.tsx`](components/SplitReveal.tsx) |

Rules every component follows:

- **Desktop (≥1024px)** gets the full experience. **Mobile** gets simplified reveals: no pinning, custom cursor or mouse parallax.
- **`prefers-reduced-motion`** turns off Lenis, pinning, parallax, scrubbing and looping motion, and keeps simple fades.
- **Continuous motion runs as CSS animations on the compositor** (hero zoom, marquee drift, subtitle rotation, film grain). JavaScript only adjusts them during scroll, for example the marquee's playback rate and skew.
- **Animation setup stays out of the hydration task.** Below-the-fold components set up when they come within about half a screen (`lib/useNear.ts`); the rest set up in idle time after hydration (`lib/useIdle.ts`).
- **Elements that animate in on load** carry `data-pre` (or `data-pre-desktop`). They are hidden by CSS until their component takes over, and shown after 4s if JavaScript fails. Without JavaScript, everything is visible.

## Performance notes

Measured locally with Lighthouse 13.5 in mobile mode. On this test machine Lighthouse warns that the CPU is slower than it expects (benchmark index ≈ 650), so these runs use a calibrated 2× CPU slowdown instead of the default 4×:

| Page | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Home | 77–83 | 100 | 100 | 100 |
| Services | 81 | 100 | 100 | 100 |
| Projects | 79 | 100 | 100 | 100 |
| Contact | 82 | 100 | 100 | 100 |

LCP (about 4s) is the limiting metric locally. After deploying, check the live URL with [PageSpeed Insights](https://pagespeed.web.dev/), which is the number that counts. If mobile is still under target, the next step is to drop GSAP on phones and do the simplified mobile reveals in CSS, which saves about 50KB of JavaScript.

## Structure

```
app/            layout (boot script, providers), template (transition hook), pages:
                /, /services, /projects, /contact, 404, sitemap, robots, favicon
components/     SmoothScroll, PageTransition, Cursor, Header, MobileMenu, Hero,
                SplitReveal, Reveal, ImageReveal, VelocityMarquee, WordHighlight, Odometer,
                HorizontalServices, RoutesMap, StackingSteps, ProjectHoverList, ProjectsGrid,
                TiltCard, Lightbox, MagneticButton, QuoteForm, Footer, FooterMotion,
                WhatsAppButton, PageBanner, CtaBanner, ServiceCard, ui, icons, Logo
lib/            data.ts (content), gsap.ts, world-map.ts, useNear.ts, useIdle.ts, utils.ts
public/         world-dots.svg (map dots); add logo.png here
```

Linking to `/contact?service=<slug>` pre-fills the quote form's cargo type and message. The service cards use this.
