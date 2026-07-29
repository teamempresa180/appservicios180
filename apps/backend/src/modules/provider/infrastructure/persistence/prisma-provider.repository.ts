import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { Provider } from '../../domain/entities/provider.entity';
import { ProviderRepository } from '../../domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../domain/value-objects/provider-id.value-object';
import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
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
    const rows = await this.prisma.providerModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const upper = term.toUpperCase();
    return rows
      .filter(
        (row) =>
          row.type.includes(upper) ||
          row.biography.toUpperCase().includes(upper),
      )
      .map((row) => ProviderPrismaMapper.toDomain(row));
  }

  async findCompatible(
    categoryId: CategoryId,
    specialization?: string,
  ): Promise<Provider[]> {
    const rows = await this.prisma.providerModel.findMany({
      where: {
        categoryId: categoryId.value,
        status: ProviderStatus.Active,
        ...(specialization
          ? {
              specialization: {
                contains: specialization,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ProviderPrismaMapper.toDomain(row));
  }
}
