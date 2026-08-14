import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { isPayer } from '../authorization/payment-access';
import { SearchPaymentQuery } from '../queries/search-payment.query';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';

/**
 * Free-text search over `method`, restricted to the Payments the
 * caller paid or received — same visibility rule as
 * `ListPaymentUseCase`, so a search term cannot surface what the
 * scoped listing hides. An Admin searches everything.
 *
 * The caller's own `Provider` id is resolved once and compared
 * against each match, rather than looking up a Provider per result —
 * one query regardless of how many Payments the term matches.
 */
export class SearchPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(query: SearchPaymentQuery): Promise<PaymentDto[]> {
    const results = await this.paymentRepository.search(query.term);
    if (query.caller.isAdmin) {
      return results.map((payment) => PaymentMapper.toDto(payment));
    }

    const provider = await this.providerRepository.findByIdentityId(
      IdentityId.fromString(query.caller.identityId),
    );
    const ownProviderId = provider ? provider.id.value : null;
    return results
      .filter(
        (payment) =>
          isPayer(payment, query.caller) ||
          (ownProviderId !== null &&
            payment.receiverProviderId.value === ownProviderId),
      )
      .map((payment) => PaymentMapper.toDto(payment));
  }
}
