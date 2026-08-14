import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to delete an existing Credential record. Plain data — no
 * behavior. `callerId`/`callerRole` carry the authenticated caller —
 * see `UpdateCredentialCommand` for why every by-id Credential
 * operation needs them.
 */
export class DeleteCredentialCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
