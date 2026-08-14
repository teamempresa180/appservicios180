import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Contacts by a free-text term. Plain data — no
 * behavior. `caller` scopes the search to that Identity's own
 * Contacts, exactly like `ListContactQuery` — a contact value is an
 * email address or a phone number, so an unscoped search would be a
 * directory of every user's contact details.
 */
export class SearchContactQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly term: string,
  ) {}
}
