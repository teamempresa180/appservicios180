import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentDto } from '../dto/payment.dto';
import { GetPaymentQuery } from '../queries/get-payment.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  execute(query: GetPaymentQuery): Promise<PaymentDto | null> {
    void this.paymentRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
