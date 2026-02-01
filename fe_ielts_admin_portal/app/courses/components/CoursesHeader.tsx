import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CoursesHeaderProps {
  onAdd: () => void
}

export function CoursesHeader({ onAdd }: CoursesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <p className="text-gray-600 mt-1">Manage courses for your IELTS curriculum</p>
      </div>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Course
      </Button>
    </div>
  )
}
