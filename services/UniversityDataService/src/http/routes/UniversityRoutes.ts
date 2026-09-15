import type {
  JsonSchemaToTsProvider,
} from "@fastify/type-provider-json-schema-to-ts";

import type {
  FastifyInstance,
} from "fastify";

import type {
  Db,
} from "mongodb";

import {
  UniversityNameConflictError,
  UniversityRepository,
} from "../../repositories/UniversityRepository.js";

import {
  createUniversityBodySchema,
  createUniversityResponseSchema,
  universityConflictResponseSchema,
} from "../schemas/UniversitySchemas.js";

export function registerUniversityRoutes(
  server: FastifyInstance,
  database: Db,
): void {
  const typedServer =
    server.withTypeProvider<JsonSchemaToTsProvider>();

  const repository =
    new UniversityRepository(database);

  typedServer.post(
    "/universities",
    {
      schema: {
        body: createUniversityBodySchema,

        response: {
          201: createUniversityResponseSchema,
          409: universityConflictResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const id = await repository.create(
          request.body,
        );

        return reply.code(201).send({
          id,
        });
      } catch (error: unknown) {
        if (
          error instanceof
          UniversityNameConflictError
        ) {
          return reply.code(409).send({
            code:
              "UNIVERSITY_NAME_ALREADY_EXISTS",

            message: error.message,
          });
        }

        throw error;
      }
    },
  );
}