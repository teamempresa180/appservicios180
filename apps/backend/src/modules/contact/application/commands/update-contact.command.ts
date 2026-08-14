import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';

/**
 * Intent to update an existing Contact. Plain data — no behavior.
 * `caller` is the authenticated user the ownership check is made
 * against in `UpdateContactUseCase`.
 */
export class UpdateContactCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly id: string,
    public readonly value?: string,
    public readonly status?: ContactStatus,
  ) {}
}
