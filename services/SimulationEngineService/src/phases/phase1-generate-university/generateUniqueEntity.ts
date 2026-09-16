export interface GenerationAttemptContext {
  attempt: number;
  usedNames: readonly string[];
  rejectedNames: readonly string[];
}

export interface GenerateUniqueEntityOptions<
  TEntity,
  TResult,
> {
  entityLabel: string;
  maxGenerationAttempts?: number;

  usedNames: Set<string>;
  rejectedNames: Set<string>;

  generate(
    context: GenerationAttemptContext,
  ): Promise<TEntity>;

  getName(entity: TEntity): string;

  withName(
    entity: TEntity,
    name: string,
  ): TEntity;

  save(entity: TEntity): Promise<TResult>;

  isNameConflict(error: unknown): boolean;

  isRetryableGenerationError?(
    error: unknown,
  ): boolean;

  createFallbackName(
    entity: TEntity,
    fallbackAttempt: number,
  ): string;
}

export interface GeneratedUniqueEntity<
  TEntity,
  TResult,
> {
  entity: TEntity;
  result: TResult;
}

function normalizeName(
  name: string,
): string {
  return name.trim().toLowerCase();
}

function containsName(
  names: ReadonlySet<string>,
  candidate: string,
): boolean {
  const normalizedCandidate =
    normalizeName(candidate);

  for (const name of names) {
    if (
      normalizeName(name) ===
      normalizedCandidate
    ) {
      return true;
    }
  }

  return false;
}

function addName(
  names: Set<string>,
  name: string,
): void {
  if (!containsName(names, name)) {
    names.add(name.trim());
  }
}

export async function generateUniqueEntity<
  TEntity,
  TResult,
>(
  options: GenerateUniqueEntityOptions<
    TEntity,
    TResult
  >,
): Promise<
  GeneratedUniqueEntity<TEntity, TResult>
> {
  const maxAttempts =
    options.maxGenerationAttempts ?? 5;

  let lastGeneratedEntity:
    TEntity | undefined;

  for (
    let attempt = 1;
    attempt <= maxAttempts;
    attempt += 1
  ) {
    let entity: TEntity;

    try {
      entity = await options.generate({
        attempt,

        usedNames: [
          ...options.usedNames,
        ],

        rejectedNames: [
          ...options.rejectedNames,
        ],
      });
    } catch (error: unknown) {
      if (
        options
          .isRetryableGenerationError?.(
            error,
          )
      ) {
        console.warn(
          `${options.entityLabel} generation ` +
            `attempt ${attempt} failed; retrying`,
        );

        continue;
      }

      throw error;
    }

    lastGeneratedEntity = entity;

    const entityName =
      options.getName(entity).trim();

    if (
      containsName(
        options.usedNames,
        entityName,
      ) ||
      containsName(
        options.rejectedNames,
        entityName,
      )
    ) {
      addName(
        options.rejectedNames,
        entityName,
      );

      console.warn(
        `${options.entityLabel} name rejected: ` +
          entityName,
      );

      continue;
    }

    try {
      const result =
        await options.save(entity);

      addName(
        options.usedNames,
        entityName,
      );

      return {
        entity,
        result,
      };
    } catch (error: unknown) {
      if (options.isNameConflict(error)) {
        addName(
          options.rejectedNames,
          entityName,
        );

        console.warn(
          `${options.entityLabel} name conflict: ` +
            `${entityName}; regenerating`,
        );

        continue;
      }

      throw error;
    }
  }

  if (!lastGeneratedEntity) {
    throw new Error(
      `${options.entityLabel} generation ` +
        "did not return any usable data",
    );
  }

  /*
   * Если LLM исчерпала все попытки,
   * создаём уникальное имя программно.
   */
  for (
    let fallbackAttempt = 1;
    fallbackAttempt <= 100;
    fallbackAttempt += 1
  ) {
    const fallbackName =
      options.createFallbackName(
        lastGeneratedEntity,
        fallbackAttempt,
      );

    if (
      containsName(
        options.usedNames,
        fallbackName,
      ) ||
      containsName(
        options.rejectedNames,
        fallbackName,
      )
    ) {
      continue;
    }

    const fallbackEntity =
      options.withName(
        lastGeneratedEntity,
        fallbackName,
      );

    try {
      const result =
        await options.save(
          fallbackEntity,
        );

      addName(
        options.usedNames,
        fallbackName,
      );

      return {
        entity: fallbackEntity,
        result,
      };
    } catch (error: unknown) {
      if (options.isNameConflict(error)) {
        addName(
          options.rejectedNames,
          fallbackName,
        );

        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `${options.entityLabel} could not receive ` +
      "a unique fallback name",
  );
}