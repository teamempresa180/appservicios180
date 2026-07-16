import { DomainException } from './domain.exception';

/**
 * Thrown when a request is authenticated but the caller's role does
 * not permit the action (`RolesGuard`). Distinct from
 * `UnauthorizedException` — the caller is known, just not allowed.
 */
export class ForbiddenException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
