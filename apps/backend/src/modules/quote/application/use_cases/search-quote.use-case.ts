import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { resolveQuoteScope } from '../authorization/quote-access';
import { SearchQuoteQuery } from '../queries/search-quote.query';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/**
 * Free-text search over `notes`, restricted to the Quotes the caller
 * is a party to — same visibility rule as `ListQuoteUseCase`, so a
 * search term cannot be used to read competitors' quotes that the
 * scoped listing already hides. An Admin searches everything.
 *
 * The scope is applied as a post-filter here rather than pushed into
 * the query: `search` is already capped at `MAX_UNPAGINATED_RESULTS`
 * and returns a flat list with no pagination contract to keep
 * consistent, so filtering the matches is both correct and simpler
 * than a second set of scoped queries.
 */
export class SearchQuoteUseCase {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(query: SearchQuoteQuery): Promise<QuoteDto[]> {
    const results = await this.quoteRepository.search(query.term);
    if (query.caller.isAdmin) {
      return results.map((quote) => QuoteMapper.toDto(quote));
    }

    const { providerId, orderIds } = await resolveQuoteScope(
      query.caller,
      this.orderRepository,
      this.providerRepository,
    );
    return results
      .filter(
        (quote) =>
          (providerId !== null && quote.providerId.value === providerId) ||
          orderIds.has(quote.orderId.value),
      )
      .map((quote) => QuoteMapper.toDto(quote));
  }
}
