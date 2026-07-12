import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { SendMessageCommand } from '../commands/send-message.command';

/**
 * Structural validation for Message commands — required fields,
 * well-formed values. No `validateUpdate`: no `UpdateMessageCommand`
 * exists in the skeleton, only Send/Delete.
 */
export class MessageValidator {
  static validateSend(command: SendMessageCommand): void {
    if (!command.chatId?.trim()) {
      throw new ValidationException('chatId is required');
    }
    if (!command.senderIdentityId?.trim()) {
      throw new ValidationException('senderIdentityId is required');
    }
    if (!command.content?.trim()) {
      throw new ValidationException('content is required');
    }
    if (!Object.values(MessageType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(MessageType).join(', ')}`,
      );
    }
  }
}
