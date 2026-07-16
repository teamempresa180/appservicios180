import { PrismaClient } from '@prisma/client';
import { Identity } from '../../../identity/domain/entities/identity.entity';
import { DocumentType } from '../../../identity/domain/value-objects/document-type.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { IdentityStatus } from '../../../identity/domain/value-objects/identity-status.value-object';
import { PrismaIdentityRepository } from '../../../identity/infrastructure/persistence/prisma-identity.repository';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenId } from '../../domain/value-objects/refresh-token-id.value-object';
import { PrismaRefreshTokenRepository } from './prisma-refresh-token.repository';

/**
 * Integration test — see `PrismaIdentityRepository.integration.spec.ts`
 * for the run instructions. Creates its own Identity first (a real
 * foreign key exists in `refresh_tokens.identity_id`).
 */
describe('PrismaRefreshTokenRepository (integration)', () => {
  const prisma = new PrismaClient();
  const identityRepository = new PrismaIdentityRepository(prisma as never);
  const repository = new PrismaRefreshTokenRepository(prisma as never);

  async function seedIdentity(): Promise<IdentityId> {
    const now = new Date();
    const identity = new Identity(IdentityId.create(), {
      fullName: 'Owner Of RefreshToken',
      documentType: DocumentType.NationalId,
      documentNumber: `IT-RT-${Date.now()}-${Math.random()}`,
      birthDate: new Date('1990-01-01'),
      status: IdentityStatus.Active,
      createdAt: now,
      updatedAt: now,
    });
    await identityRepository.save(identity);
    return identity.id;
  }

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('saves and finds a RefreshToken by tokenHash', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    const tokenHash = `hash-${Date.now()}-${Math.random()}`;
    const refreshToken = new RefreshToken(RefreshTokenId.create(), {
      identityId,
      tokenHash,
      expiresAt: new Date(now.getTime() + 900_000),
      revokedAt: null,
      createdAt: now,
    });

    await repository.save(refreshToken);
    const found = await repository.findByTokenHash(tokenHash);

    expect(found).not.toBeNull();
    expect(found?.identityId.equals(identityId)).toBe(true);
    expect(found?.isRevoked).toBe(false);
  });

  it('returns null for an unknown tokenHash', async () => {
    const found = await repository.findByTokenHash('unknown-hash');
    expect(found).toBeNull();
  });

  it('revokes a RefreshToken', async () => {
    const identityId = await seedIdentity();
    const now = new Date();
    const tokenHash = `hash-${Date.now()}-${Math.random()}`;
    const refreshToken = new RefreshToken(RefreshTokenId.create(), {
      identityId,
      tokenHash,
      expiresAt: new Date(now.getTime() + 900_000),
      revokedAt: null,
      createdAt: now,
    });
    await repository.save(refreshToken);

    await repository.revoke(refreshToken.id);

    const found = await repository.findByTokenHash(tokenHash);
    expect(found?.isRevoked).toBe(true);
  });
});
