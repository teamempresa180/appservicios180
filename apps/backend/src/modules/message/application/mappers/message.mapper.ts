import { Message } from '../../domain/entities/message.entity';
import { MessageDto } from '../dto/message.dto';

/**
 * Translates between the Message domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class MessageMapper {
  static toDto(message: Message): MessageDto {
    const dto = new MessageDto();
    dto.id = message.id.value;
    dto.chatId = message.chatId.value;
    dto.senderIdentityId = message.senderIdentityId.value;
    dto.content = message.content;
    dto.type = message.type;
    dto.status = message.status;
    dto.sentAt = message.sentAt;
    dto.readAt = message.readAt;
    return dto;
  }
}
