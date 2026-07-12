import { ServiceModel as PrismaServiceModel } from '@prisma/client';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Service } from '../../domain/entities/service.entity';
import { ServiceId } from '../../domain/value-objects/service-id.value-object';
import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';
import { ServiceType } from '../../domain/value-objects/service-type.value-object';
import { ServicePrismaMapper } from './service-prisma.mapper';

describe('ServicePrismaMapper', () => {
  const row: PrismaServiceModel = {
    id: 'id-1',
    providerId: 'provider-1',
    categoryId: 'category-1',
    name: 'Pipe Repair',
    description: 'Fixes leaking pipes',
    basePrice: 50,
    estimatedDuration: 60,
    status: 'ACTIVE',
    type: 'STANDARD',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
  };

  it('maps a Prisma row to the domain entity', () => {
    const service = ServicePrismaMapper.toDomain(row);

    expect(service.id.value).toBe('id-1');
    expect(service.providerId.value).toBe('provider-1');
    expect(service.categoryId.value).toBe('category-1');
    expect(service.basePrice).toBe(50);
    expect(service.status).toBe(ServiceStatus.Active);
    expect(service.type).toBe(ServiceType.Standard);
  });

  it('maps a domain entity back to the Prisma row shape', () => {
    const service = new Service(ServiceId.fromString('id-1'), {
      providerId: ProviderId.fromString('provider-1'),
      categoryId: CategoryId.fromString('category-1'),
      name: 'Pipe Repair',
      description: 'Fixes leaking pipes',
      basePrice: 50,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-02'),
    });

    expect(ServicePrismaMapper.toPersistence(service)).toEqual(row);
  });

  it('round-trips without losing data', () => {
    const service = ServicePrismaMapper.toDomain(row);
    expect(ServicePrismaMapper.toPersistence(service)).toEqual(row);
  });
});
