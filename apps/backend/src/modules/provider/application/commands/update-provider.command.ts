import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * Intent to update an existing Provider. Plain data — no behavior.
 */
export class UpdateProviderCommand {
  constructor(
    public readonly id: string,
    public readonly biography?: string,
    public readonly experience?: ProviderExperience,
    public readonly status?: ProviderStatus,
    public readonly categoryId?: string,
    public readonly specialization?: string,
  ) {}
}
