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
  DepartmentNameConflictError,
  DepartmentRepository,
  FacultyNotFoundError,
} from "../../repositories/DepartmentRepository.js";

import {
  createDepartmentBodySchema,
  createDepartmentResponseSchema,
  departmentConflictResponseSchema,
  facultyNotFoundResponseSchema,
} from "../schemas/DepartmentSchemas.js";

export function registerDepartmentRoutes(
  server: FastifyInstance,
  database: Db,
): void {
  const typedServer =
    server.withTypeProvider<JsonSchemaToTsProvider>();

  const repository =
    new DepartmentRepository(database);

  typedServer.post(
    "/departments",
    {
      schema: {
        body:
          createDepartmentBodySchema,

        response: {
          201:
            createDepartmentResponseSchema,

          404:
            facultyNotFoundResponseSchema,

          409:
            departmentConflictResponseSchema,
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
          FacultyNotFoundError
        ) {
          return reply.code(404).send({
            code: "FACULTY_NOT_FOUND",
            message: error.message,
          });
        }

        if (
          error instanceof
          DepartmentNameConflictError
        ) {
          return reply.code(409).send({
            code:
              "DEPARTMENT_NAME_ALREADY_EXISTS",

            message: error.message,
          });
        }

        throw error;
      }
    },
  );
}