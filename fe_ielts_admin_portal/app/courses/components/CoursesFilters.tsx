import { Search } from 'lucide-react'
import { COURSE_LEVELS, COURSE_STATUSES } from '@/config/constants'

interface CoursesFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedLevel: string
  onLevelChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
}

export function CoursesFilters({
  searchTerm,
  onSearchChange,
  selectedLevel,
  onLevelChange,
  selectedStatus,
  onStatusChange,
}: CoursesFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <select
        value={selectedLevel}
        onChange={(e) => onLevelChange(e.target.value)}
        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Levels</option>
        {COURSE_LEVELS.map((level) => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Status</option>
        {COURSE_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
    </div>
  )
}
