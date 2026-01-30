'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex-shrink-0">
            <Users className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent truncate">
              Students
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Manage and track student information
            </p>
          </div>
        </div>
      </motion.div>

      <Card>
        <CardContent className="p-4 md:p-6">
          <p className="text-gray-600">Student management content will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
