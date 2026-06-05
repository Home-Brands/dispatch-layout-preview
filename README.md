# Dispatch — layout preview

A throwaway visual prototype to gather feedback on **dispatch-calendar layout
formats**. Three layouts render the *same* synthetic dataset so reviewers can
compare structure, not content. No backend, no auth, no live data.

> Source of the look: ported from the Virtue app's Tailwind v4 theme
> (`app/globals.css`) and visit-tile styling, driven by the dispatch-board
> section's `sample-data.json`. The winning layout can be ported back into the
> real `DispatchBoard` cheaply — same Tailwind classes.

## Layouts

| Tab | What it is | Color encodes |
|-----|-----------|---------------|
| **Route swimlanes** | Current spec'd design — one horizontal lane per route, 7-day timeline | visit **status** |
| **Week grid** | Swimlanes expanded — routes stacked, each with a 7-day hourly timeline | visit **status** |
| **Day grid** | One day, a column per route (resource view), time down the side | visit **status** |
| **Gantt board** | One day, routes as rows, time runs left→right, jobs as bars (FSM-standard board) | visit **status** |
| **Agenda** | The week as a dense chronological list, grouped by day | visit **status** |

State lives in the URL (`?variant=gantt&day=2026-04-14`, `?variant=agenda`), so
any view is a shareable deep link.

## Configure the feedback link (one value)

Open `src/config.ts` and set:

```ts
export const FEEDBACK_FORM_URL = 'https://forms.gle/your-form';
```

The **Give feedback** button opens it in a new tab with `?variant=<current>`
appended, so responses carry which layout the reviewer was viewing. Leave it
empty to ship without the button.

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:5173
pnpm build        # → dist/  (static, deployable anywhere)
pnpm typecheck
```

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy-pages.yml`, which builds
and publishes `dist/` to Pages. In the repo: **Settings → Pages → Source:
GitHub Actions**. The site URL is `https://<owner>.github.io/<repo>/`.

`vite.config.ts` uses `base: './'`, so the build is path-agnostic — no repo-name
config needed.

> **Note:** a Pages site is publicly reachable by anyone with the URL (the page
> also sends `noindex`). The data is synthetic, but it exposes unreleased UI
> direction — share the link accordingly.
