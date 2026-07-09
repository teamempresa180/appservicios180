import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';

/**
 * Input shape for updating a Profile. No validation.
 */
export class UpdateProfileDto {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  visibility?: ProfileVisibility;
  status?: ProfileStatus;
}
