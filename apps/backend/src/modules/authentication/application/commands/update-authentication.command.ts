import { AuthenticationStatus } from '../../domain/value-objects/authentication-status.value-object';

/**
 * Intent to update an existing Authentication method. Plain data — no behavior.
 */
export class UpdateAuthenticationCommand {
  constructor(
    public readonly id: string,
    public readonly status?: AuthenticationStatus,
  ) {}
}
