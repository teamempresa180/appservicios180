import { randomBytes } from 'node:crypto';

/**
 * Shape of the environment variables this application actually reads.
 * `DATABASE_URL` was added in Sprint 3, Etapa 2 — the first module
 * (Identity & Access) with a real Prisma-backed repository.
 * `JWT_*` variables were added in Sprint 4, Etapa 7 (real
 * authentication) — see `validateEnv` for why there is no hardcoded
 * secret literal anywhere in this file.
 */
export interface EnvironmentVariables {
  NODE_ENV: 'development' | 'test' | 'production';
  PORT: number;
  DATABASE_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
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

  const isProduction = nodeEnv === 'production';

  // Never a hardcoded literal: in production the secret MUST come
  // from the environment (fail fast otherwise); outside production,
  // an ephemeral value is generated at boot via `crypto.randomBytes`
  // when not provided, so local/dev/test runs work out of the box
  // without ever committing a real or fixed secret to the repo.
  // Tokens signed with an ephemeral secret simply stop validating on
  // the next restart — acceptable outside production.
  const jwtAccessSecret = requireSecret(
    'JWT_ACCESS_SECRET',
    env.JWT_ACCESS_SECRET,
    isProduction,
  );
  const jwtRefreshSecret = requireSecret(
    'JWT_REFRESH_SECRET',
    env.JWT_REFRESH_SECRET,
    isProduction,
  );

  return {
    NODE_ENV: nodeEnv as EnvironmentVariables['NODE_ENV'],
    PORT: port,
    DATABASE_URL: databaseUrl,
    JWT_ACCESS_SECRET: jwtAccessSecret,
    JWT_ACCESS_EXPIRES_IN: env.JWT_ACCESS_EXPIRES_IN ?? '900s',
    JWT_REFRESH_SECRET: jwtRefreshSecret,
    JWT_REFRESH_EXPIRES_IN: env.JWT_REFRESH_EXPIRES_IN ?? '7d',
    JWT_ISSUER: env.JWT_ISSUER ?? 'servicios180-api',
    JWT_AUDIENCE: env.JWT_AUDIENCE ?? 'servicios180-clients',
  };
}

function requireSecret(
  name: string,
  value: string | undefined,
  isProduction: boolean,
): string {
  if (value) {
    return value;
  }
  if (isProduction) {
    throw new Error(
      `Missing required environment variable "${name}" in production`,
    );
  }
  return randomBytes(32).toString('hex');
}
