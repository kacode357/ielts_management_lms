import { Edit2, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { CourseLevel } from '@/types/course-levels'

interface CourseLevelsTableProps {
  courseLevels: CourseLevel[]
  isLoading: boolean
  isReordering: boolean
  onEdit: (level: CourseLevel) => void
  onDelete: (id: string) => void
  onMove: (index: number, direction: 'up' | 'down') => void
}

export function CourseLevelsTable({
  courseLevels,
  isLoading,
  isReordering,
  onEdit,
  onDelete,
  onMove,
}: CourseLevelsTableProps) {
  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </Card>
    )
  }

  if (courseLevels.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <p className="text-gray-500">No course levels found. Create your first one!</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Order</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Code</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Description</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courseLevels.map((level, index) => (
              <tr key={level._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1">
                    <span className="w-8 text-center font-medium text-gray-900">
                      {level.order}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => onMove(index, 'up')}
                        disabled={index === 0 || isReordering}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowUp className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onMove(index, 'down')}
                        disabled={index === courseLevels.length - 1 || isReordering}
                        className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ArrowDown className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-900">{level.name}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600 font-mono text-sm">{level.code}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="text-gray-600 text-sm truncate max-w-xs block">
                    {level.description || '-'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      level.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {level.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(level)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => onDelete(level._id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
