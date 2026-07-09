import { TrustLevel } from '../../domain/value-objects/trust-level.value-object';

/**
 * Intent to create a new Trust profile. Plain data — no behavior.
 */
export class CreateTrustProfileCommand {
  constructor(
    public readonly identityId: string,
    public readonly score: number,
    public readonly level: TrustLevel,
  ) {}
}
