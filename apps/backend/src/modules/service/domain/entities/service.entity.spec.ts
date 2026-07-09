import { Service } from './service.entity';
import { ServiceId } from '../value-objects/service-id.value-object';
import { ServiceStatus } from '../value-objects/service-status.value-object';
import { ServiceType } from '../value-objects/service-type.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';

describe('Service', () => {
  it('holds all the assigned properties', () => {
    const id = ServiceId.create();
    const providerId = ProviderId.create();
    const categoryId = CategoryId.create();
    const now = new Date();
    const service = new Service(id, {
      providerId,
      categoryId,
      name: 'Destape de tubería',
      description: 'Destape de tuberías residenciales',
      basePrice: 50000,
      estimatedDuration: 60,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: now,
      updatedAt: now,
    });

    expect(service.id).toBe(id);
    expect(service.providerId).toBe(providerId);
    expect(service.categoryId).toBe(categoryId);
    expect(service.name).toBe('Destape de tubería');
    expect(service.basePrice).toBe(50000);
    expect(service.estimatedDuration).toBe(60);
    expect(service.status).toBe(ServiceStatus.Active);
    expect(service.type).toBe(ServiceType.Standard);
  });

  it('is equal to another service with the same id', () => {
    const id = ServiceId.create();
    const providerId = ProviderId.create();
    const categoryId = CategoryId.create();
    const now = new Date();
    const props = {
      providerId,
      categoryId,
      name: 'Servicio',
      description: 'Desc',
      basePrice: 1000,
      estimatedDuration: 30,
      status: ServiceStatus.Active,
      type: ServiceType.Standard,
      createdAt: now,
      updatedAt: now,
    };
    const a = new Service(id, props);
    const b = new Service(id, props);
    expect(a.equals(b)).toBe(true);
  });
});
