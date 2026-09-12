import type { SimulationContext } from "./SimulationContext.js";
import type { SimulationPhase } from "./SimulationPhase.js";
import type { PhaseResult } from "../models/PhaseResult.js";

export class SimulationEngine {
  private readonly phases: SimulationPhase[];

  constructor(phases: SimulationPhase[]) {
    this.phases = [...phases].sort(
      (firstPhase, secondPhase) =>
        firstPhase.number - secondPhase.number,
    );
  }

  async run(
    context: SimulationContext,
  ): Promise<PhaseResult[]> {
    const results: PhaseResult[] = [];

    context.simulation.state = "running";
    context.simulation.startedAt ??= new Date();
    delete context.simulation.failure;

    console.log(
      `Simulation ${context.simulation.id} started`,
    );

    for (const phase of this.phases) {
      if (
        phase.number <=
        context.simulation.lastCompletedPhase
      ) {
        console.log(
          `Phase ${phase.number} already completed. Skipping.`,
        );

        continue;
      }

      const startedAt = new Date();

      console.log(
        `Starting phase ${phase.number}: ${phase.name}`,
      );

      try {
        await phase.validate(context);

        const data = await phase.execute(context);

        const completedAt = new Date();

        context.simulation.lastCompletedPhase =
          phase.number;

        results.push({
          phaseNumber: phase.number,
          phaseName: phase.name,
          startedAt,
          completedAt,
          durationMs:
            completedAt.getTime() - startedAt.getTime(),
          data,
        });

        console.log(
          `Phase ${phase.number} completed`,
        );
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : String(error);

        context.simulation.state = "failed";
        context.simulation.failure = {
          phaseNumber: phase.number,
          message,
          occurredAt: new Date(),
        };

        throw new Error(
          `Phase ${phase.number} "${phase.name}" failed: ${message}`,
        );
      }
    }

    context.simulation.state = "completed";
    context.simulation.completedAt = new Date();

    console.log(
      `Simulation ${context.simulation.id} completed`,
    );

    return results;
  }
}