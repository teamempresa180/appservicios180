import { DomainException } from './domain.exception';

/**
 * Thrown when an operation is structurally valid but violates a
 * domain invariant or business rule (e.g. an `Order` only accepts one
 * `Quote`, already documented in `PROJECT_STATUS.md` as a
 * cross-entity invariant no module implements yet). Distinct from
 * `ValidationException`, which signals malformed input rather than a
 * rule violation on well-formed input.
 */
export class BusinessRuleException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
