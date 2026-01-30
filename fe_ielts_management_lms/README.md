# IELTS Management LMS - Frontend

Modern, responsive frontend cho hệ thống quản lý học sinh IELTS.

## 🚀 Tech Stack

- **Framework**: Next.js 15.1.0 (App Router)
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Custom components với Framer Motion
- **Form Management**: React Hook Form 7.54.2
- **HTTP Client**: Axios với global error handling
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📁 Cấu trúc Project

```
src/
├── app/                          # Next.js App Router
│   ├── auth/
│   │   ├── login/page.tsx        # Trang đăng nhập
│   │   └── layout.tsx            # Auth layout
│   ├── dashboard/                # Dashboard (protected)
│   │   ├── layout.tsx            # Layout với sidebar
│   │   ├── page.tsx              # Dashboard homepage
│   │   ├── students/             # Quản lý học sinh
│   │   ├── teachers/             # Quản lý giáo viên
│   │   ├── courses/              # Quản lý khóa học
│   │   └── ...                   # Các module khác
│   ├── globals.css               # Global styles
│   └── layout.tsx                # Root layout
├── components/
│   ├── auth/                     # Auth components
│   ├── sidebar/                  # Sidebar navigation
│   ├── nav/                      # Dashboard header
│   └── ui/                       # Reusable UI components
├── config/
│   └── axios.config.ts           # Axios instance với interceptors
├── hooks/
│   └── auth/                     # Custom auth hooks
├── services/
│   └── auth.service.ts           # API service layer
├── types/
│   ├── api.types.ts              # API response types
│   └── auth/                     # Auth types
└── utils/
    ├── cookie.ts                 # Cookie utilities
    └── cn.ts                     # ClassName merger
```

## 🎨 Features

### Authentication
- Login với email/password
- JWT token stored in cookies
- Protected routes (auto redirect to login)
- Global error handling (401 auto logout)

### Dashboard
- Responsive sidebar (desktop: collapsible, mobile: slide-in)
- 10 navigation items với active states
- Dashboard header với search, notifications, user profile
- Stats cards với animations
- Role-based access control

### UI/UX
- Modern gradient design (violet-pink theme)
- Smooth animations với Framer Motion
- Toast notifications cho user feedback
- Loading states cho tất cả operations
- Mobile-first responsive design

## 🛠️ Cài đặt

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

App sẽ chạy tại: `http://localhost:3000`

## 🔧 Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 📊 Luồng hoạt động

### 1. User Login
- Nhập email/password tại `/auth/login`
- Call API `/api/auth/login`
- Nhận token + user data
- Store token in httpOnly cookie
- Redirect to `/dashboard`

### 2. Protected Routes
- Middleware check token in cookie
- Nếu không có token → redirect to `/auth/login`
- Nếu có token → render dashboard

### 3. API Calls
- Tất cả request tự động thêm `Authorization: Bearer <token>`
- Global error interceptor:
  - 401: Clear auth, redirect to login
  - 400, 403, 404, 422, 500: Show toast error
  - Success: Return data directly

### 4. Sidebar Navigation
- Desktop: Sidebar luôn hiện, có thể collapse (280px ⟷ 80px)
- Mobile: Sidebar ẩn, show khi click menu button
- Active state: Highlight route hiện tại
- 10 menu items: Dashboard, Students, Teachers, Courses, Classes, Attendance, Assessments, Materials, Reports, Settings

## 🎯 API Integration

### Standard Response Format

**Success:**
```typescript
{
  success: true,
  data: { ... }
}
```

**Error:**
```typescript
{
  success: false,
  message: "Error message",
  errors: [
    { field: "email", message: "Email is required" }
  ]
}
```

### Auth Service Example

```typescript
// services/auth.service.ts
export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<ApiSuccessResponse<LoginData>>(
      "/auth/login",
      { email, password }
    );
    
    // Store token in cookie
    cookieUtils.setToken(response.data.data.token);
    
    return response.data.data;
  }
};
```

### Hook Example

```typescript
// hooks/auth/useLogin.ts
export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await authService.login(email, password);
      toast.success("Login successful!");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };
  
  return { login, isLoading };
};
```

## 🔐 Authentication Flow

```
┌─────────────┐
│ Login Page  │
└──────┬──────┘
       │ POST /api/auth/login
       ↓
┌─────────────────┐
│  Auth Service   │
│  - Call API     │
│  - Store token  │
└──────┬──────────┘
       │ Success
       ↓
┌─────────────────┐
│   Dashboard     │
│  - Sidebar      │
│  - Header       │
│  - Content      │
└─────────────────┘
```

## 🌟 Component Usage

### Button Component
```typescript
<Button variant="primary" size="lg" onClick={handleClick}>
  Click me
</Button>
```

### Input Component
```typescript
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register("email")}
/>
```

### Card Component
```typescript
<Card>
  <Card.Header>Title</Card.Header>
  <Card.Body>Content</Card.Body>
</Card>
```

## 📱 Responsive Breakpoints

```css
mobile: < 768px
tablet: 768px - 1024px
desktop: > 1024px
```

## 🎨 Theme Colors

```css
Primary: violet-600 → pink-600 (gradient)
Background: gray-50
Card: white
Text: gray-900
Muted: gray-500
Border: gray-200
```

## 👥 Role-Based Pages

- **Admin**: Full access to all pages
- **Teacher**: Access to classes, students, assignments, materials
- **Student**: Access to own courses, assignments, submissions

## 🚧 Coming Soon

- [ ] Course management CRUD
- [ ] Schedule calendar view
- [ ] Assignment creation & grading
- [ ] File upload for materials & submissions
- [ ] Student enrollment management
- [ ] Attendance marking interface
- [ ] Dashboard statistics & charts
- [ ] Report generation

## 📄 License

ISC

## 🎨 Design System

### Color Palette
- **Primary**: Violet (#7C3AED)
- **Accent**: Pink (#EC4899)
- **Background**: Zinc-50 (#FAFAFA)
- **Success**: Green (#22C55E)
- **Error**: Red (#EF4444)

### Font
- **Inter** - Optimized for English content and modern UI

## 🚀 Features

- ✨ Smooth animations with Framer Motion
- 🎨 Modern SaaS design with Tailwind CSS
- 📱 Fully responsive layout
- 🔐 Authentication pages (Login/Register)
- 📊 Dashboard with statistics
- 🎯 TypeScript for type safety
- 🔥 Hot reload with Next.js

## 📦 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Hook Form** - Form handling
- **Axios** - API calls
- **Zustand** - State management
- **Lucide React** - Icons

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌐 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
fe_ielts_management_lms/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Animations.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Loading.tsx
│   │   ├── auth/
│   │   └── dashboard/
│   ├── services/
│   │   ├── api.ts
│   │   └── auth.service.ts
│   ├── hooks/
│   └── utils/
├── public/
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## 🎯 Available Routes

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/dashboard` - Main dashboard
- `/dashboard/courses` - Courses management
- `/dashboard/students` - Students management
- `/dashboard/teachers` - Teachers management
- `/dashboard/classes` - Classes management
- `/dashboard/materials` - Materials management

## 🎨 Component Examples

### Button
```tsx
<Button variant="primary" isLoading={false}>
  Click me
</Button>
```

### Card
```tsx
<Card hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Animations
```tsx
<FadeIn delay={0.2}>
  <YourComponent />
</FadeIn>
```

## 🔧 Development

The project uses:
- **ESLint** for code linting
- **TypeScript** for type checking
- **Tailwind CSS** for styling with custom design system

## 📝 License

MIT
