import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { RejectQuoteCommand } from '../commands/reject-quote.command';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/**
 * Rejects an existing Quote by transitioning it to `Rejected` status.
 * No prior-status guard — same criterion as `AcceptQuoteUseCase`.
 */
export class RejectQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(command: RejectQuoteCommand): Promise<QuoteDto> {
    const id = QuoteId.fromString(command.id);
    const existing = await this.quoteRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote ${command.id} not found`);
    }

    const rejected = existing.with({
      status: QuoteStatus.Rejected,
      updatedAt: new Date(),
    });

    await this.quoteRepository.save(rejected);
    return QuoteMapper.toDto(rejected);
  }
}
