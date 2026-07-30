import { Global, Module } from '@nestjs/common';
import { LoggerObservabilityAdapter } from './logger-observability.adapter';
import { OBSERVABILITY_PORT } from './observability.port';

/**
 * Global module exposing `ObservabilityPort` app-wide, bound to the
 * `AppLogger`-backed default adapter. A future Sentry/OpenTelemetry
 * integration only needs a new adapter class and a one-line change to
 * `useClass` below — every injector of `OBSERVABILITY_PORT` keeps
 * working unchanged.
 */
@Global()
@Module({
  providers: [
    { provide: OBSERVABILITY_PORT, useClass: LoggerObservabilityAdapter },
  ],
  exports: [OBSERVABILITY_PORT],
})
export class ObservabilityModule {}
