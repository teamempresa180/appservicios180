import { CredentialStatus } from '../../domain/value-objects/credential-status.value-object';

/**
 * Intent to update an existing Credential record. Plain data — no behavior.
 */
export class UpdateCredentialCommand {
  constructor(
    public readonly id: string,
    public readonly status?: CredentialStatus,
  ) {}
}
