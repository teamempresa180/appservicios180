import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { VerificationStatus } from '../../domain/value-objects/verification-status.value-object';

/**
 * Intent to update an existing Verification. Plain data — no behavior.
 * Carries the authenticated `caller`: `status` is the KYC decision
 * itself, so who is asking decides which transitions are legal.
 */
export class UpdateVerificationCommand {
  constructor(
    public readonly id: string,
    public readonly status: VerificationStatus | undefined,
    public readonly caller: AuthenticatedUser,
  ) {}
}
