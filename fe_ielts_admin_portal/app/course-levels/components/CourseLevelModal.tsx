import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CourseLevel } from '@/types/course-levels'

interface FormData {
  name: string
  code: string
  description: string
  order: number
}

interface CourseLevelModalProps {
  isOpen: boolean
  editingLevel: CourseLevel | null
  formData: FormData
  errors: Record<string, string>
  isLoading: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function CourseLevelModal({
  isOpen,
  editingLevel,
  formData,
  errors,
  isLoading,
  onClose,
  onSubmit,
  onChange,
}: CourseLevelModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingLevel ? 'Edit Course Level' : 'Add Course Level'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="p-6 space-y-4">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="Enter course level name"
              error={errors.name}
            />

            <Input
              label="Code"
              name="code"
              value={formData.code}
              onChange={onChange}
              placeholder="e.g., BEG, INT, ADV"
              error={errors.code}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={onChange}
                placeholder="Enter course level description"
                rows={3}
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <Input
              label="Order"
              name="order"
              type="number"
              value={formData.order}
              onChange={onChange}
              min={1}
            />
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {editingLevel ? 'Save Changes' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
