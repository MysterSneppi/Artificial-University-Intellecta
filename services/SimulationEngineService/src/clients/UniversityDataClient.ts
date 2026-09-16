import type {
  FacultyForCreation,
} from "../models/Faculty.js";

import type {
  DepartmentForCreation,
} from "../models/Department.js";

import {
  createDepartment,
} from "./university-data/createDepartment.js";

import type {
  GeneratedCampus,
} from "../models/Campus.js";

import type {
  GeneratedUniversity,
} from "../models/University.js";

import {
  createCampus,
} from "./university-data/createCampus.js";

import {
  createFaculty,
} from "./university-data/createFaculty.js";

import {
  createUniversity,
} from "./university-data/createUniversity.js";

import type {
  UniversityDataClientContext,
} from "./university-data/UniversityDataClientContext.js";

import {
  isObject,
  readErrorResponse,
} from "./university-data/UniversityDataResponse.js";

export interface UniversityDataClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

export class UniversityDataClient {
  private readonly context:
    UniversityDataClientContext;

  constructor(
    options: UniversityDataClientOptions,
  ) {
    this.context = {
      baseUrl: options.baseUrl.replace(
        /\/+$/,
        "",
      ),

      timeoutMs:
        options.timeoutMs ?? 30_000,
    };
  }

  async healthCheck(): Promise<void> {
    const response = await fetch(
      `${this.context.baseUrl}/health`,
      {
        signal: AbortSignal.timeout(
          10_000,
        ),
      },
    );

    if (!response.ok) {
      const error =
        await readErrorResponse(response);

      throw new Error(
        `UniversityDataService health check failed: ` +
          `${response.status} ${error.details}`,
      );
    }

    const responseData: unknown =
      await response.json();

    if (
      !isObject(responseData) ||
      responseData.status !== "ok" ||
      responseData.database !==
        "connected"
    ) {
      throw new Error(
        "UniversityDataService returned an invalid health response",
      );
    }
  }

  createUniversity(
    university: GeneratedUniversity,
  ): Promise<string> {
    return createUniversity(
      this.context,
      university,
    );
  }

  createCampus(
    universityId: string,
    campus: GeneratedCampus,
  ): Promise<string> {
    return createCampus(
      this.context,
      universityId,
      campus,
    );
  }

  createFaculty(
    campusId: string,
    faculty: FacultyForCreation,
  ): Promise<string> {
    return createFaculty(
      this.context,
      campusId,
      faculty,
    );
  }

  createDepartment(
  facultyId: string,
  department: DepartmentForCreation,
): Promise<string> {
  return createDepartment(
    this.context,
    facultyId,
    department,
  );
}

}