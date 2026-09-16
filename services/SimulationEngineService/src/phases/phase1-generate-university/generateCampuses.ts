import type {
  AiGenerationClient,
} from "../../clients/AiGenerationClient.js";

import type {
  UniversityDataClient,
} from "../../clients/UniversityDataClient.js";

import {
  CampusNameConflictError,
} from "../../clients/university-data/createCampus.js";

import type {
  GeneratedCampus,
} from "../../models/Campus.js";

import {
  campusGenerationSchema,
} from "./CampusGenerationSchema.js";

import {
  generateUniqueEntity,
} from "./generateUniqueEntity.js";

export interface GenerateCampusesOptions {
  universityId: string;
  universityName: string;
  campusCount: number;
  aiGenerationClient: AiGenerationClient;
  universityDataClient: UniversityDataClient;
}

export interface SavedCampus {
  campusId: string;
  campusName: string;
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

export async function generateCampuses(
  options: GenerateCampusesOptions,
): Promise<SavedCampus[]> {
  const campuses: SavedCampus[] = [];

  const usedNames = new Set<string>();
  const rejectedNames = new Set<string>();

  for (
    let campusNumber = 1;
    campusNumber <= options.campusCount;
    campusNumber += 1
  ) {
    const generated =
      await generateUniqueEntity<
        GeneratedCampus,
        string
      >({
        entityLabel:
          `Campus ${campusNumber}`,

        maxGenerationAttempts: 5,
        usedNames,
        rejectedNames,

        async generate(context) {
          console.log(
            `Generating campus ${campusNumber}, ` +
              `attempt ${context.attempt}...`,
          );

          return options.aiGenerationClient
            .generateJson<GeneratedCampus>({
              systemPrompt: [
                "You generate campus data for a university simulation.",
                "Return only valid JSON matching the schema.",
                "Do not use Markdown.",
                "Generate internally consistent fictional data.",
              ].join(" "),

              prompt: [
                `University: ${options.universityName}.`,
                `Generate campus number ${campusNumber}.`,

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

                "Generate a different campus name.",
                "Use an address in the format:",
                "\"Улица <number>, дом <number>\".",
                "Set is_active to true.",
              ].join(" "),

              schema:
                campusGenerationSchema,

              temperature: 0.7,
              maxTokens: 1_024,
            });
        },

        getName(campus) {
          return campus.name;
        },

        withName(campus, name) {
          return {
            ...campus,
            name,
          };
        },

        async save(campus) {
          return options
            .universityDataClient
            .createCampus(
              options.universityId,
              campus,
            );
        },

        isNameConflict(error) {
          return (
            error instanceof
            CampusNameConflictError
          );
        },

        isRetryableGenerationError:
          isRetryableAiError,

        createFallbackName(
          campus,
          fallbackAttempt,
        ) {
          return (
            `${campus.name.trim()} ` +
            `${campusNumber}-${fallbackAttempt}`
          );
        },
      });

    campuses.push({
      campusId: generated.result,
      campusName: generated.entity.name,
    });

    console.log(
      `Campus saved: ` +
        `${generated.entity.name} ` +
        `(${generated.result})`,
    );
  }

  return campuses;
}