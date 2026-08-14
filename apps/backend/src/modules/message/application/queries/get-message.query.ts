import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to fetch a single Message by id. Plain data — no behavior.
 * Carries the authenticated `caller`: a Message is only readable by a
 * participant of its Chat.
 */
export class GetMessageQuery {
  constructor(
    public readonly id: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
