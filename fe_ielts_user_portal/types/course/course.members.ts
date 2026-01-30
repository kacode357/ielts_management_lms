export interface CourseInfo {
  _id: string;
  name: string;
  code: string;
  level: string;
}

export interface TeacherUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface TeacherMember {
  _id: string;
  teacherCode: string;
  specialization: string;
  user: TeacherUser;
}

export interface StudentUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface StudentInfo {
  _id: string;
  studentCode: string;
  currentLevel: string;
  targetBand: number;
  user: StudentUser;
}

export interface StudentMember {
  enrollmentId: string;
  enrolledAt: string;
  student: StudentInfo;
}

export interface MembersPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface GetMembersPayload {
  page?: number;
  limit?: number;
}

export interface GetMembersResponse {
  success: boolean;
  data: {
    course: CourseInfo;
    teacher: TeacherMember;
    students: StudentMember[];
    pagination: MembersPagination;
  };
}
