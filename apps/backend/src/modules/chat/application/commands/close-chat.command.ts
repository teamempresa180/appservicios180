import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to close an existing Chat. Plain data — no behavior. Carries
 * the authenticated `caller` so only a participant (or an Admin) can
 * end the conversation.
 */
export class CloseChatCommand {
  constructor(
    public readonly id: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
