import { AvailabilityType } from '../../domain/value-objects/availability-type.value-object';

/**
 * Intent to create a new Availability. Plain data — no behavior.
 */
export class CreateAvailabilityCommand {
  constructor(
    public readonly providerId: string,
    public readonly type: AvailabilityType,
    public readonly availableFrom: Date,
    public readonly availableTo: Date,
  ) {}
}
