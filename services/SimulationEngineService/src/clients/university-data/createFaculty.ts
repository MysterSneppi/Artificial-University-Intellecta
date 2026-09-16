import type {
  FacultyForCreation,
} from "../../models/Faculty.js";

import type {
  UniversityDataClientContext,
} from "./UniversityDataClientContext.js";

import {
  readCreatedId,
  readErrorResponse,
} from "./UniversityDataResponse.js";

export class FacultyNameConflictError
  extends Error {
  constructor(facultyName: string) {
    super(
      `Faculty "${facultyName}" already exists`,
    );

    this.name =
      "FacultyNameConflictError";
  }
}

export class FacultyEmailConflictError
  extends Error {
  constructor(email: string) {
    super(
      `Faculty email "${email}" already exists`,
    );

    this.name =
      "FacultyEmailConflictError";
  }
}

export async function createFaculty(
  context: UniversityDataClientContext,
  campusId: string,
  faculty: FacultyForCreation,
): Promise<string> {
  const response = await fetch(
    `${context.baseUrl}/faculties`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      signal: AbortSignal.timeout(
        context.timeoutMs,
      ),

      body: JSON.stringify({
        campus_id: campusId,
        ...faculty,
      }),
    },
  );

  if (!response.ok) {
    const error =
      await readErrorResponse(response);

    if (
      response.status === 409 &&
      error.code ===
        "FACULTY_NAME_ALREADY_EXISTS"
    ) {
      throw new FacultyNameConflictError(
        faculty.name,
      );
    }

    if (
      response.status === 409 &&
      error.code ===
        "FACULTY_EMAIL_ALREADY_EXISTS"
    ) {
      throw new FacultyEmailConflictError(
        faculty.contact_email,
      );
    }

    throw new Error(
      `UniversityDataService faculty request failed: ` +
        `${response.status} ${error.details}`,
    );
  }

  return readCreatedId(
    response,
    "faculty",
  );
}