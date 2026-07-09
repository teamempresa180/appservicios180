import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';

/**
 * Intent to update an existing Verification. Plain data — no behavior.
 */
export class UpdateVerificationCommand {
  constructor(
    public readonly id: string,
    public readonly status?: VerificationStatus,
  ) {}
}
