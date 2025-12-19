# Batchmark

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thai2902/batchmark-professional-client-side-batch-watermarking-tool)

## Overview

Batchmark is a production-ready full-stack web application template built on Cloudflare Workers and Pages. It features a modern React frontend with shadcn/ui components, Tailwind CSS for styling, TypeScript for type safety, and a Hono-powered backend for API routes. Designed for rapid development and deployment, it includes built-in theming, error reporting, state management, and responsive design out of the box.

## Key Features

- **Full-Stack Architecture**: React SPA frontend with Cloudflare Worker backend API routes.
- **Modern UI**: shadcn/ui components, Tailwind CSS with custom animations and gradients, dark/light theme support.
- **API-Ready**: Hono router with CORS, logging, health checks, and error handling.
- **Developer Experience**: Vite for fast HMR, React Query for data fetching, Zod for validation, TanStack Router.
- **Cloudflare Native**: Workers for dynamic API, Pages for static assets, automatic SPA routing.
- **Production Features**: Error boundaries, client error reporting, TypeScript strict mode, linting, and optimized builds.
- **Mobile-Responsive**: Sidebar layout, touch-friendly components, and adaptive design.
- **Extensible**: Easy to add routes (`worker/userRoutes.ts`), pages (`src/pages/`), and components (`src/components/`).

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide React icons, Framer Motion, React Query, React Router, Sonner (toasts), Zustand.
- **Backend**: Hono, Cloudflare Workers, TypeScript.
- **UI/UX**: Radix UI primitives, class-variance-authority (CVA), Tailwind Merge.
- **Utilities**: Immer, Zod, UUID, Date-fns, Recharts.
- **Dev Tools**: ESLint, Bun, Wrangler.
- **Deployment**: Cloudflare Pages + Workers.

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) (package manager)
- [Cloudflare Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- Cloudflare account and Wrangler authentication (`wrangler login`)

### Installation

1. Clone the repository.
2. Install dependencies:

   ```bash
   bun install
   ```

3. Generate Worker types (optional, for IDE support):

   ```bash
   bun run cf-typegen
   ```

### Local Development

Start the development server (runs Vite on port 3000 by default, accessible via `0.0.0.0`):

```bash
bun dev
```

- Frontend: http://localhost:3000
- API: http://localhost:3000/api/health (Worker routes via Vite proxy)

Hot Module Replacement (HMR) enabled for instant updates.

### Building for Production

```bash
bun run build
```

Outputs optimized static assets to `dist/`.

### Preview Production Build

```bash
bun run preview
```

Serves the production build locally.

## Usage

### Adding API Routes

Edit `worker/userRoutes.ts`:

```typescript
app.post('/api/example', async (c) => {
  const data = await c.req.json();
  return c.json({ success: true, data });
});
```

Routes auto-load with error recovery in dev mode.

### Adding Frontend Pages

Update `src/main.tsx` router:

```tsx
{
  path: '/new-page',
  element: <NewPage />,
}
```

Create `src/pages/NewPage.tsx`.

### Customizing UI

- Theme toggle: Built-in hook `useTheme`.
- Sidebar: Edit `src/components/app-sidebar.tsx` or use `AppLayout`.
- Components: Use shadcn/ui (e.g., `Button`, `Card`, `Table`) – all pre-installed.

### Error Handling

Client errors auto-report to `/api/client-errors`. Global `ErrorBoundary` catches React errors.

## Deployment

Deploy to Cloudflare Pages (assets) + Workers (API) with one command:

```bash
bun run deploy
```

This builds assets and runs `wrangler deploy`.

### Manual Deployment Steps

1. Build: `bun run build`
2. Deploy Worker: `wrangler deploy`
3. (Optional) Custom domain: Update `wrangler.toml` or dashboard.

For CI/CD, use Cloudflare Git integration or GitHub Actions with Wrangler.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/thai2902/batchmark-professional-client-side-batch-watermarking-tool)

## Project Structure

```
├── src/              # React frontend
│   ├── components/   # UI components (shadcn/ui + custom)
│   ├── pages/        # Route pages
│   └── hooks/        # Custom hooks
├── worker/           # Cloudflare Worker backend
│   └── userRoutes.ts # Add custom API routes here
├── tailwind.config.js # Custom Tailwind theme
└── wrangler.jsonc    # Worker config
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server |
| `bun build` | Build for production |
| `bun lint` | Run ESLint |
| `bun preview` | Preview production build |
| `bun deploy` | Build + deploy to Cloudflare |
| `bun cf-typegen` | Generate Worker types |

## Contributing

1. Fork and clone.
2. Install with `bun install`.
3. Create a feature branch.
4. Run `bun dev` and test changes.
5. Lint with `bun lint`.
6. Submit a PR.

## License

MIT License. See [LICENSE](LICENSE) for details.