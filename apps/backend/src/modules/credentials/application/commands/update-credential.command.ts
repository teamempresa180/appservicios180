import { Role } from '../../../../common/auth/role.enum';
import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';

/**
 * Intent to update an existing Credential record. Plain data — no behavior.
 *
 * `callerId`/`callerRole` identify the authenticated caller.
 * `UpdateCredentialUseCase` refuses to touch a Credential belonging to
 * another Identity — without that check any authenticated user could
 * revoke (i.e. lock out) anyone else's password credential by id.
 */
export class UpdateCredentialCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
    public readonly status?: CredentialStatus,
  ) {}
}
