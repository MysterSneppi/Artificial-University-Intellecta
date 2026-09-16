import type {
  GeneratedUniversity,
} from "../../models/University.js";

import type {
  UniversityDataClientContext,
} from "./UniversityDataClientContext.js";

import {
  readCreatedId,
  readErrorResponse,
} from "./UniversityDataResponse.js";

export class UniversityNameConflictError
  extends Error {
  constructor(universityName: string) {
    super(
      `University "${universityName}" already exists`,
    );

    this.name =
      "UniversityNameConflictError";
  }
}

export async function createUniversity(
  context: UniversityDataClientContext,
  university: GeneratedUniversity,
): Promise<string> {
  const response = await fetch(
    `${context.baseUrl}/universities`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      signal: AbortSignal.timeout(
        context.timeoutMs,
      ),

      body: JSON.stringify(university),
    },
  );

  if (!response.ok) {
    const error =
      await readErrorResponse(response);

    if (
      response.status === 409 &&
      error.code ===
        "UNIVERSITY_NAME_ALREADY_EXISTS"
    ) {
      throw new UniversityNameConflictError(
        university.name,
      );
    }

    throw new Error(
      `UniversityDataService university request failed: ` +
        `${response.status} ${error.details}`,
    );
  }

  return readCreatedId(
    response,
    "university",
  );
}