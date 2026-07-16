/**
 * Intent to change the password on an existing `Password`-type
 * Credential. Plain data — no behavior. Both fields are plaintext
 * passwords, never persisted as-is — see `ChangePasswordUseCase`.
 */
export class ChangePasswordCommand {
  constructor(
    public readonly credentialId: string,
    public readonly currentPassword: string,
    public readonly newPassword: string,
  ) {}
}
