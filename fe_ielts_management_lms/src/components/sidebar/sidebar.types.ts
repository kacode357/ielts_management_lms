export interface NavItem {
  title: string
  href: string
  icon: any
  badge?: string | number
  children?: NavItem[]
}

export interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}
