# IELTS Admin Portal

Admin portal cho hệ thống quản lý IELTS LMS.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios
- **Form**: React Hook Form
- **Notifications**: React Hot Toast

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Run development server

```bash
npm run dev
```

Server sẽ chạy tại [http://localhost:3000](http://localhost:3000)

## Project Structure

```
fe_ielts_admin_portal/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles
│   └── login/             # Login page
├── components/            # Reusable components
│   └── ui/               # UI components (Button, Input, Card, etc.)
├── config/               # Configuration files
│   └── axios.config.ts   # Axios instance config
├── hooks/                # Custom React hooks
│   └── useAuth.ts       # Authentication hook
├── services/            # API services
│   ├── api.ts          # Base API instance
│   └── auth/           # Auth service
├── types/              # TypeScript types
│   └── auth/          # Auth types
└── utils/             # Utility functions
    └── cookie.ts     # Cookie utilities
```

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
