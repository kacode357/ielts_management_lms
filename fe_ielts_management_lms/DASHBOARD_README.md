# Dashboard Layout Documentation

## Overview
Dashboard với sidebar navigation đã được tạo hoàn chỉnh. Sau khi login thành công, người dùng sẽ được chuyển hướng đến trang dashboard với giao diện sidebar bên trái.

## Cấu trúc thư mục

```
src/
├── app/
│   └── dashboard/
│       ├── layout.tsx          # Dashboard layout chính với sidebar
│       ├── page.tsx            # Trang dashboard chính
│       ├── students/
│       │   └── page.tsx        # Trang quản lý học viên
│       ├── teachers/
│       │   └── page.tsx        # Trang quản lý giáo viên
│       └── courses/
│           └── page.tsx        # Trang quản lý khóa học
├── components/
│   ├── sidebar/
│   │   ├── Sidebar.tsx         # Component sidebar chính
│   │   ├── navigation.config.ts # Cấu hình menu navigation
│   │   ├── sidebar.types.ts    # TypeScript types
│   │   └── index.ts
│   └── nav/
│       ├── DashboardHeader.tsx # Header với search và notifications
│       └── index.ts
└── utils/
    └── cn.ts                   # Utility function cho className merge
```

## Tính năng

### Sidebar
- ✅ **Responsive Design**: Tự động thu gọn trên mobile, có overlay
- ✅ **Collapsible**: Có thể thu gọn sidebar trên desktop
- ✅ **Navigation Menu**: 10 menu items với icons từ lucide-react
- ✅ **Active State**: Highlight menu item đang active
- ✅ **Badge Support**: Hiển thị số lượng (students: 234, teachers: 12)
- ✅ **Logout Function**: Tích hợp logout hook
- ✅ **Smooth Animations**: Sử dụng framer-motion cho transitions

### Dashboard Header
- ✅ **Search Bar**: Tìm kiếm students, courses, classes
- ✅ **Notifications**: Nút thông báo với indicator
- ✅ **User Profile**: Hiển thị thông tin user

### Dashboard Layout
- ✅ **Sticky Sidebar**: Sidebar cố định bên trái
- ✅ **Sticky Header**: Header cố định phía trên
- ✅ **Scrollable Content**: Content area có thể scroll

## Menu Navigation

1. **Dashboard** - `/dashboard` - Tổng quan hệ thống
2. **Students** - `/dashboard/students` - Quản lý học viên (234)
3. **Teachers** - `/dashboard/teachers` - Quản lý giáo viên (12)
4. **Courses** - `/dashboard/courses` - Quản lý khóa học
5. **Classes** - `/dashboard/classes` - Quản lý lớp học
6. **Attendance** - `/dashboard/attendance` - Điểm danh
7. **Assessments** - `/dashboard/assessments` - Đánh giá & Kiểm tra
8. **Materials** - `/dashboard/materials` - Tài liệu học tập
9. **Reports** - `/dashboard/reports` - Báo cáo & Thống kê
10. **Settings** - `/dashboard/settings` - Cài đặt hệ thống

## Thư viện sử dụng

- **framer-motion**: Animations và transitions
- **lucide-react**: Icon library (đã có sẵn)
- **clsx + tailwind-merge**: Utility cho className management
- **Tailwind CSS**: Styling framework

## Login Flow

1. User login tại `/auth/login`
2. `useLogin` hook xử lý authentication
3. Sau khi login thành công → redirect đến `/dashboard`
4. Dashboard layout tự động load với sidebar và header

## Responsive Behavior

### Desktop (lg+)
- Sidebar luôn hiển thị bên trái
- Có thể toggle collapse/expand
- Width: 280px (expanded) / 80px (collapsed)

### Mobile (< lg)
- Sidebar ẩn mặc định
- Hiển thị menu button ở góc trên bên trái
- Sidebar slide in từ bên trái khi click
- Có overlay backdrop

## Customization

### Thêm menu item mới
Chỉnh sửa file `src/components/sidebar/navigation.config.ts`:

```typescript
{
  title: 'New Page',
  href: '/dashboard/new-page',
  icon: IconComponent,
  badge: '10', // optional
}
```

### Thay đổi colors
Colors sử dụng Tailwind gradient từ violet đến pink. Có thể tùy chỉnh trong:
- `Sidebar.tsx` - Logo và active states
- `DashboardHeader.tsx` - Header elements
- `page.tsx` - Dashboard content

## Next Steps

Các trang còn lại cần implement:
- [ ] Classes page
- [ ] Attendance page  
- [ ] Assessments page
- [ ] Materials page
- [ ] Reports page
- [ ] Settings page
