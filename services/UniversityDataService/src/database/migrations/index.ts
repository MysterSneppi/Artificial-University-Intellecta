import {
  createUniversitiesMigration,
} from "./001-create-universities.js";

import {
  createCampusesMigration,
} from "./002-create-campuses.js";

import {
  createFacultiesMigration,
} from "./003-create-faculties.js";

import {
  createDepartmentsMigration,
} from "./004-create-departments.js";

import {
  createSpecialtiesMigration,
} from "./005-create-specialties.js";

import {
  createTeachersMigration,
} from "./006-create-teachers.js";

import {
  createCoursesMigration,
} from "./007-create-courses.js";

import {
  createGroupsMigration,
} from "./008-create-groups.js";

import {
  createStudentsMigration,
} from "./009-create-students.js";

import type {
  Migration,
} from "../Migration.js";

export const migrations: Migration[] = [
  createUniversitiesMigration,
  createCampusesMigration,
  createFacultiesMigration,
  createDepartmentsMigration,
  createSpecialtiesMigration,
  createTeachersMigration,
  createCoursesMigration,
  createGroupsMigration,
  createStudentsMigration,
];