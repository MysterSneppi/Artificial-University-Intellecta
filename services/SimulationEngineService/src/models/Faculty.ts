export interface GeneratedFaculty {
  name: string;
  established_year: number;
  phone_number: string;
  description: string;
  is_active: boolean;
}

export interface FacultyForCreation
  extends GeneratedFaculty {
  contact_email: string;
  website: string;
}