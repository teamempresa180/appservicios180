import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentDto } from '../dto/payment.dto';
import { CreatePaymentCommand } from '../commands/create-payment.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class CreatePaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  execute(command: CreatePaymentCommand): Promise<PaymentDto> {
    void this.paymentRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
