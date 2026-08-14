import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';

/**
 * Intent to create a new Notification. Plain data — no behavior.
 *
 * `caller` is carried for symmetry with the other Notification
 * commands, but `CreateNotificationUseCase` deliberately does *not*
 * require it to match `identityId`: notifying the counterparty of an
 * order is the entire point of the entity, so a self-only rule would
 * break the domain. Restricting who may send notifications needs a
 * service-account concept that does not exist yet — see the Etapa 18
 * report.
 */
export class CreateNotificationCommand {
  constructor(
    public readonly caller: AuthenticatedUser,
    public readonly identityId: string,
    public readonly title: string,
    public readonly body: string,
    public readonly type: NotificationType,
  ) {}
}
