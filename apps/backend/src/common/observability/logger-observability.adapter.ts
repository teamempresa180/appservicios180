import { Injectable } from '@nestjs/common';
import { AppLogger } from '../logger/app-logger.service';
import {
  ObservabilityEvent,
  ObservabilityPort,
} from './observability.port';

/**
 * Default `ObservabilityPort` binding — forwards to the existing
 * `AppLogger` (stdout via Nest's `Logger`) instead of any external
 * tracking backend. Swap the provider in `ObservabilityModule` for a
 * Sentry/OpenTelemetry-backed adapter later without touching any
 * caller of `ObservabilityPort`.
 */
@Injectable()
export class LoggerObservabilityAdapter implements ObservabilityPort {
  private readonly logger = new AppLogger();

  captureEvent(event: ObservabilityEvent): void {
    this.logger.setContext(event.context ?? 'Observability');
    this.logger.log(this.format(event));
  }

  captureError(error: unknown, event?: ObservabilityEvent): void {
    this.logger.setContext(event?.context ?? 'Observability');
    const message = event ? this.format(event) : this.messageOf(error);
    const trace = error instanceof Error ? error.stack : undefined;
    this.logger.error(message, trace);
  }

  private format(event: ObservabilityEvent): string {
    if (!event.metadata) {
      return event.message;
    }
    return `${event.message} ${JSON.stringify(event.metadata)}`;
  }

  private messageOf(error: unknown): string {
    return error instanceof Error ? error.message : 'Unknown error';
  }
}
