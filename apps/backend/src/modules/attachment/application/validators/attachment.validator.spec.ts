import { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { Role } from '../../../../common/auth/role.enum';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { AttachmentType } from '../../domain/value-objects/attachment-type.value-object';
import { CreateAttachmentCommand } from '../commands/create-attachment.command';
import { AttachmentValidator } from './attachment.validator';

describe('AttachmentValidator', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  function validCommand(
    overrides: Partial<{ messageId: string }> = {},
  ): CreateAttachmentCommand {
    return new CreateAttachmentCommand(
      caller,
      overrides.messageId ?? 'message-1',
      'photo.jpg',
      'image/jpeg',
      2048,
      AttachmentType.Image,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        AttachmentValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank messageId', () => {
      expect(() =>
        AttachmentValidator.validateCreate(validCommand({ messageId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a non-positive fileSize', () => {
      expect(() =>
        AttachmentValidator.validateCreate(
          new CreateAttachmentCommand(
            caller,
            'message-1',
            'photo.jpg',
            'image/jpeg',
            0,
            AttachmentType.Image,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        AttachmentValidator.validateCreate(
          new CreateAttachmentCommand(
            caller,
            'message-1',
            'photo.jpg',
            'image/jpeg',
            2048,
            'INVALID' as AttachmentType,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
