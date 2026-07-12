import { ScheduleModel as PrismaSchedule } from '@prisma/client';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Schedule } from '../../domain/entities/schedule.entity';
import { ScheduleId } from '../../domain/value-objects/schedule-id.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';
import { SchedulePrismaMapper } from './schedule-prisma.mapper';

describe('SchedulePrismaMapper', () => {
  const row: PrismaSchedule = {
    id: 'id-1',
    providerId: 'provider-1',
    startDateTime: new Date('2026-01-01T08:00:00Z'),
    endDateTime: new Date('2026-01-01T09:00:00Z'),
    status: 'OPEN',
    type: 'REGULAR',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const schedule = SchedulePrismaMapper.toDomain(row);

    expect(schedule.id.value).toBe('id-1');
    expect(schedule.providerId.value).toBe('provider-1');
    expect(schedule.status).toBe(ScheduleStatus.Open);
    expect(schedule.type).toBe(ScheduleType.Regular);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const schedule = new Schedule(ScheduleId.fromString('id-1'), {
      providerId: ProviderId.fromString('provider-1'),
      startDateTime: new Date('2026-01-01T08:00:00Z'),
      endDateTime: new Date('2026-01-01T09:00:00Z'),
      status: ScheduleStatus.Open,
      type: ScheduleType.Regular,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(SchedulePrismaMapper.toPersistence(schedule)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const schedule = SchedulePrismaMapper.toDomain(row);
    expect(SchedulePrismaMapper.toPersistence(schedule)).toEqual(row);
  });
});
