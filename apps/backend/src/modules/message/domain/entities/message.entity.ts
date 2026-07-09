import { Entity } from '../../../core/domain/base/entity.base';
import { ChatId } from '../../../chat/domain/value-objects/chat-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { MessageId } from '../value-objects/message-id.value-object';
import { MessageType } from '../value-objects/message-type.value-object';
import { MessageStatus } from '../value-objects/message-status.value-object';

export interface MessageProps {
  chatId: ChatId;
  senderIdentityId: IdentityId;
  content: string;
  type: MessageType;
  status: MessageStatus;
  sentAt: Date;
  readAt: Date | null;
}

/**
 * Represents an individual message belonging to a Chat.
 * Pure data holder — no real-time transport, no WebSockets, no attachments,
 * no AI, no translation, no moderation, no persistence, no business rules.
 */
export class Message extends Entity<MessageId> {
  public readonly chatId: ChatId;
  public readonly senderIdentityId: IdentityId;
  public readonly content: string;
  public readonly type: MessageType;
  public readonly status: MessageStatus;
  public readonly sentAt: Date;
  public readonly readAt: Date | null;

  constructor(id: MessageId, props: MessageProps) {
    super(id);
    this.chatId = props.chatId;
    this.senderIdentityId = props.senderIdentityId;
    this.content = props.content;
    this.type = props.type;
    this.status = props.status;
    this.sentAt = props.sentAt;
    this.readAt = props.readAt;
  }
}
