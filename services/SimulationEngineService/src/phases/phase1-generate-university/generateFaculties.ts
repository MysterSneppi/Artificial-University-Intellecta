import type {
  AiGenerationClient,
} from "../../clients/AiGenerationClient.js";

import type {
  UniversityDataClient,
} from "../../clients/UniversityDataClient.js";

import {
  FacultyNameConflictError,
} from "../../clients/university-data/createFaculty.js";

import type {
  FacultyForCreation,
  GeneratedFaculty,
} from "../../models/Faculty.js";

import type {
  SavedCampus,
} from "./generateCampuses.js";

import {
  facultyGenerationSchema,
} from "./FacultyGenerationSchema.js";

import {
  generateUniqueEntity,
} from "./generateUniqueEntity.js";

export interface GenerateFacultiesOptions {
  universityId: string;
  universityName: string;
  universityWebsite: string;
  universityEstablishedYear: number;
  campuses: readonly SavedCampus[];
  facultiesPerCampus: number;
  aiGenerationClient: AiGenerationClient;
  universityDataClient: UniversityDataClient;
}

export interface SavedFaculty {
  facultyId: string;
  facultyName: string;
  campusId: string;
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

function createFacultySlug(
  facultyName: string,
): string {
  const slug = facultyName
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || "faculty";
}

export async function generateFaculties(
  options: GenerateFacultiesOptions,
): Promise<SavedFaculty[]> {
  const faculties: SavedFaculty[] = [];

  const universityHost =
    getUniversityHost(
      options.universityWebsite,
    );

  const currentYear =
    new Date().getUTCFullYear();

  for (
    let campusIndex = 0;
    campusIndex < options.campuses.length;
    campusIndex += 1
  ) {
    const campus =
      options.campuses[campusIndex];

    if (!campus) {
      continue;
    }

    /*
     * Название факультета уникально
     * только внутри одного кампуса.
     */
    const usedNames = new Set<string>();
    const rejectedNames =
      new Set<string>();

    for (
      let facultyNumber = 1;
      facultyNumber <=
        options.facultiesPerCampus;
      facultyNumber += 1
    ) {
      const generated =
        await generateUniqueEntity<
          GeneratedFaculty,
          string
        >({
          entityLabel:
            `Faculty ${facultyNumber} ` +
            `of ${campus.campusName}`,

          maxGenerationAttempts: 5,
          usedNames,
          rejectedNames,

          async generate(context) {
            console.log(
              `Generating faculty ` +
                `${facultyNumber} for ` +
                `"${campus.campusName}", ` +
                `attempt ${context.attempt}...`,
            );

            return options
              .aiGenerationClient
              .generateJson<
                GeneratedFaculty
              >({
                systemPrompt: [
                  "You generate faculty data for a university simulation.",
                  "Return only valid JSON matching the schema.",
                  "Do not use Markdown.",
                  "Generate internally consistent fictional data.",
                ].join(" "),

                prompt: [
  `University: ${
    options.universityName
  }.`,

  `Campus: ${
    campus.campusName
  }.`,

  `Generate faculty number ${
    facultyNumber
  }.`,

  "The word faculty means an academic organizational division.",
  "Generate the name of an academic division, not a person.",
  "The name must start exactly with \"Faculty of\".",
  "Continue the name with an academic field or group of disciplines.",
  "Never generate a person's first name, last name, or title.",
  "Never use titles such as Dr, Professor, Mr, or Ms.",

  `Already used names: ${
    context.usedNames.join(", ") ||
    "none"
  }.`,

  `Rejected names: ${
    context.rejectedNames.join(", ") ||
    "none"
  }.`,

  "Generate a different academic faculty name.",

  "The establishment year must not be earlier",
  `than ${
    options.universityEstablishedYear
  }.`,

  "Set is_active to true.",
].join(" "),

                schema:
                  facultyGenerationSchema,

                temperature: 0.7,
                maxTokens: 1_024,
              });
          },

          getName(faculty) {
            return faculty.name;
          },

          withName(faculty, name) {
            return {
              ...faculty,
              name,
            };
          },

          async save(faculty) {
            const campusNumber =
              campusIndex + 1;

            const uniqueKey = [
              options.universityId,
              campusNumber,
              facultyNumber,
            ].join("-");

            const establishedYear =
              Math.min(
                currentYear,
                Math.max(
                  options
                    .universityEstablishedYear,

                  faculty
                    .established_year,
                ),
              );

            const facultySlug =
              createFacultySlug(
                faculty.name,
              );

            const facultyForCreation:
              FacultyForCreation = {
              ...faculty,

              established_year:
                establishedYear,

              contact_email:
                `faculty-${uniqueKey}` +
                `@${universityHost}`,

              website:
                `https://${universityHost}` +
                `/faculties/` +
                `${facultySlug}-${uniqueKey}`,
            };

            return options
              .universityDataClient
              .createFaculty(
                campus.campusId,
                facultyForCreation,
              );
          },

          isNameConflict(error) {
            return (
              error instanceof
              FacultyNameConflictError
            );
          },

          isRetryableGenerationError:
            isRetryableAiError,

          createFallbackName(
  _faculty,
  fallbackAttempt,
) {
  return (
    "Faculty of Interdisciplinary Studies " +
    `${facultyNumber}-${fallbackAttempt}`
  );
},
        });

      faculties.push({
        facultyId: generated.result,
        facultyName:
          generated.entity.name,
        campusId: campus.campusId,
      });

      console.log(
        `Faculty saved: ` +
          `${generated.entity.name} ` +
          `(${generated.result})`,
      );
    }
  }

  return faculties;
}