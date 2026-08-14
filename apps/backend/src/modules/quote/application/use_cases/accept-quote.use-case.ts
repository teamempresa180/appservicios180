import { Logger } from '@nestjs/common';
import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { TransactionRunner } from '../../../core/application/ports/transaction-runner.port';
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
 * Admin), checked via `assertOrderCustomer` before any state is
 * inspected or written — which is also why `orderRepository` is a
 * required dependency rather than the optional convenience it used to
 * be: without it there is no way to reach `Order.identityId`, and an
 * unauthorized accept would bind a Provider to a stranger's Order.
 *
 * The Order and Quote writes run inside a single `TransactionRunner`
 * transaction (Etapa 18, Security Hardening) — the only genuinely
 * multi-aggregate write in the codebase. Without it, a crash between
 * the two `save` calls could leave an Order `Accepted` with its Quote
 * still `Pending`, or vice versa. `transactionRunner` stays optional
 * so existing unit tests built against in-memory repositories (which
 * have no concept of a transaction) keep compiling unchanged — when
 * omitted, the two writes just happen sequentially.
 */
export class AcceptQuoteUseCase {
  private readonly logger = new Logger(AcceptQuoteUseCase.name);

  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly orderRepository: OrderRepository,
    private readonly transactionRunner?: TransactionRunner,
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

    const accepted = existing.with({
      status: QuoteStatus.Accepted,
      updatedAt: new Date(),
    });

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

      if (this.transactionRunner) {
        await this.transactionRunner.run(async (tx) => {
          await this.orderRepository.save(acceptedOrder, tx);
          await this.quoteRepository.save(accepted, tx);
        });
      } else {
        await this.orderRepository.save(acceptedOrder);
        await this.quoteRepository.save(accepted);
      }
      this.logger.log(
        `Quote accepted id=${accepted.id.value} orderId=${accepted.orderId.value}`,
      );
      return QuoteMapper.toDto(accepted);
    }

    await this.quoteRepository.save(accepted);
    this.logger.log(
      `Quote accepted id=${accepted.id.value} orderId=${accepted.orderId.value}`,
    );
    return QuoteMapper.toDto(accepted);
  }
}
