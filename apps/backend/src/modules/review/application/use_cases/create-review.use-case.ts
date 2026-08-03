import { NotFoundException } from '../../../core/domain/exceptions/not-found.exception';
import { IdentityRepository } from '../../../identity/domain/interfaces/identity-repository.interface';
import { IdentityId } from '../../../identity/domain/value-objects/identity-id.value-object';
import { OrderRepository } from '../../../order/domain/interfaces/order-repository.interface';
import { OrderId } from '../../../order/domain/value-objects/order-id.value-object';
import { ProviderRepository } from '../../../provider/domain/interfaces/provider-repository.interface';
import { ProviderId } from '../../../provider/domain/value-objects/provider-id.value-object';
import { Review } from '../../domain/entities/review.entity';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ReviewId } from '../../domain/value-objects/review-id.value-object';
import { ReviewRating } from '../../domain/value-objects/review-rating.value-object';
import { ReviewStatus } from '../../domain/value-objects/review-status.value-object';
import { CreateReviewCommand } from '../commands/create-review.command';
import { ReviewDto } from '../dto/review.dto';
import { ReviewMapper } from '../mappers/review.mapper';
import { ReviewValidator } from '../validators/review.validator';

/**
 * Creates a new Review for a completed Order, always in `Pending`
 * status. Depends on `OrderRepository`, `ProviderRepository` and
 * `IdentityRepository` to verify the referenced Order, Provider and
 * reviewer Identity all exist before creating the review — all three
 * already have Infrastructure (Order since Sprint 3 Etapa 8, Provider
 * since Etapa 7, Identity since Etapa 2), so none of these checks is
 * deferred. No uniqueness check: `findByOrderId` returns `Review[]`,
 * so multiple reviews per Order are allowed by the domain contract.
 */
export class CreateReviewUseCase {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly orderRepository: OrderRepository,
    private readonly providerRepository: ProviderRepository,
    private readonly identityRepository: IdentityRepository,
  ) {}

  async execute(command: CreateReviewCommand): Promise<ReviewDto> {
    ReviewValidator.validateCreate(command);

    const orderId = OrderId.fromString(command.orderId);
    const providerId = ProviderId.fromString(command.providerId);
    const reviewerIdentityId = IdentityId.fromString(
      command.reviewerIdentityId,
    );

    // Independent existence checks against different tables — issued
    // together, then reported in the original order so the error a
    // caller sees is unchanged.
    const [order, provider, reviewer] = await Promise.all([
      this.orderRepository.findById(orderId),
      this.providerRepository.findById(providerId),
      this.identityRepository.findById(reviewerIdentityId),
    ]);
    if (!order) {
      throw new NotFoundException(`Order ${command.orderId} not found`);
    }
    if (!provider) {
      throw new NotFoundException(`Provider ${command.providerId} not found`);
    }
    if (!reviewer) {
      throw new NotFoundException(
        `Identity ${command.reviewerIdentityId} not found`,
      );
    }

    const now = new Date();
    const review = new Review(ReviewId.create(), {
      orderId,
      providerId,
      reviewerIdentityId,
      rating: ReviewRating.of(command.rating),
      title: command.title,
      comment: command.comment,
      status: ReviewStatus.Pending,
      createdAt: now,
      updatedAt: now,
    });

    await this.reviewRepository.save(review);
    return ReviewMapper.toDto(review);
  }
}
