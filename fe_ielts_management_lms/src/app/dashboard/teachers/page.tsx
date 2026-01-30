'use client'

import { motion } from 'framer-motion'
import { GraduationCap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-violet-500 to-violet-600 rounded-lg flex-shrink-0">
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-violet-800 bg-clip-text text-transparent truncate">
              Teachers
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage teaching staff and assignments
            </p>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <p className="text-gray-600">Teacher management content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
