import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { QuoteRepository } from '../../../quote/domain/interfaces/quote-repository.interface';
import { QuoteId } from '../../../quote/domain/value-objects/quote-id.value-object';
import { Payment } from '../../domain/entities/payment.entity';
import { PaymentRepository } from '../../domain/interfaces/payment-repository.interface';
import { PaymentId } from '../../domain/value-objects/payment-id.value-object';
import { PaymentStatus } from '../../domain/value-objects/payment-status.value-object';
import { CreatePaymentCommand } from '../commands/create-payment.command';
import { PaymentDto } from '../dto/payment.dto';
import { PaymentMapper } from '../mappers/payment.mapper';
import { PaymentValidator } from '../validators/payment.validator';

/**
 * Creates a new Payment record for a Quote/Order, always in `Pending`
 * status. Depends on `QuoteRepository`, `OrderRepository`,
 * `IdentityRepository` and `ProviderRepository` to verify all four
 * referenced records actually exist before creating the payment — all
 * four already have Infrastructure (Quote/Order since Sprint 3 Etapa
 * 8, Identity since Etapa 2, Provider since Etapa 7), so none of
 * these checks is deferred. No uniqueness check: `findByQuoteId`
 * returns `Payment[]`, so multiple Payment records per Quote are
 * allowed by the domain contract.
 */
export class CreatePaymentUseCase {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly quoteRepository: QuoteRepository,
    private readonly orderRepository: OrderRepository,
    private readonly identityRepository: IdentityRepository,
    private readonly providerRepository: ProviderRepository,
  ) {}

  async execute(command: CreatePaymentCommand): Promise<PaymentDto> {
    PaymentValidator.validateCreate(command);

    const quoteId = QuoteId.fromString(command.quoteId);
    const quote = await this.quoteRepository.findById(quoteId);
    if (!quote) {
      throw new NotFoundException(`Quote ${command.quoteId} not found`);
    }

    const orderId = OrderId.fromString(command.orderId);
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order ${command.orderId} not found`);
    }

    const payerIdentityId = IdentityId.fromString(command.payerIdentityId);
    const payer = await this.identityRepository.findById(payerIdentityId);
    if (!payer) {
      throw new NotFoundException(
        `Identity ${command.payerIdentityId} not found`,
      );
    }

    const receiverProviderId = ProviderId.fromString(
      command.receiverProviderId,
    );
    const receiver = await this.providerRepository.findById(receiverProviderId);
    if (!receiver) {
      throw new NotFoundException(
        `Provider ${command.receiverProviderId} not found`,
      );
    }

    const now = new Date();
    const payment = new Payment(PaymentId.create(), {
      quoteId,
      orderId,
      payerIdentityId,
      receiverProviderId,
      amount: command.amount,
      method: command.method,
      status: PaymentStatus.Pending,
      createdAt: now,
      updatedAt: now,
    });

    await this.paymentRepository.save(payment);
    return PaymentMapper.toDto(payment);
  }
}
