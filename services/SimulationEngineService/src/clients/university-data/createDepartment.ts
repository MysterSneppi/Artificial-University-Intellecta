import type {
  DepartmentForCreation,
} from "../../models/Department.js";

import type {
  UniversityDataClientContext,
} from "./UniversityDataClientContext.js";

import {
  readCreatedId,
  readErrorResponse,
} from "./UniversityDataResponse.js";

export class DepartmentNameConflictError
  extends Error {
  constructor(departmentName: string) {
    super(
      `Department "${departmentName}" already exists`,
    );

    this.name =
      "DepartmentNameConflictError";
  }
}

export async function createDepartment(
  context: UniversityDataClientContext,
  facultyId: string,
  department: DepartmentForCreation,
): Promise<string> {
  const response = await fetch(
    `${context.baseUrl}/departments`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      signal: AbortSignal.timeout(
        context.timeoutMs,
      ),

      body: JSON.stringify({
        faculty_id: facultyId,
        ...department,
      }),
    },
  );

  if (!response.ok) {
    const error =
      await readErrorResponse(response);

    if (
      response.status === 409 &&
      error.code ===
        "DEPARTMENT_NAME_ALREADY_EXISTS"
    ) {
      throw new DepartmentNameConflictError(
        department.name,
      );
    }

    throw new Error(
      `UniversityDataService department request failed: ` +
        `${response.status} ${error.details}`,
    );
  }

  return readCreatedId(
    response,
    "department",
  );
}