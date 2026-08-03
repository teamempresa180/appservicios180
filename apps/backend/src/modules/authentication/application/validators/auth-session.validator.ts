import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { LoginCommand } from '../commands/login.command';
import { RefreshCommand } from '../commands/refresh.command';
import { LogoutCommand } from '../commands/logout.command';

/**
 * Structural validation for the login/refresh/logout commands —
 * separate from `AuthenticationValidator` (which covers the CRUD
 * commands) for the same reason `AuthSessionHttpMapper` is separate
 * from `AuthenticationHttpMapper`: no shared fields.
 *
 * This app has no global `ValidationPipe` (validation lives in the
 * Application layer by convention, see every other module's
 * `*.validator.ts`), so without this the session endpoints accepted
 * *any* body. `POST /authentications/login` with `{}` reached
 * `IdentityRepository.findByDocumentNumber(undefined)` and
 * `POST /authentications/{refresh,logout}` with `{}` reached
 * `createHash().update(undefined)` — both surfacing as an opaque 500
 * (with a stack trace in the logs) instead of a 400, on the three
 * highest-traffic unauthenticated endpoints in the API.
 *
 * The length ceilings are a denial-of-service guard, not a business
 * rule: without them an unauthenticated caller can force an bcrypt
 * verify or a SHA-256 hash over a multi-megabyte string on every
 * request.
 */
const MAX_DOCUMENT_NUMBER_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 256;
const MAX_TOKEN_LENGTH = 4096;

export class AuthSessionValidator {
  static validateLogin(command: LoginCommand): void {
    requireString(command.documentNumber, 'documentNumber', MAX_DOCUMENT_NUMBER_LENGTH);
    requireString(command.password, 'password', MAX_PASSWORD_LENGTH);
  }

  static validateRefresh(command: RefreshCommand): void {
    requireString(command.refreshToken, 'refreshToken', MAX_TOKEN_LENGTH);
  }

  static validateLogout(command: LogoutCommand): void {
    requireString(command.refreshToken, 'refreshToken', MAX_TOKEN_LENGTH);
  }
}

/**
 * Rejects anything that isn't a non-empty string within [maxLength].
 * The `typeof` check matters as much as the emptiness one: a JSON body
 * can carry a number, an array or an object under these field names,
 * and every downstream consumer (Prisma query, bcrypt, `createHash`)
 * assumes a string.
 */
function requireString(value: unknown, field: string, maxLength: number): void {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationException(`${field} is required`);
  }
  if (value.length > maxLength) {
    throw new ValidationException(
      `${field} must be at most ${maxLength} characters`,
    );
  }
}
