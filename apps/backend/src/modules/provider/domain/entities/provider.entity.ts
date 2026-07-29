import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../../../profiles/domain/value-objects/profile-id.value-object';
import { CategoryId } from '../../../category/domain/value-objects/category-id.value-object';
import { ProviderId } from '../value-objects/provider-id.value-object';
import { ProviderStatus } from '../value-objects/provider-status.value-object';
import { ProviderType } from '../value-objects/provider-type.value-object';
import { ProviderExperience } from '../value-objects/provider-experience.value-object';

export interface ProviderProps {
  identityId: IdentityId;
  providerProfileId: ProfileId;
  categoryId?: CategoryId | null;
  specialization?: string | null;
  status: ProviderStatus;
  type: ProviderType;
  experience: ProviderExperience;
  biography: string;
  yearsOfExperience: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the professional profile of a person as a service provider.
 * `categoryId`/`specialization` are optional (nullable) so existing
 * providers created before this field existed — and any future flow
 * that doesn't collect a category — remain valid; no behavior beyond
 * plain data, no persistence, no business rules.
 */
export class Provider extends Entity<ProviderId> {
  public readonly identityId: IdentityId;
  public readonly providerProfileId: ProfileId;
  public readonly categoryId: CategoryId | null;
  public readonly specialization: string | null;
  public readonly status: ProviderStatus;
  public readonly type: ProviderType;
  public readonly experience: ProviderExperience;
  public readonly biography: string;
  public readonly yearsOfExperience: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: ProviderId, props: ProviderProps) {
    super(id);
    this.identityId = props.identityId;
    this.providerProfileId = props.providerProfileId;
    this.categoryId = props.categoryId ?? null;
    this.specialization = props.specialization ?? null;
    this.status = props.status;
    this.type = props.type;
    this.experience = props.experience;
    this.biography = props.biography;
    this.yearsOfExperience = props.yearsOfExperience;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
