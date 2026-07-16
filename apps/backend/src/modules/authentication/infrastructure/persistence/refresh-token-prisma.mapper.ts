import { RefreshTokenModel as PrismaRefreshToken } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenId } from '../../domain/value-objects/refresh-token-id.value-object';

/**
 * Translates between the `RefreshToken` domain entity and its Prisma
 * row shape (`RefreshTokenModel`, mapped to the `refresh_tokens`
 * table). The only place in this module that imports from
 * `@prisma/client` — Domain/Application never do.
 */
export class RefreshTokenPrismaMapper {
  static toDomain(row: PrismaRefreshToken): RefreshToken {
    return new RefreshToken(RefreshTokenId.fromString(row.id), {
      identityId: IdentityId.fromString(row.identityId),
      tokenHash: row.tokenHash,
      expiresAt: row.expiresAt,
      revokedAt: row.revokedAt,
      createdAt: row.createdAt,
    });
  }

  static toPersistence(refreshToken: RefreshToken): PrismaRefreshToken {
    return {
      id: refreshToken.id.value,
      identityId: refreshToken.identityId.value,
      tokenHash: refreshToken.tokenHash,
      expiresAt: refreshToken.expiresAt,
      revokedAt: refreshToken.revokedAt,
      createdAt: refreshToken.createdAt,
    };
  }
}
