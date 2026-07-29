import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { BusinessRuleException } from '../../../core/domain/exceptions/business-rule.exception';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Quote } from '../../domain/entities/quote.entity';
import { QuoteRepository } from '../../domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../domain/value-objects/quote-id.value-object';
import { QuoteStatus } from '../../domain/value-objects/quote-status.value-object';
import { CreateQuoteCommand } from '../commands/create-quote.command';
import { QuoteDto } from '../dto/quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';
import { QuoteValidator } from '../validators/quote.validator';

/**
 * Creates a new Quote a Provider submits for an Order, always in
 * `Pending` status. Depends on `OrderRepository` and
 * `ProviderRepository` to verify both the referenced Order and the
 * referenced Provider actually exist before creating the quote — both
 * already have Infrastructure (Order and Provider, Sprint 3 Etapa 8
 * and Etapa 7 respectively), so neither check is deferred. No
 * uniqueness check: `findByOrderId` returns `Quote[]`, so multiple
 * Providers may quote the same Order.
 */
export class CreateQuoteUseCase {
  constructor(
    private readonly quoteRepository: QuoteRepository,
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: CreateQuoteCommand): Promise<QuoteDto> {
    QuoteValidator.validateCreate(command);

    const orderId = OrderId.fromString(command.orderId);
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${command.orderId} not found`);
    }

    const providerId = ProviderId.fromString(command.providerId);
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
    }

    if (order.providerId && !order.providerId.equals(providerId)) {
      throw new BusinessRuleException(
        `Order ${command.orderId} is a direct hire for a different Provider`,
      );
    }

    const now = new Date();
    const quote = new Quote(QuoteId.create(), {
      orderId,
      providerId,
      proposedPrice: command.proposedPrice,
      estimatedDuration: command.estimatedDuration,
      notes: command.notes,
      status: QuoteStatus.Pending,
      type: command.type,
      createdAt: now,
      updatedAt: now,
    });

    await this.quoteRepository.save(quote);
    return QuoteMapper.toDto(quote);
  }
}
