import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { assertPayer } from '../authorization/payment-access';
import { CancelPaymentCommand } from '../commands/cancel-payment.command';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';

/**
 * Cancels an existing Payment by transitioning it to `Cancelled`
 * status. No prior-status guard — same criterion as
 * `CancelOrderUseCase`, which applies the change unconditionally to
 * any found entity.
 *
 * Restricted to the original payer (or an Admin) — same rationale as
 * `UpdatePaymentUseCase`.
 */
export class CancelPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(command: CancelPaymentCommand): Promise<PaymentDto> {
    const id = PaymentId.fromString(command.id);
    const existing = await this.paymentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Payment ${command.id} not found`);
    }
    assertPayer(existing, command.caller, 'cancel');

    const cancelled = new Payment(existing.id, {
      quoteId: existing.quoteId,
      orderId: existing.orderId,
      payerIdentityId: existing.payerIdentityId,
      receiverProviderId: existing.receiverProviderId,
      amount: existing.amount,
      method: existing.method,
      status: PaymentStatus.Cancelled,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.paymentRepository.save(cancelled);
    return PaymentMapper.toDto(cancelled);
  }
}
