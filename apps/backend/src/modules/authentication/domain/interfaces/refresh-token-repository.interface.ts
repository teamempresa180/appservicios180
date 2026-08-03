import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenId } from '../value-objects/refresh-token-id.value-object';

/** DI token — see `IDENTITY_REPOSITORY` for why this exists. */
export const REFRESH_TOKEN_REPOSITORY = Symbol('RefreshTokenRepository');

export interface RefreshTokenRepository {
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  save(refreshToken: RefreshToken): Promise<void>;
  /** Marks a token revoked (rotation on refresh, or explicit logout). */
  revoke(id: RefreshTokenId): Promise<void>;
  /**
   * Revokes every still-active refresh token belonging to an Identity
   * — the response to detected refresh-token reuse (see
   * `RefreshUseCase`), which means the token value leaked and every
   * session derived from it must be assumed compromised.
   */
  revokeAllForIdentity(identityId: IdentityId): Promise<void>;
}
