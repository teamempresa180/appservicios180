import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to delete an existing Profile. Plain data — no behavior.
 * `callerId`/`callerRole` carry the authenticated caller — see
 * `CreateProfileCommand`.
 */
export class DeleteProfileCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
