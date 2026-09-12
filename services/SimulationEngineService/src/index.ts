import { randomUUID } from "node:crypto";

import { defaultSimulationConfig } from "./config/SimulationConfig.js";
import { SimulationEngine } from "./engine/SimulationEngine.js";
import { GenerateUniversityPhase } from "./phases/phase1-generate-university/index.js";

import type { SimulationContext } from "./engine/SimulationContext.js";
import type { Simulation } from "./models/Simulation.js";

async function main(): Promise<void> {
  const simulation: Simulation = {
    id: randomUUID(),
    state: "created",
    lastCompletedPhase: 0,
    academicYear: 1,
    semester: 1,
    createdAt: new Date(),
  };

  const context: SimulationContext = {
    simulation,
    config: defaultSimulationConfig,
  };

  const engine = new SimulationEngine([
    new GenerateUniversityPhase(),
  ]);

  const results = await engine.run(context);

  console.log("Simulation results:");

  console.dir(results, {
    depth: null,
  });

  console.log("Final simulation state:");

  console.dir(simulation, {
    depth: null,
  });
}

main().catch((error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : String(error);

  console.error(`Simulation failed: ${message}`);

  process.exitCode = 1;
});