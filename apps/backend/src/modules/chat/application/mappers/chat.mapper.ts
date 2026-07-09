import { Chat } from '../../domain/entities/chat.entity';
import { ChatDto } from '../dto/chat.dto';

/**
 * Translates between the Chat domain entity and its DTOs.
 * Simple field-by-field mapping only — no business logic.
 */
export class ChatMapper {
  static toDto(chat: Chat): ChatDto {
    const dto = new ChatDto();
    dto.id = chat.id.value;
    dto.orderId = chat.orderId.value;
    dto.clientIdentityId = chat.clientIdentityId.value;
    dto.providerId = chat.providerId.value;
    dto.status = chat.status;
    dto.type = chat.type;
    dto.createdAt = chat.createdAt;
    dto.updatedAt = chat.updatedAt;
    return dto;
  }
}
