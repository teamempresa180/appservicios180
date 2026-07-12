import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { CreatePaymentCommand } from '../commands/create-payment.command';
import { UpdatePaymentCommand } from '../commands/update-payment.command';
import { PaymentValidator } from './payment.validator';

describe('PaymentValidator', () => {
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
          ),
        ),
      ).toThrow(ValidationException);
    });
  });

  describe('validateUpdate', () => {
    it('passes for a well-formed command', () => {
      expect(() =>
        PaymentValidator.validateUpdate(
          new UpdatePaymentCommand('id-1', PaymentStatus.Completed),
        ),
      ).not.toThrow();
    });

    it('rejects a blank id', () => {
      expect(() =>
        PaymentValidator.validateUpdate(new UpdatePaymentCommand('  ')),
      ).toThrow(ValidationException);
    });

    it('rejects an invalid status when provided', () => {
      expect(() =>
        PaymentValidator.validateUpdate(
          new UpdatePaymentCommand('id-1', 'INVALID' as PaymentStatus),
        ),
      ).toThrow(ValidationException);
    });
  });
});
