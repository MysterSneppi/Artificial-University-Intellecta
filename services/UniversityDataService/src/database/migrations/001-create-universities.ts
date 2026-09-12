import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const universitiesValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "name",
      "address",
      "established_year",
      "is_active",
    ],

    properties: {
      name: {
        bsonType: "string",
      },

      address: {
        bsonType: "string",
      },

      established_year: {
        bsonType: "int",
      },

      contact_email: {
        bsonType: "string",
      },

      phone_number: {
        bsonType: "string",
      },

      website: {
        bsonType: "string",
      },

      description: {
        bsonType: "string",
      },

      is_active: {
        bsonType: "bool",
      },
    },
  },
};

async function collectionExists(
  database: Db,
  collectionName: string,
): Promise<boolean> {
  return database
    .listCollections(
      {
        name: collectionName,
      },
      {
        nameOnly: true,
      },
    )
    .hasNext();
}

export const createUniversitiesMigration:
  Migration = {
    version: 1,

    name: "create-universities",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "universities",
      );

      if (!exists) {
        await database.createCollection(
          "universities",
          {
            validator:
              universitiesValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "universities" created',
        );
      } else {
        await database.command({
          collMod: "universities",

          validator:
            universitiesValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "universities" updated',
        );
      }

      await database
        .collection("universities")
        .createIndex(
          {
            name: 1,
          },
          {
            unique: true,
          },
        );

      console.log(
        'Unique index for "universities.name" created',
      );
    },
  };