import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';

/**
 * Intent to delete an existing Message. Plain data — no behavior.
 * Carries the authenticated `caller`: only the original sender (or an
 * Admin) may delete a message.
 */
export class DeleteMessageCommand {
  constructor(
    public readonly id: string,
    public readonly caller: AuthenticatedUser,
  ) {}
}
