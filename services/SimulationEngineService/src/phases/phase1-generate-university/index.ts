import { randomUUID } from "node:crypto";

import type { SimulationContext } from "../../engine/SimulationContext.js";
import type { SimulationPhase } from "../../engine/SimulationPhase.js";

export interface GenerateUniversityResult {
  universityId: string;
  message: string;
}

export class GenerateUniversityPhase
  implements SimulationPhase<GenerateUniversityResult>
{
  readonly number = 1;

  readonly name = "Generate university";

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
    console.log("Generating university data...");

   //TEST ID
    const universityId = randomUUID();

    context.simulation.universityId = universityId;

    return {
      universityId,
      message: "University successfully generated",
    };
  }
}