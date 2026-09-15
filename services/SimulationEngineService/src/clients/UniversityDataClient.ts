import type {
  GeneratedUniversity,
} from "../models/University.js";

import type {
  GeneratedCampus,
} from "../models/Campus.js";

export interface UniversityDataClientOptions {
  baseUrl: string;
  timeoutMs?: number;
}

function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

export class UniversityDataClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;

  constructor(
    options: UniversityDataClientOptions,
  ) {
    this.baseUrl = options.baseUrl.replace(
      /\/+$/,
      "",
    );

    this.timeoutMs =
      options.timeoutMs ?? 30_000;
  }

  async healthCheck(): Promise<void> {
    const response = await fetch(
      `${this.baseUrl}/health`,
      {
        signal: AbortSignal.timeout(10_000),
      },
    );

    if (!response.ok) {
      const details = await response.text();

      throw new Error(
        `UniversityDataService health check failed: ` +
          `${response.status} ${details}`,
      );
    }

    const responseData: unknown =
      await response.json();

    if (
      !isObject(responseData) ||
      responseData.status !== "ok" ||
      responseData.database !== "connected"
    ) {
      throw new Error(
        "UniversityDataService returned an invalid health response",
      );
    }
  }

  async createUniversity(
    university: GeneratedUniversity,
  ): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/universities`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        signal: AbortSignal.timeout(
          this.timeoutMs,
        ),

        body: JSON.stringify(university),
      },
    );

    if (!response.ok) {
      const details = await response.text();

      throw new Error(
        `UniversityDataService request failed: ` +
          `${response.status} ${details}`,
      );
    }

    const responseData: unknown =
      await response.json();

    if (
      !isObject(responseData) ||
      typeof responseData.id !== "string" ||
      !/^[a-fA-F0-9]{24}$/.test(
        responseData.id,
      )
    ) {
      throw new Error(
        "UniversityDataService returned an invalid university id",
      );
    }

    typeof responseData.id !== "string"
    return responseData.id;
  }

  async createCampus(
  universityId: string,
  campus: GeneratedCampus,
): Promise<string> {
  const response = await fetch(
    `${this.baseUrl}/campuses`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      signal: AbortSignal.timeout(
        this.timeoutMs,
      ),

      body: JSON.stringify({
        university_id: universityId,
        ...campus,
      }),
    },
  );

  if (!response.ok) {
    const details = await response.text();

    throw new Error(
      `UniversityDataService campus request failed: ` +
        `${response.status} ${details}`,
    );
  }

  const responseData: unknown =
    await response.json();

  if (
    !isObject(responseData) ||
    typeof responseData.id !== "string" ||
    !/^[a-fA-F0-9]{24}$/.test(
      responseData.id,
    )
  ) {
    throw new Error(
      "UniversityDataService returned an invalid campus id",
    );
  }

  return responseData.id;
}
}