import { CredentialType } from '../../domain/value-objects/credential-type.value-object';

/**
 * Intent to create a new Credential record. Plain data — no behavior.
 * `password` is required when `type === CredentialType.Password` and
 * forbidden otherwise (`CredentialValidator.validateCreate` enforces
 * this) — it is the plaintext password, hashed by
 * `CreateCredentialUseCase` via `PasswordHasher` before persistence;
 * it is never stored or logged as-is.
 */
export class CreateCredentialCommand {
  constructor(
    public readonly identityId: string,
    public readonly type: CredentialType,
    public readonly password?: string,
  ) {}
}
