import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * Intent to create a new Chat. Plain data — no behavior. Carries the
 * authenticated `caller` so the Use Case can refuse to open a
 * conversation between two other people.
 */
export class CreateChatCommand {
  constructor(
    public readonly orderId: string,
    public readonly clientIdentityId: string,
    public readonly providerId: string,
    public readonly type: ChatType,
    public readonly caller: AuthenticatedUser,
  ) {}
}
