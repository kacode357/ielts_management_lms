import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  GraduationCap,
  ClipboardList,
  UserCheck,
  FolderOpen,
} from 'lucide-react'
import { NavItem } from './sidebar.types'

export const navigationItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Students',
    href: '/dashboard/students',
    icon: Users,
    badge: '234',
  },
  {
    title: 'Teachers',
    href: '/dashboard/teachers',
    icon: GraduationCap,
    badge: '12',
  },
  {
    title: 'Courses',
    href: '/dashboard/courses',
    icon: BookOpen,
  },
  {
    title: 'Classes',
    href: '/dashboard/classes',
    icon: Calendar,
  },
  {
    title: 'Attendance',
    href: '/dashboard/attendance',
    icon: UserCheck,
  },
  {
    title: 'Assessments',
    href: '/dashboard/assessments',
    icon: ClipboardList,
  },
  {
    title: 'Materials',
    href: '/dashboard/materials',
    icon: FolderOpen,
  },
  {
    title: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]
