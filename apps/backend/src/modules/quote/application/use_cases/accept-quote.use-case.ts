import { Logger } from '@nestjs/common';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { OrderStatus } from '../../../order/domain/value-objects/order-status.value-object';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { assertOrderCustomer } from '../authorization/quote-access';
import { AcceptQuoteCommand } from '../commands/accept-quote.command';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';

/**
 * Accepts an existing Quote by transitioning it to `Accepted` status.
 * Also advances the referenced `Order` from `Pending` to `Accepted` —
 * accepting a Quote *is* the client's order-acceptance decision in
 * this flow (closes the previously-documented gap where an Order
 * could never move past `Pending` via the API). Two cases:
 * - **Open request** (`Order.providerId` was `null`): this Quote's
 *   Provider is assigned to the Order — this is the one moment an
 *   open request becomes tied to a specific Provider.
 * - **Direct hire** (`Order.providerId` already set): the accepted
 *   Quote must belong to that same Provider, or `BusinessRuleException`
 *   — a direct hire can't be reassigned to a different Provider by
 *   accepting someone else's Quote.
 *
 * Throws `BusinessRuleException` if the Order isn't `Pending` (already
 * accepted by another Quote, or cancelled) — a Quote can't be
 * accepted twice over, from the Order's perspective.
 *
 * Accepting is the customer's decision and nobody else's: the caller
 * must be the Identity that requested the referenced Order (or an
 * Admin), checked before any state is inspected or written. That is
 * also why `orderRepository` is a required dependency rather than the
 * optional convenience it used to be — without it there is no way to
 * reach `Order.identityId`, and an unauthorized accept would bind a
 * Provider to a stranger's Order.
 */
export class AcceptQuoteUseCase {
  private readonly logger = new Logger(AcceptQuoteUseCase.name);

  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute(command: AcceptQuoteCommand): Promise<QuoteDto> {
    const id = QuoteId.fromString(command.id);
    const existing = await this.quoteRepository.findById(id);
    if (!existing) {
      throw new NotFoundException(`Quote ${command.id} not found`);
    }
    await assertOrderCustomer(
      existing,
      command.caller,
      this.orderRepository,
      'accept',
    );

    const order = await this.orderRepository.findById(existing.orderId);
    if (order) {
      if (order.status !== OrderStatus.Pending) {
        throw new BusinessRuleException(
          `Order ${order.id.value} is not awaiting a quote decision`,
        );
      }
      if (order.providerId && !order.providerId.equals(existing.providerId)) {
        throw new BusinessRuleException(
          `Order ${order.id.value} is a direct hire for a different Provider`,
        );
      }
      const acceptedOrder = order.with({
        providerId: order.providerId ?? existing.providerId,
        status: OrderStatus.Accepted,
        updatedAt: new Date(),
      });
      await this.orderRepository.save(acceptedOrder);
    }

    const accepted = existing.with({
      status: QuoteStatus.Accepted,
      updatedAt: new Date(),
    });

    await this.quoteRepository.save(accepted);
    this.logger.log(
      `Quote accepted id=${accepted.id.value} orderId=${accepted.orderId.value}`,
    );
    return QuoteMapper.toDto(accepted);
  }
}
