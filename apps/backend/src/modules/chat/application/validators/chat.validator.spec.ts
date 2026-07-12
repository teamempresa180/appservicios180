import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { ChatType } from '../../domain/value-objects/chat-type.value-object';
import { CreateChatCommand } from '../commands/create-chat.command';
import { CloseChatCommand } from '../commands/close-chat.command';
import { ChatValidator } from './chat.validator';

describe('ChatValidator', () => {
  function validCommand(
    overrides: Partial<{ orderId: string }> = {},
  ): CreateChatCommand {
    return new CreateChatCommand(
      overrides.orderId ?? 'order-1',
      'identity-1',
      'provider-1',
      ChatType.OrderRelated,
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
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateClose', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        ChatValidator.validateClose(new CloseChatCommand('id-1')),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        ChatValidator.validateClose(new CloseChatCommand('  ')),
      ).toThrow(ValidationException);
    });
  });
});
