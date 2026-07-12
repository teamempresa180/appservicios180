import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../infrastructure/prisma/prisma.service';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleRepository } from '../../domain/interfaces/schedule-repository.interface';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { SchedulePrismaMapper } from './schedule-prisma.mapper';

/**
 * `ScheduleRepository` implementation backed by Prisma/PostgreSQL —
 * the only place in this module that knows Prisma exists.
 */
@Injectable()
export class PrismaScheduleRepository implements ScheduleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: ScheduleId): Promise<Schedule | null> {
    const row = await this.prisma.scheduleModel.findUnique({
      where: { id: id.value },
    });
    return row ? SchedulePrismaMapper.toDomain(row) : null;
  }

  async findByProviderId(providerId: ProviderId): Promise<Schedule[]> {
    const rows = await this.prisma.scheduleModel.findMany({
      where: { providerId: providerId.value },
      orderBy: { startDateTime: 'desc' },
    });
    return rows.map((row) => SchedulePrismaMapper.toDomain(row));
  }

  async save(schedule: Schedule): Promise<void> {
    const data = SchedulePrismaMapper.toPersistence(schedule);
    await this.prisma.scheduleModel.upsert({
      where: { id: data.id },
      create: data,
      update: data,
    });
  }

  async delete(id: ScheduleId): Promise<void> {
    await this.prisma.scheduleModel.delete({ where: { id: id.value } });
  }

  async list(
    page: number,
    pageSize: number,
  ): Promise<PaginatedResult<Schedule>> {
    const [rows, total] = await Promise.all([
      this.prisma.scheduleModel.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startDateTime: 'desc' },
      }),
      this.prisma.scheduleModel.count(),
    ]);
    return {
      items: rows.map((row) => SchedulePrismaMapper.toDomain(row)),
      total,
      page,
      pageSize,
    };
  }

  async search(term: string): Promise<Schedule[]> {
    const rows = await this.prisma.scheduleModel.findMany({
      orderBy: { startDateTime: 'desc' },
    });
    const upper = term.toUpperCase();
    return rows
      .filter((row) => row.type.includes(upper) || row.status.includes(upper))
      .map((row) => SchedulePrismaMapper.toDomain(row));
  }
}
