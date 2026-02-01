export interface CourseLevelDropdown {
  _id: string;
  name: string;
  code: string;
}

export interface CourseLevelsDropdownResponse {
  success: boolean;
  data: CourseLevelDropdown[];
}
