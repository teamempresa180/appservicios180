import { PaginatedResult } from '../../../core/application/paginated-result';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { ListNotificationQuery } from '../queries/list-notification.query';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

/** Lists Notifications page by page. */
export class ListNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    query: ListNotificationQuery,
  ): Promise<PaginatedResult<NotificationDto>> {
    const result = await this.notificationRepository.list(
      query.page,
      query.pageSize,
    );
    return {
      items: result.items.map((notification) =>
        NotificationMapper.toDto(notification),
      ),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
