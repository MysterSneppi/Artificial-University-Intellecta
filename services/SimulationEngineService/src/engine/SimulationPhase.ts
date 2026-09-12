import type { SimulationContext } from "./SimulationContext.js";

export interface SimulationPhase<TResult = unknown> {
  readonly number: number;

  readonly name: string;

  validate(context: SimulationContext): Promise<void>;

  execute(context: SimulationContext): Promise<TResult>;
}