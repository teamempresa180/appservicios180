import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';
import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class AvailabilityDto {
  id!: string;
  providerId!: string;
  status!: AvailabilityStatus;
  type!: AvailabilityType;
  availableFrom!: Date;
  availableTo!: Date;
  createdAt!: Date;
  updatedAt!: Date;
}
