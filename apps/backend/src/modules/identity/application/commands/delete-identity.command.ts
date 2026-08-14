import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to delete an existing Identity. Plain data — no behavior.
 * `callerId`/`callerRole` carry the authenticated caller — see
 * `UpdateIdentityCommand` for why every by-id Identity operation needs
 * them.
 */
export class DeleteIdentityCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
