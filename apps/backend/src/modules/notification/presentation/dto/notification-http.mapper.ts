import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateNotificationCommand } from '../../application/commands/create-notification.command';
import { NotificationDto } from '../../application/dto/notification.dto';
import { CreateNotificationRequestDto } from './create-notification.request.dto';
import { NotificationResponseDto } from './notification.response.dto';
import { NotificationListResponseDto } from './notification-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `NotificationController` never builds a
 * `CreateNotificationCommand` or a `NotificationResponseDto` by hand.
 * No `toUpdateCommand`: there is no `UpdateNotificationCommand` in
 * the Application layer, only Create/MarkAsRead/Delete.
 */
export class NotificationHttpMapper {
  static toCreateCommand(
    dto: CreateNotificationRequestDto,
  ): CreateNotificationCommand {
    return new CreateNotificationCommand(
      dto.identityId,
      dto.title,
      dto.body,
      dto.type,
    );
  }

  static toResponse(dto: NotificationDto): NotificationResponseDto {
    const response = new NotificationResponseDto();
    response.id = dto.id;
    response.identityId = dto.identityId;
    response.title = dto.title;
    response.body = dto.body;
    response.type = dto.type;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.readAt = dto.readAt ? dto.readAt.toISOString() : null;
    return response;
  }

  static toListResponse(
    result: PaginatedResult<NotificationDto>,
  ): NotificationListResponseDto {
    const response = new NotificationListResponseDto();
    response.items = result.items.map((item) =>
      NotificationHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
