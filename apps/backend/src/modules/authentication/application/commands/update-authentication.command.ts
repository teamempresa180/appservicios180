import { Role } from '../../../../common/auth/role.enum';
import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * Intent to update an existing Authentication method. Plain data — no
 * behavior.
 *
 * `callerId`/`callerRole` identify the authenticated caller.
 * `UpdateAuthenticationUseCase` refuses to touch a record belonging to
 * another Identity — without that check any authenticated user could
 * set someone else's `Password` method to `Locked` and lock them out
 * of their account, since `LoginUseCase` requires an *active* method.
 */
export class UpdateAuthenticationCommand {
  constructor(
    public readonly id: string,
    public readonly callerId: string,
    public readonly callerRole: Role,
    public readonly status?: AuthenticationStatus,
  ) {}
}
