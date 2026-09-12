import "dotenv/config";

import type {
  MongoClient,
} from "mongodb";

import {
  connectToMongo,
} from "./MongoConnection.js";

import {
  runMigrations,
} from "./runMigrations.js";

let client: MongoClient | undefined;

try {
  const connection =
    await connectToMongo();

  client = connection.client;

  console.log(
    `Connected to MongoDB database "${connection.database.databaseName}"`,
  );

  await runMigrations(
    connection.database,
  );

  console.log(
    "All database migrations completed",
  );
} catch (error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.error(
    `Database migration failed: ${message}`,
  );

  process.exitCode = 1;
} finally {
  if (client) {
    await client.close();
  }
}