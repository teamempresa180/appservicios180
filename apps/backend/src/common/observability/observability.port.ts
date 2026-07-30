/**
 * Thin seam between application code and whatever error/event tracking
 * backend ends up wired in (Sentry, OpenTelemetry, etc.). Nothing in
 * this codebase should call a tracking SDK directly — depend on this
 * interface instead, so swapping/adding a real backend later only
 * means writing a new adapter and changing the `ObservabilityModule`
 * provider, not touching every call site.
 *
 * No such SDK is installed yet (deliberately — out of scope for this
 * hardening pass, and no new dependency is added here). The default
 * binding (`LoggerObservabilityAdapter`) simply forwards to the
 * existing `AppLogger`, so today this is a no-op wrapper with the same
 * observable behavior as logging directly.
 */
export interface ObservabilityEvent {
  /** Short, human-readable description of what happened. */
  message: string;
  /** Logical origin, e.g. a use case or filter class name. */
  context?: string;
  /**
   * Extra structured data. Callers must never put secrets here —
   * password hashes, full tokens, card numbers — only ids and
   * outcomes (see `common/logger` usage conventions).
   */
  metadata?: Record<string, unknown>;
}

export interface ObservabilityPort {
  /** Records a notable business or system event (not necessarily an error). */
  captureEvent(event: ObservabilityEvent): void;
  /** Records an unexpected error/exception, optionally with extra context. */
  captureError(error: unknown, event?: ObservabilityEvent): void;
}

/** DI token — inject with `@Inject(OBSERVABILITY_PORT)`. */
export const OBSERVABILITY_PORT = Symbol('OBSERVABILITY_PORT');
