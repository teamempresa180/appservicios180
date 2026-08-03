import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import {
  MAX_UNPAGINATED_RESULTS,
  enumValuesMatching,
} from '../../../core/infrastructure/enum-search';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { SpecializationId } from '../../../category/domain/value-objects/specialization-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderPrismaMapper } from './provider-prisma.mapper';

/**
 * `ProviderRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists.
 * `identityId` is `@unique` in `schema.prisma`, enforcing the 1:1
 * invariant with `Identity` at the database level too, not just in
 * `CreateProviderUseCase` (same pattern as `PrismaTrustRepository`).
 */
@Injectable()
export class PrismaProviderRepository implements ProviderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ProviderId): Promise<Provider | null> {
    const row = await this.prisma.providerModel.findUnique({
      where: { id: id.value },
    });
    return row ? ProviderPrismaMapper.toDomain(row) : null;
  }

  async findByIdentityId(identityId: IdentityId): Promise<Provider | null> {
    const row = await this.prisma.providerModel.findUnique({
      where: { identityId: identityId.value },
    });
    return row ? ProviderPrismaMapper.toDomain(row) : null;
  }

  async save(provider: Provider): Promise<void> {
    const data = ProviderPrismaMapper.toPersistence(provider);
    await this.prisma.providerModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: ProviderId): Promise<void> {
    await this.prisma.providerModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Provider>> {
    const [rows, total] = await Promise.all([
      this.prisma.providerModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.providerModel.count(),
    ]);
    return {
      items: rows.map((row) => ProviderPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Provider[]> {
    // Previously loaded *every* provider row — `biography` included —
    // and matched in Node. `type` is a Prisma enum column (no
    // `contains` support), but its possible values are known at
    // compile time, so the substring match resolves against that
    // short list and pushes down as `IN (...)`; `biography` is a text
    // column and matches with a real `contains` (MySQL's default
    // collation is case-insensitive, so this keeps the previous
    // case-insensitive behavior).
    const types = enumValuesMatching(ProviderType, term);
    const rows = await this.prisma.providerModel.findMany({
      where: {
        OR: [
          ...(types.length > 0 ? [{ type: { in: types } }] : []),
          { biography: { contains: term } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ProviderPrismaMapper.toDomain(row));
  }

  async findCompatible(
    categoryId: CategoryId,
    specializationId?: SpecializationId,
  ): Promise<Provider[]> {
    const rows = await this.prisma.providerModel.findMany({
      where: {
        categoryId: categoryId.value,
        status: ProviderStatus.Active,
        ...(specializationId ? { specializationId: specializationId.value } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => ProviderPrismaMapper.toDomain(row));
  }
}
