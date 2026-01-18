# CLAUDE.md - Be On Bikes

This document provides comprehensive guidance for AI assistants working with the Be On Bikes codebase.

## Project Overview

**Be On Bikes** is an e-bike rental platform targeting backpackers and the Latino community on Australia's Sunshine Coast. The application features bilingual support (Spanish/English), an admin dashboard, dynamic pricing, and automated email notifications.

**Live URL**: https://beonbikes.com
**Tech Stack**: Next.js 16 (App Router), TypeScript, PostgreSQL (Neon), Prisma ORM, Better Auth, Tailwind CSS, Resend

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (copy from .env.example)
cp .env.example .env.local

# Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

**Required environment variables**:
- `DATABASE_URL` - PostgreSQL connection string (Neon)
- `BETTER_AUTH_SECRET` - Auth secret (32+ chars, generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL` - Application URL
- `RESEND_API_KEY` - Email service API key

## Directory Structure

```
src/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Spanish landing page (main)
│   ├── en/page.tsx          # English landing page
│   ├── admin/               # Protected admin dashboard
│   │   ├── page.tsx         # Dashboard with stats
│   │   ├── layout.tsx       # Auth-protected layout
│   │   ├── login/           # Admin login
│   │   ├── setup/           # Initial admin setup
│   │   ├── bookings/        # Booking management
│   │   ├── settings/        # Price configuration
│   │   └── availability/    # Calendar management
│   └── api/                 # API routes
│       ├── bookings/        # POST: create, GET: list
│       ├── prices/          # GET: dynamic pricing
│       ├── auth/[...all]/   # Better Auth endpoints
│       └── admin/           # Admin-only endpoints
├── components/
│   ├── forms/               # Form components
│   │   └── BackpackerBookingForm.tsx  # Main booking form (bilingual)
│   ├── admin/               # Admin-only components
│   │   ├── AdminSidebar.tsx
│   │   ├── BookingsTable.tsx
│   │   ├── PriceSettings.tsx
│   │   └── AvailabilityCalendar.tsx
│   ├── layout/              # Header, Footer
│   └── ui/                  # Shadcn UI components
├── lib/
│   ├── auth.ts              # Better Auth configuration
│   ├── auth-client.ts       # Client-side auth hooks
│   ├── prisma.ts            # Prisma client singleton
│   └── utils.ts             # Utility functions (cn)
└── middleware.ts            # Route protection for /admin

prisma/
├── schema.prisma            # Database schema
└── migrations/              # Migration history
```

## Key Conventions

### TypeScript & Imports

- Use absolute imports with `@/` alias: `import { cn } from '@/lib/utils'`
- Mark client components with `'use client'` directive at the top
- Define interfaces for component props and data structures
- Use strict typing; avoid `any`

### Component Patterns

```tsx
// Client component example
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MyComponentProps {
  lang?: 'es' | 'en'
}

export function MyComponent({ lang = 'es' }: MyComponentProps) {
  // Component logic
}
```

### Bilingual Support (i18n)

The app uses a translation object pattern for Spanish/English support:

```tsx
const t = {
  es: {
    title: 'Titulo en espanol',
    submit: 'Enviar',
  },
  en: {
    title: 'English Title',
    submit: 'Submit',
  },
}

// Usage
const texts = t[lang]
return <h1>{texts.title}</h1>
```

**Language handling**:
- Default language is Spanish (`es`)
- English pages are at `/en/*` routes
- Forms pass `lang` parameter to API for email localization
- Date formatting uses `date-fns` with `es` or `enUS` locale

### Styling

- **Tailwind CSS** with custom theme colors (orange/amber brand palette)
- **Shadcn UI** components in `src/components/ui/`
- Use `cn()` utility for conditional classes: `className={cn('base', condition && 'conditional')}`
- Mobile-first responsive design
- Dark mode configured but not actively used

**Brand colors**:
- Primary orange: `bg-orange-600`, `text-orange-600`
- Accent amber: `bg-amber-500`
- Slate for text: `text-slate-700`, `text-slate-500`

### Database (Prisma)

**Key models**:
- `User`, `Session`, `Account`, `Verification` - Better Auth models
- `RentalBooking` - E-bike rental reservations (main business entity)
- `Settings` - Key-value store for dynamic pricing
- `TourBooking`, `ConversionRequest` - Placeholder models

**Common operations**:
```ts
import prisma from '@/lib/prisma'

// Create booking
const booking = await prisma.rentalBooking.create({
  data: { fullName, email, startDate, endDate, weeks, status: 'pending' }
})

// Get settings
const settings = await prisma.settings.findMany()
```

**Schema changes**:
```bash
# Edit prisma/schema.prisma, then:
npx prisma db push      # Development (direct push)
npx prisma migrate dev  # Production (with migration)
```

### Authentication

Uses **Better Auth** with email/password authentication:

```ts
// Server-side (API routes)
import { auth } from '@/lib/auth'
const session = await auth.api.getSession({ headers: request.headers })

// Client-side
import { authClient } from '@/lib/auth-client'
await authClient.signOut()
```

**Protected routes**: All `/admin/*` routes except `/admin/login` and `/admin/setup` require authentication (enforced in `middleware.ts`).

### API Routes

API routes use Next.js App Router conventions:

```ts
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: 'value' })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  // Process and return response
  return NextResponse.json({ success: true }, { status: 201 })
}
```

### Form Handling

Uses **react-hook-form** with **Zod** validation:

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
})

const form = useForm({
  resolver: zodResolver(schema),
})
```

### Email Notifications

Uses **Resend** for transactional emails:

```ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

await resend.emails.send({
  from: 'Be On Bikes <reservas@beonbikes.com>',
  to: [email],
  subject: 'Subject',
  html: `<div>...</div>`,
})
```

Emails are sent in both Spanish (to admin) and the customer's selected language.

## Business Logic

### Rental Pricing

- **Base rate**: $70 AUD/week (configurable via admin settings)
- **Minimum rental**: 2 weeks
- **Bond**: $140 AUD (2 weeks) collected at delivery
- Rentals always start on Monday, end on Sunday

### Booking Flow

1. Customer fills out `BackpackerBookingForm` with dates and personal info
2. Form submits to `POST /api/bookings`
3. API creates `RentalBooking` record with `status: 'pending'`
4. Resend sends notification email to admin (Spanish) and confirmation to customer (their language)
5. Admin reviews in dashboard, updates status via `PATCH /api/admin/bookings/[id]`

### Status Values

- `pending` - New booking awaiting confirmation
- `confirmed` - Booking confirmed
- `cancelled` - Booking cancelled

## Common Tasks

### Adding a new page

1. Create file at `src/app/[route]/page.tsx`
2. For client interactivity, add `'use client'` directive
3. For bilingual, create both `src/app/page.tsx` (Spanish) and `src/app/en/page.tsx` (English)

### Adding a new API endpoint

1. Create `src/app/api/[endpoint]/route.ts`
2. Export `GET`, `POST`, `PATCH`, `DELETE` functions as needed
3. Use `NextRequest`/`NextResponse` from `next/server`

### Adding a new Prisma model

1. Add model to `prisma/schema.prisma`
2. Run `npx prisma db push` (dev) or `npx prisma migrate dev` (prod)
3. Prisma client auto-generates types

### Adding a new Shadcn component

```bash
npx shadcn@latest add [component-name]
```

Components are added to `src/components/ui/`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production (includes Prisma generate + db push) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma studio` | Open Prisma database GUI |

## Code Style

- **Indentation**: 2 spaces
- **Quotes**: Single quotes
- **Semicolons**: Required
- **Trailing commas**: ES5 style
- **Line width**: 100 characters

The project uses Prettier with configuration in `.prettierrc`.

## Security Considerations

- Admin routes protected by middleware session check
- Passwords hashed with bcryptjs
- Rate limiting on auth (10 requests/minute)
- Session expiry: 7 days
- Never commit `.env.local` or expose API keys
- CSRF protection via Better Auth

## Deployment

The app is configured for **Vercel** deployment:

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Vercel auto-runs `npm run build` (which includes Prisma setup)
4. Database: Use Neon PostgreSQL (serverless-compatible)

## Testing

Currently no automated tests are configured. When adding tests:
- Use Vitest or Jest for unit tests
- Use React Testing Library for component tests
- Use Playwright for E2E tests

## Troubleshooting

### Prisma client not found
```bash
npx prisma generate
```

### Database connection errors
- Verify `DATABASE_URL` in `.env.local`
- Ensure Neon database is active (auto-suspends after inactivity)

### Auth not working
- Verify `BETTER_AUTH_SECRET` is set (32+ chars)
- Check `NEXT_PUBLIC_APP_URL` matches your domain
- Clear cookies and try again

### Emails not sending
- Verify `RESEND_API_KEY` is valid
- Check Resend dashboard for delivery status
- Ensure sender domain is verified in Resend
