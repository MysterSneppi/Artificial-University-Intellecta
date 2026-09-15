import type {
  AiGenerationClient,
} from "../../clients/AiGenerationClient.js";

import type {
  UniversityDataClient,
} from "../../clients/UniversityDataClient.js";

import type {
  GeneratedCampus,
} from "../../models/Campus.js";

import {
  campusGenerationSchema,
} from "./CampusGenerationSchema.js";

export interface GenerateCampusesOptions {
  universityId: string;
  universityName: string;
  campusCount: number;
  aiGenerationClient: AiGenerationClient;
  universityDataClient: UniversityDataClient;
}

function normalizeCampusName(
  name: string,
): string {
  return name.trim().toLowerCase();
}

function makeUniqueCampusName(
  generatedName: string,
  campusNumber: number,
  usedNames: ReadonlySet<string>,
): string {
  const baseName =
    generatedName.trim() ||
    `Campus ${campusNumber}`;

  if (
    !usedNames.has(
      normalizeCampusName(baseName),
    )
  ) {
    return baseName;
  }

  let suffix = campusNumber;
  let uniqueName = `${baseName} ${suffix}`;

  while (
    usedNames.has(
      normalizeCampusName(uniqueName),
    )
  ) {
    suffix += 1;
    uniqueName = `${baseName} ${suffix}`;
  }

  return uniqueName;
}

export async function generateCampuses(
  options: GenerateCampusesOptions,
): Promise<string[]> {
  const campusIds: string[] = [];
  const usedNames = new Set<string>();
  const usedNamesForPrompt: string[] = [];

  for (
    let campusNumber = 1;
    campusNumber <= options.campusCount;
    campusNumber += 1
  ) {
    console.log(
      `Generating campus ${campusNumber}...`,
    );

    const candidate =
      await options.aiGenerationClient
        .generateJson<GeneratedCampus>({
          systemPrompt: [
            "You generate campus data for a university simulation.",
            "Return only valid JSON matching the schema.",
            "Do not use Markdown.",
            "Generate internally consistent fictional data.",
          ].join(" "),

          prompt: [
            `University name: ${options.universityName}.`,
            `Generate campus number ${campusNumber}.`,
            "Use a distinctive fictional campus name.",
            "Do not repeat previously generated names.",
            `Previously used names: ${
              usedNamesForPrompt.join(", ") ||
              "none"
            }.`,
            "Use an address in the format:",
            "\"Улица <number>, дом <number>\".",
            "Set is_active to true.",
          ].join(" "),

          schema: campusGenerationSchema,
          temperature: 0.5,
          maxTokens: 1_024,
        });

    const uniqueName =
      makeUniqueCampusName(
        candidate.name,
        campusNumber,
        usedNames,
      );

    const campus: GeneratedCampus = {
      ...candidate,
      name: uniqueName,
    };

    const campusId =
      await options.universityDataClient
        .createCampus(
          options.universityId,
          campus,
        );

    campusIds.push(campusId);
    usedNames.add(
      normalizeCampusName(campus.name),
    );
    usedNamesForPrompt.push(campus.name);

    console.log(
      `Campus saved: ${campus.name} (${campusId})`,
    );
  }

  return campusIds;
}