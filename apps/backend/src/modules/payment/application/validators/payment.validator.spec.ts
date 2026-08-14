import { Caller } from '../../../core/application/caller';
import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { CreatePaymentCommand } from '../commands/create-payment.command';
import { UpdatePaymentCommand } from '../commands/update-payment.command';
import { PaymentValidator } from './payment.validator';

describe('PaymentValidator', () => {
  const caller: Caller = { identityId: 'identity-1', isAdmin: false };

  function validCommand(
    overrides: Partial<{ quoteId: string }> = {},
  ): CreatePaymentCommand {
    return new CreatePaymentCommand(
      overrides.quoteId ?? 'quote-1',
      'order-1',
      'identity-1',
      'provider-1',
      100,
      PaymentMethod.Card,
      caller,
    );
  }

  describe('validateCreate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        PaymentValidator.validateCreate(validCommand()),
      ).not.toThrow();
    });

    it('rejects a blank quoteId', () => {
      expect(() =>
        PaymentValidator.validateCreate(validCommand({ quoteId: '  ' })),
      ).toThrow(ValidationException);
    });

    it('rejects a non-positive amount', () => {
      expect(() =>
        PaymentValidator.validateCreate(
          new CreatePaymentCommand(
            'quote-1',
            'order-1',
            'identity-1',
            'provider-1',
            0,
            PaymentMethod.Card,
            caller,
          ),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid method', () => {
      expect(() =>
        PaymentValidator.validateCreate(
          new CreatePaymentCommand(
            'quote-1',
            'order-1',
            'identity-1',
            'provider-1',
            100,
            'INVALID' as PaymentMethod,
            caller,
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        PaymentValidator.validateUpdate(
          new UpdatePaymentCommand('id-1', caller, PaymentStatus.Completed),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        PaymentValidator.validateUpdate(
          new UpdatePaymentCommand('  ', caller),
        ),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        PaymentValidator.validateUpdate(
          new UpdatePaymentCommand('id-1', caller, 'INVALID' as PaymentStatus),
        ),
      ).toThrow(ValidationException);
    });
  });
});
