import { PaginatedResult } from '../../../core/application/paginated-result';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { ListQuoteQuery } from '../queries/list-quote.query';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/** Lists Quotes page by page. */
export class ListQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(query: ListQuoteQuery): Promise<PaginatedResult<QuoteDto>> {
    const result = await this.quoteRepository.list(query.page, query.pageSize);
    return {
      items: result.items.map((quote) => QuoteMapper.toDto(quote)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
