import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const coursesValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "specialty_id",
      "teacher_id",
      "name",
      "credits",
      "semester",
      "is_mandatory",
      "is_active",
    ],

    properties: {
      specialty_id: {
        bsonType: "objectId",
      },

      teacher_id: {
        bsonType: "objectId",
      },

      name: {
        bsonType: "string",
      },

      type: {
        bsonType: "string",
      },

      credits: {
        bsonType: "int",
        minimum: 0,
      },

      semester: {
        bsonType: "int",
        minimum: 1,
      },

      max_students: {
        bsonType: "int",
        minimum: 1,
      },

      min_students: {
        bsonType: "int",
        minimum: 0,
      },

      description: {
        bsonType: "string",
      },

      syllabus_url: {
        bsonType: "string",
      },

      evaluation_method: {
        bsonType: "string",
      },

      is_mandatory: {
        bsonType: "bool",
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

export const createCoursesMigration:
  Migration = {
    version: 7,

    name: "create-courses",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "courses",
      );

      if (!exists) {
        await database.createCollection(
          "courses",
          {
            validator: coursesValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "courses" created',
        );
      } else {
        await database.command({
          collMod: "courses",

          validator: coursesValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "courses" updated',
        );
      }

      const courses =
        database.collection("courses");

      await courses.createIndex({
        teacher_id: 1,
      });

      console.log(
        "Index for courses teacher created",
      );

      await courses.createIndex({
        specialty_id: 1,
        semester: 1,
      });

      console.log(
        "Compound index for courses specialty and semester created",
      );
    },
  };