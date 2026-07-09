import { CredentialType } from '../../domain/value-objects/credential-type.value-object';

/**
 * Intent to create a new Credential record. Plain data — no behavior.
 */
export class CreateCredentialCommand {
  constructor(
    public readonly identityId: string,
    public readonly type: CredentialType,
  ) {}
}
