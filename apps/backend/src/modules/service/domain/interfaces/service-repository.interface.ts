import { Service } from '../entities/service.entity';
import { ServiceId } from '../value-objects/service-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';

/**
 * Contract for Service persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface ServiceRepository {
  findById(id: ServiceId): Promise<Service | null>;
  findByProviderId(providerId: ProviderId): Promise<Service[]>;
  findByCategoryId(categoryId: CategoryId): Promise<Service[]>;
  save(service: Service): Promise<void>;
}
