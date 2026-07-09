import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentDto } from '../dto/payment.dto';
import { UpdatePaymentCommand } from '../commands/update-payment.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  execute(command: UpdatePaymentCommand): Promise<PaymentDto> {
    void this.paymentRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
