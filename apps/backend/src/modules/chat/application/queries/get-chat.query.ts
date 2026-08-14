import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Chat by id. Plain data — no behavior.
 * Carries the authenticated `caller` so the Use Case can reject reads
 * of somebody else's conversation.
 */
export class GetChatQuery {
  constructor(
    public readonly id: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
