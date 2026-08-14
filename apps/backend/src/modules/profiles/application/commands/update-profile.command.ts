import { Role } from '../../../../common/auth/role.enum';
import { ProfileVisibility } from '../../domain/value-objects/profile-visibility.value-object';
import { ProfileStatus } from '../../domain/value-objects/profile-status.value-object';

/**
 * Intent to update an existing Profile. Plain data — no behavior.
 * `callerId`/`callerRole` carry the authenticated caller — see
 * `CreateProfileCommand` for why writing to someone else's Profile has
 * to be refused.
 */
export class UpdateProfileCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
    public readonly displayName?: string,
    public readonly visibility?: ProfileVisibility,
    public readonly status?: ProfileStatus,
  ) {}
}
