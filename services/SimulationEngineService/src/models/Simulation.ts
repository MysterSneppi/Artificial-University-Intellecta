import type { SimulationState } from "../engine/SimulationState.js";

export interface SimulationFailure {
  phaseNumber: number;
  message: string;
  occurredAt: Date;
}

export interface Simulation {
  id: string;

  state: SimulationState;

  lastCompletedPhase: number;

  academicYear: number;

  semester: number;

  universityId?: string;

  createdAt: Date;

  startedAt?: Date;

  completedAt?: Date;

  failure?: SimulationFailure;
}