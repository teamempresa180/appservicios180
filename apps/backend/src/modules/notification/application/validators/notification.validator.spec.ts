import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { NotificationType } from '../../domain/value-objects/notification-type.value-object';
import { CreateNotificationCommand } from '../commands/create-notification.command';
import { NotificationValidator } from './notification.validator';

describe('NotificationValidator', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  function validCommand(
    overrides: Partial<{ identityId: string }> = {},
  ): CreateNotificationCommand {
    return new CreateNotificationCommand(
      caller,
      overrides.identityId ?? 'identity-1',
      'Your order was accepted',
      'Provider accepted your order request.',
      NotificationType.Info,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        NotificationValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank identityId', () => {
      expect(() =>
        NotificationValidator.validateCreate(
          validCommand({ identityId: '  ' }),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects a blank title', () => {
      expect(() =>
        NotificationValidator.validateCreate(
          new CreateNotificationCommand(
            caller,
            'identity-1',
            '  ',
            'body',
            NotificationType.Info,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        NotificationValidator.validateCreate(
          new CreateNotificationCommand(
            caller,
            'identity-1',
            'title',
            'body',
            'INVALID' as NotificationType,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
