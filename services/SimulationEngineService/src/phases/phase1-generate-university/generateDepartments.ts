import type {
  AiGenerationClient,
} from "../../clients/AiGenerationClient.js";

import type {
  UniversityDataClient,
} from "../../clients/UniversityDataClient.js";

import {
  DepartmentNameConflictError,
} from "../../clients/university-data/createDepartment.js";

import type {
  DepartmentForCreation,
  GeneratedDepartment,
} from "../../models/Department.js";

import {
  departmentGenerationSchema,
} from "./DepartmentGenerationSchema.js";

import type {
  SavedFaculty,
} from "./generateFaculties.js";

import {
  generateUniqueEntity,
} from "./generateUniqueEntity.js";

export interface GenerateDepartmentsOptions {
  universityId: string;
  universityName: string;
  universityWebsite: string;
  faculties: readonly SavedFaculty[];
  departmentsPerFaculty: number;
  aiGenerationClient: AiGenerationClient;
  universityDataClient: UniversityDataClient;
}

export interface SavedDepartment {
  departmentId: string;
  departmentName: string;
  facultyId: string;
}

function isRetryableAiError(
  error: unknown,
): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes(
      "returned invalid JSON",
    ) ||
    error.message.includes(
      "returned empty",
    ) ||
    error.message.includes(
      "does not match schema",
    )
  );
}

function getUniversityHost(
  website: string,
): string {
  try {
    const host = new URL(website)
      .hostname
      .replace(/^www\./, "");

    return host || "intellecta.test";
  } catch {
    return "intellecta.test";
  }
}

export async function generateDepartments(
  options: GenerateDepartmentsOptions,
): Promise<SavedDepartment[]> {
  const departments:
    SavedDepartment[] = [];

  const universityHost =
    getUniversityHost(
      options.universityWebsite,
    );

  for (
    let facultyIndex = 0;
    facultyIndex <
      options.faculties.length;
    facultyIndex += 1
  ) {
    const faculty =
      options.faculties[facultyIndex];

    if (!faculty) {
      continue;
    }

    const usedNames = new Set<string>();
    const rejectedNames =
      new Set<string>();

    for (
      let departmentNumber = 1;
      departmentNumber <=
        options.departmentsPerFaculty;
      departmentNumber += 1
    ) {
      const generated =
        await generateUniqueEntity<
          GeneratedDepartment,
          string
        >({
          entityLabel:
            `Department ${departmentNumber} ` +
            `of ${faculty.facultyName}`,

          maxGenerationAttempts: 5,
          usedNames,
          rejectedNames,

          async generate(context) {
            console.log(
              `Generating department ` +
                `${departmentNumber} for ` +
                `"${faculty.facultyName}", ` +
                `attempt ${context.attempt}...`,
            );

            return options
              .aiGenerationClient
              .generateJson<
                GeneratedDepartment
              >({
                systemPrompt: [
                  "You generate department data for a university simulation.",
                  "A department is an academic organizational unit.",
                  "Return only valid JSON matching the schema.",
                  "Do not use Markdown.",
                ].join(" "),

                prompt: [
                  `University: ${
                    options.universityName
                  }.`,

                  `Faculty: ${
                    faculty.facultyName
                  }.`,

                  `Generate department number ${
                    departmentNumber
                  }.`,

                  "The name must start exactly with \"Department of\".",
                  "Generate an academic department, not a person.",
                  "Never use personal names or titles.",

                  `Already used names: ${
                    context.usedNames.join(
                      ", ",
                    ) || "none"
                  }.`,

                  `Rejected names: ${
                    context.rejectedNames.join(
                      ", ",
                    ) || "none"
                  }.`,

                  "Generate a different department name.",
                  "Generate 2 to 5 relevant research areas.",
                  "Set is_active to true.",
                ].join(" "),

                schema:
                  departmentGenerationSchema,

                temperature: 0.7,
                maxTokens: 1_200,
              });
          },

          getName(department) {
            return department.name;
          },

          withName(
            department,
            name,
          ) {
            return {
              ...department,
              name,
            };
          },

          async save(department) {
            const uniqueKey = [
              options.universityId,
              facultyIndex + 1,
              departmentNumber,
            ].join("-");

            const departmentForCreation:
              DepartmentForCreation = {
              ...department,

              contact_email:
                `department-${uniqueKey}` +
                `@${universityHost}`,
            };

            return options
              .universityDataClient
              .createDepartment(
                faculty.facultyId,
                departmentForCreation,
              );
          },

          isNameConflict(error) {
            return (
              error instanceof
              DepartmentNameConflictError
            );
          },

          isRetryableGenerationError:
            isRetryableAiError,

          createFallbackName(
            _department,
            fallbackAttempt,
          ) {
            return (
              "Department of Interdisciplinary Studies " +
              `${departmentNumber}-` +
              `${fallbackAttempt}`
            );
          },
        });

      departments.push({
        departmentId:
          generated.result,

        departmentName:
          generated.entity.name,

        facultyId:
          faculty.facultyId,
      });

      console.log(
        `Department saved: ` +
          `${generated.entity.name} ` +
          `(${generated.result})`,
      );
    }
  }

  return departments;
}