import { DomainException } from './domain.exception';

/**
 * Thrown when a request is not authenticated, or presents invalid
 * credentials or an invalid/expired/revoked token (login, refresh,
 * or the JWT guard). Deliberately generic — callers never leak
 * *why* a credential was rejected (e.g. "identity not found" vs
 * "wrong password") to avoid helping an attacker enumerate valid
 * accounts.
 */
export class UnauthorizedException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
