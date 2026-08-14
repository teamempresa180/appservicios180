import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to fetch a single Authentication method by id. Plain data —
 * no behavior. `callerId`/`callerRole` carry the authenticated caller
 * — see `UpdateAuthenticationCommand` for why every by-id operation
 * needs them; reading someone else's record reveals which methods
 * their account can authenticate with and whether each is active.
 */
export class GetAuthenticationQuery {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
