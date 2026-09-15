import "dotenv/config";

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `Environment variable "${name}" is required`,
    );
  }

  return value;
}

export const environment = {
  llamaServerUrl: requireEnvironmentVariable(
    "LLAMA_SERVER_URL",
  ).replace(/\/+$/, ""),

  llamaModel: requireEnvironmentVariable(
    "LLAMA_MODEL",
  ),

  universityDataServiceUrl: requireEnvironmentVariable(
    "UNIVERSITY_DATA_SERVICE_URL",
  ).replace(/\/+$/, ""),
} as const;