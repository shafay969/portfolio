# Project: Shafay's Portfolio Website

Personal portfolio site for an AI-assisted web development agency. Primary
job of this page: convert cold local-service-business prospects (plumbers,
auto shops, salons) into replies/calls. Every design and copy decision
should serve that, not decorate for its own sake.

## Stack

- Plain HTML/CSS/JS (or Next.js if a component structure becomes useful —
  default to plain unless the section count/complexity justifies it)
- GSAP + ScrollTrigger for the scroll-scrubbed hero canvas
- Deploy target: Netlify or Vercel (already used for other demos — match
  that workflow)
- No CMS, no backend — static site, contact via mailto/Calendly-style link

## Build order (follow this sequence, do not skip ahead)

1. **Blank scroll-video page.** Load the frame sequence onto a `<canvas>`,
   pin it with `position: sticky` inside a container of tunable height
   (start at `300vh`), map scroll progress within that container to frame
   index via GSAP ScrollTrigger (`scrub: true, pin: true`). No text, no
   sections. Confirm this feels smooth before moving on.
2. **Hero content layer.** Add headline (rotating, see Motion below),
   subhead, two CTAs, tool-logo strip. Still inside the pinned container.
3. **Sections, one at a time, in this order:** About/stats → Work → Services
   → Process → Contact. Build, review, adjust — don't batch multiple
   sections in one pass.
4. **Tune the pin height** last, once all sections exist, so the hero
   animation finishes and releases into section 2 at the right scroll
   position. This is the "crop" — a CSS/JS number, never a video edit.
5. **Mobile pass** after desktop is signed off (see Mobile below) — a
   separate pass, not built in parallel.

Reference `SECTIONS.md` for what goes in each section and `CONTENT.md` for
the actual copy/data to use — do not invent stats, client counts, or
testimonials.

## Design tokens

Derive the palette from the subject's own scroll-video (dark, moody, pink/
magenta rim-lighting on a black background) — not from the inspiration
sites' orange palette. The inspiration sites are a reference for
*structure and motion*, not color.

- `--bg`: `#0a0a0d` (near-black base)
- `--bg-panel`: `#141117` (slightly lifted panel/card background)
- `--accent-primary`: `#ff2e63` (magenta-red, pulled from the video's rim
  light)
- `--accent-secondary`: `#7a1f3d` (deep muted rose, for subtler UI —
  borders, secondary text highlights)
- `--text-primary`: `#f5f3f4`
- `--text-muted`: `#9c949a`

Typography: pick a display face with some edge (not a default geometric
sans) for headlines, paired with a clean, highly legible body face. Set a
real type scale, not just font-size bumps. Treat this as the studio-quality
bar described in the frontend-design skill, not a generic SaaS template.

## Motion

- **Hero headline rotation:** cycle 3–4 short value props (e.g. "We build
  AI-powered websites" / "We build booking systems that convert" / "We ship
  in weeks, not months") on a fixed interval with a clean fade/slide
  transition — mirrors the inspiration sites' rotating hero text.
- Keep motion elsewhere restrained: scroll-triggered reveals on section
  entry are enough. Don't scatter effects — the pinned hero video is
  already the signature moment; nothing else should compete with it.
- Respect `prefers-reduced-motion`: disable the frame-scrub and rotation on
  request, fall back to a static hero frame.

## Mobile strategy (do not reuse the desktop scroll-scrub as-is)

- Desktop: full pinned frame-sequence scrub as above.
- Mobile (`<768px`): swap to a single static hero frame (pick one from the
  existing sequence) or a short muted autoplay loop. Apply simple CSS
  fade/parallax on scroll instead of frame-by-frame scrubbing. Do not load
  the full frame sequence on mobile — it's a real page-weight cost for a
  visual effect mobile users scroll past too fast to perceive anyway.
- No new source video is needed for this — reuse the existing frames/stills.
- Build and test mobile layout as its own pass per section, not a
  responsive afterthought bolted on at the end.

## Copy rules

- No fabricated stats, client counts, or testimonials. Current real
  numbers: 3 production demo sites, tools used (Claude Code, GitHub,
  Netlify, Vercel), fast turnaround.
- Write from the visitor's side: what they get, not how it's built.
- Every section should point toward one action: Start a Project.

## Quality bar

- Responsive down to mobile, visible keyboard focus states.
- Take screenshots and self-critique each section before moving to the
  next (see frontend-design skill if available in this environment).
- No AI-generated-design tells: avoid default cream/terracotta or
  black+acid-green templated looks — this project's palette is already
  specified above, stick to it.
