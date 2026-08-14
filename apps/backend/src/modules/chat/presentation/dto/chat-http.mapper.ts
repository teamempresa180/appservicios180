import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateChatCommand } from '../../application/commands/create-chat.command';
import { ChatDto } from '../../application/dto/chat.dto';
import { CreateChatRequestDto } from './create-chat.request.dto';
import { ChatResponseDto } from './chat.response.dto';
import { ChatListResponseDto } from './chat-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `ChatController` never builds a `CreateChatCommand`
 * or a `ChatResponseDto` by hand. No `toUpdateCommand`: there is no
 * `UpdateChatCommand` in the Application layer, only Create/Close.
 */
export class ChatHttpMapper {
  static toCreateCommand(
    dto: CreateChatRequestDto,
    caller: AuthenticatedUser,
  ): CreateChatCommand {
    return new CreateChatCommand(
      dto.orderId,
      dto.clientIdentityId,
      dto.providerId,
      dto.type,
      caller,
    );
  }

  static toResponse(dto: ChatDto): ChatResponseDto {
    const response = new ChatResponseDto();
    response.id = dto.id;
    response.orderId = dto.orderId;
    response.clientIdentityId = dto.clientIdentityId;
    response.providerId = dto.providerId;
    response.status = dto.status;
    response.type = dto.type;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(result: PaginatedResult<ChatDto>): ChatListResponseDto {
    const response = new ChatListResponseDto();
    response.items = result.items.map((item) =>
      ChatHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
