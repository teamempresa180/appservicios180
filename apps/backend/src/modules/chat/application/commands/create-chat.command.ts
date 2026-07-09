import { ChatType } from '../../domain/value-objects/chat-type.value-object';

/**
 * Intent to create a new Chat. Plain data — no behavior.
 */
export class CreateChatCommand {
  constructor(
    public readonly orderId: string,
    public readonly clientIdentityId: string,
    public readonly providerId: string,
    public readonly type: ChatType,
  ) {}
}
