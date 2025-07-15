# Project Structure

## Root Level

- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration with strict mode
- `postcss.config.mjs` - PostCSS setup for Tailwind
- `README.md` - Project documentation

## App Directory (`app/`)

Uses Next.js App Router structure:

- `layout.tsx` - Root layout with font setup and global styles
- `page.tsx` - Home page component
- `globals.css` - Global CSS imports and Tailwind directives
- `favicon.ico` - Site favicon

## Public Assets (`public/`)

Static files served at root:

- SVG icons and logos
- Images accessible via `/filename.ext`

## Key Conventions

### File Naming

- React components: PascalCase (e.g., `HomePage.tsx`)
- Route files: lowercase (e.g., `page.tsx`, `layout.tsx`)
- Config files: kebab-case or camelCase as per tool conventions

### Import Patterns

- Use `@/` alias for imports from project root
- Next.js components imported from `next/`
- Font imports from `next/font/google`

### Component Structure

- Export default for page/layout components
- Use TypeScript interfaces for props
- Metadata exports for SEO in page components

### Styling Approach

- Tailwind utility classes for styling
- CSS custom properties for theme values
- Responsive design with Tailwind breakpoints (`sm:`, `md:`, etc.)
- Dark mode support via Tailwind's `dark:` prefix
