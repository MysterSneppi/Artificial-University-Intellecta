import type {
  AnySchema,
} from "ajv";

export const facultyGenerationSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "name",
    "established_year",
    "phone_number",
    "description",
    "is_active",
  ],

  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 150,
      pattern: "^Faculty of .+",

  description:
    "Name of an academic organizational division, not a person",
    },

    established_year: {
      type: "integer",
      minimum: 1000,
      maximum: new Date().getUTCFullYear(),
    },

    phone_number: {
      type: "string",
      minLength: 5,
      maxLength: 50,
    },

    description: {
      type: "string",
      minLength: 20,
      maxLength: 1_000,
    },

    is_active: {
      type: "boolean",
    },
  },
} satisfies AnySchema;