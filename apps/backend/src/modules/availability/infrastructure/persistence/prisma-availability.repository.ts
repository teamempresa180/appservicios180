import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import {
  MAX_UNPAGINATED_RESULTS,
  enumValuesMatching,
} from '../../../core/infrastructure/enum-search';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Availability } from '../../domain/entities/availability.entity';
import { AvailabilityRepository } from '../../domain/interfaces/availability-repository.interface';
import { AvailabilityId } from '../../domain/value-objects/availability-id.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
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
      take: MAX_UNPAGINATED_RESULTS,
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
    // `type`/`status` are Prisma enum columns — enum filters only
    // support `equals`/`in`, not `contains`. Resolving the substring
    // match against the (compile-time known) enum values first turns
    // what used to be an unfiltered full-table fetch + in-memory
    // `.filter()` into a single bounded `IN (...)` query.
    const types = enumValuesMatching(AvailabilityType, term);
    const statuses = enumValuesMatching(AvailabilityStatus, term);
    if (types.length === 0 && statuses.length === 0) {
      return [];
    }
    const rows = await this.prisma.availabilityModel.findMany({
      where: {
        OR: [
          ...(types.length > 0 ? [{ type: { in: types } }] : []),
          ...(statuses.length > 0 ? [{ status: { in: statuses } }] : []),
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: MAX_UNPAGINATED_RESULTS,
    });
    return rows.map((row) => AvailabilityPrismaMapper.toDomain(row));
  }
}
