# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SafeBase is a database backup and restoration management system built as a REST API with a web interface. The application enables users to add database connections, automate regular backups using cron schedules (with MySQL and PostgreSQL utilities), manage backup versions, monitor backup/restore processes with alerts, and provide a simple UI for managing these operations.

## Tech Stack

- **Framework**: Next.js 15 with App Router and Turbopack
- **Runtime**: Node.js >=22.10.0
- **Database**: PostgreSQL with Prisma ORM
- **UI**: shadcn/ui components built on Radix UI + Tailwind CSS 4
- **State Management**: TanStack Query (React Query) with `nuqs` for URL state
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Better Auth (configured but not yet in schema)
- **Styling**: Tailwind CSS with mobile-first approach
- **Package Manager**: pnpm (always use pnpm, never npm/yarn)

## Development Commands

```bash
# Development server with Turbopack
pnpm dev

# Production build with Turbopack
pnpm build

# Start production server
pnpm start

# Run ESLint
pnpm lint

# Database backup script
pnpm save-db

# Prisma commands
npx prisma migrate dev    # Run migrations in development
npx prisma generate       # Generate Prisma client
npx prisma studio        # Open Prisma Studio
```

## Architecture Patterns

### File Organization

```
app/                    # Next.js App Router pages and layouts
  _navigation/         # Navigation components (sidebar, etc.)
  databases/           # Database management pages
    _components/       # Feature-specific components
  backups/            # Backup management pages
components/           # Shared UI components
  ui/                # shadcn/ui components
  nowts/             # Custom components
features/            # Feature modules (dialog-manager, etc.)
lib/                 # Shared utilities and configurations
  database/          # Database utilities
hooks/               # Shared React hooks
prisma/              # Prisma schema and migrations
script/              # Utility scripts
```

### Data Fetching Architecture

**Server Components (Default)**:
- Minimize `use client` - favor React Server Components (RSC)
- Fetch data directly in server components using Prisma
- For small, single-use queries, query directly in the component
- For complex or reusable queries, create them in `lib/prisma/`

**Client Components**:
- Use for Web API access, interactivity, and state management
- Wrap client components in `Suspense` with fallback
- Use TanStack Query (`useMutation`) for mutations
- Server Actions for authenticated database mutations

### Database Queries with Prisma

**Simple queries** - query directly in server components:
```tsx
export default async function Page() {
  const databases = await prisma.database.findMany({
    where: { type: 'postgres' },
  });
  return <DatabaseList databases={databases} />;
}
```

**Complex queries** - create in `lib/prisma/`:
```tsx
// lib/prisma/database-query.ts
export const DatabaseSelectQuery = {
  id: true,
  name: true,
  type: true,
  host: true,
  backups: { take: 5, orderBy: { createdAt: 'desc' } },
} satisfies Prisma.DatabaseSelect;

export const getDatabaseWithBackups = async (id: string) => {
  return await prisma.database.findUnique({
    where: { id },
    select: DatabaseSelectQuery,
  });
};

// Export the return type
export type DatabaseWithBackupsType = NonNullable<
  Prisma.PromiseReturnType<typeof getDatabaseWithBackups>
>;
```

Always export return types from queries for use in component props.

### Server Actions Pattern

Server actions handle authenticated mutations without API endpoints.

**Create**: Use `*.action.ts` naming convention:
```tsx
"use server";
import { z } from "zod";
import { authAction } from "@/lib/actions/safe-actions";
import { prisma } from "@/lib/prisma";

const Schema = z.object({
  name: z.string(),
  type: z.enum(["postgres", "mysql"]),
});

export const createDatabaseAction = authAction
  .inputSchema(Schema)
  .action(async ({ parsedInput: input, ctx }) => {
    return await prisma.database.create({
      data: input,
    });
  });
```

**Use in components**:
```tsx
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/actions/actions-utils";
import { createDatabaseAction } from "./create-database.action";

const mutation = useMutation({
  mutationFn: async (data) => resolveActionResult(createDatabaseAction(data)),
  onError: (error) => toast.error(error.message),
  onSuccess: () => toast.success("Database created"),
});
```

**Available action types**:
- `action` - No authentication required
- `authAction` - Requires user authentication
- `orgAction` - Requires authentication + organization context (for multi-tenant features)

### Dialog Management

Use the global `dialogManager` for type-safe dialogs:

```tsx
import { dialogManager } from "@/features/dialog-manager/dialog-manager";

// Confirm dialog
dialogManager.confirm({
  title: "Delete database",
  description: "This action cannot be undone.",
  confirmText: "DELETE", // Optional: require typing confirmation
  action: {
    label: "Delete",
    onClick: async () => await deleteDatabase(),
    variant: "destructive"
  },
});

// Input dialog
dialogManager.input({
  title: "Rename database",
  input: {
    label: "Name",
    defaultValue: currentName,
    validation: (v) => v.trim() ? null : "Name required"
  },
  action: {
    label: "Rename",
    onClick: async (newName) => await rename(newName),
  },
});
```

## Coding Conventions

### General Principles
- Write concise, technical TypeScript using functional and declarative patterns
- Avoid classes; prefer iteration and modularization
- Use descriptive variable names with auxiliary verbs (`isLoading`, `hasError`)
- Structure files: exported component → subcomponents → helpers → static content → types
- Prefer types over interfaces
- Avoid enums; use maps or const objects instead
- No comments in code (code should be self-documenting)
- All code and UI in English

### Naming Conventions

**Files**:
- Source code: `kebab-case.ts`
- Components: `PascalCase.tsx`
- Server actions: `kebab-case.action.ts`
- Zod schemas: `kebab-case.schema.ts`
- Tests: `kebab-case.spec.ts`

**Code**:
- Variables: `camelCase`
- Constants: `SCREAMING_SNAKE_CASE`
- Functions: `camelCase`
- Classes: `PascalCase`
- Types: `PascalCaseType` or `TPascalCase`
- Interfaces: `PascalCaseInterface`
- React components: `PascalCase`
- Custom hooks: `useCamelCase`
- Server actions: suffix with `Action` (e.g., `createDatabaseAction`)
- Zod schemas: suffix with `Schema` (e.g., `DatabaseSchema`)

### TypeScript Usage
- Use TypeScript for all code
- Avoid unnecessary curly braces in conditionals
- Write declarative JSX
- Always export types from Prisma queries for component props

### Performance Optimization
- Optimize images: WebP format, size data, lazy loading
- Optimize Web Vitals (LCP, CLS, FID)
- Use dynamic loading for non-critical components
- Limit `useEffect` and `setState` usage

## Database Schema

**Current models**:
- `Database`: Stores database connection details (PostgreSQL/MySQL)
- `Backup`: Stores backup metadata and URLs linked to databases

**Note**: Prisma client is generated to `app/generated/prisma/` (not the default location).

## Key Files

- `lib/prisma.ts` - Prisma client instance
- `lib/database/test-connection.ts` - Database connection testing utility
- `features/dialog-manager/` - Global dialog management system
- `app/providers.tsx` - React Query and theme providers
- `.cursor/rules/` - Comprehensive coding rules and patterns (reference for complex scenarios)
