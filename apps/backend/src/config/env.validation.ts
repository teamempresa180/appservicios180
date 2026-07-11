/**
 * Shape of the environment variables this application actually reads.
 * `DATABASE_URL` was added in Sprint 3, Etapa 2 — the first module
 * (Identity & Access) with a real Prisma-backed repository. No
 * JWT/Firebase credentials yet — those are added when the module that
 * needs them is implemented, not before.
 */
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL: string;
}

const ALLOWED_NODE_ENVS: ReadonlyArray<EnvironmentVariables['NODE_ENV']> = [
  'development',
  'test',
  'production',
];

/**
 * Validates `process.env` against {@link EnvironmentVariables} and
 * returns a parsed, typed object. Throws synchronously on the first
 * missing/malformed variable — fails fast at boot instead of letting
 * `undefined`/`NaN` leak into the running app.
 */
export function validateEnv(
  env: Record<string, string | undefined>,
): EnvironmentVariables {
  const nodeEnv = env.NODE_ENV ?? 'development';
  if (
    !ALLOWED_NODE_ENVS.includes(nodeEnv as EnvironmentVariables['NODE_ENV'])
  ) {
    throw new Error(
      `Invalid NODE_ENV "${nodeEnv}" — expected one of: ${ALLOWED_NODE_ENVS.join(', ')}`,
    );
  }

  const rawPort = env.PORT ?? '3000';
  const port = Number(rawPort);
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT "${rawPort}" — expected a positive integer`);
  }

  // No default with real credentials — just a syntactically valid,
  // unreachable-by-default local connection string, so the app (and
  // its tests, none of which touch Prisma eagerly — see
  // `PrismaService`) can boot without a running Postgres. A real
  // deployment always sets `DATABASE_URL` explicitly.
  const databaseUrl =
    env.DATABASE_URL ?? 'postgresql://localhost:5432/appservicios';

  return {
    NODE_ENV: nodeEnv as EnvironmentVariables['NODE_ENV'],
    PORT: port,
    DATABASE_URL: databaseUrl,
  };
}
