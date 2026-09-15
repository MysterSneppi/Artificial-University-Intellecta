import type {
  AiGenerationClient,
} from "../../clients/AiGenerationClient.js";

import type {
  UniversityDataClient,
} from "../../clients/UniversityDataClient.js";

import type {
  GeneratedUniversity,
} from "../../models/University.js";

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

export async function generateUniversity(
  options: GenerateUniversityOptions,
): Promise<SavedUniversity> {
  console.log(
    "Generating university data...",
  );

  const university =
    await options.aiGenerationClient
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
  "Use a placeholder address in the format:",
  "\"Улица <number>, дом <number>\".",
  "Set is_active to true.",
  `Simulation identifier: ${options.simulationId}.`,
  "Use the identifier only as a randomness cue.",
  "Do not include the identifier in generated data.",
].join(" "),

        schema: universityGenerationSchema,
        temperature: 0.4,
        maxTokens: 2_048,
      });

  const universityId =
    await options.universityDataClient
      .createUniversity(university);

  console.log(
    `University saved: ${university.name} (${universityId})`,
  );

  return {
    universityId,
    university,
  };
}