import { Role } from '../../../../common/auth/role.enum';
import type { AuthenticatedUser } from '../../../../common/auth/authenticated-user.interface';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { CreateChatCommand } from '../commands/create-chat.command';
import { CloseChatCommand } from '../commands/close-chat.command';
import { ChatValidator } from './chat.validator';

describe('ChatValidator', () => {
  const caller: AuthenticatedUser = { id: 'identity-1', role: Role.Customer };

  function validCommand(
    overrides: Partial<{ orderId: string }> = {},
  ): CreateChatCommand {
    return new CreateChatCommand(
      overrides.orderId ?? 'order-1',
      'identity-1',
      'provider-1',
      ChatType.OrderRelated,
      caller,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() => ChatValidator.validateCreate(validCommand())).not.toThrow();
    });

    it('rejects a blank orderId', () => {
      expect(() =>
        ChatValidator.validateCreate(validCommand({ orderId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        ChatValidator.validateCreate(
          new CreateChatCommand(
            'order-1',
            'identity-1',
            'provider-1',
            'INVALID' as ChatType,
            caller,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateClose', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ChatValidator.validateClose(new CloseChatCommand('id-1', caller)),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ChatValidator.validateClose(new CloseChatCommand('  ', caller)),
      ).toThrow(ValidationException);
    });
  });
});
