import type { SimulationConfig } from "../config/SimulationConfig.js";
import type { Simulation } from "../models/Simulation.js";

export interface SimulationContext {
  simulation: Simulation;

  config: SimulationConfig;
}