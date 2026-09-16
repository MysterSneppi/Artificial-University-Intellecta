import type {
  AiGenerationClient,
} from "../../clients/AiGenerationClient.js";

import type {
  UniversityDataClient,
} from "../../clients/UniversityDataClient.js";

import {
  UniversityNameConflictError,
} from "../../clients/university-data/createUniversity.js";

import type {
  GeneratedUniversity,
} from "../../models/University.js";

import {
  generateUniqueEntity,
} from "./generateUniqueEntity.js";

import {
  universityGenerationSchema,
} from "./UniversityGenerationSchema.js";

export interface GenerateUniversityOptions {
  simulationId: string;
  aiGenerationClient: AiGenerationClient;
  universityDataClient: UniversityDataClient;
}

export interface SavedUniversity {
  universityId: string;
  university: GeneratedUniversity;
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

function createFallbackUniversityName(
  generatedName: string,
  simulationId: string,
  fallbackAttempt: number,
): string {
  const simulationCode =
    simulationId
      .replaceAll("-", "")
      .toUpperCase();

  const suffix =
    ` [${simulationCode}-${fallbackAttempt}]`;

  const maximumBaseLength =
    150 - suffix.length;

  const baseName = generatedName
    .trim()
    .slice(0, maximumBaseLength)
    .trim();

  return `${baseName}${suffix}`;
}

export async function generateUniversity(
  options: GenerateUniversityOptions,
): Promise<SavedUniversity> {
  const usedNames = new Set<string>();
  const rejectedNames = new Set<string>();

  const generated =
    await generateUniqueEntity<
      GeneratedUniversity,
      string
    >({
      entityLabel: "University",
      maxGenerationAttempts: 5,
      usedNames,
      rejectedNames,

      async generate(context) {
        console.log(
          `Generating university data, ` +
            `attempt ${context.attempt}...`,
        );

        return options.aiGenerationClient
          .generateJson<GeneratedUniversity>({
            systemPrompt: [
              "You generate data for a university simulation.",
              "Return only valid JSON matching the provided schema.",
              "Do not use Markdown.",
              "Generate internally consistent fictional data.",
            ].join(" "),

            prompt: [
              "Generate one fictional modern university.",
              "Give it a distinctive fictional name.",
              "The university name and website domain must correspond.",
              "The website must be a complete URL starting with https://.",
              "Do not use names of real universities.",

              `Already used names: ${
                context.usedNames.join(", ") ||
                "none"
              }.`,

              `Rejected names: ${
                context.rejectedNames.join(
                  ", ",
                ) || "none"
              }.`,

              "Generate a name that is not present in either list.",
              "Use a placeholder address in the format:",
              "\"Улица <number>, дом <number>\".",
              "Set is_active to true.",

              `Simulation identifier: ${
                options.simulationId
              }.`,

              "Use the identifier only as a randomness cue.",
              "Do not include the identifier in generated data.",
            ].join(" "),

            schema:
              universityGenerationSchema,

            temperature: 0.7,
            maxTokens: 2_048,
          });
      },

      getName(university) {
        return university.name;
      },

      withName(
        university,
        name,
      ) {
        return {
          ...university,
          name,
        };
      },

      async save(university) {
        return options
          .universityDataClient
          .createUniversity(university);
      },

      isNameConflict(error) {
        return (
          error instanceof
          UniversityNameConflictError
        );
      },

      isRetryableGenerationError:
        isRetryableAiError,

      createFallbackName(
        university,
        fallbackAttempt,
      ) {
        return createFallbackUniversityName(
          university.name,
          options.simulationId,
          fallbackAttempt,
        );
      },
    });

  console.log(
    `University saved: ` +
      `${generated.entity.name} ` +
      `(${generated.result})`,
  );

  return {
    universityId: generated.result,
    university: generated.entity,
  };
}