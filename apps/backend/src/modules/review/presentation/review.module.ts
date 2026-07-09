import { Module } from '@nestjs/common';
import { ReviewController } from './controllers/review.controller';
import { CreateReviewUseCase } from '../application/use_cases/create-review.use-case';
import { UpdateReviewUseCase } from '../application/use_cases/update-review.use-case';
import { DeleteReviewUseCase } from '../application/use_cases/delete-review.use-case';
import { GetReviewUseCase } from '../application/use_cases/get-review.use-case';
import { ReviewRepository } from '../domain/interfaces/review-repository.interface';

/**
 * Wires the Review presentation layer to its Use Cases.
 *
 * No concrete ReviewRepository exists yet (Infrastructure layer is not
 * built). Each Use Case is constructed with an unset repository reference —
 * this is safe because every Use Case currently throws before touching it.
 */
@Module({
  controllers: [ReviewController],
  providers: [
    {
      provide: CreateReviewUseCase,
      useFactory: () =>
        new CreateReviewUseCase(undefined as unknown as ReviewRepository),
    },
    {
      provide: UpdateReviewUseCase,
      useFactory: () =>
        new UpdateReviewUseCase(undefined as unknown as ReviewRepository),
    },
    {
      provide: DeleteReviewUseCase,
      useFactory: () =>
        new DeleteReviewUseCase(undefined as unknown as ReviewRepository),
    },
    {
      provide: GetReviewUseCase,
      useFactory: () =>
        new GetReviewUseCase(undefined as unknown as ReviewRepository),
    },
  ],
})
export class ReviewPresentationModule {}
