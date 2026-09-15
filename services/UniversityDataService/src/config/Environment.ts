function requireEnvironmentVariable(
  name: string,
): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `${name} environment variable is required`,
    );
  }

  return value;
}

function parsePort(value: string): number {
  const port = Number(value);

  if (
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65_535
  ) {
    throw new Error(
      `HTTP_PORT must be a valid port, received: ${value}`,
    );
  }

  return port;
}

export const environment = {
  httpHost: requireEnvironmentVariable(
    "HTTP_HOST",
  ),

  httpPort: parsePort(
    requireEnvironmentVariable("HTTP_PORT"),
  ),
} as const;