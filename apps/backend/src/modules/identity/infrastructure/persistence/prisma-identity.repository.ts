import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { Identity } from '../../domain/entities/identity.entity';
import { IdentityRepository } from '../../domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../domain/value-objects/identity-id.value-object';
import { IdentityPrismaMapper } from './identity-prisma.mapper';

/**
 * `IdentityRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists. Domain and
 * Application depend only on `IdentityRepository` (the interface).
 */
@Injectable()
export class PrismaIdentityRepository implements IdentityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: IdentityId): Promise<Identity | null> {
    const row = await this.prisma.identityModel.findUnique({
      where: { id: id.value },
    });
    return row ? IdentityPrismaMapper.toDomain(row) : null;
  }

  async findByDocumentNumber(documentNumber: string): Promise<Identity | null> {
    const row = await this.prisma.identityModel.findFirst({
      where: { documentNumber },
    });
    return row ? IdentityPrismaMapper.toDomain(row) : null;
  }

  async save(identity: Identity): Promise<void> {
    const data = IdentityPrismaMapper.toPersistence(identity);
    await this.prisma.identityModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: IdentityId): Promise<void> {
    await this.prisma.identityModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Identity>> {
    const [rows, total] = await Promise.all([
      this.prisma.identityModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.identityModel.count(),
    ]);
    return {
      items: rows.map((row) => IdentityPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Identity[]> {
    const rows = await this.prisma.identityModel.findMany({
      where: {
        OR: [
          { fullName: { contains: term, mode: 'insensitive' } },
          { documentNumber: { contains: term, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => IdentityPrismaMapper.toDomain(row));
  }
}
