import { PaginatedResult } from '../../../core/application/paginated-result';
import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { ListReviewQuery } from '../queries/list-review.query';
import { ReviewDto } from '../dto/review.dto';
import { ReviewMapper } from '../mappers/review.mapper';

/** Lists Reviews page by page. */
export class ListReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(query: ListReviewQuery): Promise<PaginatedResult<ReviewDto>> {
    const result = await this.reviewRepository.list(query.page, query.pageSize);
    return {
      items: result.items.map((review) => ReviewMapper.toDto(review)),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
    };
  }
}
