export interface TeacherDropdown {
  id: string;
  name: string;
  code: string;
  specialization?: string;
}

export interface TeachersDropdownResponse {
  success: boolean;
  data: {
    teachers: TeacherDropdown[];
  };
}
