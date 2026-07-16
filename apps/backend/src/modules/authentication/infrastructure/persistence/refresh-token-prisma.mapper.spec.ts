import { RefreshTokenModel as PrismaRefreshToken } from '@prisma/client';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenId } from '../../domain/value-objects/refresh-token-id.value-object';
import { RefreshTokenPrismaMapper } from './refresh-token-prisma.mapper';

describe('RefreshTokenPrismaMapper', () => {
  const row: PrismaRefreshToken = {
    id: 'token-1',
    identityId: 'identity-1',
    tokenHash: 'hash-value',
    expiresAt: new Date('2026-01-08T00:00:00.000Z'),
    revokedAt: null,
    createdAt: new Date('2026-01-01T00:00:00.000Z'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const refreshToken = RefreshTokenPrismaMapper.toDomain(row);

    expect(refreshToken.id.value).toBe('token-1');
    expect(refreshToken.identityId.value).toBe('identity-1');
    expect(refreshToken.tokenHash).toBe('hash-value');
    expect(refreshToken.isRevoked).toBe(false);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const refreshToken = new RefreshToken(
      RefreshTokenId.fromString('token-1'),
      {
        identityId: IdentityId.fromString('identity-1'),
        tokenHash: 'hash-value',
        expiresAt: new Date('2026-01-08T00:00:00.000Z'),
        revokedAt: null,
        createdAt: new Date('2026-01-01T00:00:00.000Z'),
      },
    );

    expect(RefreshTokenPrismaMapper.toPersistence(refreshToken)).toEqual(row);
  });
});
