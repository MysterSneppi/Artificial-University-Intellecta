import type { AnySchema } from "ajv";

export const universityGenerationSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "name",
    "address",
    "established_year",
    "contact_email",
    "phone_number",
    "website",
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

    established_year: {
      type: "integer",
      minimum: 1000,
      maximum: new Date().getUTCFullYear(),
    },

    contact_email: {
      type: "string",
      minLength: 5,
      maxLength: 150,
    },

    phone_number: {
      type: "string",
      minLength: 5,
      maxLength: 50,
    },

    website: {
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