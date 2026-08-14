import { ForbiddenException } from '../../../core/domain/exceptions/forbidden.exception';
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
 *
 * `payerIdentityId` must be the caller's own Identity (Admin aside):
 * a payment record filed in someone else's name would both
 * misattribute money and, because the payer is who may later read or
 * cancel it, hand that record to the wrong party.
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

    if (
      !command.caller.isAdmin &&
      command.payerIdentityId !== command.caller.identityId
    ) {
      throw new ForbiddenException(
        'A Payment can only be registered for the calling Identity',
      );
    }

    const quoteId = QuoteId.fromString(command.quoteId);
    const orderId = OrderId.fromString(command.orderId);
    const payerIdentityId = IdentityId.fromString(command.payerIdentityId);
    const receiverProviderId = ProviderId.fromString(
      command.receiverProviderId,
    );

    // Four independent existence checks against four different
    // tables — none of them reads the previous one's result, so they
    // go out together: one round-trip instead of four. The `if`
    // ladder below still reports the *first* missing reference in the
    // same order as before, so the error a caller sees is unchanged.
    const [quote, order, payer, receiver] = await Promise.all([
      this.quoteRepository.findById(quoteId),
      this.orderRepository.findById(orderId),
      this.identityRepository.findById(payerIdentityId),
      this.providerRepository.findById(receiverProviderId),
    ]);

    if (!quote) {
      throw new NotFoundException(`Quote ${command.quoteId} not found`);
    }
    if (!order) {
      throw new NotFoundException(`Order ${command.orderId} not found`);
    }
    if (!payer) {
      throw new NotFoundException(
        `Identity ${command.payerIdentityId} not found`,
      );
    }
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
