import { PaginatedResult } from '../../../../core/application/paginated-result';
import { IdentityId } from '../../../../identity/domain/value-objects/identity-id.value-object';
import { Notification } from '../../../domain/entities/notification.entity';
import { NotificationRepository } from '../../../domain/interfaces/notification-repository.interface';
import { NotificationId } from '../../../domain/value-objects/notification-id.value-object';

/** In-memory `NotificationRepository` fake — see `InMemoryIdentityRepository`. */
export class InMemoryNotificationRepository implements NotificationRepository {
  private readonly rows = new Map<string, Notification>();

  findById(id: NotificationId): Promise<Notification | null> {
    return Promise.resolve(this.rows.get(id.value) ?? null);
  }

  findByIdentityId(identityId: IdentityId): Promise<Notification[]> {
    return Promise.resolve(
      [...this.rows.values()].filter((row) =>
        row.identityId.equals(identityId),
      ),
    );
  }

  save(notification: Notification): Promise<void> {
    this.rows.set(notification.id.value, notification);
    return Promise.resolve();
  }

  delete(id: NotificationId): Promise<void> {
    this.rows.delete(id.value);
    return Promise.resolve();
  }

  list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Notification>> {
    const all = [...this.rows.values()].filter(
      (row) => identityId === undefined || row.identityId.equals(identityId),
    );
    const start = (page - 1) * pageSize;
    return Promise.resolve({
      items: all.slice(start, start + pageSize),
      total: all.length,
      page,
      pageSize,
    });
  }

  search(term: string, identityId?: IdentityId): Promise<Notification[]> {
    const lower = term.toLowerCase();
    return Promise.resolve(
      [...this.rows.values()].filter(
        (row) =>
          (identityId === undefined || row.identityId.equals(identityId)) &&
          (row.title.toLowerCase().includes(lower) ||
            row.body.toLowerCase().includes(lower)),
      ),
    );
  }
}
