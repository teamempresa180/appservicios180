import { ScheduleDto } from '../../application/dto/schedule.dto';
import { ScheduleType } from '../../domain/value-objects/schedule-type.value-object';
import { ScheduleStatus } from '../../domain/value-objects/schedule-status.value-object';
import { CreateScheduleRequestDto } from './create-schedule.request.dto';
import { UpdateScheduleRequestDto } from './update-schedule.request.dto';
import { ScheduleHttpMapper } from './schedule-http.mapper';

describe('ScheduleHttpMapper', () => {
  it('toCreateCommand() parses ISO date strings to Date', () => {
    const dto: CreateScheduleRequestDto = {
      providerId: 'provider-1',
      startDateTime: '2026-01-01T08:00:00.000Z',
      endDateTime: '2026-01-01T09:00:00.000Z',
      type: ScheduleType.Blocked,
    };

    const command = ScheduleHttpMapper.toCreateCommand(dto);

    expect(command.providerId).toBe('provider-1');
    expect(command.startDateTime).toEqual(new Date('2026-01-01T08:00:00.000Z'));
    expect(command.endDateTime).toEqual(new Date('2026-01-01T09:00:00.000Z'));
  });

  it('toUpdateCommand() carries the id and optional fields through, parsing dates', () => {
    const dto: UpdateScheduleRequestDto = {
      startDateTime: '2026-01-01T08:30:00.000Z',
      status: ScheduleStatus.Completed,
    };

    const command = ScheduleHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.startDateTime).toEqual(new Date('2026-01-01T08:30:00.000Z'));
    expect(command.endDateTime).toBeUndefined();
    expect(command.status).toBe(ScheduleStatus.Completed);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: ScheduleDto = {
      id: 'id-1',
      providerId: 'provider-1',
      startDateTime: new Date('2026-01-01T08:00:00.000Z'),
      endDateTime: new Date('2026-01-01T09:00:00.000Z'),
      status: ScheduleStatus.Open,
      type: ScheduleType.Regular,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = ScheduleHttpMapper.toResponse(dto);

    expect(response.startDateTime).toBe('2026-01-01T08:00:00.000Z');
    expect(response.endDateTime).toBe('2026-01-01T09:00:00.000Z');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: ScheduleDto = {
      id: 'id-1',
      providerId: 'provider-1',
      startDateTime: new Date('2026-01-01T08:00:00.000Z'),
      endDateTime: new Date('2026-01-01T09:00:00.000Z'),
      status: ScheduleStatus.Open,
      type: ScheduleType.Regular,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = ScheduleHttpMapper.toListResponse({
      items: [dto],
      total: 1,
      page: 1,
      pageSize: 20,
    });

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe('id-1');
    expect(response.total).toBe(1);
  });
});
