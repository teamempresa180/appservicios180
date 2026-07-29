import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * Intent to create a new Provider. Plain data — no behavior.
 */
export class CreateProviderCommand {
  constructor(
    public readonly identityId: string,
    public readonly providerProfileId: string,
    public readonly type: ProviderType,
    public readonly experience: ProviderExperience,
    public readonly biography: string,
    public readonly yearsOfExperience: number,
    public readonly categoryId?: string,
    public readonly specialization?: string,
  ) {}
}
