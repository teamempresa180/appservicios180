import { ValidationException } from '../../../core/domain/exceptions/validation.exception';
import { PaymentMethod } from '../../domain/value-objects/payment-method.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { CreatePaymentCommand } from '../commands/create-payment.command';
import { UpdatePaymentCommand } from '../commands/update-payment.command';

/**
 * Structural validation for Payment commands — required fields,
 * well-formed values. No uniqueness check — `findByQuoteId` returns
 * `Payment[]`, so multiple payments per Quote are allowed.
 */
export class PaymentValidator {
  static validateCreate(command: CreatePaymentCommand): void {
    if (!command.quoteId?.trim()) {
      throw new ValidationException('quoteId is required');
    }
    if (!command.orderId?.trim()) {
      throw new ValidationException('orderId is required');
    }
    if (!command.payerIdentityId?.trim()) {
      throw new ValidationException('payerIdentityId is required');
    }
    if (!command.receiverProviderId?.trim()) {
      throw new ValidationException('receiverProviderId is required');
    }
    if (
      typeof command.amount !== 'number' ||
      Number.isNaN(command.amount) ||
      command.amount <= 0
    ) {
      throw new ValidationException('amount must be a positive number');
    }
    if (!Object.values(PaymentMethod).includes(command.method)) {
      throw new ValidationException(
        `method must be one of: ${Object.values(PaymentMethod).join(', ')}`,
      );
    }
  }

  static validateUpdate(command: UpdatePaymentCommand): void {
    if (!command.id?.trim()) {
      throw new ValidationException('id is required');
    }
    if (
      command.status !== undefined &&
      !Object.values(PaymentStatus).includes(command.status)
    ) {
      throw new ValidationException(
        `status must be one of: ${Object.values(PaymentStatus).join(', ')}`,
      );
    }
  }
}
