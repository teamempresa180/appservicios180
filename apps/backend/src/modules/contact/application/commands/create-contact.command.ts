import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ContactType } from '../../domain/value-objects/contact-type.value-object';

/**
 * Intent to create a new Contact. Plain data — no behavior.
 * `caller` is the authenticated user: `CreateContactUseCase` rejects
 * an `identityId` that is not the caller's own, so a contact channel
 * can never be planted on another Identity.
 */
export class CreateContactCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly identityId: string,
    public readonly type: ContactType,
    public readonly value: string,
  ) {}
}
