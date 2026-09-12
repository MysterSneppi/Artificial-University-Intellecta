import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const studentsValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "specialty_id",
      "group_id",
      "first_name",
      "last_name",
      "email",
      "is_active",
    ],

    properties: {
      specialty_id: {
        bsonType: "objectId",
      },

      group_id: {
        bsonType: "objectId",
      },

      first_name: {
        bsonType: "string",
      },

      last_name: {
        bsonType: "string",
      },

      email: {
        bsonType: "string",
      },

      phone_number: {
        bsonType: "string",
      },

      date_of_birth: {
        bsonType: "date",
      },

      address: {
        bsonType: "string",
      },

      skills: {
        bsonType: "array",

        items: {
          bsonType: "string",
        },
      },

      courses: {
        bsonType: "array",

        items: {
          bsonType: "objectId",
        },
      },

      photo_url: {
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

export const createStudentsMigration:
  Migration = {
    version: 9,

    name: "create-students",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "students",
      );

      if (!exists) {
        await database.createCollection(
          "students",
          {
            validator: studentsValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "students" created',
        );
      } else {
        await database.command({
          collMod: "students",

          validator: studentsValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "students" updated',
        );
      }

      const students =
        database.collection("students");

      await students.createIndex({
        specialty_id: 1,
      });

      console.log(
        "Index for students specialty created",
      );

      await students.createIndex({
        group_id: 1,
      });

      console.log(
        "Index for students group created",
      );

      await students.createIndex(
        {
          email: 1,
        },
        {
          unique: true,
        },
      );

      console.log(
        "Unique index for student email created",
      );
    },
  };