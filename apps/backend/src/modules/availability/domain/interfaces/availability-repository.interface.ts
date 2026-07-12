import { PaginatedResult } from '../../../core/application/paginated-result';
import { Availability } from '../entities/availability.entity';
import { AvailabilityId } from '../value-objects/availability-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Availability persistence. No implementation lives in
 * this module — concrete repositories belong to the infrastructure
 * layer (Sprint 3, Etapa 7: `PrismaAvailabilityRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject an `AvailabilityRepository` implementation by
 *  contract instead of by concrete class. */
export const AVAILABILITY_REPOSITORY = Symbol('AvailabilityRepository');

export interface AvailabilityRepository {
  findById(id: AvailabilityId): Promise<Availability | null>;
  findByProviderId(providerId: ProviderId): Promise<Availability[]>;
  save(availability: Availability): Promise<void>;
  delete(id: AvailabilityId): Promise<void>;
  list(page: number, pageSize: number): Promise<PaginatedResult<Availability>>;
  /** Free-text match against `type`/`status`. */
  search(term: string): Promise<Availability[]>;
}
