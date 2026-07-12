import { ReviewRepository } from '../../domain/interfaces/review-repository.interface';
import { SearchReviewQuery } from '../queries/search-review.query';
import { ReviewDto } from '../dto/review.dto';
import { ReviewMapper } from '../mappers/review.mapper';

/** Free-text search over `title`/`comment`. */
export class SearchReviewUseCase {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async execute(query: SearchReviewQuery): Promise<ReviewDto[]> {
    const results = await this.reviewRepository.search(query.term);
    return results.map((review) => ReviewMapper.toDto(review));
  }
}
