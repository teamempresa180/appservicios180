import { Module } from '@nestjs/common';
import { QuotePresentationModule } from '../../quote/presentation/quote.module';
import {
  QUOTE_REPOSITORY,
  QuoteRepository,
} from '../../quote/domain/interfaces/quote-repository.interface';
import { OrderPresentationModule } from '../../order/presentation/order.module';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../order/domain/interfaces/order-repository.interface';
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { PaymentController } from './controllers/payment.controller';
import { CreatePaymentUseCase } from '../application/use_cases/create-payment.use-case';
import { UpdatePaymentUseCase } from '../application/use_cases/update-payment.use-case';
import { CancelPaymentUseCase } from '../application/use_cases/cancel-payment.use-case';
import { GetPaymentUseCase } from '../application/use_cases/get-payment.use-case';
import { ListPaymentUseCase } from '../application/use_cases/list-payment.use-case';
import { SearchPaymentUseCase } from '../application/use_cases/search-payment.use-case';
import {
  PAYMENT_REPOSITORY,
  PaymentRepository,
} from '../domain/interfaces/payment-repository.interface';
import { PrismaPaymentRepository } from '../infrastructure/persistence/prisma-payment.repository';

/**
 * Wires the Payment presentation layer to its Use Cases, which are
 * wired to the real `PrismaPaymentRepository` (Sprint 3, Etapa 9) via
 * the `PAYMENT_REPOSITORY` DI token. Imports `QuotePresentationModule`,
 * `OrderPresentationModule`, `IdentityPresentationModule` and
 * `ProviderPresentationModule` — `CreatePaymentUseCase` verifies the
 * referenced Quote, Order, payer Identity and receiver Provider all
 * exist before creating a payment.
 *
 * `PROVIDER_REPOSITORY` is also injected into the read Use Cases:
 * `Payment.receiverProviderId` is a `Provider` id, so deciding
 * whether the caller is the receiving Provider means resolving it to
 * the owning Identity (see `payment-access.ts`).
 */
@Module({
  imports: [
    QuotePresentationModule,
    OrderPresentationModule,
    IdentityPresentationModule,
    ProviderPresentationModule,
  ],
  controllers: [PaymentController],
  providers: [
    { provide: PAYMENT_REPOSITORY, useClass: PrismaPaymentRepository },
    {
      provide: CreatePaymentUseCase,
      useFactory: (
        paymentRepo: PaymentRepository,
        quoteRepo: QuoteRepository,
        orderRepo: OrderRepository,
        identityRepo: IdentityRepository,
        providerRepo: ProviderRepository,
      ) =>
        new CreatePaymentUseCase(
          paymentRepo,
          quoteRepo,
          orderRepo,
          identityRepo,
          providerRepo,
        ),
      inject: [
        PAYMENT_REPOSITORY,
        QUOTE_REPOSITORY,
        ORDER_REPOSITORY,
        IDENTITY_REPOSITORY,
        PROVIDER_REPOSITORY,
      ],
    },
    {
      provide: UpdatePaymentUseCase,
      useFactory: (repo: PaymentRepository) => new UpdatePaymentUseCase(repo),
      inject: [PAYMENT_REPOSITORY],
    },
    {
      provide: CancelPaymentUseCase,
      useFactory: (repo: PaymentRepository) => new CancelPaymentUseCase(repo),
      inject: [PAYMENT_REPOSITORY],
    },
    {
      provide: GetPaymentUseCase,
      useFactory: (repo: PaymentRepository, providerRepo: ProviderRepository) =>
        new GetPaymentUseCase(repo, providerRepo),
      inject: [PAYMENT_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: ListPaymentUseCase,
      useFactory: (repo: PaymentRepository, providerRepo: ProviderRepository) =>
        new ListPaymentUseCase(repo, providerRepo),
      inject: [PAYMENT_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: SearchPaymentUseCase,
      useFactory: (repo: PaymentRepository, providerRepo: ProviderRepository) =>
        new SearchPaymentUseCase(repo, providerRepo),
      inject: [PAYMENT_REPOSITORY, PROVIDER_REPOSITORY],
    },
  ],
  exports: [PAYMENT_REPOSITORY],
})
export class PaymentPresentationModule {}
