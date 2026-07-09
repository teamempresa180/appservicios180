import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';

/**
 * Input shape for creating an Availability. No validation.
 */
export class CreateAvailabilityDto {
  providerId!: string;
  type!: AvailabilityType;
  availableFrom!: Date;
  availableTo!: Date;
}
