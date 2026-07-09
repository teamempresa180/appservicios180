import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProfileId } from '../value-objects/profile-id.value-object';
import { ProfileVisibility } from '../value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../value-objects/profile-status.value-object';

export interface ProfileProps {
  identityId: IdentityId;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  visibility: ProfileVisibility;
  status: ProfileStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Represents the public/social profile of a person.
 * Pure data holder — no behavior, no persistence, no business rules.
 */
export class Profile extends Entity<ProfileId> {
  public readonly identityId: IdentityId;
  public readonly displayName: string;
  public readonly avatarUrl: string | null;
  public readonly bio: string | null;
  public readonly visibility: ProfileVisibility;
  public readonly status: ProfileStatus;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(id: ProfileId, props: ProfileProps) {
    super(id);
    this.identityId = props.identityId;
    this.displayName = props.displayName;
    this.avatarUrl = props.avatarUrl;
    this.bio = props.bio;
    this.visibility = props.visibility;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
