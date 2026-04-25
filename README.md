# ClinicallyManic Admin Dashboard

Administrative dashboard for managing the ClinicallyManic platform. This app is built for authenticated admins to manage content, banners, shop products, orders, subscriptions, events, offers, contacts, newsletters/subscribers, dashboard analytics, and profile settings.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Radix UI primitives
- TanStack React Query
- TanStack Table
- NextAuth credentials authentication
- Next.js middleware for admin route protection
- TipTap editor for rich content editing
- Sonner toast notifications
- Recharts dashboard visualizations
- Vercel Analytics
- Next Image optimization

## Key Features

- Admin-only authentication backed by the backend `/auth/login` endpoint.
- Middleware protects `/admin-dashboard` and all nested dashboard routes.
- Dashboard overview with revenue, user-growth, contact, and platform metrics.
- Banner CRUD with image upload support.
- Content CRUD for articles, YouTube, and Spotify content.
- Shop product CRUD with image uploads and product metadata.
- Order management and order status updates.
- Subscription plan management with plan features, price, billing interval, and active state.
- Event and offer management modules.
- Contact message viewing and deletion.
- Subscriber/newsletter management.
- Admin profile and password settings.
- Reusable table, modal, empty-state, pagination, and stat-card components.

## Protected Routes

The dashboard is mounted under `/admin-dashboard`.

- `/admin-dashboard` - dashboard home/overview
- `/admin-dashboard/banner-management` - banner management
- `/admin-dashboard/content-management` - content management
- `/admin-dashboard/shop-management` - shop product management
- `/admin-dashboard/orders-management` - order management
- `/admin-dashboard/subscription-management` - subscription plans
- `/admin-dashboard/events-management` - events
- `/admin-dashboard/offers-management` - offers
- `/admin-dashboard/contact-management` - contact messages
- `/admin-dashboard/subscribers-management` - newsletter subscribers
- `/admin-dashboard/settings` - profile and password settings

Authentication routes:

- `/signin`
- `/verify-email`
- `/forgot-password`
- `/reset-password`

## Project Structure

```text
app/
├── (auth)/                         # Admin signin/recovery pages
├── admin-dashboard/                # Protected dashboard routes
│   ├── banner-management/
│   ├── content-management/
│   ├── contact-management/
│   ├── events-management/
│   ├── offers-management/
│   ├── orders-management/
│   ├── settings/
│   ├── shop-management/
│   ├── subscribers-management/
│   └── subscription-management/
├── api/auth/[...nextauth]/         # NextAuth route handler
├── layout.tsx                      # Root layout and providers
└── providers.tsx                   # React Query + Session providers

components/
├── common/                         # Shared table/modals/empty states
├── editor/                         # TipTap editor
├── layout/                         # Sidebar and topbar
├── overview/                       # Dashboard overview widgets
├── reusable/                       # Reusable dashboard primitives
└── ui/                             # Radix/shadcn-style UI primitives

hooks/                              # Entity-specific React Query hooks
lib/api/                            # Backend API clients
types/                              # Entity and NextAuth types
public/                             # Static assets and placeholders
middleware.ts                       # Admin route protection
```

## Authentication And Authorization

The dashboard uses NextAuth credentials auth.

- Admin login posts credentials to backend `/auth/login`.
- The login callback rejects non-admin users.
- The JWT/session stores `id`, `email`, `role`, `accessToken`, and `profileImage`.
- `middleware.ts` protects `/admin-dashboard` and redirects unauthenticated or non-admin users to `/signin`.
- Admin API requests send `Authorization: Bearer <accessToken>` from the NextAuth session.

Required auth environment variables:

```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3001
```

## Environment Variables

Create `.env.local` in the admin dashboard root.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3001
```

If the admin app runs on the same port as the public frontend, update `NEXTAUTH_URL` accordingly. In production, use the deployed dashboard URL.

## Local Setup

1. Install dependencies.

```bash
npm install
```

2. Add environment variables.

```bash
cp .env.example .env.local
```

If `.env.example` is not present, create `.env.local` from the values above.

3. Start the development server.

```bash
npm run dev
```

4. Open the dashboard.

```text
http://localhost:3000/signin
```

If the public frontend is already using port `3000`, run this dashboard with a different port:

```bash
npm run dev -- -p 3001
```

## Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm start` - run the production build
- `npm run lint` - run Next.js linting

## Admin Best Practices Followed

- Admin routes are protected at middleware level before page rendering.
- NextAuth callback rejects non-admin users early.
- React Query centralizes server-state fetching and mutation cache invalidation.
- Query defaults reduce noisy refetching on focus/reconnect.
- API clients live under `lib/api` so UI components stay focused on presentation.
- Reusable table, modal, pagination, empty-state, and stat components keep CRUD screens consistent.
- Domain folders under `app/admin-dashboard` keep each management module isolated.
- Typed entity definitions live in `types` to make table/detail/modal code safer.
- Next Image remote patterns restrict optimized remote images to approved hosts.
- Toast feedback is used for create/update/delete operations.

## Operational Notes

- The backend must be running and reachable through `NEXT_PUBLIC_API_URL`.
- The backend CORS `CLIENT_URL` must allow the dashboard origin in production.
- Admin users must have role `ADMIN` from the backend.
- Several create/update forms upload files using `FormData`; keep backend file field names aligned with the dashboard components.
- `next.config.mjs` currently ignores TypeScript build errors. This can keep deployments moving, but for stricter production quality it should eventually be removed after all type issues are fixed.

## Production Notes

- Set `NEXT_PUBLIC_API_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in the hosting provider.
- Use a strong, private `NEXTAUTH_SECRET`.
- Run `npm run build` before deployment.
- Deploy behind HTTPS so NextAuth cookies are secure.
- Keep dashboard access restricted to admin accounts only.

## License

Private project.
