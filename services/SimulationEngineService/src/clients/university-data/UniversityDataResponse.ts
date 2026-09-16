export interface ErrorResponseDetails {
  details: string;
  code: string | undefined;
}

export function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null
  );
}

export async function readErrorResponse(
  response: Response,
): Promise<ErrorResponseDetails> {
  const details = await response.text();

  let code: string | undefined;

  try {
    const errorData: unknown =
      JSON.parse(details);

    if (
      isObject(errorData) &&
      typeof errorData.code === "string"
    ) {
      code = errorData.code;
    }
  } catch {
    // Ошибка сервиса может быть не JSON.
  }

  return {
    details,
    code,
  };
}

export async function readCreatedId(
  response: Response,
  entityName: string,
): Promise<string> {
  let responseData: unknown;

  try {
    responseData =
      await response.json();
  } catch (error: unknown) {
    throw new Error(
      `UniversityDataService returned invalid JSON ` +
        `after creating ${entityName}`,
      {
        cause: error,
      },
    );
  }

  if (
    !isObject(responseData) ||
    typeof responseData.id !== "string" ||
    !/^[a-fA-F0-9]{24}$/.test(
      responseData.id,
    )
  ) {
    throw new Error(
      `UniversityDataService returned an invalid ` +
        `${entityName} id`,
    );
  }

  return responseData.id;
}