import { NotificationRepository } from '../../domain/interfaces/notification-repository.interface';
import { SearchNotificationQuery } from '../queries/search-notification.query';
import { NotificationDto } from '../dto/notification.dto';
import { NotificationMapper } from '../mappers/notification.mapper';

/** Free-text search over `title`/`body`. */
export class SearchNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
  ) {}

  async execute(query: SearchNotificationQuery): Promise<NotificationDto[]> {
    const results = await this.notificationRepository.search(query.term);
    return results.map((notification) =>
      NotificationMapper.toDto(notification),
    );
  }
}
