import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const facultiesValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "campus_id",
      "name",
      "is_active",
    ],

    properties: {
      campus_id: {
        bsonType: "objectId",
      },

      name: {
        bsonType: "string",
      },

      dean_id: {
        bsonType: "objectId",
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

export const createFacultiesMigration:
  Migration = {
    version: 3,

    name: "create-faculties",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "faculties",
      );

      if (!exists) {
        await database.createCollection(
          "faculties",
          {
            validator: facultiesValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "faculties" created',
        );
      } else {
        await database.command({
          collMod: "faculties",

          validator: facultiesValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "faculties" updated',
        );
      }

      const faculties =
        database.collection("faculties");

      await faculties.createIndex(
        {
          campus_id: 1,
          name: 1,
        },
        {
          unique: true,
        },
      );

      console.log(
        "Unique index for faculties campus and name created",
      );

      await faculties.createIndex(
        {
          contact_email: 1,
        },
        {
          unique: true,

          partialFilterExpression: {
            contact_email: {
              $type: "string",
            },
          },
        },
      );

      console.log(
        "Partial unique index for faculties contact email created",
      );
    },
  };