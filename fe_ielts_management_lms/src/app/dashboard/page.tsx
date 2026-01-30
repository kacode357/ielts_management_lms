'use client'

import { motion } from 'framer-motion'
import { BarChart3, Users, BookOpen, Calendar, TrendingUp, Award } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

export default function DashboardPage() {
  const stats = [
    {
      title: 'Total Students',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Active Courses',
      value: '42',
      change: '+5%',
      icon: BookOpen,
      color: 'from-violet-500 to-violet-600',
    },
    {
      title: 'Classes Today',
      value: '8',
      change: '+2',
      icon: Calendar,
      color: 'from-pink-500 to-pink-600',
    },
    {
      title: 'Avg. Score',
      value: '7.5',
      change: '+0.3',
      icon: Award,
      color: 'from-green-500 to-green-600',
    },
  ]

  return (
    <div className="space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Welcome back! Here's what's happening with your IELTS platform.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm text-gray-600 font-medium truncate">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-bold mt-1 md:mt-2">{stat.value}</h3>
                    <p className="text-xs md:text-sm text-green-600 mt-1 md:mt-2 font-medium">
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full bg-gradient-to-br ${stat.color} flex-shrink-0 ml-2`}>
                    <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <TrendingUp className="w-5 h-5 text-violet-600" />
                Recent Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">Reading Module</p>
                    <p className="text-xs md:text-sm text-gray-600">Average Score</p>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-green-600 ml-2">8.0</div>
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">Listening Module</p>
                    <p className="text-xs md:text-sm text-gray-600">Average Score</p>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-blue-600 ml-2">7.5</div>
                </div>
                <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm md:text-base truncate">Writing Module</p>
                    <p className="text-xs md:text-sm text-gray-600">Average Score</p>
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-yellow-600 ml-2">6.5</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-3 md:p-4 text-left bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl">
                  <p className="font-medium text-sm md:text-base">Schedule New Class</p>
                  <p className="text-xs md:text-sm opacity-90">Create a new class session</p>
                </button>
                <button className="w-full p-3 md:p-4 text-left bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl">
                  <p className="font-medium text-sm md:text-base">Add Student</p>
                  <p className="text-xs md:text-sm opacity-90">Register a new student</p>
                </button>
                <button className="w-full p-3 md:p-4 text-left bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                  <p className="font-medium text-sm md:text-base">Create Assessment</p>
                  <p className="text-xs md:text-sm opacity-90">Set up a new test</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
