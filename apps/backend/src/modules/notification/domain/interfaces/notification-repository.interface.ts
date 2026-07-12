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
  list(page: number, pageSize: number): Promise<PaginatedResult<Notification>>;
  /** Free-text match against `title`/`body`. */
  search(term: string): Promise<Notification[]>;
}
