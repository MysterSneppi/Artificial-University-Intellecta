import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const teachersValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "faculty_id",
      "first_name",
      "last_name",
      "position",
      "is_active",
    ],

    properties: {
      faculty_id: {
        bsonType: "objectId",
      },

      first_name: {
        bsonType: "string",
      },

      last_name: {
        bsonType: "string",
      },

      position: {
        bsonType: "string",
      },

      specialization: {
        bsonType: "string",
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

      years_of_experience: {
        bsonType: "int",
        minimum: 0,
      },

      research_interests: {
        bsonType: "array",

        items: {
          bsonType: "string",
        },
      },

      publications_count: {
        bsonType: "int",
        minimum: 0,
      },

      bio: {
        bsonType: "string",
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

export const createTeachersMigration:
  Migration = {
    version: 6,

    name: "create-teachers",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "teachers",
      );

      if (!exists) {
        await database.createCollection(
          "teachers",
          {
            validator: teachersValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "teachers" created',
        );
      } else {
        await database.command({
          collMod: "teachers",

          validator: teachersValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "teachers" updated',
        );
      }

      const teachers =
        database.collection("teachers");

      await teachers.createIndex({
        faculty_id: 1,
      });

      console.log(
        "Index for teachers faculty created",
      );

      await teachers.createIndex(
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
        "Partial unique index for teachers contact email created",
      );
    },
  };