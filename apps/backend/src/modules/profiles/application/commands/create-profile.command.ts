import { Role } from '../../../../common/auth/role.enum';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';

/**
 * Intent to create a new Profile. Plain data — no behavior.
 *
 * `callerId`/`callerRole` identify the authenticated caller.
 * `CreateProfileUseCase` requires `identityId === callerId`: without
 * it any authenticated user could attach an arbitrary Profile —
 * display name, bio, avatar — to someone else's Identity, and every
 * screen that reads that account's Profile would render the attacker's
 * content as if the owner had written it.
 */
export class CreateProfileCommand {
  constructor(
    public readonly identityId: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
    public readonly displayName: string,
    public readonly avatarUrl: string | null,
    public readonly bio: string | null,
    public readonly visibility: ProfileVisibility,
  ) {}
}
