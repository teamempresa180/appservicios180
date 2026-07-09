import { Entity } from '../../../core/domain/base/entity.base';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { NotificationId } from '../value-objects/notification-id.value-object';
import { NotificationType } from '../value-objects/notification-type.value-object';
import { NotificationStatus } from '../value-objects/notification-status.value-object';

export interface NotificationProps {
  identityId: IdentityId;
  title: string;
  body: string;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: Date;
  readAt: Date | null;
}

/**
 * Represents a notification sent by the system to an Identity.
 * Pure data holder — no FCM, no APNs, no email, no SMS, no push, no
 * channels, no delivery logic, no persistence, no business rules.
 */
export class Notification extends Entity<NotificationId> {
  public readonly identityId: IdentityId;
  public readonly title: string;
  public readonly body: string;
  public readonly type: NotificationType;
  public readonly status: NotificationStatus;
  public readonly createdAt: Date;
  public readonly readAt: Date | null;

  constructor(id: NotificationId, props: NotificationProps) {
    super(id);
    this.identityId = props.identityId;
    this.title = props.title;
    this.body = props.body;
    this.type = props.type;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.readAt = props.readAt;
  }
}
