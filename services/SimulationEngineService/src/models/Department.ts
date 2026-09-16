export interface GeneratedDepartment {
  name: string;
  phone_number: string;
  office: string;
  research_areas: string[];
  description: string;
  is_active: boolean;
}

export interface DepartmentForCreation
  extends GeneratedDepartment {
  contact_email: string;
}