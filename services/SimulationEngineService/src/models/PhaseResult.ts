export interface PhaseResult<TResult = unknown> {
  phaseNumber: number;

  phaseName: string;

  startedAt: Date;

  completedAt: Date;

  durationMs: number;

  data: TResult;
}