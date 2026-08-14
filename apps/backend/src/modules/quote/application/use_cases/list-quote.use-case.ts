import { PaginatedResult } from '../../../core/application/paginated-result';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { resolveQuoteScope } from '../authorization/quote-access';
import { ListQuoteQuery } from '../queries/list-quote.query';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/**
 * Lists the Quotes the caller is a party to, page by page: the ones
 * their own Provider record submitted, plus the ones submitted for
 * Orders they requested as a customer. An Admin sees everything.
 *
 * Previously this returned every Quote in the database to any
 * authenticated user, and the mobile client filtered client-side —
 * which meant every price every competitor had ever quoted was one
 * request away. Scoping happens here rather than in the repository's
 * `list()` because "the caller's Quotes" is the union of two
 * unrelated ownership paths (Provider-side and Order-side); the
 * repository stays a plain data gateway and answers each side with a
 * single bounded query (`findByProviderId`, `findByOrderIds`).
 *
 * Pagination is then applied to that union in memory. The union is
 * already bounded by the repository's `MAX_UNPAGINATED_RESULTS` cap,
 * and unlike slicing first and filtering after, `total` and the page
 * contents stay consistent with each other.
 */
export class ListQuoteUseCase {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(query: ListQuoteQuery): Promise<PaginatedResult<QuoteDto>> {
    const result = query.caller.isAdmin
      ? await this.quoteRepository.list(query.page, query.pageSize)
      : await this.listVisible(query);
    return {
      items: result.items.map((quote) => QuoteMapper.toDto(quote)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }

  private async listVisible(
    query: ListQuoteQuery,
  ): Promise<PaginatedResult<Quote>> {
    const { providerId, orderIds } = await resolveQuoteScope(
      query.caller,
      this.orderRepository,
      this.providerRepository,
    );

    const [asProvider, asCustomer] = await Promise.all([
      providerId
        ? this.quoteRepository.findByProviderId(
            ProviderId.fromString(providerId),
          )
        : Promise.resolve<Quote[]>([]),
      this.quoteRepository.findByOrderIds(
        [...orderIds].map((id) => OrderId.fromString(id)),
      ),
    ]);

    // A Provider quoting their own Order would otherwise appear twice.
    const byId = new Map<string, Quote>();
    for (const quote of [...asProvider, ...asCustomer]) {
      byId.set(quote.id.value, quote);
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
