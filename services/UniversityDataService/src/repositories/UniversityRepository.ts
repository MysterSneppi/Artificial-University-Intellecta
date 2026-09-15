import {
  MongoServerError,
  type Db,
} from "mongodb";

export interface CreateUniversityInput {
  name: string;
  address: string;
  established_year: number;
  contact_email?: string;
  phone_number?: string;
  website?: string;
  description?: string;
  is_active: boolean;
}

export class UniversityNameConflictError
  extends Error {
  constructor(universityName: string) {
    super(
      `University "${universityName}" already exists`,
    );

    this.name = "UniversityNameConflictError";
  }
}

export class UniversityRepository {
  constructor(
    private readonly database: Db,
  ) {}

  async create(
    university: CreateUniversityInput,
  ): Promise<string> {
    try {
      const result = await this.database
        .collection("universities")
        .insertOne({
          ...university,
        });

      return result.insertedId.toHexString();
    } catch (error: unknown) {
      if (
        error instanceof MongoServerError &&
        error.code === 11_000
      ) {
        throw new UniversityNameConflictError(
          university.name,
        );
      }

      throw error;
    }
  }
}