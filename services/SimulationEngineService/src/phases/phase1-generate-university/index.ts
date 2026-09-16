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

import {
  generateCampuses,
} from "./generateCampuses.js";

import {
  generateUniversity,
} from "./generateUniversity.js";

import {
  generateFaculties,
} from "./generateFaculties.js";

export interface GenerateUniversityResult {
  universityId: string;
  campusIds: string[];
  message: string;
  facultyIds: string[];
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

    const campusCount =
      context.config.campusesPerUniversity;

    if (
      !Number.isInteger(campusCount) ||
      campusCount < 1 ||
      campusCount > 10
    ) {
      throw new Error(
        "campusesPerUniversity must be an integer between 1 and 10",
      );
    }

    const facultiesPerCampus =
  context.config.facultiesPerCampus;

if (
  !Number.isInteger(facultiesPerCampus) ||
  facultiesPerCampus < 1 ||
  facultiesPerCampus > 10
) {
  throw new Error(
    "facultiesPerCampus must be an integer between 1 and 10",
  );
}


  }

  async execute(
    context: SimulationContext,
  ): Promise<GenerateUniversityResult> {
    const {
      universityId,
      university,
    } = await generateUniversity({
      simulationId:
        context.simulation.id,

      aiGenerationClient:
        this.aiGenerationClient,

      universityDataClient:
        this.universityDataClient,
    });

    context.simulation.universityId =
      universityId;

    const campuses =
      await generateCampuses({
        universityId,
        universityName: university.name,

        campusCount:
          context.config
            .campusesPerUniversity,

        aiGenerationClient:
          this.aiGenerationClient,

        universityDataClient:
          this.universityDataClient,
      });

      const faculties =
  await generateFaculties({
    universityId,
    universityName: university.name,
    universityWebsite: university.website,

    universityEstablishedYear:
      university.established_year,

    campuses,

    facultiesPerCampus:
      context.config.facultiesPerCampus,

    aiGenerationClient:
      this.aiGenerationClient,

    universityDataClient:
      this.universityDataClient,
  });
    return {
      universityId,
      campusIds: campuses.map(
    (campus) => campus.campusId,
  ),
facultyIds: faculties.map(
    (faculty) => faculty.facultyId,
  ),
      message:
        "University and campuses successfully generated and saved",
    };
  }
}