import type {
  Db,
  Document,
} from "mongodb";

import {
  migrations,
} from "./migrations/index.js";

import type {
  MigrationRecord,
} from "./Migration.js";

const migrationCollectionName =
  "schema_migrations";

const migrationValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    additionalProperties: false,

    required: [
      "version",
      "name",
      "applied_at",
    ],

    properties: {
      _id: {
        bsonType: "objectId",
      },

      version: {
        bsonType: [
          "int",
          "long",
        ],
        minimum: 1,
      },

      name: {
        bsonType: "string",
        minLength: 1,
      },

      applied_at: {
        bsonType: "date",
      },
    },
  },
};

async function ensureMigrationCollection(
  database: Db,
): Promise<void> {
  const exists = await database
    .listCollections(
      {
        name: migrationCollectionName,
      },
      {
        nameOnly: true,
      },
    )
    .hasNext();

  if (!exists) {
    await database.createCollection(
      migrationCollectionName,
      {
        validator: migrationValidator,

        validationLevel: "strict",

        validationAction: "error",
      },
    );
  }

  await database
    .collection(migrationCollectionName)
    .createIndex(
      {
        version: 1,
      },
      {
        name:
          "uq_schema_migrations_version",

        unique: true,
      },
    );
}

function validateMigrationList(): void {
  const knownVersions = new Set<number>();

  for (const migration of migrations) {
    if (knownVersions.has(migration.version)) {
      throw new Error(
        `Duplicate migration version: ${migration.version}`,
      );
    }

    knownVersions.add(migration.version);
  }
}

export async function runMigrations(
  database: Db,
): Promise<void> {
  validateMigrationList();

  await ensureMigrationCollection(
    database,
  );

  const migrationRecords =
    database.collection<MigrationRecord>(
      migrationCollectionName,
    );

  const appliedMigrations =
    await migrationRecords
      .find(
        {},
        {
          projection: {
            _id: 0,
            version: 1,
          },
        },
      )
      .toArray();

  const appliedVersions = new Set(
    appliedMigrations.map(
      (migration) =>
        migration.version,
    ),
  );

  const orderedMigrations = [
    ...migrations,
  ].sort(
    (firstMigration, secondMigration) =>
      firstMigration.version -
      secondMigration.version,
  );

  for (
    const migration of orderedMigrations
  ) {
    if (
      appliedVersions.has(
        migration.version,
      )
    ) {
      console.log(
        `Migration ${migration.version} "${migration.name}" already applied`,
      );

      continue;
    }

    console.log(
      `Applying migration ${migration.version}: ${migration.name}`,
    );

    await migration.up(database);

    await migrationRecords.insertOne({
      version: migration.version,
      name: migration.name,
      applied_at: new Date(),
    });

    console.log(
      `Migration ${migration.version} completed`,
    );
  }
}