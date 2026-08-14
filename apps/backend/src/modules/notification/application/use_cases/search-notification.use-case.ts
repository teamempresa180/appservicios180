import { ownershipScope } from '../../../core/application/ownership';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { SearchNotificationQuery } from '../queries/search-notification.query';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

/**
 * Free-text search over `title`/`body`, restricted to the caller's
 * own inbox — same recipient rule as `ListNotificationUseCase`, so
 * search can't be used to walk around the listing's scope.
 */
export class SearchNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: SearchNotificationQuery): Promise<NotificationDto[]> {
    const scope = ownershipScope(query.caller);
    const results = await this.notificationRepository.search(
      query.term,
      scope !== undefined ? IdentityId.fromString(scope) : undefined,
    );
    return results.map((notification) =>
      NotificationMapper.toDto(notification),
    );
  }
}
