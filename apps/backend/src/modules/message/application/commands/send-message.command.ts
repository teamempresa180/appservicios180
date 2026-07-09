import { MessageType } from '../../domain/value-objects/message-type.value-object';

/**
 * Intent to send a new Message. Plain data — no behavior.
 */
export class SendMessageCommand {
  constructor(
    public readonly chatId: string,
    public readonly senderIdentityId: string,
    public readonly content: string,
    public readonly type: MessageType,
  ) {}
}
