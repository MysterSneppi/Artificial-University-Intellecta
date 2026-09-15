import Fastify from "fastify";
import {
  registerUniversityRoutes,
} from "./routes/UniversityRoutes.js";
import type {
  JsonSchemaToTsProvider,
} from "@fastify/type-provider-json-schema-to-ts";

import type {
  Db,
} from "mongodb";

const healthResponseSchema = {
  type: "object",

  additionalProperties: false,

  required: [
    "status",
    "database",
  ],

  properties: {
    status: {
      type: "string",
      const: "ok",
    },

    database: {
      type: "string",
      const: "connected",
    },
  },
} as const;

export function createServer(database: Db) {
  const server = Fastify({
  logger: true,

  ajv: {
    customOptions: {
      coerceTypes: false,
      removeAdditional: false,
    },
  },
}).withTypeProvider<JsonSchemaToTsProvider>();

  server.get(
    "/health",
    {
      schema: {
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async () => {
      await database.command({
        ping: 1,
      });

      return {
        status: "ok",
        database: "connected",
      }as const;
    },
  );

  registerUniversityRoutes(
  server,
  database,
);
  return server;
}