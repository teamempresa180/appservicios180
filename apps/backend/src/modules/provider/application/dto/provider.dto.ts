import { ProviderStatus } from '../../domain/value-objects/provider-status.value-object';
import { ProviderType } from '../../domain/value-objects/provider-type.value-object';
import { ProviderExperience } from '../../domain/value-objects/provider-experience.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class ProviderDto {
  id!: string;
  identityId!: string;
  providerProfileId!: string;
  categoryId!: string | null;
  specialization!: string | null;
  status!: ProviderStatus;
  type!: ProviderType;
  experience!: ProviderExperience;
  biography!: string;
  yearsOfExperience!: number;
  createdAt!: Date;
  updatedAt!: Date;
}
