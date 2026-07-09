import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteDto } from '../dto/quote.dto';
import { UpdateQuoteCommand } from '../commands/update-quote.command';

/**
 * Use case skeleton. Dependencies are wired correctly; the orchestration
 * logic itself is intentionally not implemented in this phase.
 */
export class UpdateQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  execute(command: UpdateQuoteCommand): Promise<QuoteDto> {
    void this.quoteRepository;
    void command;
    throw new Error('Not implemented yet');
  }
}
