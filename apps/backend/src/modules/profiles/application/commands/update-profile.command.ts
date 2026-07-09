import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';

/**
 * Intent to update an existing Profile. Plain data — no behavior.
 */
export class UpdateProfileCommand {
  constructor(
    public readonly id: string,
    public readonly displayName?: string,
    public readonly visibility?: ProfileVisibility,
    public readonly status?: ProfileStatus,
  ) {}
}
