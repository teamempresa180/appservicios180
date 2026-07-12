import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { UpdateQuoteCommand } from '../commands/update-quote.command';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';
import { QuoteValidator } from '../validators/quote.validator';

/**
 * Updates the mutable fields of an existing Quote (`proposedPrice`,
 * `estimatedDuration`, `notes`) — `orderId`/`providerId`/`type` are
 * not offered by `UpdateQuoteCommand`; status changes go exclusively
 * through `AcceptQuoteUseCase`/`RejectQuoteUseCase`.
 */
export class UpdateQuoteUseCase {
  constructor(private readonly quoteRepository: QuoteRepository) {}

  async execute(command: UpdateQuoteCommand): Promise<QuoteDto> {
    QuoteValidator.validateUpdate(command);

    const id = QuoteId.fromString(command.id);
    const existing = await this.quoteRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote ${command.id} not found`);
    }

    const updated = new Quote(existing.id, {
      orderId: existing.orderId,
      providerId: existing.providerId,
      proposedPrice: command.proposedPrice ?? existing.proposedPrice,
      estimatedDuration:
        command.estimatedDuration ?? existing.estimatedDuration,
      notes: command.notes ?? existing.notes,
      status: existing.status,
      type: existing.type,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    await this.quoteRepository.save(updated);
    return QuoteMapper.toDto(updated);
  }
}
