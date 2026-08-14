import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { MessageType } from '../../domain/value-objects/message-type.value-object';

/**
 * Intent to send a new Message. Plain data — no behavior. Carries the
 * authenticated `caller`: the sender must be the caller itself and a
 * participant of the target Chat.
 */
export class SendMessageCommand {
  constructor(
    public readonly chatId: string,
    public readonly senderIdentityId: string,
    public readonly content: string,
    public readonly type: MessageType,
    public readonly caller: AuthenticatedUser,
  ) {}
}
