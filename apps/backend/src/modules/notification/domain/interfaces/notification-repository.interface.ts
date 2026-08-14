import { PaginatedResult } from '../../../core/application/paginated-result';
import { Notification } from '../entities/notification.entity';
import { NotificationId } from '../value-objects/notification-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Notification persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer
 * (Sprint 3, Etapa 10: `PrismaNotificationRepository`).
 */
/** DI token — interfaces have no runtime value in TS, so NestJS needs
 *  this to inject a `NotificationRepository` implementation by
 *  contract instead of by concrete class. */
export const NOTIFICATION_REPOSITORY = Symbol('NotificationRepository');

export interface NotificationRepository {
  findById(id: NotificationId): Promise<Notification | null>;
  findByIdentityId(identityId: IdentityId): Promise<Notification[]>;
  save(notification: Notification): Promise<void>;
  delete(id: NotificationId): Promise<void>;
  /**
   * Paginates Notifications. `identityId` restricts the page (and its
   * `total`) to the ones addressed to that Identity — a Notification's
   * `identityId` is its recipient, and its body quotes order details,
   * names and prices, so callers read their own inbox unless they are
   * an `Admin`, in which case the scope is omitted.
   */
  list(
    page: number,
    pageSize: number,
    identityId?: IdentityId,
  ): Promise<PaginatedResult<Notification>>;
  /**
   * Free-text match against `title`/`body`, scoped to `identityId`
   * when given — same recipient rule as `list`.
   */
  search(term: string, identityId?: IdentityId): Promise<Notification[]>;
}
