# purebullion Dashboard Starter

A clean, production-ready Next.js Dashboard Boilerplate configured with **Header**, **Sidebar**, **NextAuth**, and **Tailwind CSS**, designed following the layout and architecture of `product-supplier-dashboard`.

---

## 🚀 Features

- **Next.js 16 (App Router)** & React 19
- **Tailwind CSS v4** & Modern Shadcn/Radix UI component primitives
- **Header & Sidebar Layout**:
  - Desktop responsive sidebar with active route highlighting
  - Mobile slide-out drawer with hamburger toggle
  - Top header with dynamic route-based title & subtitle, search bar, and user profile pill
  - Logout modal with confirmation dialog powered by `next-auth`
- **NextAuth.js v4 Setup**:
  - Credentials Provider configured in `src/lib/auth.ts`
  - Route handler in `src/app/api/auth/[...nextauth]/route.ts`
  - Session & Token typing in `src/types/next-auth.d.ts`
  - Route protection via `src/middleware.ts`
  - Pre-built `/login` page
  - Seamless fallback demo mode for testing immediately without an active backend
- **Zustand State Store**:
  - `src/store/ui.store.ts` for managing sidebar collapse and mobile drawer toggles
- **TanStack React Query & Sonner Toast Notifications** in `src/Providers/MainProviders.tsx`

---

## 📁 Project Structure

```
jsb-dashboard/
├── public/                 # Static assets (logo, icons)
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/      # Sign-in page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx  # Shared dashboard layout (Header + Sidebar)
│   │   │   ├── page.tsx    # Dashboard root
│   │   │   └── dashboard/  # Dashboard home view
│   │   ├── api/auth/       # NextAuth API route
│   │   ├── globals.css     # Tailwind v4 theme & CSS variables
│   │   ├── layout.tsx      # Root layout with Query & Session providers
│   │   └── page.tsx        # Redirects to /dashboard
│   ├── components/
│   │   ├── shared/
│   │   │   ├── DashboardHeader.tsx # Top Navbar
│   │   │   ├── Sidebar.tsx         # Sidebar Navigation
│   │   │   └── index.ts
│   │   └── ui/             # Reusable UI primitives (Button, Dialog, Card, Input, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/
│   │   ├── auth.ts         # NextAuth options & backend credentials logic
│   │   └── utils.ts        # cn helper (clsx + tailwind-merge)
│   ├── Providers/          # SessionProvider, QueryClientProvider, Toaster
│   ├── store/              # Zustand ui.store.ts
│   └── types/              # TypeScript declarations
├── .env                    # Environment variables
├── middleware.ts           # Route guard
├── package.json
└── tsconfig.json
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
Inside the project directory, run:

```bash
pnpm install
# or
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` if not already present:

```env
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8080/api/v1
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

### 3. Run Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧩 Customization Guide

### Adding New Sidebar Links
Open `src/components/shared/Sidebar.tsx` and edit the `sidebarNavigation` array:

```tsx
export const sidebarNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "My Feature", href: "/my-feature", icon: MyIcon },
  // ...
];
```

### Adding New Dashboard Pages
Create folder and `page.tsx` inside `src/app/(dashboard)/`:

```
src/app/(dashboard)/my-feature/page.tsx
```

Any page created here automatically inherits the `DashboardHeader` and `Sidebar` layout!
