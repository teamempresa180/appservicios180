import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { CreateChatCommand } from '../commands/create-chat.command';
import { CloseChatCommand } from '../commands/close-chat.command';

/**
 * Structural validation for Chat commands — required fields,
 * well-formed values. No `validateUpdate`: no `UpdateChatCommand`
 * exists in the skeleton, only Create/Close.
 */
export class ChatValidator {
  static validateCreate(command: CreateChatCommand): void {
    if (!command.orderId?.trim()) {
      throw new ValidationException('orderId is required');
    }
    if (!command.clientIdentityId?.trim()) {
      throw new ValidationException('clientIdentityId is required');
    }
    if (!command.providerId?.trim()) {
      throw new ValidationException('providerId is required');
    }
    if (!Object.values(ChatType).includes(command.type)) {
      throw new ValidationException(
        `type must be one of: ${Object.values(ChatType).join(', ')}`,
      );
    }
  }

  static validateClose(command: CloseChatCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
  }
}
