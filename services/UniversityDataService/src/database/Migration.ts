import type { Db } from "mongodb";

export interface Migration {
  readonly version: number;

  readonly name: string;

  up(database: Db): Promise<void>;
}

export interface MigrationRecord {
  version: number;

  name: string;

  applied_at: Date;
}