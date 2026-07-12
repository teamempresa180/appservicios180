import { ScheduleModel as PrismaSchedule } from '@prisma/client';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';

/**
 * Translates between the `Schedule` domain entity and its Prisma row
 * shape (`ScheduleModel`, mapped to the `schedules` table). The only
 * place in this module that imports from `@prisma/client` — Domain/
 * Application never do.
 */
export class SchedulePrismaMapper {
  static toDomain(row: PrismaSchedule): Schedule {
    return new Schedule(ScheduleId.fromString(row.id), {
      providerId: ProviderId.fromString(row.providerId),
      startDateTime: row.startDateTime,
      endDateTime: row.endDateTime,
      status: row.status as unknown as ScheduleStatus,
      type: row.type as unknown as ScheduleType,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }

  static toPersistence(schedule: Schedule): PrismaSchedule {
    return {
      id: schedule.id.value,
      providerId: schedule.providerId.value,
      startDateTime: schedule.startDateTime,
      endDateTime: schedule.endDateTime,
      status: schedule.status,
      type: schedule.type,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };
  }
}
