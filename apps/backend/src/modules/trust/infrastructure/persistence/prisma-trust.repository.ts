import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { Trust } from '../../domain/entities/trust.entity';
import { TrustRepository } from '../../domain/interfaces/trust-repository.interface';
import { TrustId } from '../../domain/value-objects/trust-id.value-object';
import { TrustPrismaMapper } from './trust-prisma.mapper';

/**
 * `TrustRepository` implementation backed by Prisma/PostgreSQL — the
 * only place in this module that knows Prisma exists. `identityId` is
 * `@unique` in `schema.prisma`, enforcing the 1:1 invariant with
 * `Identity` at the database level too, not just in
 * `CreateTrustProfileUseCase`.
 */
@Injectable()
export class PrismaTrustRepository implements TrustRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: TrustId): Promise<Trust | null> {
    const row = await this.prisma.trustModel.findUnique({
      where: { id: id.value },
    });
    return row ? TrustPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Trust | null> {
    const row = await this.prisma.trustModel.findUnique({
      where: { identityId: identityId.value },
    });
    return row ? TrustPrismaMapper.toDomain(row) : null;
  }

  async save(trust: Trust): Promise<void> {
    const data = TrustPrismaMapper.toPersistence(trust);
    await this.prisma.trustModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async list(page: number, pageSize: number): Promise<PaginatedResult<Trust>> {
    const [rows, total] = await Promise.all([
      this.prisma.trustModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.trustModel.count(),
    ]);
    return {
      items: rows.map((row) => TrustPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Trust[]> {
    // `level`/`status` are Prisma enum columns — enum filters only support
    // `equals`/`in`, not `contains`, so a substring match across both
    // fields has to happen in application code after the fetch.
    const rows = await this.prisma.trustModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const upper = term.toUpperCase();
    return rows
      .filter((row) => row.level.includes(upper) || row.status.includes(upper))
      .map((row) => TrustPrismaMapper.toDomain(row));
  }
}
