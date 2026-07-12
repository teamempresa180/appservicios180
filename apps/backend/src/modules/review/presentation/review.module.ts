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
import { IdentityPresentationModule } from '../../identity/presentation/identity.module';
import {
  IDENTITY_REPOSITORY,
  IdentityRepository,
} from '../../identity/domain/interfaces/identity-repository.interface';
import { ReviewController } from './controllers/review.controller';
import { CreateReviewUseCase } from '../application/use_cases/create-review.use-case';
import { UpdateReviewUseCase } from '../application/use_cases/update-review.use-case';
import { DeleteReviewUseCase } from '../application/use_cases/delete-review.use-case';
import { GetReviewUseCase } from '../application/use_cases/get-review.use-case';
import { ListReviewUseCase } from '../application/use_cases/list-review.use-case';
import { SearchReviewUseCase } from '../application/use_cases/search-review.use-case';
import {
  REVIEW_REPOSITORY,
  ReviewRepository,
} from '../domain/interfaces/review-repository.interface';
import { PrismaReviewRepository } from '../infrastructure/persistence/prisma-review.repository';

/**
 * Wires the Review presentation layer to its Use Cases, which are
 * wired to the real `PrismaReviewRepository` (Sprint 3, Etapa 9) via
 * the `REVIEW_REPOSITORY` DI token. Imports `OrderPresentationModule`,
 * `ProviderPresentationModule` and `IdentityPresentationModule` —
 * `CreateReviewUseCase` verifies the referenced Order, Provider and
 * reviewer Identity all exist before creating a review.
 */
@Module({
  imports: [
    OrderPresentationModule,
    ProviderPresentationModule,
    IdentityPresentationModule,
  ],
  controllers: [ReviewController],
  providers: [
    { provide: REVIEW_REPOSITORY, useClass: PrismaReviewRepository },
    {
      provide: CreateReviewUseCase,
      useFactory: (
        reviewRepo: ReviewRepository,
        orderRepo: OrderRepository,
        providerRepo: ProviderRepository,
        identityRepo: IdentityRepository,
      ) =>
        new CreateReviewUseCase(
          reviewRepo,
          orderRepo,
          providerRepo,
          identityRepo,
        ),
      inject: [
        REVIEW_REPOSITORY,
        ORDER_REPOSITORY,
        PROVIDER_REPOSITORY,
        IDENTITY_REPOSITORY,
      ],
    },
    {
      provide: UpdateReviewUseCase,
      useFactory: (repo: ReviewRepository) => new UpdateReviewUseCase(repo),
      inject: [REVIEW_REPOSITORY],
    },
    {
      provide: DeleteReviewUseCase,
      useFactory: (repo: ReviewRepository) => new DeleteReviewUseCase(repo),
      inject: [REVIEW_REPOSITORY],
    },
    {
      provide: GetReviewUseCase,
      useFactory: (repo: ReviewRepository) => new GetReviewUseCase(repo),
      inject: [REVIEW_REPOSITORY],
    },
    {
      provide: ListReviewUseCase,
      useFactory: (repo: ReviewRepository) => new ListReviewUseCase(repo),
      inject: [REVIEW_REPOSITORY],
    },
    {
      provide: SearchReviewUseCase,
      useFactory: (repo: ReviewRepository) => new SearchReviewUseCase(repo),
      inject: [REVIEW_REPOSITORY],
    },
  ],
  exports: [REVIEW_REPOSITORY],
})
export class ReviewPresentationModule {}
