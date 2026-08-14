import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { assertPayer } from '../authorization/payment-access';
import { UpdatePaymentCommand } from '../commands/update-payment.command';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';
import { PaymentValidator } from '../validators/payment.validator';

/**
 * Updates the `status` of an existing Payment — `quoteId`/`orderId`/
 * `payerIdentityId`/`receiverProviderId`/`amount`/`method` are not
 * offered by `UpdatePaymentCommand`, so they stay untouched.
 *
 * Restricted to the original payer (or an Admin): the receiving
 * Provider can read the record but must not be able to declare a
 * payment `Completed` on the payer's behalf.
 */
export class UpdatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(command: UpdatePaymentCommand): Promise<PaymentDto> {
    PaymentValidator.validateUpdate(command);

    const id = PaymentId.fromString(command.id);
    const existing = await this.paymentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Payment ${command.id} not found`);
    }
    assertPayer(existing, command.caller, 'update');

    const updated = new Payment(existing.id, {
      quoteId: existing.quoteId,
      orderId: existing.orderId,
      payerIdentityId: existing.payerIdentityId,
      receiverProviderId: existing.receiverProviderId,
      amount: existing.amount,
      method: existing.method,
      status: command.status ?? existing.status,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.paymentRepository.save(updated);
    return PaymentMapper.toDto(updated);
  }
}
