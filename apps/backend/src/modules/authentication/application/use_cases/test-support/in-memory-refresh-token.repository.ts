import { RefreshToken } from '../../../domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '../../../domain/interfaces/refresh-token-repository.interface';
import { RefreshTokenId } from '../../../domain/value-objects/refresh-token-id.value-object';

/** In-memory `RefreshTokenRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryRefreshTokenRepository implements RefreshTokenRepository {
  private readonly rows = new Map<string, RefreshToken>();

  findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    return Promise.resolve(
      [...this.rows.values()].find((row) => row.tokenHash === tokenHash) ??
        null,
    );
  }

  save(refreshToken: RefreshToken): Promise<void> {
    this.rows.set(refreshToken.id.value, refreshToken);
    return Promise.resolve();
  }

  revoke(id: RefreshTokenId): Promise<void> {
    const existing = this.rows.get(id.value);
    if (existing) {
      this.rows.set(
        id.value,
        new RefreshToken(existing.id, {
          identityId: existing.identityId,
          tokenHash: existing.tokenHash,
          expiresAt: existing.expiresAt,
          revokedAt: new Date(),
          createdAt: existing.createdAt,
        }),
      );
    }
    return Promise.resolve();
  }
}
