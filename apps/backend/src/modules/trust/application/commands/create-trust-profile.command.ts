import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';

/**
 * Intent to create a new Trust profile. Plain data — no behavior.
 * Carries the authenticated `caller`: a Trust profile may only be
 * opened for the caller's own Identity.
 */
export class CreateTrustProfileCommand {
  constructor(
    public readonly identityId: string,
    public readonly score: number,
    public readonly level: TrustLevel,
    public readonly caller: AuthenticatedUser,
  ) {}
}
