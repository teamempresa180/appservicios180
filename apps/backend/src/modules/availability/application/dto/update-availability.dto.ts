import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';

/**
 * Input shape for updating an Availability. No validation.
 */
export class UpdateAvailabilityDto {
  availableFrom?: Date;
  availableTo?: Date;
  status?: AvailabilityStatus;
}
