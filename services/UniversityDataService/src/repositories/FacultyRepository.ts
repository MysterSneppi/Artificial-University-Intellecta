import {
  MongoServerError,
  ObjectId,
  type Db,
} from "mongodb";

export interface CreateFacultyInput {
  campus_id: string;
  name: string;
  established_year?: number;
  contact_email?: string;
  phone_number?: string;
  website?: string;
  description?: string;
  is_active: boolean;
}

export class CampusNotFoundError
  extends Error {
  constructor(campusId: string) {
    super(
      `Campus "${campusId}" was not found`,
    );

    this.name = "CampusNotFoundError";
  }
}

export class FacultyNameConflictError
  extends Error {
  constructor(facultyName: string) {
    super(
      `Faculty "${facultyName}" already exists in this campus`,
    );

    this.name = "FacultyNameConflictError";
  }
}

export class FacultyEmailConflictError
  extends Error {
  constructor(email: string) {
    super(
      `Faculty contact email "${email}" is already in use`,
    );

    this.name = "FacultyEmailConflictError";
  }
}

export class FacultyRepository {
  constructor(
    private readonly database: Db,
  ) {}

  async create(
    faculty: CreateFacultyInput,
  ): Promise<string> {
    const campusId =
      new ObjectId(faculty.campus_id);

    const campusExists =
      await this.database
        .collection("campuses")
        .findOne(
          {
            _id: campusId,
          },
          {
            projection: {
              _id: 1,
            },
          },
        );

    if (!campusExists) {
      throw new CampusNotFoundError(
        faculty.campus_id,
      );
    }

    try {
      const result = await this.database
        .collection("faculties")
        .insertOne({
          campus_id: campusId,
          name: faculty.name,
          is_active: faculty.is_active,

          ...(faculty.established_year !==
          undefined
            ? {
                established_year:
                  faculty.established_year,
              }
            : {}),

          ...(faculty.contact_email !== undefined
            ? {
                contact_email:
                  faculty.contact_email,
              }
            : {}),

          ...(faculty.phone_number !== undefined
            ? {
                phone_number:
                  faculty.phone_number,
              }
            : {}),

          ...(faculty.website !== undefined
            ? {
                website: faculty.website,
              }
            : {}),

          ...(faculty.description !== undefined
            ? {
                description:
                  faculty.description,
              }
            : {}),
        });

      return result.insertedId.toHexString();
    } catch (error: unknown) {
      if (
        error instanceof MongoServerError &&
        error.code === 11_000
      ) {
        if (
          error.keyPattern?.contact_email === 1
        ) {
          throw new FacultyEmailConflictError(
            faculty.contact_email ??
              "unknown",
          );
        }

        throw new FacultyNameConflictError(
          faculty.name,
        );
      }

      throw error;
    }
  }
}