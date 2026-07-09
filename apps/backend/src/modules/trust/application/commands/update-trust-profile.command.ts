import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';
import { TrustStatus } from '../../domain/value-objects/trust-status.value-object';

/**
 * Intent to update an existing Trust profile. Plain data — no behavior.
 */
export class UpdateTrustProfileCommand {
  constructor(
    public readonly id: string,
    public readonly score?: number,
    public readonly level?: TrustLevel,
    public readonly status?: TrustStatus,
  ) {}
}
