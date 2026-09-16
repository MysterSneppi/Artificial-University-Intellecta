export const createDepartmentBodySchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "faculty_id",
    "name",
    "is_active",
  ],

  properties: {
    faculty_id: {
      type: "string",
      pattern: "^[a-fA-F0-9]{24}$",
    },

    name: {
      type: "string",
      minLength: 14,
      maxLength: 150,
      pattern: "^Department of .+",
    },

    contact_email: {
      type: "string",
      minLength: 5,
      maxLength: 150,
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
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
} as const;

export const createDepartmentResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "id",
  ],

  properties: {
    id: {
      type: "string",
      pattern: "^[a-fA-F0-9]{24}$",
    },
  },
} as const;

export const facultyNotFoundResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "code",
    "message",
  ],

  properties: {
    code: {
      type: "string",
      const: "FACULTY_NOT_FOUND",
    },

    message: {
      type: "string",
    },
  },
} as const;

export const departmentConflictResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "code",
    "message",
  ],

  properties: {
    code: {
      type: "string",
      const: "DEPARTMENT_NAME_ALREADY_EXISTS",
    },

    message: {
      type: "string",
    },
  },
} as const;