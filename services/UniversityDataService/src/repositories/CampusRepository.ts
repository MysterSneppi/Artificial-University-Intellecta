import {
  MongoServerError,
  ObjectId,
  type Db,
} from "mongodb";

export interface CreateCampusInput {
  university_id: string;
  name: string;
  address: string;
  description?: string;
  is_active: boolean;
}

export class UniversityNotFoundError
  extends Error {
  constructor(universityId: string) {
    super(
      `University "${universityId}" was not found`,
    );

    this.name = "UniversityNotFoundError";
  }
}

export class CampusNameConflictError
  extends Error {
  constructor(campusName: string) {
    super(
      `Campus "${campusName}" already exists in this university`,
    );

    this.name = "CampusNameConflictError";
  }
}

export class CampusRepository {
  constructor(
    private readonly database: Db,
  ) {}

  async create(
    campus: CreateCampusInput,
  ): Promise<string> {
    const universityId =
      new ObjectId(campus.university_id);

    const universityExists =
      await this.database
        .collection("universities")
        .findOne(
          {
            _id: universityId,
          },
          {
            projection: {
              _id: 1,
            },
          },
        );

    if (!universityExists) {
      throw new UniversityNotFoundError(
        campus.university_id,
      );
    }

    try {
      const result = await this.database
        .collection("campuses")
        .insertOne({
          university_id: universityId,
          name: campus.name,
          address: campus.address,
          is_active: campus.is_active,

          ...(campus.description !== undefined
            ? {
                description:
                  campus.description,
              }
            : {}),
        });

      return result.insertedId.toHexString();
    } catch (error: unknown) {
      if (
        error instanceof MongoServerError &&
        error.code === 11_000
      ) {
        throw new CampusNameConflictError(
          campus.name,
        );
      }

      throw error;
    }
  }
}