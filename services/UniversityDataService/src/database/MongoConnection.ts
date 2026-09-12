import {
  MongoClient,
  type Db,
} from "mongodb";

export interface MongoConnection {
  client: MongoClient;
  database: Db;
}

export async function connectToMongo():
  Promise<MongoConnection> {
  const uri = process.env.MONGODB_URI;
  const databaseName =
    process.env.MONGODB_DATABASE;

  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is required",
    );
  }

  if (!databaseName) {
    throw new Error(
      "MONGODB_DATABASE environment variable is required",
    );
  }

  const client = new MongoClient(uri);

  await client.connect();

  await client
    .db("admin")
    .command({
      ping: 1,
    });

  return {
    client,
    database: client.db(databaseName),
  };
}