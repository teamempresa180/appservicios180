import { Caller } from '../../../core/application/caller';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { QuoteType } from '../../domain/value-objects/quote-type.value-object';
import { CreateQuoteCommand } from '../commands/create-quote.command';
import { UpdateQuoteCommand } from '../commands/update-quote.command';
import { QuoteValidator } from './quote.validator';

describe('QuoteValidator', () => {
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };

  function validCommand(
    overrides: Partial<{ orderId: string }> = {},
  ): CreateQuoteCommand {
    return new CreateQuoteCommand(
      overrides.orderId ?? 'order-1',
      'provider-1',
      100,
      120,
      'Includes parts and labor',
      QuoteType.Standard,
      caller,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() => QuoteValidator.validateCreate(validCommand())).not.toThrow();
    });

    it('rejects a blank orderId', () => {
      expect(() =>
        QuoteValidator.validateCreate(validCommand({ orderId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a negative proposedPrice', () => {
      expect(() =>
        QuoteValidator.validateCreate(
          new CreateQuoteCommand(
            'order-1',
            'provider-1',
            -1,
            120,
            'notes',
            QuoteType.Standard,
            caller,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid type', () => {
      expect(() =>
        QuoteValidator.validateCreate(
          new CreateQuoteCommand(
            'order-1',
            'provider-1',
            100,
            120,
            'notes',
            'INVALID' as QuoteType,
            caller,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        QuoteValidator.validateUpdate(
          new UpdateQuoteCommand('id-1', caller, 150),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        QuoteValidator.validateUpdate(new UpdateQuoteCommand('  ', caller)),
      ).toThrow(ValidationException);
    });

    it('rejects a negative proposedPrice when provided', () => {
      expect(() =>
        QuoteValidator.validateUpdate(
          new UpdateQuoteCommand('id-1', caller, -1),
        ),
      ).toThrow(ValidationException);
    });
  });
});
