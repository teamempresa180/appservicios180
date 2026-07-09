import { Notification } from '../entities/notification.entity';
import { NotificationId } from '../value-objects/notification-id.value-object';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';

/**
 * Contract for Notification persistence. No implementation lives in this
 * module — concrete repositories belong to the infrastructure layer, not yet built.
 */
export interface NotificationRepository {
  findById(id: NotificationId): Promise<Notification | null>;
  findByIdentityId(identityId: IdentityId): Promise<Notification[]>;
  save(notification: Notification): Promise<void>;
}
