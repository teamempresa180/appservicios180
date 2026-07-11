import { Injectable, Logger, Scope } from '@nestjs/common';

/**
 * App-wide logger. Wraps Nest's built-in `Logger` (no external logging
 * library — `winston`/`pino` aren't installed and nothing here needs
 * more than what Nest already provides) behind an injectable service
 * so every module logs through the same seam instead of instantiating
 * `new Logger(...)` ad hoc. `Scope.TRANSIENT` gives each injecting
 * class its own instance so `setContext` doesn't leak between them.
 *
 * Nest's `Logger` class takes its context as a per-call argument, not
 * via an instance `setContext` method (that only exists on the
 * separate `ConsoleLogger` class) — `AppLogger` stores it once and
 * forwards it on every call so callers don't have to repeat it.
 */
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger {
  private readonly logger = new Logger();
  private context?: string;

  setContext(context: string): void {
    this.context = context;
  }

  log(message: string): void {
    this.logger.log(message, this.context);
  }

  error(message: string, trace?: string): void {
    this.logger.error(message, trace, this.context);
  }

  warn(message: string): void {
    this.logger.warn(message, this.context);
  }

  debug(message: string): void {
    this.logger.debug(message, this.context);
  }
}
