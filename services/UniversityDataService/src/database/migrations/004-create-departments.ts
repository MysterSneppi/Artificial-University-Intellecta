import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const departmentsValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "faculty_id",
      "name",
      "is_active",
    ],

    properties: {
      faculty_id: {
        bsonType: "objectId",
      },

      name: {
        bsonType: "string",
      },

      head_of_department_id: {
        bsonType: "objectId",
      },

      contact_email: {
        bsonType: "string",
      },

      phone_number: {
        bsonType: "string",
      },

      office: {
        bsonType: "string",
      },

      research_areas: {
        bsonType: "array",

        items: {
          bsonType: "string",
        },
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

export const createDepartmentsMigration:
  Migration = {
    version: 4,

    name: "create-departments",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "departments",
      );

      if (!exists) {
        await database.createCollection(
          "departments",
          {
            validator:
              departmentsValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "departments" created',
        );
      } else {
        await database.command({
          collMod: "departments",

          validator:
            departmentsValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "departments" updated',
        );
      }

      await database
        .collection("departments")
        .createIndex(
          {
            faculty_id: 1,
            name: 1,
          },
          {
            unique: true,
          },
        );

      console.log(
        "Unique index for departments faculty and name created",
      );
    },
  };