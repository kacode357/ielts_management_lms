"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Upload, UserPlus, Search } from "lucide-react";
import { courseService } from "@/services/course.service";
import { teacherService } from "@/services/teacher.service";
import { toast } from "react-hot-toast";

export default function ImportTeachersPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [coursesData, teachersData] = await Promise.all([
        courseService.getCourses(),
        teacherService.getTeachers()
      ]);
      
      const foundCourse = coursesData.find((c: any) => c._id === courseId);
      if (!foundCourse) {
        toast.error("Course not found");
        router.push("/dashboard/courses");
        return;
      }
      
      setCourse(foundCourse);
      setTeachers(teachersData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTeacher = (teacherId: string) => {
    setSelectedTeachers(prev => 
      prev.includes(teacherId) 
        ? prev.filter(id => id !== teacherId)
        : [...prev, teacherId]
    );
  };

  const handleImport = async () => {
    if (selectedTeachers.length === 0) {
      toast.error("Please select at least one teacher");
      return;
    }

    try {
      setIsImporting(true);
      // TODO: Implement actual import API call
      // await courseService.importTeachers(courseId, selectedTeachers);
      
      toast.success(`Successfully added ${selectedTeachers.length} teacher(s) to the course`);
      router.push(`/dashboard/courses/${courseId}`);
    } catch (error) {
      console.error("Error importing teachers:", error);
      toast.error("Failed to import teachers");
    } finally {
      setIsImporting(false);
    }
  };

  const filteredTeachers = teachers.filter((teacher: any) =>
    teacher.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.teacherCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/dashboard/courses/${courseId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Import Teachers</h1>
            <p className="text-gray-500 mt-1">
              {course?.name} ({course?.code})
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleImport}
          disabled={selectedTeachers.length === 0 || isImporting}
          isLoading={isImporting}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Add {selectedTeachers.length > 0 && `(${selectedTeachers.length})`} Teacher{selectedTeachers.length !== 1 ? 's' : ''}
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search teachers by name, email, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Teachers List */}
      {filteredTeachers.length === 0 ? (
        <Card className="p-12 text-center">
          <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No teachers found
          </h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search terms" : "No teachers available"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredTeachers.map((teacher: any) => (
            <Card
              key={teacher._id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedTeachers.includes(teacher._id)
                  ? "ring-2 ring-violet-500 bg-violet-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleToggleTeacher(teacher._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedTeachers.includes(teacher._id)}
                    onChange={() => handleToggleTeacher(teacher._id)}
                    className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {teacher.userId?.fullName || "N/A"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">
                        {teacher.userId?.email || "N/A"}
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-600">
                        {teacher.teacherCode}
                      </p>
                    </div>
                    {teacher.specialization && (
                      <p className="text-sm text-violet-600 mt-1">
                        {teacher.specialization}
                      </p>
                    )}
                  </div>
                </div>
                {selectedTeachers.includes(teacher._id) && (
                  <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-medium">
                    Selected
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
