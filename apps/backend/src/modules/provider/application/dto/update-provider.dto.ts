import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * Input shape for updating a Provider. No validation.
 */
export class UpdateProviderDto {
  biography?: string;
  yearsOfExperience?: number;
  experience?: ProviderExperience;
  status?: ProviderStatus;
}
