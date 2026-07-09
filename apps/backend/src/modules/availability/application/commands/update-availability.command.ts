import { AvailabilityStatus } from '../../domain/value-objects/availability-status.value-object';

/**
 * Intent to update an existing Availability. Plain data — no behavior.
 */
export class UpdateAvailabilityCommand {
  constructor(
    public readonly id: string,
    public readonly availableFrom?: Date,
    public readonly availableTo?: Date,
    public readonly status?: AvailabilityStatus,
  ) {}
}
