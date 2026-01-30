"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Upload, UserPlus, Search } from "lucide-react";
import { courseService } from "@/services/course.service";
import { studentService } from "@/services/student.service";
import { toast } from "react-hot-toast";

export default function ImportStudentsPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [coursesData, studentsData] = await Promise.all([
        courseService.getCourses(),
        studentService.getStudents()
      ]);
      
      const foundCourse = coursesData.find((c: any) => c._id === courseId);
      if (!foundCourse) {
        toast.error("Course not found");
        router.push("/dashboard/courses");
        return;
      }
      
      setCourse(foundCourse);
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStudent = (studentId: string) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleImport = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    try {
      setIsImporting(true);
      // TODO: Implement actual import API call
      // await courseService.importStudents(courseId, selectedStudents);
      
      toast.success(`Successfully enrolled ${selectedStudents.length} student(s) in the course`);
      router.push(`/dashboard/courses/${courseId}`);
    } catch (error) {
      console.error("Error importing students:", error);
      toast.error("Failed to import students");
    } finally {
      setIsImporting(false);
    }
  };

  const filteredStudents = students.filter((student: any) =>
    student.userId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentCode?.toLowerCase().includes(searchTerm.toLowerCase())
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
            <h1 className="text-3xl font-bold text-gray-900">Import Students</h1>
            <p className="text-gray-500 mt-1">
              {course?.name} ({course?.code})
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleImport}
          disabled={selectedStudents.length === 0 || isImporting}
          isLoading={isImporting}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          Enroll {selectedStudents.length > 0 && `(${selectedStudents.length})`} Student{selectedStudents.length !== 1 ? 's' : ''}
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Search students by name, email, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card className="p-12 text-center">
          <Upload className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No students found
          </h3>
          <p className="text-gray-500">
            {searchTerm ? "Try adjusting your search terms" : "No students available"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredStudents.map((student: any) => (
            <Card
              key={student._id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedStudents.includes(student._id)
                  ? "ring-2 ring-violet-500 bg-violet-50"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => handleToggleStudent(student._id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => handleToggleStudent(student._id)}
                    className="w-5 h-5 text-violet-600 rounded focus:ring-violet-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {student.userId?.fullName || "N/A"}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-sm text-gray-600">
                        {student.userId?.email || "N/A"}
                      </p>
                      <span className="text-gray-300">•</span>
                      <p className="text-sm text-gray-600">
                        {student.studentCode}
                      </p>
                    </div>
                    {student.targetBand && (
                      <p className="text-sm text-violet-600 mt-1">
                        Target Band: {student.targetBand}
                      </p>
                    )}
                  </div>
                </div>
                {selectedStudents.includes(student._id) && (
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
