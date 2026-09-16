import {
  MongoServerError,
  ObjectId,
  type Db,
} from "mongodb";

export interface CreateDepartmentInput {
  faculty_id: string;
  name: string;
  contact_email?: string;
  phone_number?: string;
  office?: string;
  research_areas?: string[];
  description?: string;
  is_active: boolean;
}

export class FacultyNotFoundError
  extends Error {
  constructor(facultyId: string) {
    super(
      `Faculty "${facultyId}" was not found`,
    );

    this.name = "FacultyNotFoundError";
  }
}

export class DepartmentNameConflictError
  extends Error {
  constructor(departmentName: string) {
    super(
      `Department "${departmentName}" already exists in this faculty`,
    );

    this.name =
      "DepartmentNameConflictError";
  }
}

export class DepartmentRepository {
  constructor(
    private readonly database: Db,
  ) {}

  async create(
    department: CreateDepartmentInput,
  ): Promise<string> {
    const facultyId =
      new ObjectId(
        department.faculty_id,
      );

    const facultyExists =
      await this.database
        .collection("faculties")
        .findOne(
          {
            _id: facultyId,
          },
          {
            projection: {
              _id: 1,
            },
          },
        );

    if (!facultyExists) {
      throw new FacultyNotFoundError(
        department.faculty_id,
      );
    }

    try {
      const result = await this.database
        .collection("departments")
        .insertOne({
          faculty_id: facultyId,
          name: department.name,
          is_active:
            department.is_active,

          ...(department.contact_email !==
          undefined
            ? {
                contact_email:
                  department.contact_email,
              }
            : {}),

          ...(department.phone_number !==
          undefined
            ? {
                phone_number:
                  department.phone_number,
              }
            : {}),

          ...(department.office !== undefined
            ? {
                office: department.office,
              }
            : {}),

          ...(department.research_areas !==
          undefined
            ? {
                research_areas:
                  department.research_areas,
              }
            : {}),

          ...(department.description !==
          undefined
            ? {
                description:
                  department.description,
              }
            : {}),
        });

      return result.insertedId.toHexString();
    } catch (error: unknown) {
      if (
        error instanceof MongoServerError &&
        error.code === 11_000
      ) {
        throw new DepartmentNameConflictError(
          department.name,
        );
      }

      throw error;
    }
  }
}