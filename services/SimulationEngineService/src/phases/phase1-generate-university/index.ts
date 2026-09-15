import type {
  AiGenerationClient,
} from "../../clients/AiGenerationClient.js";

import type {
  UniversityDataClient,
} from "../../clients/UniversityDataClient.js";

import type {
  SimulationContext,
} from "../../engine/SimulationContext.js";

import type {
  SimulationPhase,
} from "../../engine/SimulationPhase.js";

import type {
  GeneratedUniversity,
} from "../../models/University.js";

import {
  universityGenerationSchema,
} from "./UniversityGenerationSchema.js";

export interface GenerateUniversityResult {
  universityId: string;
  message: string;
}

export class GenerateUniversityPhase
  implements SimulationPhase<GenerateUniversityResult>
{
  readonly number = 1;
  readonly name = "Generate university";

  constructor(
    private readonly aiGenerationClient:
      AiGenerationClient,

    private readonly universityDataClient:
      UniversityDataClient,
  ) {}

  async validate(
    context: SimulationContext,
  ): Promise<void> {
    if (context.simulation.universityId) {
      throw new Error(
        "University has already been generated",
      );
    }
  }

  async execute(
    context: SimulationContext,
  ): Promise<GenerateUniversityResult> {
    console.log(
      "Generating university data...",
    );

    const university =
      await this.aiGenerationClient
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
            "Do not use names of real universities.",
            "Use a placeholder address in the format:",
            "\"Улица <number>, дом <number>\".",
            "Set is_active to true.",
            `Simulation identifier: ${context.simulation.id}.`,
            "Use the identifier only as a randomness cue.",
            "Do not include the identifier in generated data.",
            "/no_think",
          ].join(" "),

          schema: universityGenerationSchema,
          temperature: 0.4,
          maxTokens: 2_048,
        });

    console.log(
      "University data generated:",
    );

    console.dir(university, {
      depth: null,
    });

    const universityId =
      await this.universityDataClient
        .createUniversity(university);

    context.simulation.universityId =
      universityId;

    return {
      universityId,
      message:
        "University successfully generated and saved",
    };
  }
}