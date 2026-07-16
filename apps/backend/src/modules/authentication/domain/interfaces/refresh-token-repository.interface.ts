import { RefreshToken } from '../entities/refresh-token.entity';
import { RefreshTokenId } from '../value-objects/refresh-token-id.value-object';

/** DI token — see `IDENTITY_REPOSITORY` for why this exists. */
export const REFRESH_TOKEN_REPOSITORY = Symbol('RefreshTokenRepository');

export interface RefreshTokenRepository {
  findByTokenHash(tokenHash: string): Promise<RefreshToken | null>;
  save(refreshToken: RefreshToken): Promise<void>;
  /** Marks a token revoked (rotation on refresh, or explicit logout). */
  revoke(id: RefreshTokenId): Promise<void>;
}
