import { AuthMethodType } from '../../domain/value-objects/auth-method-type.value-object';

/**
 * Intent to create a new Authentication method. Plain data — no behavior.
 */
export class CreateAuthenticationCommand {
  constructor(
    public readonly identityId: string,
    public readonly methodType: AuthMethodType,
  ) {}
}
