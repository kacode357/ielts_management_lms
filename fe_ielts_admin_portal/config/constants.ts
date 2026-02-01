// Course levels constants - can be fetched from API
export const COURSE_LEVELS = [
  'Foundation',
  'Pre-Intermediate',
  'Intermediate',
  'Upper-Intermediate',
  'Advanced',
  'IELTS 5.5',
  'IELTS 6.5',
  'IELTS 7.0+',
] as const

export type CourseLevel = typeof COURSE_LEVELS[number]

// Course status constants
export const COURSE_STATUSES = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const

export type CourseStatus = typeof COURSE_STATUSES[number]['value']
