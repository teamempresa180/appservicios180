import { AvailabilityDto } from '../../application/dto/availability.dto';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';
import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { CreateAvailabilityRequestDto } from './create-availability.request.dto';
import { UpdateAvailabilityRequestDto } from './update-availability.request.dto';
import { AvailabilityHttpMapper } from './availability-http.mapper';

describe('AvailabilityHttpMapper', () => {
  it('toCreateCommand() parses ISO date strings to Date', () => {
    const dto: CreateAvailabilityRequestDto = {
      providerId: 'provider-1',
      type: AvailabilityType.PartTime,
      availableFrom: '2026-01-01T08:00:00.000Z',
      availableTo: '2026-01-01T12:00:00.000Z',
    };

    const command = AvailabilityHttpMapper.toCreateCommand(dto);

    expect(command.providerId).toBe('provider-1');
    expect(command.availableFrom).toEqual(new Date('2026-01-01T08:00:00.000Z'));
    expect(command.availableTo).toEqual(new Date('2026-01-01T12:00:00.000Z'));
  });

  it('toUpdateCommand() carries the id and optional fields through, parsing dates', () => {
    const dto: UpdateAvailabilityRequestDto = {
      availableFrom: '2026-01-01T09:00:00.000Z',
      status: AvailabilityStatus.Suspended,
    };

    const command = AvailabilityHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.availableFrom).toEqual(new Date('2026-01-01T09:00:00.000Z'));
    expect(command.availableTo).toBeUndefined();
    expect(command.status).toBe(AvailabilityStatus.Suspended);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: AvailabilityDto = {
      id: 'id-1',
      providerId: 'provider-1',
      status: AvailabilityStatus.Active,
      type: AvailabilityType.FullTime,
      availableFrom: new Date('2026-01-01T08:00:00.000Z'),
      availableTo: new Date('2026-01-01T18:00:00.000Z'),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = AvailabilityHttpMapper.toResponse(dto);

    expect(response.availableFrom).toBe('2026-01-01T08:00:00.000Z');
    expect(response.availableTo).toBe('2026-01-01T18:00:00.000Z');
    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: AvailabilityDto = {
      id: 'id-1',
      providerId: 'provider-1',
      status: AvailabilityStatus.Active,
      type: AvailabilityType.FullTime,
      availableFrom: new Date('2026-01-01T08:00:00.000Z'),
      availableTo: new Date('2026-01-01T18:00:00.000Z'),
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = AvailabilityHttpMapper.toListResponse({
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
