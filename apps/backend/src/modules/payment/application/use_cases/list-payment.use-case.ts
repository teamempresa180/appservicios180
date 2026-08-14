import { PaginatedResult } from '../../../core/application/paginated-result';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { ListPaymentQuery } from '../queries/list-payment.query';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';

/**
 * Lists the Payments the caller is a party to, page by page: the ones
 * they paid, plus the ones their own Provider record received. An
 * Admin sees everything.
 *
 * This endpoint used to return every Payment in the database to any
 * authenticated user — amounts, methods and the Identity/Provider on
 * both ends. Scoping lives here rather than in the repository because
 * the two ownership paths start from different ids (an `Identity` id
 * for the payer, a `Provider` id for the receiver, which first has to
 * be resolved from the caller's Identity); the repository already
 * exposes exactly one bounded query for each.
 *
 * Pagination is applied to the union in memory: both queries are
 * capped by `MAX_UNPAGINATED_RESULTS`, and paginating after filtering
 * keeps `total` consistent with the page contents.
 */
export class ListPaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(query: ListPaymentQuery): Promise<PaginatedResult<PaymentDto>> {
    const result = query.caller.isAdmin
      ? await this.paymentRepository.list(query.page, query.pageSize)
      : await this.listVisible(query);
    return {
      items: result.items.map((payment) => PaymentMapper.toDto(payment)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  private async listVisible(
    query: ListPaymentQuery,
  ): Promise<PaginatedResult<Payment>> {
    const identityId = IdentityId.fromString(query.caller.identityId);
    const [asPayer, provider] = await Promise.all([
      this.paymentRepository.findByPayerIdentityId(identityId),
      this.providerRepository.findByIdentityId(identityId),
    ]);
    const asReceiver = provider
      ? await this.paymentRepository.findByReceiverProviderId(provider.id)
      : [];

    // A Provider paying themselves would otherwise appear twice.
    const byId = new Map<string, Payment>();
    for (const payment of [...asPayer, ...asReceiver]) {
      byId.set(payment.id.value, payment);
    }
    const all = [...byId.values()].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const start = (query.page - 1) * query.pageSize;
    return {
      items: all.slice(start, start + query.pageSize),
      total: all.length,
      page: query.page,
      pageSize: query.pageSize,
    };
  }
}
