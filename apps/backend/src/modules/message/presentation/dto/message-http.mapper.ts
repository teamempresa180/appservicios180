import { PaginatedResult } from '../../../core/application/paginated-result';
import { SendMessageCommand } from '../../application/commands/send-message.command';
import { MessageDto } from '../../application/dto/message.dto';
import { SendMessageRequestDto } from './send-message.request.dto';
import { MessageResponseDto } from './message.response.dto';
import { MessageListResponseDto } from './message-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `MessageController` never builds a
 * `SendMessageCommand` or a `MessageResponseDto` by hand. No
 * `toUpdateCommand`: there is no `UpdateMessageCommand` in the
 * Application layer, only Send/Delete.
 */
export class MessageHttpMapper {
  static toSendCommand(dto: SendMessageRequestDto): SendMessageCommand {
    return new SendMessageCommand(
      dto.chatId,
      dto.senderIdentityId,
      dto.content,
      dto.type,
    );
  }

  static toResponse(dto: MessageDto): MessageResponseDto {
    const response = new MessageResponseDto();
    response.id = dto.id;
    response.chatId = dto.chatId;
    response.senderIdentityId = dto.senderIdentityId;
    response.content = dto.content;
    response.type = dto.type;
    response.status = dto.status;
    response.sentAt = dto.sentAt.toISOString();
    response.readAt = dto.readAt ? dto.readAt.toISOString() : null;
    return response;
  }

  static toListResponse(
    result: PaginatedResult<MessageDto>,
  ): MessageListResponseDto {
    const response = new MessageListResponseDto();
    response.items = result.items.map((item) =>
      MessageHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
