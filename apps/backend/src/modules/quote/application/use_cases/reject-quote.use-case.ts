import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { assertOrderCustomer } from '../authorization/quote-access';
import { RejectQuoteCommand } from '../commands/reject-quote.command';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/**
 * Rejects an existing Quote by transitioning it to `Rejected` status.
 * No prior-status guard — same criterion as `AcceptQuoteUseCase`.
 *
 * Rejecting is the mirror of accepting and belongs to the same party:
 * the customer who requested the Order this Quote answers, or an
 * Admin. `OrderRepository` is injected purely to reach
 * `Order.identityId` for that check — nothing about the Order is
 * written here (unlike `AcceptQuoteUseCase`, a rejection leaves the
 * Order `Pending` and open to other Quotes).
 */
export class RejectQuoteUseCase {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: RejectQuoteCommand): Promise<QuoteDto> {
    const id = QuoteId.fromString(command.id);
    const existing = await this.quoteRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote ${command.id} not found`);
    }
    await assertOrderCustomer(
      existing,
      command.caller,
      this.orderRepository,
      'reject',
    );

    const rejected = existing.with({
      status: QuoteStatus.Rejected,
      updatedAt: new Date(),
    });

    await this.quoteRepository.save(rejected);
    return QuoteMapper.toDto(rejected);
  }
}
