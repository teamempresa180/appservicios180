import { PaginatedResult } from '../../../core/application/paginated-result';
import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { ListNotificationQuery } from '../queries/list-notification.query';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

/**
 * Lists the caller's own Notifications page by page. The scope is
 * applied in the repository query (not filtered after the fact) so
 * `total` and the page window both describe the caller's own inbox —
 * the unscoped listing handed every user's notifications, order
 * details and prices included, to any authenticated caller. An
 * `Admin` caller lists every Notification.
 */
export class ListNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(
    query: ListNotificationQuery,
  ): Promise<PaginatedResult<NotificationDto>> {
    const scope = ownershipScope(query.caller);
    const result = await this.notificationRepository.list(
      query.page,
      query.pageSize,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
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
