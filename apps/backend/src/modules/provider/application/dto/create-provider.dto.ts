import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * Input shape for creating a Provider. No validation.
 */
export class CreateProviderDto {
  identityId!: string;
  providerProfileId!: string;
  type!: ProviderType;
  experience!: ProviderExperience;
  biography!: string;
  yearsOfExperience!: number;
}
