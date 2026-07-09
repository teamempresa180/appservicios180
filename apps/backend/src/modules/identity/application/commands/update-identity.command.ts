import { IdentityStatus } from '../../domain/value-objects/identity-status.value-object';

/**
 * Intent to update an existing Identity. Plain data — no behavior.
 */
export class UpdateIdentityCommand {
  constructor(
    public readonly id: string,
    public readonly fullName?: string,
    public readonly status?: IdentityStatus,
  ) {}
}
