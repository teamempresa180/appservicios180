import { ServiceStatus } from '../../domain/value-objects/service-status.value-object';

/**
 * Intent to update an existing Service. Plain data — no behavior.
 */
export class UpdateServiceCommand {
  constructor(
    public readonly id: string,
    public readonly basePrice?: number,
    public readonly estimatedDuration?: number,
    public readonly status?: ServiceStatus,
  ) {}
}
