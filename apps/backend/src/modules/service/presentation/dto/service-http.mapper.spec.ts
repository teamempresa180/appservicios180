import { ServiceDto } from '../../application/dto/service.dto';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { CreateServiceRequestDto } from './create-service.request.dto';
import { UpdateServiceRequestDto } from './update-service.request.dto';
import { ServiceHttpMapper } from './service-http.mapper';

describe('ServiceHttpMapper', () => {
  it('toCreateCommand() carries all create fields through', () => {
    const dto: CreateServiceRequestDto = {
      providerId: 'provider-1',
      categoryId: 'category-1',
      name: 'Pipe repair',
      description: 'Fixes leaking or broken pipes.',
      basePrice: 50.0,
      estimatedDuration: 60,
      type: ServiceType.Standard,
    };

    const command = ServiceHttpMapper.toCreateCommand(dto);

    expect(command.providerId).toBe('provider-1');
    expect(command.categoryId).toBe('category-1');
    expect(command.basePrice).toBe(50.0);
    expect(command.estimatedDuration).toBe(60);
  });

  it('toUpdateCommand() carries the id and optional fields through', () => {
    const dto: UpdateServiceRequestDto = { status: ServiceStatus.Inactive };

    const command = ServiceHttpMapper.toUpdateCommand('id-1', dto);

    expect(command.id).toBe('id-1');
    expect(command.status).toBe(ServiceStatus.Inactive);
  });

  it('toResponse() converts Date fields to ISO strings', () => {
    const dto: ServiceDto = {
      id: 'id-1',
      providerId: 'provider-1',
      categoryId: 'category-1',
      name: 'Pipe repair',
      description: 'Fixes leaking or broken pipes.',
      basePrice: 50.0,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-02T00:00:00.000Z'),
    };

    const response = ServiceHttpMapper.toResponse(dto);

    expect(response.createdAt).toBe('2026-01-01T00:00:00.000Z');
    expect(response.updatedAt).toBe('2026-01-02T00:00:00.000Z');
  });

  it('toListResponse() maps each item and carries pagination metadata through', () => {
    const dto: ServiceDto = {
      id: 'id-1',
      providerId: 'provider-1',
      categoryId: 'category-1',
      name: 'Pipe repair',
      description: 'Fixes leaking or broken pipes.',
      basePrice: 50.0,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
      updatedAt: new Date('2026-01-01T00:00:00.000Z'),
    };

    const response = ServiceHttpMapper.toListResponse({
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
