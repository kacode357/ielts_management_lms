import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CourseLevelsHeaderProps {
  onAdd: () => void
}

export function CourseLevelsHeader({ onAdd }: CourseLevelsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Levels</h1>
        <p className="text-gray-600 mt-1">Manage course levels for your IELTS curriculum</p>
      </div>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Add Course Level
      </Button>
    </div>
  )
}
