import { DomainException } from './domain.exception';

/**
 * Thrown when input data fails a structural/format check (a required
 * field is missing, a value is malformed) — as opposed to
 * `BusinessRuleException`, which signals a semantically invalid
 * operation on otherwise well-formed data. Every module's `create`/
 * `update` use case will need this once its validation logic is
 * implemented.
 */
export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
