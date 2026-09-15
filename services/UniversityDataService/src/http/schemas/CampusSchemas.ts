export const createCampusBodySchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "university_id",
    "name",
    "address",
    "is_active",
  ],

  properties: {
    university_id: {
      type: "string",
      pattern: "^[a-fA-F0-9]{24}$",
    },

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
} as const;

export const createCampusResponseSchema = {
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

export const universityNotFoundResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "code",
    "message",
  ],

  properties: {
    code: {
      type: "string",
      const: "UNIVERSITY_NOT_FOUND",
    },

    message: {
      type: "string",
    },
  },
} as const;

export const campusConflictResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "code",
    "message",
  ],

  properties: {
    code: {
      type: "string",
      const: "CAMPUS_NAME_ALREADY_EXISTS",
    },

    message: {
      type: "string",
    },
  },
} as const;