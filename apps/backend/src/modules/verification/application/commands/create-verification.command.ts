import { VerificationType } from '../../domain/value-objects/verification-type.value-object';

/**
 * Intent to create a new Verification. Plain data — no behavior.
 */
export class CreateVerificationCommand {
  constructor(
    public readonly identityId: string,
    public readonly type: VerificationType,
  ) {}
}
