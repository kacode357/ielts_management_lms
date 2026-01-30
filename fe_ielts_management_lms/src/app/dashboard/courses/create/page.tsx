"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Plus, X } from "lucide-react";
import { useCreateCourse, useGetStudents, useGetTeachers, useEnrollStudents } from "@/hooks/course/useCourse";
import { CreateCoursePayload } from "@/services/course.service";
import toast from "react-hot-toast";

export default function CreateCoursePage() {
  const router = useRouter();
  const { createCourse, isLoading } = useCreateCourse();
  const { fetchStudents, students } = useGetStudents();
  const { fetchTeachers, teachers } = useGetTeachers();
  const { enrollStudents } = useEnrollStudents();

  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const [showTeacherSelector, setShowTeacherSelector] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCoursePayload>();

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
  }, []);

  const onSubmit = async (data: CreateCoursePayload) => {
    try {
      const course = await createCourse(data);
      
      // Enroll selected students
      if (selectedStudents.length > 0 && course._id) {
        await enrollStudents(course._id, selectedStudents);
      }

      toast.success("Course created successfully!");
      router.push("/dashboard/courses");
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleTeacher = (teacherId: string) => {
    setSelectedTeachers((prev) =>
      prev.includes(teacherId)
        ? prev.filter((id) => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const getSelectedStudentNames = () => {
    return students
      .filter((s) => selectedStudents.includes(s._id))
      .map((s) => `${s.userId?.firstName} ${s.userId?.lastName}`)
      .join(", ");
  };

  const getSelectedTeacherNames = () => {
    return teachers
      .filter((t) => selectedTeachers.includes(t._id))
      .map((t) => `${t.userId?.firstName} ${t.userId?.lastName}`)
      .join(", ");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-500 mt-1">Set up a new IELTS course</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course Name"
                placeholder="e.g., IELTS Foundation"
                error={errors.name?.message}
                {...register("name", { required: "Course name is required" })}
              />
              <Input
                label="Course Code"
                placeholder="e.g., IELTS-101"
                error={errors.code?.message}
                {...register("code", { required: "Course code is required" })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                rows={3}
                placeholder="Course description..."
                {...register("description")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Level
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  {...register("level", { required: "Level is required" })}
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner (4.0-5.0)</option>
                  <option value="intermediate">Intermediate (5.5-6.5)</option>
                  <option value="advanced">Advanced (7.0-8.5)</option>
                </select>
                {errors.level && (
                  <p className="text-red-500 text-sm mt-1">{errors.level.message}</p>
                )}
              </div>

              <Input
                label="Duration (weeks)"
                type="number"
                placeholder="e.g., 12"
                error={errors.duration?.message}
                {...register("duration", { 
                  required: "Duration is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Duration must be at least 1 week" }
                })}
              />

              <Input
                label="Total Hours (optional)"
                type="number"
                placeholder="e.g., 120"
                error={errors.totalHours?.message}
                {...register("totalHours", { valueAsNumber: true })}
              />
            </div>

            <Input
              label="Max Students (optional)"
              type="number"
              placeholder="e.g., 30"
              error={errors.maxStudents?.message}
              {...register("maxStudents", { valueAsNumber: true })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Syllabus (optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                rows={3}
                placeholder="Course syllabus details..."
                {...register("syllabus")}
              />
            </div>
          </div>
        </Card>

        {/* Students Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Enroll Students
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowStudentSelector(!showStudentSelector)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Students
            </Button>
          </div>

          {selectedStudents.length > 0 && (
            <div className="mb-4 p-3 bg-violet-50 rounded-lg">
              <p className="text-sm font-medium text-violet-900">
                Selected: {selectedStudents.length} student(s)
              </p>
              <p className="text-sm text-violet-700 mt-1">
                {getSelectedStudentNames()}
              </p>
            </div>
          )}

          {showStudentSelector && (
            <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              {students.map((student) => (
                <label
                  key={student._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => toggleStudent(student._id)}
                    className="w-4 h-4 text-violet-600 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {student.userId?.firstName} {student.userId?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {student.studentCode} • {student.currentLevel}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </Card>

        {/* Teachers Selection */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Teachers (Coming Soon)
            </h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowTeacherSelector(!showTeacherSelector)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Teachers
            </Button>
          </div>

          {selectedTeachers.length > 0 && (
            <div className="mb-4 p-3 bg-violet-50 rounded-lg">
              <p className="text-sm font-medium text-violet-900">
                Selected: {selectedTeachers.length} teacher(s)
              </p>
              <p className="text-sm text-violet-700 mt-1">
                {getSelectedTeacherNames()}
              </p>
            </div>
          )}

          {showTeacherSelector && (
            <div className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
              {teachers.map((teacher) => (
                <label
                  key={teacher._id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(teacher._id)}
                    onChange={() => toggleTeacher(teacher._id)}
                    className="w-4 h-4 text-violet-600 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {teacher.userId?.firstName} {teacher.userId?.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {teacher.teacherCode} • {teacher.specialization}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Creating..." : "Create Course"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
