import { ContactStatus } from '../../domain/value-objects/contact-status.value-object';

/**
 * Intent to update an existing Contact. Plain data — no behavior.
 */
export class UpdateContactCommand {
  constructor(
    public readonly id: string,
    public readonly value?: string,
    public readonly status?: ContactStatus,
  ) {}
}
