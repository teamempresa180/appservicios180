import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Profile } from '../../domain/entities/profile.entity';
import { ProfileRepository } from '../../domain/interfaces/profile-repository.interface';
import { ProfileId } from '../../domain/value-objects/profile-id.value-object';
import { ProfilePrismaMapper } from './profile-prisma.mapper';

/**
 * `ProfileRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists. Domain and
 * Application depend only on `ProfileRepository` (the interface).
 */
@Injectable()
export class PrismaProfileRepository implements ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ProfileId): Promise<Profile | null> {
    const row = await this.prisma.profileModel.findUnique({
      where: { id: id.value },
    });
    return row ? ProfilePrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Profile[]> {
    const rows = await this.prisma.profileModel.findMany({
      where: { identityId: identityId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ProfilePrismaMapper.toDomain(row));
  }

  async save(profile: Profile): Promise<void> {
    const data = ProfilePrismaMapper.toPersistence(profile);
    await this.prisma.profileModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: ProfileId): Promise<void> {
    await this.prisma.profileModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Profile>> {
    const [rows, total] = await Promise.all([
      this.prisma.profileModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.profileModel.count(),
    ]);
    return {
      items: rows.map((row) => ProfilePrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Profile[]> {
    const rows = await this.prisma.profileModel.findMany({
      where: {
        OR: [
          { displayName: { contains: term, mode: 'insensitive' } },
          { bio: { contains: term, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ProfilePrismaMapper.toDomain(row));
  }
}
