import { Role } from '../../../../common/auth/role.enum';
import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * Intent to update an existing Identity. Plain data — no behavior.
 *
 * `callerId`/`callerRole` identify who is asking (the authenticated
 * `Identity` behind the request). `UpdateIdentityUseCase` refuses to
 * touch an Identity other than the caller's own — without them the
 * endpoint would be a plain IDOR: any authenticated user could rename
 * or deactivate anyone else's Identity by id.
 */
export class UpdateIdentityCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
    public readonly fullName?: string,
    public readonly status?: IdentityStatus,
  ) {}
}
