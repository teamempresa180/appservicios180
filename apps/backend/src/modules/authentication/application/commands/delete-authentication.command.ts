import { Role } from '../../../../common/auth/role.enum';

/**
 * Intent to delete an existing Authentication method. Plain data — no
 * behavior. `callerId`/`callerRole` carry the authenticated caller —
 * see `UpdateAuthenticationCommand` for why every by-id operation
 * needs them (deleting someone else's only `Password` method locks
 * them out just as effectively as locking it).
 */
export class DeleteAuthenticationCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
  ) {}
}
