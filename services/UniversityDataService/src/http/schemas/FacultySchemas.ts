export const createFacultyBodySchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "campus_id",
    "name",
    "is_active",
  ],

  properties: {
    campus_id: {
      type: "string",
      pattern: "^[a-fA-F0-9]{24}$",
    },

    name: {
      type: "string",
      minLength: 3,
      maxLength: 150,
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
      pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
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
      pattern: "^https?://",
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

export const createFacultyResponseSchema = {
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

export const campusNotFoundResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "code",
    "message",
  ],

  properties: {
    code: {
      type: "string",
      const: "CAMPUS_NOT_FOUND",
    },

    message: {
      type: "string",
    },
  },
} as const;

export const facultyConflictResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "code",
    "message",
  ],

  properties: {
    code: {
      type: "string",

      enum: [
        "FACULTY_NAME_ALREADY_EXISTS",
        "FACULTY_EMAIL_ALREADY_EXISTS",
      ],
    },

    message: {
      type: "string",
    },
  },
} as const;