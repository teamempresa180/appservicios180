import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to search Messages by a free-text term. Plain data — no
 * behavior. Carries the authenticated `caller`: results never reach
 * outside the Chats that caller takes part in.
 */
export class SearchMessageQuery {
  constructor(
    public readonly term: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
