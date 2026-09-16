import type {
  GeneratedCampus,
} from "../../models/Campus.js";

import type {
  UniversityDataClientContext,
} from "./UniversityDataClientContext.js";

import {
  readCreatedId,
  readErrorResponse,
} from "./UniversityDataResponse.js";

export class CampusNameConflictError
  extends Error {
  constructor(campusName: string) {
    super(
      `Campus "${campusName}" already exists`,
    );

    this.name =
      "CampusNameConflictError";
  }
}

export async function createCampus(
  context: UniversityDataClientContext,
  universityId: string,
  campus: GeneratedCampus,
): Promise<string> {
  const response = await fetch(
    `${context.baseUrl}/campuses`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      signal: AbortSignal.timeout(
        context.timeoutMs,
      ),

      body: JSON.stringify({
        university_id: universityId,
        ...campus,
      }),
    },
  );

  if (!response.ok) {
    const error =
      await readErrorResponse(response);

    if (
      response.status === 409 &&
      error.code ===
        "CAMPUS_NAME_ALREADY_EXISTS"
    ) {
      throw new CampusNameConflictError(
        campus.name,
      );
    }

    throw new Error(
      `UniversityDataService campus request failed: ` +
        `${response.status} ${error.details}`,
    );
  }

  return readCreatedId(
    response,
    "campus",
  );
}