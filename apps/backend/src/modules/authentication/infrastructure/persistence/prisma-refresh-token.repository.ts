import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { RefreshToken } from '../../domain/entities/refresh-token.entity';
import { RefreshTokenRepository } from '../../domain/interfaces/refresh-token-repository.interface';
import { RefreshTokenId } from '../../domain/value-objects/refresh-token-id.value-object';
import { RefreshTokenPrismaMapper } from './refresh-token-prisma.mapper';

/**
 * `RefreshTokenRepository` implementation backed by Prisma/PostgreSQL
 * — the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaRefreshTokenRepository implements RefreshTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTokenHash(tokenHash: string): Promise<RefreshToken | null> {
    const row = await this.prisma.refreshTokenModel.findFirst({
      where: { tokenHash },
    });
    return row ? RefreshTokenPrismaMapper.toDomain(row) : null;
  }

  async save(refreshToken: RefreshToken): Promise<void> {
    const data = RefreshTokenPrismaMapper.toPersistence(refreshToken);
    await this.prisma.refreshTokenModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async revoke(id: RefreshTokenId): Promise<void> {
    await this.prisma.refreshTokenModel.update({
      where: { id: id.value },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForIdentity(identityId: IdentityId): Promise<void> {
    // Only the not-yet-revoked rows: re-stamping `revokedAt` on
    // already-revoked tokens would lose the original revocation time,
    // which is the audit trail for when the session actually ended.
    // Covered by the existing `@@index([identityId])` on
    // `RefreshTokenModel` — no schema change needed.
    await this.prisma.refreshTokenModel.updateMany({
      where: { identityId: identityId.value, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
