import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class ProfileDto {
  id!: string;
  identityId!: string;
  displayName!: string;
  avatarUrl!: string | null;
  bio!: string | null;
  visibility!: ProfileVisibility;
  status!: ProfileStatus;
  createdAt!: Date;
  updatedAt!: Date;
}
