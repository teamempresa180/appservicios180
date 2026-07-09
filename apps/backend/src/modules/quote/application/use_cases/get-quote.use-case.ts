import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteDto } from '../dto/quote.dto';
import { GetQuoteQuery } from '../queries/get-quote.query';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class GetQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  execute(query: GetQuoteQuery): Promise<QuoteDto | null> {
    void this.quoteRepository;
    void query;
    throw new Error('Not implemented yet');
  }
}
