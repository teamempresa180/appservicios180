import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { SearchQuoteQuery } from '../queries/search-quote.query';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/** Free-text search over `notes`. */
export class SearchQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(query: SearchQuoteQuery): Promise<QuoteDto[]> {
    const results = await this.quoteRepository.search(query.term);
    return results.map((quote) => QuoteMapper.toDto(quote));
  }
}
