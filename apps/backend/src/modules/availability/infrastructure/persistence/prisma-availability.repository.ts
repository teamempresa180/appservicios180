import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { AvailabilityPrismaMapper } from './availability-prisma.mapper';

/**
 * `AvailabilityRepository` implementation backed by Prisma/PostgreSQL
 * — the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaAvailabilityRepository implements AvailabilityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: AvailabilityId): Promise<Availability | null> {
    const row = await this.prisma.availabilityModel.findUnique({
      where: { id: id.value },
    });
    return row ? AvailabilityPrismaMapper.toDomain(row) : null;
  }

  async findByProviderId(providerId: ProviderId): Promise<Availability[]> {
    const rows = await this.prisma.availabilityModel.findMany({
      where: { providerId: providerId.value },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((row) => AvailabilityPrismaMapper.toDomain(row));
  }

  async save(availability: Availability): Promise<void> {
    const data = AvailabilityPrismaMapper.toPersistence(availability);
    await this.prisma.availabilityModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: AvailabilityId): Promise<void> {
    await this.prisma.availabilityModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Availability>> {
    const [rows, total] = await Promise.all([
      this.prisma.availabilityModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.availabilityModel.count(),
    ]);
    return {
      items: rows.map((row) => AvailabilityPrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Availability[]> {
    // `type`/`status` are Prisma enum columns — enum filters only support
    // `equals`/`in`, not `contains`, so a substring match across both
    // fields has to happen in application code after the fetch.
    const rows = await this.prisma.availabilityModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    const upper = term.toUpperCase();
    return rows
      .filter((row) => row.type.includes(upper) || row.status.includes(upper))
      .map((row) => AvailabilityPrismaMapper.toDomain(row));
  }
}
