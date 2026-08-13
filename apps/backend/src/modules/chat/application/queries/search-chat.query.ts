import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Chats by a free-text term. Plain data — no
 * behavior. Carries the authenticated `caller`: results are scoped to
 * the conversations that caller takes part in.
 */
export class SearchChatQuery {
  constructor(
    public readonly term: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
