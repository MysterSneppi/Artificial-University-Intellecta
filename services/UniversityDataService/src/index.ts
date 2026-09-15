import "dotenv/config";

import {
  environment,
} from "./config/Environment.js";

import {
  connectToMongo,
} from "./database/MongoConnection.js";

import {
  createServer,
} from "./http/createServer.js";

async function main(): Promise<void> {
  const mongoConnection =
    await connectToMongo();

  const server = createServer(
    mongoConnection.database,
  );

  let isShuttingDown = false;

  async function shutdown(
    signal: string,
  ): Promise<void> {
    if (isShuttingDown) {
      return;
    }

    isShuttingDown = true;

    server.log.info(
      {
        signal,
      },
      "Shutting down UniversityDataService",
    );

    await server.close();
    await mongoConnection.client.close();
  }

  process.once("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.once("SIGTERM", () => {
    void shutdown("SIGTERM");
  });

  try {
    await server.listen({
      host: environment.httpHost,
      port: environment.httpPort,
    });
  } catch (error: unknown) {
    await mongoConnection.client.close();

    throw error;
  }
}

main().catch((error: unknown) => {
  console.error(
    "UniversityDataService failed to start:",
    error,
  );

  process.exitCode = 1;
});