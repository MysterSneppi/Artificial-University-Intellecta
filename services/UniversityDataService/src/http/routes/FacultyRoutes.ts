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
  CampusNotFoundError,
  FacultyEmailConflictError,
  FacultyNameConflictError,
  FacultyRepository,
} from "../../repositories/FacultyRepository.js";

import {
  campusNotFoundResponseSchema,
  createFacultyBodySchema,
  createFacultyResponseSchema,
  facultyConflictResponseSchema,
} from "../schemas/FacultySchemas.js";

export function registerFacultyRoutes(
  server: FastifyInstance,
  database: Db,
): void {
  const typedServer =
    server.withTypeProvider<JsonSchemaToTsProvider>();

  const repository =
    new FacultyRepository(database);

  typedServer.post(
    "/faculties",
    {
      schema: {
        body: createFacultyBodySchema,

        response: {
          201: createFacultyResponseSchema,
          404: campusNotFoundResponseSchema,
          409: facultyConflictResponseSchema,
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
          CampusNotFoundError
        ) {
          return reply.code(404).send({
            code: "CAMPUS_NOT_FOUND",
            message: error.message,
          });
        }

        if (
          error instanceof
          FacultyEmailConflictError
        ) {
          return reply.code(409).send({
            code:
              "FACULTY_EMAIL_ALREADY_EXISTS",

            message: error.message,
          });
        }

        if (
          error instanceof
          FacultyNameConflictError
        ) {
          return reply.code(409).send({
            code:
              "FACULTY_NAME_ALREADY_EXISTS",

            message: error.message,
          });
        }

        throw error;
      }
    },
  );
}