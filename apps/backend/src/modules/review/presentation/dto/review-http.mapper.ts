import { Caller } from '../../../core/application/caller';
import { PaginatedResult } from '../../../core/application/paginated-result';
import { CreateReviewCommand } from '../../application/commands/create-review.command';
import { UpdateReviewCommand } from '../../application/commands/update-review.command';
import { ReviewDto } from '../../application/dto/review.dto';
import { CreateReviewRequestDto } from './create-review.request.dto';
import { UpdateReviewRequestDto } from './update-review.request.dto';
import { ReviewResponseDto } from './review.response.dto';
import { ReviewListResponseDto } from './review-list.response.dto';

/**
 * Translates between the HTTP-facing DTOs (this folder) and the
 * Application layer's commands/DTOs. The only place that knows both
 * shapes exist — `ReviewController` never builds a
 * `CreateReviewCommand` or a `ReviewResponseDto` by hand.
 */
export class ReviewHttpMapper {
  static toCreateCommand(
    dto: CreateReviewRequestDto,
    caller: Caller,
  ): CreateReviewCommand {
    return new CreateReviewCommand(
      dto.orderId,
      dto.providerId,
      dto.reviewerIdentityId,
      dto.rating,
      dto.title,
      dto.comment,
      caller,
    );
  }

  static toUpdateCommand(
    id: string,
    dto: UpdateReviewRequestDto,
    caller: Caller,
  ): UpdateReviewCommand {
    return new UpdateReviewCommand(id, caller, dto.title, dto.comment);
  }

  static toResponse(dto: ReviewDto): ReviewResponseDto {
    const response = new ReviewResponseDto();
    response.id = dto.id;
    response.orderId = dto.orderId;
    response.providerId = dto.providerId;
    response.reviewerIdentityId = dto.reviewerIdentityId;
    response.rating = dto.rating;
    response.title = dto.title;
    response.comment = dto.comment;
    response.status = dto.status;
    response.createdAt = dto.createdAt.toISOString();
    response.updatedAt = dto.updatedAt.toISOString();
    return response;
  }

  static toListResponse(
    result: PaginatedResult<ReviewDto>,
  ): ReviewListResponseDto {
    const response = new ReviewListResponseDto();
    response.items = result.items.map((item) =>
      ReviewHttpMapper.toResponse(item),
    );
    response.total = result.total;
    response.page = result.page;
    response.pageSize = result.pageSize;
    return response;
  }
}
