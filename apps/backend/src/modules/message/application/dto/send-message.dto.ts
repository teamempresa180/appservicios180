import { MessageType } from '../../domain/value-objects/message-type.value-object';

/**
 * Input shape for sending a Message. No validation.
 */
export class SendMessageDto {
  chatId!: string;
  senderIdentityId!: string;
  content!: string;
  type!: MessageType;
}
