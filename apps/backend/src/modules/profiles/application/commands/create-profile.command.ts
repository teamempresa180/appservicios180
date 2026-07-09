import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';

/**
 * Intent to create a new Profile. Plain data — no behavior.
 */
export class CreateProfileCommand {
  constructor(
    public readonly identityId: string,
    public readonly displayName: string,
    public readonly avatarUrl: string | null,
    public readonly bio: string | null,
    public readonly visibility: ProfileVisibility,
  ) {}
}
