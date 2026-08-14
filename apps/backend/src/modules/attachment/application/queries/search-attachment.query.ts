import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Attachments by a free-text term. Plain data — no
 * behavior. `caller` scopes the search to Chats that Identity takes
 * part in, exactly like `ListAttachmentQuery` — file names leak what
 * people send each other.
 */
export class SearchAttachmentQuery {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly term: string,
  ) {}
}
