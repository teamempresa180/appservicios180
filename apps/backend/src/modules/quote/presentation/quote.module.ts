import { Module } from '@nestjs/common';
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
 */
@Module({
  imports: [OrderPresentationModule, ProviderPresentationModule],
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
      useFactory: (repo: QuoteRepository) => new UpdateQuoteUseCase(repo),
      inject: [QUOTE_REPOSITORY],
    },
    {
      provide: AcceptQuoteUseCase,
      useFactory: (repo: QuoteRepository, orderRepo: OrderRepository) =>
        new AcceptQuoteUseCase(repo, orderRepo),
      inject: [QUOTE_REPOSITORY, ORDER_REPOSITORY],
    },
    {
      provide: RejectQuoteUseCase,
      useFactory: (repo: QuoteRepository) => new RejectQuoteUseCase(repo),
      inject: [QUOTE_REPOSITORY],
    },
    {
      provide: GetQuoteUseCase,
      useFactory: (repo: QuoteRepository) => new GetQuoteUseCase(repo),
      inject: [QUOTE_REPOSITORY],
    },
    {
      provide: ListQuoteUseCase,
      useFactory: (repo: QuoteRepository) => new ListQuoteUseCase(repo),
      inject: [QUOTE_REPOSITORY],
    },
    {
      provide: SearchQuoteUseCase,
      useFactory: (repo: QuoteRepository) => new SearchQuoteUseCase(repo),
      inject: [QUOTE_REPOSITORY],
    },
  ],
  exports: [QUOTE_REPOSITORY],
})
export class QuotePresentationModule {}
