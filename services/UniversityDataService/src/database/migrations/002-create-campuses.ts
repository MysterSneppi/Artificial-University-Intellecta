import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const campusesValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "university_id",
      "name",
      "address",
      "is_active",
    ],

    properties: {
      university_id: {
        bsonType: "objectId",
      },

      name: {
        bsonType: "string",
      },

      address: {
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

export const createCampusesMigration:
  Migration = {
    version: 2,

    name: "create-campuses",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "campuses",
      );

      if (!exists) {
        await database.createCollection(
          "campuses",
          {
            validator: campusesValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "campuses" created',
        );
      } else {
        await database.command({
          collMod: "campuses",

          validator: campusesValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "campuses" updated',
        );
      }

      await database
        .collection("campuses")
        .createIndex(
          {
            university_id: 1,
            name: 1,
          },
          {
            unique: true,
          },
        );

      console.log(
        "Unique index for campuses university and name created",
      );
    },
  };