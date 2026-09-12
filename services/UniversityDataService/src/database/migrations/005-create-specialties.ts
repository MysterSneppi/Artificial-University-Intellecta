import type {
  Db,
  Document,
} from "mongodb";

import type {
  Migration,
} from "../Migration.js";

const specialtiesValidator: Document = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "faculty_id",
      "code",
      "name",
      "duration_years",
      "degree",
      "is_active",
    ],

    properties: {
      faculty_id: {
        bsonType: "objectId",
      },

      code: {
        bsonType: "string",
      },

      name: {
        bsonType: "string",
      },

      field_of_study: {
        bsonType: "string",
      },

      duration_years: {
        bsonType: "int",
        minimum: 1,
      },

      degree: {
        bsonType: "string",
      },

      credits_required: {
        bsonType: "int",
        minimum: 0,
      },

      language_of_instruction: {
        bsonType: "string",
      },

      tuition_fee: {
        bsonType: [
          "int",
          "double",
        ],
        minimum: 0,
      },

      internship_required: {
        bsonType: "bool",
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

export const createSpecialtiesMigration:
  Migration = {
    version: 5,

    name: "create-specialties",

    async up(database: Db): Promise<void> {
      const exists = await collectionExists(
        database,
        "specialties",
      );

      if (!exists) {
        await database.createCollection(
          "specialties",
          {
            validator:
              specialtiesValidator,

            validationLevel: "strict",

            validationAction: "error",
          },
        );

        console.log(
          'Collection "specialties" created',
        );
      } else {
        await database.command({
          collMod: "specialties",

          validator:
            specialtiesValidator,

          validationLevel: "strict",

          validationAction: "error",
        });

        console.log(
          'Validator for "specialties" updated',
        );
      }

      const specialties =
        database.collection("specialties");

      await specialties.createIndex({
        faculty_id: 1,
      });

      console.log(
        "Index for specialties faculty created",
      );

      await specialties.createIndex(
        {
          code: 1,
        },
        {
          unique: true,
        },
      );

      console.log(
        "Unique index for specialties code created",
      );
    },
  };