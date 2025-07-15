# Technology Stack

## Core Framework

- **Next.js 15.4.1** - React framework with App Router
- **React 19.1.0** - Latest React with concurrent features
- **TypeScript 5** - Type-safe JavaScript development

## Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **PostCSS** - CSS processing with Tailwind plugin
- **Geist Font** - Vercel's optimized font family (sans & mono)

## Build System

- **Turbopack** - Fast bundler for development (via `--turbopack` flag)
- **Next.js built-in bundler** - For production builds

## Development Tools

- **TypeScript** - Strict mode enabled
- **ESLint** - Code linting via Next.js config
- **Path aliases** - `@/*` maps to project root

## Common Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
```

### Build & Deploy

```bash
npm run build        # Create production build
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint checks
```

## Configuration Notes

- Uses App Router (not Pages Router)
- Strict TypeScript configuration
- CSS-in-JS via Tailwind utilities
- Font optimization with `next/font`
