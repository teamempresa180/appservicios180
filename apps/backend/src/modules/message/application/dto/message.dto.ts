import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { MessageStatus } from '../../domain/value-objects/message-status.value-object';

/**
 * Output shape returned by queries and use cases.
 */
export class MessageDto {
  id!: string;
  chatId!: string;
  senderIdentityId!: string;
  content!: string;
  type!: MessageType;
  status!: MessageStatus;
  sentAt!: Date;
  readAt!: Date | null;
}
