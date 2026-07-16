import { Role } from '../../../../common/auth/role.enum';

/** The claims embedded in both access and refresh tokens. */
export interface TokenClaims {
  sub: string;
  role: Role;
}

/**
 * Contract for issuing/verifying JWTs and for hashing a refresh
 * token for storage. No implementation lives in this module —
 * concrete implementation belongs to the infrastructure layer
 * (`JwtTokenService`), same pattern as every repository interface in
 * this codebase.
 */
export const TOKEN_SERVICE = Symbol('TokenService');

export interface TokenService {
  signAccessToken(claims: TokenClaims): string;
  signRefreshToken(claims: TokenClaims): string;
  /** Throws `UnauthorizedException` on an invalid/expired/malformed token. */
  verifyAccessToken(token: string): TokenClaims;
  /** Throws `UnauthorizedException` on an invalid/expired/malformed token. */
  verifyRefreshToken(token: string): TokenClaims;
  /** Deterministic digest used to look up a stored refresh token by
   * hash without ever persisting the token itself. */
  hashRefreshToken(token: string): string;
  /** Reads the `exp` claim off an already-signed token (no signature
   * verification — used right after signing a token this service
   * itself just issued, to know when to expire the stored
   * `RefreshToken` row). */
  getExpiry(token: string): Date;
}
