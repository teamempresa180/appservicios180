import { PaginatedResult } from '../../../core/application/paginated-result';
import { Service } from '../entities/service.entity';
import { ServiceId } from '../value-objects/service-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';

/**
 * Contract for Service persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 6: `PrismaServiceRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `ServiceRepository` implementation by contract
 *  instead of by concrete class. */
export const SERVICE_REPOSITORY = Symbol('ServiceRepository');

export interface ServiceRepository {
  findById(id: ServiceId): Promise<Service | null>;
  findByProviderId(providerId: ProviderId): Promise<Service[]>;
  findByCategoryId(categoryId: CategoryId): Promise<Service[]>;
  save(service: Service): Promise<void>;
  delete(id: ServiceId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Service>>;
  /** Free-text match against `name`/`description`. */
  search(term: string): Promise<Service[]>;
}
