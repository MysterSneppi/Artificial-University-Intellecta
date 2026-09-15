import type {
  AnySchema,
} from "ajv";

export const campusGenerationSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "name",
    "address",
    "description",
    "is_active",
  ],

  properties: {
    name: {
      type: "string",
      minLength: 3,
      maxLength: 150,
    },

    address: {
      type: "string",
      minLength: 5,
      maxLength: 200,
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