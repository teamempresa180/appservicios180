import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to fetch a single Credential by id. Plain data — no behavior.
 * `callerId`/`callerRole` carry the authenticated caller — see
 * `UpdateCredentialCommand` for why every by-id Credential operation
 * needs them.
 */
export class GetCredentialQuery {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
