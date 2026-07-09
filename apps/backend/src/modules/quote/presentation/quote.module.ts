import { Module } from '@nestjs/common';
import { QuoteController } from './controllers/quote.controller';
import { CreateQuoteUseCase } from '../application/use_cases/create-quote.use-case';
import { UpdateQuoteUseCase } from '../application/use_cases/update-quote.use-case';
import { AcceptQuoteUseCase } from '../application/use_cases/accept-quote.use-case';
import { RejectQuoteUseCase } from '../application/use_cases/reject-quote.use-case';
import { GetQuoteUseCase } from '../application/use_cases/get-quote.use-case';
import { QuoteRepository } from '../domain/interfaces/quote-repository.interface';

/**
 * Wires the Quote presentation layer to its Use Cases.
 *
 * No concrete QuoteRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [QuoteController],
  providers: [
    {
      provide: CreateQuoteUseCase,
      useFactory: () =>
        new CreateQuoteUseCase(undefined as unknown as QuoteRepository),
    },
    {
      provide: UpdateQuoteUseCase,
      useFactory: () =>
        new UpdateQuoteUseCase(undefined as unknown as QuoteRepository),
    },
    {
      provide: AcceptQuoteUseCase,
      useFactory: () =>
        new AcceptQuoteUseCase(undefined as unknown as QuoteRepository),
    },
    {
      provide: RejectQuoteUseCase,
      useFactory: () =>
        new RejectQuoteUseCase(undefined as unknown as QuoteRepository),
    },
    {
      provide: GetQuoteUseCase,
      useFactory: () =>
        new GetQuoteUseCase(undefined as unknown as QuoteRepository),
    },
  ],
})
export class QuotePresentationModule {}
