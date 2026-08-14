import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { MessageType } from '../../domain/value-objects/message-type.value-object';
import { SendMessageCommand } from '../commands/send-message.command';
import { MessageValidator } from './message.validator';

describe('MessageValidator', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  function validCommand(
    overrides: Partial<{ chatId: string }> = {},
  ): SendMessageCommand {
    return new SendMessageCommand(
      overrides.chatId ?? 'chat-1',
      'identity-1',
      'Hello there',
      MessageType.Text,
      caller,
    );
  }

  describe('validateSend', () => {
    it('passes for a well-formed command', () => {
      expect(() => MessageValidator.validateSend(validCommand())).not.toThrow();
    });

    it('rejects a blank chatId', () => {
      expect(() =>
        MessageValidator.validateSend(validCommand({ chatId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a blank content', () => {
      expect(() =>
        MessageValidator.validateSend(
          new SendMessageCommand(
            'chat-1',
            'identity-1',
            '  ',
            MessageType.Text,
            caller,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        MessageValidator.validateSend(
          new SendMessageCommand(
            'chat-1',
            'identity-1',
            'Hello',
            'INVALID' as MessageType,
            caller,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });
});
