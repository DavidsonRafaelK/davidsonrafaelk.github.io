# Hi, I'm David :)

Source for my personal site [davidsonrafael.xyz](https://www.davidsonrafael.xyz).

## Stack

- [Next.js](https://nextjs.org) (App Router) + React 19
- [Turborepo](https://turbo.build) monorepo, [bun](https://bun.sh) as package manager
- Tailwind CSS v4, shadcn-based components in a shared `@homepage/ui` package
- [PostHog](https://posthog.com) for analytics, [Vercel Analytics](https://vercel.com/analytics) + [Speed Insights](https://vercel.com/docs/speed-insights)
- Deployed on [Vercel](https://vercel.com)

## Structure

```
apps/web       Next.js app - the site itself
packages/ui    shared components, styles, hooks
packages/env   typed env var validation (zod)
```

## Development

```bash
bun install
bun dev          # start the web app on :3001
bun check        # lint + format (biome)
bun check-types  # typecheck all workspaces
bun build        # production build
```

## CI

GitHub Actions keep the site honest: daily joke refresh, weekly Lighthouse budget checks, a post-deploy health check on every push to `main`, and a weekly automated security review.
