import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { VerificationType } from '../../domain/value-objects/verification-type.value-object';

/**
 * Intent to create a new Verification. Plain data — no behavior.
 * Carries the authenticated `caller`: a Verification may only be
 * opened for the caller's own Identity.
 */
export class CreateVerificationCommand {
  constructor(
    public readonly identityId: string,
    public readonly type: VerificationType,
    public readonly caller: AuthenticatedUser,
  ) {}
}
