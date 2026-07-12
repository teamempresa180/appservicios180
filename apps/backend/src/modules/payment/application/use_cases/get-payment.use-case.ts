import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';
import { GetPaymentQuery } from '../queries/get-payment.query';

/**
 * Fetches a single Payment by id, returning `null` when not found —
 * matches the `Promise<PaymentDto | null>` signature already declared
 * for this use case.
 */
export class GetPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(query: GetPaymentQuery): Promise<PaymentDto | null> {
    const payment = await this.paymentRepository.findById(
      PaymentId.fromString(query.id),
    );
    return payment ? PaymentMapper.toDto(payment) : null;
  }
}
