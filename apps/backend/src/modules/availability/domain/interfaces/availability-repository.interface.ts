import { Availability } from '../entities/availability.entity';
import { AvailabilityId } from '../value-objects/availability-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';

/**
 * Contract for Availability persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface AvailabilityRepository {
  findById(id: AvailabilityId): Promise<Availability | null>;
  findByProviderId(providerId: ProviderId): Promise<Availability[]>;
  save(availability: Availability): Promise<void>;
}
