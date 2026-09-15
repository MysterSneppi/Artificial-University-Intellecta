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
  CampusNameConflictError,
  CampusRepository,
  UniversityNotFoundError,
} from "../../repositories/CampusRepository.js";

import {
  campusConflictResponseSchema,
  createCampusBodySchema,
  createCampusResponseSchema,
  universityNotFoundResponseSchema,
} from "../schemas/CampusSchemas.js";

export function registerCampusRoutes(
  server: FastifyInstance,
  database: Db,
): void {
  const typedServer =
    server.withTypeProvider<JsonSchemaToTsProvider>();

  const repository =
    new CampusRepository(database);

  typedServer.post(
    "/campuses",
    {
      schema: {
        body: createCampusBodySchema,

        response: {
          201: createCampusResponseSchema,
          404: universityNotFoundResponseSchema,
          409: campusConflictResponseSchema,
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
          UniversityNotFoundError
        ) {
          return reply.code(404).send({
            code: "UNIVERSITY_NOT_FOUND",
            message: error.message,
          });
        }

        if (
          error instanceof
          CampusNameConflictError
        ) {
          return reply.code(409).send({
            code:
              "CAMPUS_NAME_ALREADY_EXISTS",

            message: error.message,
          });
        }

        throw error;
      }
    },
  );
}