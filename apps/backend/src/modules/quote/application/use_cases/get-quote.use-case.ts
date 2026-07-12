import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';
import { GetQuoteQuery } from '../queries/get-quote.query';

/**
 * Fetches a single Quote by id, returning `null` when not found —
 * matches the `Promise<QuoteDto | null>` signature already declared
 * for this use case.
 */
export class GetQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(query: GetQuoteQuery): Promise<QuoteDto | null> {
    const quote = await this.quoteRepository.findById(
      QuoteId.fromString(query.id),
    );
    return quote ? QuoteMapper.toDto(quote) : null;
  }
}
