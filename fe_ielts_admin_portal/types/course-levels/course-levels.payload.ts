export interface CreateCourseLevelPayload {
  name: string;
  code: string;
  description: string;
  order: number;
}

export interface UpdateCourseLevelPayload {
  name?: string;
  code?: string;
  description?: string;
  order?: number;
  isActive?: boolean;
}

export interface ReorderLevelItem {
  id: string;
  order: number;
}

export interface ReorderCourseLevelsPayload {
  levels: ReorderLevelItem[];
}
