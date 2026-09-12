export interface SimulationConfig {
  applicantCount: number;

  maxStudentsPerSpecialty: number;

  maxStudentsPerGroup: number;

  maxLessonsPerDay: number;

  studyDaysPerWeek: 5 | 6;

  semesterWeeks: number;
}

export const defaultSimulationConfig: SimulationConfig = {
  applicantCount: 1300,
  maxStudentsPerSpecialty: 60,
  maxStudentsPerGroup: 30,
  maxLessonsPerDay: 4,
  studyDaysPerWeek: 5,
  semesterWeeks: 16,
};