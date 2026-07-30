import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Service } from '../../domain/entities/service.entity';
import { ServiceRepository } from '../../domain/interfaces/service-repository.interface';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { ServicePrismaMapper } from './service-prisma.mapper';

/**
 * `ServiceRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists. `providerId`
 * has no FK relation in `schema.prisma` yet — the Provider bounded
 * context has no Infrastructure/table of its own, out of scope for
 * this stage (see `PROJECT_STATUS.md`, section "Prompt 63").
 */
@Injectable()
export class PrismaServiceRepository implements ServiceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ServiceId): Promise<Service | null> {
    const row = await this.prisma.serviceModel.findUnique({
      where: { id: id.value },
    });
    return row ? ServicePrismaMapper.toDomain(row) : null;
  }

  async findByProviderId(providerId: ProviderId): Promise<Service[]> {
    const rows = await this.prisma.serviceModel.findMany({
      where: { providerId: providerId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ServicePrismaMapper.toDomain(row));
  }

  async findByCategoryId(categoryId: CategoryId): Promise<Service[]> {
    const rows = await this.prisma.serviceModel.findMany({
      where: { categoryId: categoryId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ServicePrismaMapper.toDomain(row));
  }

  async save(service: Service): Promise<void> {
    const data = ServicePrismaMapper.toPersistence(service);
    await this.prisma.serviceModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: ServiceId): Promise<void> {
    await this.prisma.serviceModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Service>> {
    const [rows, total] = await Promise.all([
      this.prisma.serviceModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.serviceModel.count(),
    ]);
    return {
      items: rows.map((row) => ServicePrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Service[]> {
    const rows = await this.prisma.serviceModel.findMany({
      where: {
        OR: [
          { name: { contains: term } },
          { description: { contains: term } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => ServicePrismaMapper.toDomain(row));
  }
}
