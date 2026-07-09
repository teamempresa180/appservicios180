import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';

/**
 * Input shape for creating a Profile. No validation.
 */
export class CreateProfileDto {
  identityId!: string;
  displayName!: string;
  avatarUrl!: string | null;
  bio!: string | null;
  visibility!: ProfileVisibility;
}
