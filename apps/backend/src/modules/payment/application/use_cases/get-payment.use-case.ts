import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { assertPartyToPayment } from '../authorization/payment-access';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';
import { GetPaymentQuery } from '../queries/get-payment.query';

/**
 * Fetches a single Payment by id, returning `null` when not found —
 * matches the `Promise<PaymentDto | null>` signature already declared
 * for this use case.
 *
 * A Payment is only readable by its payer, the Provider receiving it,
 * or an Admin — "no reading third parties' payments" is the headline
 * requirement of this hardening pass, and it has to hold for the
 * by-id route as much as for the listing.
 */
export class GetPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(query: GetPaymentQuery): Promise<PaymentDto | null> {
    const payment = await this.paymentRepository.findById(
      PaymentId.fromString(query.id),
    );
    if (!payment) {
      return null;
    }
    await assertPartyToPayment(
      payment,
      query.caller,
      this.providerRepository,
      'read',
    );
    return PaymentMapper.toDto(payment);
  }
}
