import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { assertSubmittingProvider } from '../authorization/quote-access';
import { UpdateQuoteCommand } from '../commands/update-quote.command';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';
import { QuoteValidator } from '../validators/quote.validator';

/**
 * Updates the mutable fields of an existing Quote (`proposedPrice`,
 * `estimatedDuration`, `notes`) — `orderId`/`providerId`/`type` are
 * not offered by `UpdateQuoteCommand`; status changes go exclusively
 * through `AcceptQuoteUseCase`/`RejectQuoteUseCase`.
 *
 * Revising the offer belongs to the Provider that submitted it (or an
 * Admin) — the customer receiving the Quote must not be able to edit
 * the price they are about to accept.
 */
export class UpdateQuoteUseCase {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: UpdateQuoteCommand): Promise<QuoteDto> {
    QuoteValidator.validateUpdate(command);

    const id = QuoteId.fromString(command.id);
    const existing = await this.quoteRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote ${command.id} not found`);
    }
    await assertSubmittingProvider(
      existing,
      command.caller,
      this.providerRepository,
      'update',
    );

    const updated = existing.with({
      proposedPrice: command.proposedPrice ?? existing.proposedPrice,
      estimatedDuration:
        command.estimatedDuration ?? existing.estimatedDuration,
      notes: command.notes ?? existing.notes,
      updatedAt: new Date(),
    });

    await this.quoteRepository.save(updated);
    return QuoteMapper.toDto(updated);
  }
}
