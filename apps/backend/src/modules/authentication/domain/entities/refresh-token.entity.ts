import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { RefreshTokenId } from '../value-objects/refresh-token-id.value-object';

export interface RefreshTokenProps {
  identityId: IdentityId;
  /** SHA-256 hex digest of the signed refresh token JWT — never the
   * token itself, so a database leak alone doesn't expose usable
   * tokens. Deterministic (unlike a bcrypt hash) so it can be looked
   * up directly by exact match at refresh/logout time. */
  tokenHash: string;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

/**
 * Represents one issued refresh token (one row per login/refresh —
 * supports multiple concurrent sessions per Identity). Pure data
 * holder — no signing, no verification, no persistence; see
 * `TokenService`/`RefreshTokenRepository`.
 */
export class RefreshToken extends Entity<RefreshTokenId> {
  public readonly identityId: IdentityId;
  public readonly tokenHash: string;
  public readonly expiresAt: Date;
  public readonly revokedAt: Date | null;
  public readonly createdAt: Date;

  constructor(id: RefreshTokenId, props: RefreshTokenProps) {
    super(id);
    this.identityId = props.identityId;
    this.tokenHash = props.tokenHash;
    this.expiresAt = props.expiresAt;
    this.revokedAt = props.revokedAt;
    this.createdAt = props.createdAt;
  }

  get isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  get isExpired(): boolean {
    return this.expiresAt.getTime() <= Date.now();
  }
}
