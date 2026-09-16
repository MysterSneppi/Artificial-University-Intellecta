import type {
  AnySchema,
} from "ajv";

export const departmentGenerationSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "name",
    "phone_number",
    "office",
    "research_areas",
    "description",
    "is_active",
  ],

  properties: {
    name: {
      type: "string",
      minLength: 14,
      maxLength: 150,
      pattern: "^Department of .+",

      description:
        "Name of an academic department, not a person",
    },

    phone_number: {
      type: "string",
      minLength: 5,
      maxLength: 50,
    },

    office: {
      type: "string",
      minLength: 2,
      maxLength: 100,
    },

    research_areas: {
      type: "array",
      minItems: 1,
      maxItems: 10,
      uniqueItems: true,

      items: {
        type: "string",
        minLength: 2,
        maxLength: 100,
      },
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