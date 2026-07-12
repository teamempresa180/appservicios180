import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { AcceptQuoteCommand } from '../commands/accept-quote.command';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/**
 * Accepts an existing Quote by transitioning it to `Accepted` status.
 * No prior-status guard — same criterion as `UpdateProviderUseCase`,
 * which applies changes unconditionally to any found entity. No
 * side effect on the referenced Order or on other Quotes for the same
 * Order: neither `Order` nor `Quote` exposes any such behavior.
 */
export class AcceptQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(command: AcceptQuoteCommand): Promise<QuoteDto> {
    const id = QuoteId.fromString(command.id);
    const existing = await this.quoteRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote ${command.id} not found`);
    }

    const accepted = new Quote(existing.id, {
      orderId: existing.orderId,
      providerId: existing.providerId,
      proposedPrice: existing.proposedPrice,
      estimatedDuration: existing.estimatedDuration,
      notes: existing.notes,
      status: QuoteStatus.Accepted,
      type: existing.type,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.quoteRepository.save(accepted);
    return QuoteMapper.toDto(accepted);
  }
}
