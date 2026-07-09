import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentDto } from '../dto/payment.dto';
import { CancelPaymentCommand } from '../commands/cancel-payment.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CancelPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  execute(command: CancelPaymentCommand): Promise<PaymentDto> {
    void this.paymentRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
