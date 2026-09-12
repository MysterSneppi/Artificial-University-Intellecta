import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const groupsValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "specialty_id",
      "number",
      "year_of_study",
      "is_active",
    ],

    properties: {
      specialty_id: {
        bsonType: "objectId",
      },

      number: {
        bsonType: "string",
      },

      year_of_study: {
        bsonType: "int",
        minimum: 1,
      },

      leader_id: {
        bsonType: "objectId",
      },

      contact_email: {
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

export const createGroupsMigration:
  Migration = {
    version: 8,

    name: "create-groups",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "groups",
      );

      if (!exists) {
        await database.createCollection(
          "groups",
          {
            validator: groupsValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "groups" created',
        );
      } else {
        await database.command({
          collMod: "groups",

          validator: groupsValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "groups" updated',
        );
      }

      const groups =
        database.collection("groups");

      await groups.createIndex({
        specialty_id: 1,
      });

      console.log(
        "Index for groups specialty created",
      );

      await groups.createIndex(
        {
          number: 1,
        },
        {
          unique: true,
        },
      );

      console.log(
        "Unique index for group number created",
      );
    },
  };