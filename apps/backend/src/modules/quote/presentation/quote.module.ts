import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../infrastructure/prisma/prisma.module';
import { PrismaTransactionRunner } from '../../../infrastructure/prisma/prisma-transaction-runner';
import { TransactionRunner } from '../../core/application/ports/transaction-runner.port';
import { OrderPresentationModule } from '../../order/presentation/order.module';
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from '../../order/domain/interfaces/order-repository.interface';
import { ProviderPresentationModule } from '../../provider/presentation/provider.module';
import {
  PROVIDER_REPOSITORY,
  ProviderRepository,
} from '../../provider/domain/interfaces/provider-repository.interface';
import { QuoteController } from './controllers/quote.controller';
import { CreateQuoteUseCase } from '../application/use_cases/create-quote.use-case';
import { UpdateQuoteUseCase } from '../application/use_cases/update-quote.use-case';
import { AcceptQuoteUseCase } from '../application/use_cases/accept-quote.use-case';
import { RejectQuoteUseCase } from '../application/use_cases/reject-quote.use-case';
import { GetQuoteUseCase } from '../application/use_cases/get-quote.use-case';
import { ListQuoteUseCase } from '../application/use_cases/list-quote.use-case';
import { SearchQuoteUseCase } from '../application/use_cases/search-quote.use-case';
import {
  QUOTE_REPOSITORY,
  QuoteRepository,
} from '../domain/interfaces/quote-repository.interface';
import { PrismaQuoteRepository } from '../infrastructure/persistence/prisma-quote.repository';

/**
 * Wires the Quote presentation layer to its Use Cases, which are
 * wired to the real `PrismaQuoteRepository` (Sprint 3, Etapa 8) via
 * the `QUOTE_REPOSITORY` DI token. Imports `OrderPresentationModule`
 * and `ProviderPresentationModule` — `CreateQuoteUseCase` verifies
 * the referenced Order and Provider both exist before creating a
 * quote.
 *
 * Both repositories are needed well beyond that existence check since
 * Etapa 18: `ORDER_REPOSITORY` resolves `Quote.orderId` to the
 * customer allowed to accept/reject it, and `PROVIDER_REPOSITORY`
 * resolves `Quote.providerId` to the Provider allowed to revise it
 * (see `quote-access.ts`). The list/search Use Cases take both to
 * scope their results to the caller.
 */
@Module({
  imports: [PrismaModule, OrderPresentationModule, ProviderPresentationModule],
  controllers: [QuoteController],
  providers: [
    { provide: QUOTE_REPOSITORY, useClass: PrismaQuoteRepository },
    {
      provide: CreateQuoteUseCase,
      useFactory: (
        quoteRepo: QuoteRepository,
        orderRepo: OrderRepository,
        providerRepo: ProviderRepository,
      ) => new CreateQuoteUseCase(quoteRepo, orderRepo, providerRepo),
      inject: [QUOTE_REPOSITORY, ORDER_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: UpdateQuoteUseCase,
      useFactory: (repo: QuoteRepository, providerRepo: ProviderRepository) =>
        new UpdateQuoteUseCase(repo, providerRepo),
      inject: [QUOTE_REPOSITORY, PROVIDER_REPOSITORY],
    },
    PrismaTransactionRunner,
    {
      provide: AcceptQuoteUseCase,
      useFactory: (
        repo: QuoteRepository,
        orderRepo: OrderRepository,
        transactionRunner: TransactionRunner,
      ) => new AcceptQuoteUseCase(repo, orderRepo, transactionRunner),
      inject: [QUOTE_REPOSITORY, ORDER_REPOSITORY, PrismaTransactionRunner],
    },
    {
      provide: RejectQuoteUseCase,
      useFactory: (repo: QuoteRepository, orderRepo: OrderRepository) =>
        new RejectQuoteUseCase(repo, orderRepo),
      inject: [QUOTE_REPOSITORY, ORDER_REPOSITORY],
    },
    {
      provide: GetQuoteUseCase,
      useFactory: (repo: QuoteRepository) => new GetQuoteUseCase(repo),
      inject: [QUOTE_REPOSITORY],
    },
    {
      provide: ListQuoteUseCase,
      useFactory: (
        repo: QuoteRepository,
        orderRepo: OrderRepository,
        providerRepo: ProviderRepository,
      ) => new ListQuoteUseCase(repo, orderRepo, providerRepo),
      inject: [QUOTE_REPOSITORY, ORDER_REPOSITORY, PROVIDER_REPOSITORY],
    },
    {
      provide: SearchQuoteUseCase,
      useFactory: (
        repo: QuoteRepository,
        orderRepo: OrderRepository,
        providerRepo: ProviderRepository,
      ) => new SearchQuoteUseCase(repo, orderRepo, providerRepo),
      inject: [QUOTE_REPOSITORY, ORDER_REPOSITORY, PROVIDER_REPOSITORY],
    },
  ],
  exports: [QUOTE_REPOSITORY],
})
export class QuotePresentationModule {}
