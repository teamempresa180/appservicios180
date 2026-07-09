import { ContactType } from '../../domain/value-objects/contact-type.value-object';

/**
 * Intent to create a new Contact. Plain data — no behavior.
 */
export class CreateContactCommand {
  constructor(
    public readonly identityId: string,
    public readonly type: ContactType,
    public readonly value: string,
  ) {}
}
