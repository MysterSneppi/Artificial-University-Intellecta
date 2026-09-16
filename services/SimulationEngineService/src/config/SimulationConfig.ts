export interface SimulationConfig {
  campusesPerUniversity: number;
  applicantCount: number;
  maxStudentsPerSpecialty: number;
  maxStudentsPerGroup: number;
  maxLessonsPerDay: number;
  studyDaysPerWeek: 5 | 6;
  semesterWeeks: number;
  facultiesPerCampus: number;
}

export const defaultSimulationConfig:
  SimulationConfig = {
    facultiesPerCampus: 2,
    campusesPerUniversity: 2,
    applicantCount: 1300,
    maxStudentsPerSpecialty: 60,
    maxStudentsPerGroup: 30,
    maxLessonsPerDay: 4,
    studyDaysPerWeek: 5,
    semesterWeeks: 16,
  };