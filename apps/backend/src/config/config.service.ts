import { Injectable } from '@nestjs/common';
import { EnvironmentVariables, validateEnv } from './env.validation';

/**
 * Typed access to environment configuration — the single place that
 * reads `process.env`. Nothing else in the app should reference
 * `process.env` directly (see `main.ts`, updated to use this instead
 * of the ad hoc `process.env.PORT` it had before).
 */
@Injectable()
export class ConfigService {
  private readonly env: EnvironmentVariables;

  constructor() {
    this.env = validateEnv(process.env);
  }

  get nodeEnv(): EnvironmentVariables['NODE_ENV'] {
    return this.env.NODE_ENV;
  }

  get port(): number {
    return this.env.PORT;
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production';
  }
}
